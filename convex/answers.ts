import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate answer for a question
export const generateAnswer = mutation({
  args: {
    questionText: v.string(),
    imageUrl: v.optional(v.string()),
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

    // Check if user has credits (for free tier)
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", identity.subject))
      .first();

    const hasActiveSubscription = subscription?.status === "active";
    const userCredits = user.credits || 0;

    if (!hasActiveSubscription && userCredits <= 0) {
      throw new Error("Você não tem mais créditos. Por favor, atualize seu plano.");
    }

    // Verifica se temos uma resposta da IA
    if (!args.aiResponse) {
      throw new Error("No AI response provided.");
    }

    // Deduct a credit if user is on free tier
    if (!hasActiveSubscription) {
      await ctx.db.patch(user._id, { credits: userCredits - 1 });
    }

    // Store the correction
    const correctionId = await ctx.db.insert("questionCorrections", {
      userId: user._id,
      questionText: args.questionText,
      imageUrl: args.imageUrl,
      model: args.model || "gpt-4.1",
      status: "completed",
      aiResponse: args.aiResponse,
      createdAt: new Date().toISOString(),
      savedStatus: false,
      savedTags: [],
    });

    return {
      id: correctionId,
      answer: args.aiResponse,
      remainingCredits: hasActiveSubscription ? "unlimited" : userCredits - 1,
    };
  },
});

// Save an answer
export const saveAnswer = mutation({
  args: {
    correctionId: v.optional(v.id("questionCorrections")),
    questionText: v.string(),
    answer: v.string(),
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

    // If correctionId is provided, update the savedStatus
    if (args.correctionId) {
      await ctx.db.patch(args.correctionId, {
        savedStatus: true,
        savedTags: args.tags,
      });
    }

    // Save the answer to savedItems
    const savedItemId = await ctx.db.insert("savedItems", {
      userId: user._id,
      type: "answer",
      content: `Question: ${args.questionText}\n\nAnswer: ${args.answer}`,
      subject: args.subject,
      tags: args.tags,
      createdAt: new Date().toISOString(),
      originalItemId: args.correctionId
        ? args.correctionId.toString()
        : undefined,
    });

    return savedItemId;
  },
});

// Get user's corrections
export const getUserCorrections = query({
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

    const corrections = await ctx.db
      .query("questionCorrections")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return corrections;
  },
});
