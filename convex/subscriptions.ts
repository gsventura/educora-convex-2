import { v } from "convex/values";
import Stripe from "stripe";
import { api, internal } from "./_generated/api";
import { action, httpAction, mutation, query } from "./_generated/server";
import { PlanPermissions, getPermissionsForTier } from "../src/types/permissions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Mapeamento de IDs de preço para tipos de plano
// Substitua estes valores pelos IDs reais dos seus preços no Stripe
const PRICE_ID_TO_PLAN_TYPE = {
  // Planos mensais
  "price_1Q0UtHCiAbwUv4bIXhchhGv2": "basic", // Basic Mensal
  "price_1PzRV4CiAbwUv4bIDcFp0KUv": "pro",   // Pro Mensal
  
  // Planos anuais
  "price_1Q0UtHCiAbwUv4bI19agfivT": "basic", // Basic Anual
  "price_1PzRV4CiAbwUv4bIggZCMI8a": "pro",   // Pro Anual
};

// Função utilitária para determinar o tipo de plano com base no price ID ou valor
function determinePlanType(subscriptionData) {
  let planType = "free"; // Default plan type
  
  if (subscriptionData.status !== "active") {
    console.log(`Plano não ativo, retornando free`);
    return planType;
  }
  
  // 1. Verificar primeiro pelo ID do preço (mais preciso)
  if (subscriptionData.plan && subscriptionData.plan.id) {
    const priceId = subscriptionData.plan.id;
    const planByPriceId = PRICE_ID_TO_PLAN_TYPE[priceId];
    
    console.log(`Verificando price ID: ${priceId}`);
    console.log(`Mapeamento encontrado: ${planByPriceId || "não encontrado"}`);
    
    if (planByPriceId) {
      console.log(`Plano determinado por price ID: ${planByPriceId} (${priceId})`);
      return planByPriceId;
    }
    
    // Verificar se contém "basic" ou "pro" no ID do preço
    if (priceId.toLowerCase().includes('basic')) {
      console.log(`Plano determinado por nome no price ID: basic (${priceId})`);
      return "basic";
    } else if (priceId.toLowerCase().includes('pro')) {
      console.log(`Plano determinado por nome no price ID: pro (${priceId})`);
      return "pro";
    }
  }
  
  // 2. Fallback: verificar pelo valor do plano
  if (subscriptionData.plan && subscriptionData.plan.amount) {
    // Valor em centavos: 19.99 = 1999
    planType = subscriptionData.plan.amount >= 1999 ? "pro" : "basic";
    console.log(`Plano determinado por valor: ${planType} (${subscriptionData.plan.amount})`);
  }
  
  return planType;
}

