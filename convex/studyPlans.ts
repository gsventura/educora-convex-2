import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a study plan
export const generateStudyPlan = mutation({
  args: {
    prompt: v.string(),
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
    // For now, we'll generate a mock study plan
    const mockPlan = `Study Plan for: ${args.prompt}\n\nWeek 1: Fundamentals\n- Day 1-2: Review basic concepts and terminology\n- Day 3-4: Study core principles\n- Day 5-7: Practice fundamental problems\n\nWeek 2: Intermediate Concepts\n- Day 1-3: Dive deeper into complex topics\n- Day 4-5: Connect concepts together\n- Day 6-7: Apply knowledge to medium-difficulty problems\n\nWeek 3: Advanced Applications\n- Day 1-3: Study advanced topics and edge cases\n- Day 4-5: Work through complex problems\n- Day 6-7: Identify and address knowledge gaps\n\nWeek 4: Review and Practice\n- Day 1-2: Comprehensive content review\n- Day 3-5: Timed practice sessions\n- Day 6-7: Mock exams under test conditions\n\nStudy Techniques:\n1. Use active recall instead of passive reading\n2. Implement spaced repetition for better retention\n3. Teach concepts to others to solidify understanding\n4. Take regular breaks using the Pomodoro technique\n5. Review material before sleep to improve memory consolidation`;

    // Deduct a credit if user is on free tier
    if (!hasActiveSubscription) {
      await ctx.db.patch(user._id, { credits: userCredits - 1 });
    }

    return {
      plan: mockPlan,
      remainingCredits: hasActiveSubscription ? "unlimited" : userCredits - 1,
    };
  },
});

// Save a study plan
export const saveStudyPlan = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    prompt: v.string(),
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

    // Check if user can save study plans (Pro tier feature)
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", identity.subject))
      .first();

    const hasActiveSubscription = subscription?.status === "active";

    // Count existing study plans
    const existingPlans = await ctx.db
      .query("studyPlans")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();

    // Free users can save 1 plan, Basic users can save 3 plans, Pro users unlimited
    const planLimit = hasActiveSubscription
      ? subscription.amount >= 1999
        ? Infinity
        : 3
      : 1;

    if (existingPlans.length >= planLimit) {
      throw new Error(
        `You can only save ${planLimit} study plan(s) on your current plan. Please upgrade to save more.`,
      );
    }

    const planId = await ctx.db.insert("studyPlans", {
      userId: user._id,
      title: args.title,
      content: args.content,
      prompt: args.prompt,
      model: "gpt-4", // Mock model name
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
