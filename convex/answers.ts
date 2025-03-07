import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate answer for a question
export const generateAnswer = mutation({
  args: {
    questionText: v.string(),
    imageUrl: v.optional(v.string()),
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
    // For now, we'll generate a mock answer
    let mockAnswer = "";
    if (args.imageUrl) {
      mockAnswer = `Based on the image you uploaded, I can see this is a question about mathematical principles. The solution requires applying the correct formula and calculating step by step.\n\nFirst, we need to understand what the question is asking. It appears to be asking about calculating a specific value using the given information.\n\nThe correct approach would be to use the formula relevant to this type of problem, substitute the values, and solve for the unknown variable.\n\nThe answer is...`;
    } else {
      mockAnswer = `Here's the explanation for your question:\n\n${args.questionText}\n\nThe answer involves understanding the key concepts and applying them correctly. First, you need to identify the main elements of the problem. Then, analyze how they interact with each other. Finally, apply the relevant formulas or principles to arrive at the solution.\n\nStep 1: Identify the variables and constants in the problem.\nStep 2: Set up the appropriate equations based on the principles involved.\nStep 3: Solve the equations to find the answer.\n\nThe correct approach would be to...`;
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
      model: "gpt-4", // Mock model name
      status: "completed",
      aiResponse: mockAnswer,
      createdAt: new Date().toISOString(),
      savedStatus: false,
      savedTags: [],
    });

    return {
      id: correctionId,
      answer: mockAnswer,
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
