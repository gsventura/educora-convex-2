import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .unique();
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          email: identity.email,
        });
      }
      return user._id;
    }

    // If it's a new identity, create a new User with 10 free credits
    return await ctx.db.insert("users", {
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.subject,
      credits: 10, // Start with 10 free credits
    });
  },
});

// Get user's credit information
export const getUserCreditInfo = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { credits: 0, hasActiveSubscription: false, tier: "free" };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      return { credits: 0, hasActiveSubscription: false, tier: "free" };
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", identity.subject))
      .first();

    const hasActiveSubscription = subscription?.status === "active";
    const credits = user.credits || 0;

    // Determine tier based on subscription amount
    let tier = "free";
    if (hasActiveSubscription) {
      tier = subscription.amount >= 1999 ? "pro" : "basic";
    }

    return { credits, hasActiveSubscription, tier };
  },
});

// Add credits to a user (for admin or testing purposes)
export const addCredits = mutation({
  args: {
    userId: v.id("users"),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // In a real app, you would check if the user is an admin
    // For now, we'll just allow any authenticated user to add credits

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const currentCredits = user.credits || 0;
    await ctx.db.patch(args.userId, {
      credits: currentCredits + args.credits,
    });

    return { success: true, newCredits: currentCredits + args.credits };
  },
});
