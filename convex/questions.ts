import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Generate questions based on subject, difficulty, and prompt
export const generateQuestions = mutation({
  args: {
    subject: v.string(),
    difficulty: v.string(),
    prompt: v.string(),
    numQuestions: v.number(),
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
      throw new Error("No credits remaining. Please upgrade your plan.");
    }

    // In a real implementation, this would call an AI service
    // For now, we'll generate mock questions
    const mockQuestions = [
      `What are the key differences between ${args.subject} in the context of ${args.prompt}?`,
      `Explain how ${args.prompt} relates to the fundamental principles of ${args.subject}.`,
      `Compare and contrast the various approaches to solving problems in ${args.subject} when dealing with ${args.prompt}.`,
      `What are the historical developments that led to our current understanding of ${args.prompt} in ${args.subject}?`,
      `Describe a real-world application of ${args.subject} concepts in the context of ${args.prompt}.`,
    ].slice(0, args.numQuestions);

    // Deduct a credit if user is on free tier
    if (!hasActiveSubscription) {
      await ctx.db.patch(user._id, { credits: userCredits - 1 });
    }

    // Store the generated questions
    const generatedQuestionId = await ctx.db.insert("generatedQuestions", {
      userId: user._id,
      subject: args.subject,
      difficulty: args.difficulty,
      prompt: args.prompt,
      model: "gpt-4", // Model name
      status: "completed",
      questions: mockQuestions,
      aiResponse: JSON.stringify(mockQuestions),
      createdAt: new Date().toISOString(),
      savedStatus: false,
      savedTags: [args.subject, args.difficulty],
    });

    return {
      id: generatedQuestionId,
      questions: mockQuestions,
      remainingCredits: hasActiveSubscription ? "unlimited" : userCredits - 1,
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
