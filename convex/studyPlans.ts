import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// Generate a study plan
export const generateStudyPlan = mutation({
  args: {
    prompt: v.string(),
    aiResponse: v.optional(v.string()),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get user permissions based on subscription tier
    const userPermissions = await ctx.db.query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", identity.subject))
      .first()
      .then(subscription => {
        const hasActiveSubscription = subscription?.status === "active";
        const userCredits = user.credits || 0;
        
        if (!hasActiveSubscription) {
          return { 
            tier: "free", 
            hasUnlimitedCredits: false,
            remainingCredits: userCredits
          };
        }
        
        // Determine tier from planType
        const tier = subscription.planType || 
                   (subscription.amount >= 1999 ? "pro" : "basic");
                   
        return { 
          tier,
          hasUnlimitedCredits: true,
          remainingCredits: userCredits
        };
      });

    // Verifica se o usuário tem créditos (para o plano gratuito)
    if (!userPermissions.hasUnlimitedCredits && userPermissions.remainingCredits <= 0) {
      throw new Error("Sem créditos restantes. Por favor, faça upgrade do seu plano.");
    }

    // Verifica se temos uma resposta da IA
    if (!args.aiResponse) {
      throw new Error("Nenhuma resposta da IA fornecida.");
    }

    // Deduz um crédito se o usuário estiver no plano gratuito
    if (!userPermissions.hasUnlimitedCredits) {
      await ctx.db.patch(user._id, { credits: userPermissions.remainingCredits - 1 });
    }

    return {
      plan: args.aiResponse,
      remainingCredits: userPermissions.hasUnlimitedCredits 
        ? "unlimited" 
        : userPermissions.remainingCredits - 1,
    };
  },
});

// Save a study plan
export const saveStudyPlan = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    prompt: v.string(),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get user permissions based on subscription tier
    const userPermissions = await ctx.db.query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", identity.subject))
      .first()
      .then(subscription => {
        const hasActiveSubscription = subscription?.status === "active";
        if (!hasActiveSubscription) return { tier: "free", maxStudyPlans: 1 };
        
        // Determine tier from planType
        const tier = subscription.planType || 
                   (subscription.amount >= 1999 ? "pro" : "basic");
                   
        const maxStudyPlans = tier === "pro" 
          ? Infinity 
          : tier === "basic" 
            ? 3 
            : 1;
            
        return { tier, maxStudyPlans };
      });

    // Count existing study plans
    const existingPlans = await ctx.db
      .query("studyPlans")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();

    // Check if user has reached their plan limit
    if (existingPlans.length >= userPermissions.maxStudyPlans) {
      throw new Error(
        `Você só pode salvar ${userPermissions.maxStudyPlans} plano(s) de estudo no seu plano atual. Faça upgrade para salvar mais.`,
      );
    }

    const planId = await ctx.db.insert("studyPlans", {
      userId: user._id,
      title: args.title,
      content: args.content,
      prompt: args.prompt,
      model: args.model || "gpt-4.1",
      createdAt: new Date().toISOString(),
    });

    return planId;
  },
});

// Get user's study plans
export const getUserStudyPlans = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    const plans = await ctx.db
      .query("studyPlans")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return plans;
  },
});

// Delete a study plan
export const deleteStudyPlan = mutation({
  args: {
    planId: v.id("studyPlans"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Plan not found");
    }

    // Check if the plan belongs to the user
    if (plan.userId.toString() !== user._id.toString()) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.planId);
    return { success: true };
  },
});

// Update a study plan
export const updateStudyPlan = mutation({
  args: {
    planId: v.id("studyPlans"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Plan not found");
    }

    // Check if the plan belongs to the user
    if (plan.userId.toString() !== user._id.toString()) {
      throw new Error("Not authorized");
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (args.title !== undefined) {
      updates.title = args.title;
    }

    if (args.content !== undefined) {
      updates.content = args.content;
    }

    await ctx.db.patch(args.planId, updates);
    return { success: true };
  },
});
