import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";
import { PlanTier } from "../src/types/permissions";

// Generate questions based on subject, difficulty, and prompt
export const generateQuestions = mutation({
  args: {
    subject: v.string(),
    difficulty: v.string(),
    prompt: v.string(),
    numQuestions: v.number(),
    aiResponse: v.optional(v.string()),
    subjectId: v.optional(v.id("subjects")),
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
            tier: "free" as PlanTier, 
            hasUnlimitedCredits: false,
            remainingCredits: userCredits,
            accessToAIModel: "basic"
          };
        }
        
        // Determine tier from planType
        let tier = "basic" as PlanTier; // Default é basic para assinaturas ativas
        
        // Use planType if available (first priority)
        if (subscription.planType) {
          tier = subscription.planType as PlanTier;
        }
        // Fallback para determinar pelo valor
        else if (subscription.amount && subscription.amount >= 1999) {
          tier = "pro" as PlanTier;
        }
                   
        // Determine AI model based on tier
        const accessToAIModel = tier === "pro" ? "advanced" : "basic";
                   
        return { 
          tier,
          hasUnlimitedCredits: true,
          remainingCredits: userCredits,
          accessToAIModel
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

    // Extrai as perguntas da resposta da IA, por enquanto vamos usar o aiResponse completo
    const questions = [args.aiResponse];

    // Deduz um crédito se o usuário estiver no plano gratuito
    if (!userPermissions.hasUnlimitedCredits) {
      await ctx.db.patch(user._id, { credits: userPermissions.remainingCredits - 1 });
    }

    // Store the generated questions
    const generatedQuestionId = await ctx.db.insert("generatedQuestions", {
      userId: user._id,
      subjectId: args.subjectId,
      subject: args.subject,
      difficulty: args.difficulty,
      prompt: args.prompt,
      model: userPermissions.accessToAIModel === "advanced" ? (args.model || "o3-mini") : "gpt-4o",
      status: "completed",
      questions: [args.aiResponse], // Usa a resposta completa da IA como única questão
      aiResponse: args.aiResponse,
      createdAt: new Date().toISOString(),
      savedStatus: false,
      savedTags: [args.subject, args.difficulty],
    });

    return {
      id: generatedQuestionId,
      questions: [args.aiResponse],
      remainingCredits: userPermissions.hasUnlimitedCredits ? "unlimited" : userPermissions.remainingCredits - 1,
    };
  },
});

// Save a generated question
export const saveQuestion = mutation({
  args: {
    questionId: v.optional(v.id("generatedQuestions")),
    question: v.string(),
    subject: v.optional(v.string()),
    tags: v.array(v.string()),
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

    // If questionId is provided, update the savedStatus
    if (args.questionId) {
      await ctx.db.patch(args.questionId, {
        savedStatus: true,
        savedTags: args.tags,
      });
    }

    // Save the question to savedItems
    const savedItemId = await ctx.db.insert("savedItems", {
      userId: user._id,
      type: "question",
      content: args.question,
      subject: args.subject,
      tags: args.tags,
      createdAt: new Date().toISOString(),
      originalItemId: args.questionId ? args.questionId.toString() : undefined,
    });

    return savedItemId;
  },
});

// Get user's generated questions
export const getUserGeneratedQuestions = query({
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

    const questions = await ctx.db
      .query("generatedQuestions")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return questions;
  },
});

// Get user's remaining credits
export const getUserCredits = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { credits: 0, hasActiveSubscription: false };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      return { credits: 0, hasActiveSubscription: false };
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", identity.subject))
      .first();

    const hasActiveSubscription = subscription?.status === "active";
    const credits = user.credits || 0;

    return { credits, hasActiveSubscription };
  },
});