export const createCheckoutSession = action({
  args: { priceId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(api.users.getUserByToken, {
      tokenIdentifier: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const metadata = {
      userId: user.tokenIdentifier, // DO NOT FORGET THIS
      email: user.email,
    };

    // Make sure we have a valid frontend URL
    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    // Log do price ID para debug
    console.log(`Criando checkout session com price ID: ${args.priceId}`);
    console.log(`Tipo de plano para este price ID: ${PRICE_ID_TO_PLAN_TYPE[args.priceId] || "desconhecido"}`);

    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: args.priceId, quantity: 1 }],
      metadata,
      mode: "subscription",
      customer_email: user.email,
      allow_promotion_codes: true,
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel`,
    });

    return checkout;
  },
});

export const paymentWebhook = httpAction(async (ctx, request) => {
  try {
    const body = await request.text();
    const sig = request.headers.get("Stripe-Signature");

    if (!sig) {
      return new Response(
        JSON.stringify({ error: "No Stripe-Signature header" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // track events and based on events store data
    await ctx.runAction(api.subscriptions.webhooksHandler, {
      body,
      sig,
    });

    return new Response(JSON.stringify({ message: "Webhook received!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});

export const getProducts = action({
  handler: async (ctx) => {
    try {
      const plans = await stripe.plans.list({
        active: true,
        expand: ['data.product'],
      });

      // Log dos dados recebidos do Stripe para debug
      console.log("Dados do Stripe:", JSON.stringify(plans, null, 2));

      // Garantir que o objeto product está acessível corretamente
      const processedPlans = {
        ...plans,
        data: plans.data.map(plan => {
          // Log de cada plano para debug
          console.log("Plano individual:", JSON.stringify(plan, null, 2));
          
          // Garantir que product seja acessível
          return {
            ...plan,
            product: typeof plan.product === 'string' 
              ? { id: plan.product, name: 'Produto não expandido' } 
              : plan.product
          };
        })
      };

      return processedPlans;
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },
});

export const getUserSubscriptionStatus = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { hasActiveSubscription: false };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      return { hasActiveSubscription: false };
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
      .first();

    const hasActiveSubscription = subscription?.status === "active";
    return { hasActiveSubscription };
  },
});

export const getUserSubscription = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
      .first();

    return subscription;
  },
});

export const getUserDashboardUrl = action({
  handler: async (ctx, args: { customerId: string }) => {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: args.customerId,
        return_url: process.env.FRONTEND_URL, // URL to redirect to after the customer is done in the portal
      });
      // Only return the URL to avoid Convex type issues

      console.log("session", session);

      return { url: session.url };
    } catch (error) {
      console.error("Error creating customer session:", error);
      throw new Error("Failed to create customer session");
    }
  },
});

export const handleSubscriptionCreated = mutation({
  args: { webhookData: v.any() },
  async handler(ctx, args) {
    const { webhookData } = args;
    const subscriptionData = webhookData.data.object;

    // Log para depuração
    console.log("Subscription Data:", JSON.stringify({
      id: subscriptionData.id,
      planId: subscriptionData.plan.id,
      productId: subscriptionData.plan.product,
      amount: subscriptionData.plan.amount,
      metadata: subscriptionData.metadata
    }, null, 2));

    // Determine plan type based on price ID or amount
    const planType = determinePlanType(subscriptionData);
    
    // Check if subscription already exists
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("stripeId", (q) => q.eq("stripeId", subscriptionData.id))
      .first();

    if (existingSub) {
      return await ctx.db.patch(existingSub._id, {
        status: subscriptionData.status,
        planType, 
        metadata: subscriptionData.metadata || {},
        userId: subscriptionData.metadata?.userId,
        currentPeriodStart: subscriptionData.current_period_start,
        currentPeriodEnd: subscriptionData.current_period_end,
      });
    }

    // Create new subscription
    return await ctx.db.insert("subscriptions", {
      stripeId: subscriptionData.id,
      stripePriceId: subscriptionData.plan.id,
      currency: subscriptionData.currency,
      interval: subscriptionData.plan.interval,
      userId: subscriptionData.metadata?.userId,
      status: subscriptionData.status,
      planType,
      currentPeriodStart: subscriptionData.current_period_start,
      currentPeriodEnd: subscriptionData.current_period_end,
      cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
      amount: subscriptionData.plan.amount,
      startedAt: subscriptionData.start_date,
      endedAt: subscriptionData.ended_at || undefined,
      canceledAt: subscriptionData.canceled_at || undefined,
      customerCancellationReason:
        subscriptionData.cancellation_details?.reason || undefined,
      customerCancellationComment:
        subscriptionData.cancellation_details?.comment || undefined,
      metadata: subscriptionData.metadata || {},
      customerId: subscriptionData.customer,
    });
  },
});

export const handleSubscriptionUpdated = mutation({
  args: { webhookData: v.any() },
  async handler(ctx, args) {
    const { webhookData } = args;
    const subscriptionData = webhookData.data.object;

    // Determine plan type based on price ID or amount
    const planType = determinePlanType(subscriptionData);

    // Find existing subscription
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("stripeId", (q) => q.eq("stripeId", subscriptionData.id))
      .first();

    if (existingSub) {
      return await ctx.db.patch(existingSub._id, {
        amount: subscriptionData.plan.amount,
        status: subscriptionData.status,
        planType,
        currentPeriodStart: subscriptionData.current_period_start,
        currentPeriodEnd: subscriptionData.current_period_end,
        cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
        metadata: subscriptionData.metadata || {},
        userId: subscriptionData.metadata?.userId || existingSub.userId,
        customerCancellationReason:
          subscriptionData.cancellation_details?.reason || undefined,
        customerCancellationComment:
          subscriptionData.cancellation_details?.comment || undefined,
      });
    }
  },
});

export const handleCheckoutSessionCompleted = action({
  args: { webhookData: v.any() },
  async handler(ctx, args) {
    const { webhookData } = args;
    const session = webhookData.data.object;

    console.log("SESSION_DEBUG:", session);

    if (session.subscription) {
      // Implement retry logic
      let checkoutSub = null;
      let attempts = 0;
      const maxAttempts = 5;
      const delayMs = 1000; // 1 second delay between attempts

      while (attempts < maxAttempts) {
        checkoutSub = await ctx.runQuery(
          internal.subscriptions.getSubscriptionByStripeId,
          {
            stripeId: session.subscription,
          },
        );

        console.log(
          `CHECKOUT_SUB_DEBUG (Attempt ${attempts + 1}):`,
          checkoutSub,
        );

        if (checkoutSub) {
          break;
        }

        // Use proper sleep function for actions
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        attempts++;
      }

      if (checkoutSub) {
        console.log("patching checkoutSub");
        // Only update if payment is successful
        if (session.payment_status === "paid") {
          // Fetch subscription details to determine plan type
          let planType = "basic"; // Default to basic
          
          try {
            // Retrieve the subscription from Stripe to get price details
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            
            // Log para depuração
            console.log("Subscription completa do Stripe:", JSON.stringify({
              id: subscription.id,
              item_data: subscription.items.data.map(item => ({
                price_id: item.price.id,
                product_id: item.price.product,
                unit_amount: item.price.unit_amount,
              }))
            }, null, 2));
            
            if (subscription && subscription.items && subscription.items.data.length > 0) {
              const priceId = subscription.items.data[0].price.id;
              
              // Log detalhado do item
              console.log(`Detalhes do item da subscription:`, JSON.stringify({
                price_id: priceId,
                product: subscription.items.data[0].price.product,
                unit_amount: subscription.items.data[0].price.unit_amount,
                nickname: subscription.items.data[0].price.nickname,
                metadata: subscription.items.data[0].price.metadata,
              }, null, 2));
              
              // Determinar o tipo de plano pelo ID do preço
              if (PRICE_ID_TO_PLAN_TYPE[priceId]) {
                planType = PRICE_ID_TO_PLAN_TYPE[priceId];
                console.log(`Plano determinado na checkout: ${planType} pelo mapeamento direto do price ID: ${priceId}`);
              } 
              // Verificar por nome/ID se contém basic ou pro
              else if (priceId.toLowerCase().includes('basic')) {
                planType = "basic";
                console.log(`Plano determinado na checkout: basic pelo nome no price ID: ${priceId}`);
              } 
              else if (priceId.toLowerCase().includes('pro')) {
                planType = "pro";
                console.log(`Plano determinado na checkout: pro pelo nome no price ID: ${priceId}`);
              }
              // Fallback para o valor
              else {
                planType = subscription.items.data[0].price.unit_amount >= 1999 ? "pro" : "basic";
                console.log(`Plano determinado na checkout pelo valor: ${planType} (${subscription.items.data[0].price.unit_amount})`);
              }
            }
          } catch (error) {
            console.error("Error retrieving subscription details:", error);
            // Continue with default planType if there's an error
          }
          
          return await ctx.runMutation(
            internal.subscriptions.updateSubscription,
            {
              id: checkoutSub._id,
              status: "active",
              planType,
              metadata: session.metadata || checkoutSub.metadata,
              userId: session.metadata?.userId || checkoutSub.userId,
            },
          );
        }
      } else {
        console.log(
          "Failed to find subscription after",
          maxAttempts,
          "attempts",
        );
        // You might want to store this in a separate table for failed webhooks to retry later
      }
    }
  },
});

export const getSubscriptionByStripeId = query({
  args: { stripeId: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("subscriptions")
      .withIndex("stripeId", (q) => q.eq("stripeId", args.stripeId))
      .first();
  },
});

export const updateSubscription = mutation({
  args: {
    id: v.id("subscriptions"),
    status: v.string(),
    planType: v.optional(v.string()),
    metadata: v.any(),
    userId: v.string(),
  },
  async handler(ctx, args) {
    const updates: Record<string, any> = {
      status: args.status,
      metadata: args.metadata,
      userId: args.userId,
    };
    
    // Add planType to updates if provided
    if (args.planType) {
      updates.planType = args.planType;
    }
    
    return await ctx.db.patch(args.id, updates);
  },
});

export const storeWebhookEvent = mutation({
  args: {
    type: v.string(),
    stripeEventId: v.string(),
    created: v.number(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("webhookEvents", {
      type: args.type,
      stripeEventId: args.stripeEventId,
      createdAt: new Date(args.created * 1000).toISOString(),
      modifiedAt: new Date(args.created * 1000).toISOString(),
      data: args.data,
    });
  },
});

export const handleInvoicePaymentSucceeded = mutation({
  args: { webhookData: v.any() },
  async handler(ctx, args) {
    const { webhookData } = args;
    const invoice = webhookData.data.object;

    // Get the subscription if it exists, but don't require it
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("stripeId", (q) => q.eq("stripeId", invoice.subscription))
      .first();

    // Create invoice record regardless of subscription status
    return await ctx.db.insert("invoices", {
      createdTime: invoice.created,
      invoiceId: invoice.id,
      subscriptionId: invoice.subscription,
      amountPaid: invoice.amount_paid.toString(),
      amountDue: invoice.amount_due.toString(),
      currency: invoice.currency,
      status: invoice.status,
      email: invoice.customer_email,
      // Use subscription metadata if available, otherwise use customer email as identifier
      userId: subscription?.metadata?.userId,
    });
  },
});

export const handleInvoicePaymentFailed = mutation({
  args: { webhookData: v.any() },
  async handler(ctx, args) {
    const { webhookData } = args;
    const invoice = webhookData.data.object;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("stripeId", (q) => q.eq("stripeId", invoice.subscription))
      .first();

    if (subscription) {
      return await ctx.db.patch(subscription._id, {
        status: "past_due",
      });
    }
  },
});

export const handleSubscriptionDeleted = mutation({
  args: { webhookData: v.any() },
  async handler(ctx, args) {
    const { webhookData } = args;
    const info = webhookData.data.object;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("stripeId", (q) => q.eq("stripeId", info.id))
      .first();

    if (subscription) {
      return await ctx.db.patch(subscription._id, {
        status: info.status,
      });
    }
  },
});

export const webhooksHandler = action({
  args: { body: v.string(), sig: v.string() },
  async handler(ctx, args) {
    const event = await stripe.webhooks.constructEventAsync(
      args.body,
      args.sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    const webhookData = JSON.parse(args.body);

    // Store webhook event
    await ctx.runMutation(api.subscriptions.storeWebhookEvent, {
      type: event.type,
      stripeEventId: webhookData.id,
      created: webhookData.created,
      data: webhookData,
    });

    switch (event.type) {
      case "customer.subscription.created":
        return await ctx.runMutation(
          api.subscriptions.handleSubscriptionCreated,
          { webhookData },
        );

      case "customer.subscription.updated":
        return await ctx.runMutation(
          api.subscriptions.handleSubscriptionUpdated,
          { webhookData },
        );

      case "customer.subscription.deleted":
        console.log("deleted", webhookData);
        return await ctx.runMutation(
          api.subscriptions.handleSubscriptionDeleted,
          { webhookData },
        );

      case "checkout.session.completed":
        return await ctx.runAction(
          api.subscriptions.handleCheckoutSessionCompleted,
          { webhookData },
        );

      case "invoice.payment_succeeded":
        return await ctx.runMutation(
          api.subscriptions.handleInvoicePaymentSucceeded,
          { webhookData },
        );

      case "invoice.payment_failed":
        return await ctx.runMutation(
          api.subscriptions.handleInvoicePaymentFailed,
          { webhookData },
        );

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }
  },
});

// A função getUserPermissions retorna as permissões para cada tipo de plano
export const getUserPermissions = query({
  handler: async (ctx): Promise<PlanPermissions> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return getPermissionsForTier("free");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      return getPermissionsForTier("free");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", identity.subject))
      .first();

    const hasActiveSubscription = subscription?.status === "active";
    if (!hasActiveSubscription) {
      return getPermissionsForTier("free");
    }

    // Determine tier from planType
    const tier = subscription.planType || 
                (subscription.amount >= 1999 ? "pro" : "basic");

    return getPermissionsForTier(tier as "free" | "basic" | "pro");
  },
});

// Função para corrigir assinaturas existentes com planType incorreto
export const fixSubscriptionPlanTypes = mutation({
  args: {},
  async handler(ctx) {
    // Obter todas as assinaturas ativas
    const activeSubscriptions = await ctx.db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    
    console.log(`Encontradas ${activeSubscriptions.length} assinaturas ativas para verificar`);
    
    const fixedSubscriptions = [];
    
    for (const subscription of activeSubscriptions) {
      // Pular se não tem stripePriceId
      if (!subscription.stripePriceId) {
        console.log(`Assinatura ${subscription._id} não tem stripePriceId, pulando`);
        continue;
      }
      
      const priceId = subscription.stripePriceId;
      let newPlanType = null;
      
      // Determinar o tipo de plano pelo mapeamento de ID
      if (PRICE_ID_TO_PLAN_TYPE[priceId]) {
        newPlanType = PRICE_ID_TO_PLAN_TYPE[priceId];
      }
      // Verificar pelo nome no ID
      else if (priceId.toLowerCase().includes('basic')) {
        newPlanType = "basic";
      }
      else if (priceId.toLowerCase().includes('pro')) {
        newPlanType = "pro";
      }
      // Fallback para valor (se tiver amount)
      else if (subscription.amount) {
        newPlanType = subscription.amount >= 1999 ? "pro" : "basic";
      }
      
      // Se o tipo de plano calculado for diferente do existente, atualizar
      if (newPlanType && newPlanType !== subscription.planType) {
        console.log(`Corrigindo assinatura ${subscription._id}: alterando planType de "${subscription.planType}" para "${newPlanType}"`);
        
        await ctx.db.patch(subscription._id, {
          planType: newPlanType
        });
        
        fixedSubscriptions.push({
          id: subscription._id,
          oldPlanType: subscription.planType,
          newPlanType: newPlanType
        });
      }
    }
    
    return {
      totalChecked: activeSubscriptions.length,
      totalFixed: fixedSubscriptions.length,
      fixedSubscriptions
    };
  }
});
