import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's saved items
export const getUserSavedItems = query({
  args: {
    type: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    searchTerm: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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

    // Start with a query for the user's items
    let itemsQuery = ctx.db
      .query("savedItems")
      .withIndex("byUserId", (q) => q.eq("userId", user._id));

    // Filter by type if provided
    if (args.type) {
      itemsQuery = ctx.db
        .query("savedItems")
        .withIndex("byType", (q) => q.eq("type", args.type))
        .filter((q) => q.eq(q.field("userId"), user._id));
    }

    // Get all items first
    const items = await itemsQuery.order("desc").collect();

    // Then filter by tags and search term in memory
    // (This is a simplification - in a real app, you might want to implement proper search)
    let filteredItems = items;

    // Filter by tags if provided
    if (args.tags && args.tags.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        args.tags!.every((tag) => item.tags.includes(tag)),
      );
    }

    // Filter by search term if provided
    if (args.searchTerm) {
      const searchTermLower = args.searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.content.toLowerCase().includes(searchTermLower) ||
          (item.subject &&
            item.subject.toLowerCase().includes(searchTermLower)) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTermLower)),
      );
    }

    return filteredItems;
  },
});

// Delete a saved item
export const deleteSavedItem = mutation({
  args: {
    itemId: v.id("savedItems"),
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

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // Check if the item belongs to the user
    if (item.userId.toString() !== user._id.toString()) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.itemId);
    return { success: true };
  },
});

// Update tags for a saved item
export const updateItemTags = mutation({
  args: {
    itemId: v.id("savedItems"),
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

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // Check if the item belongs to the user
    if (item.userId.toString() !== user._id.toString()) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.itemId, {
      tags: args.tags,
    });

    return { success: true };
  },
});

// Export saved items
export const exportSavedItems = query({
  args: {
    type: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    format: v.string(), // "markdown" or "docx"
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

    // Get items based on filters
    const itemsQuery = ctx.db
      .query("savedItems")
      .withIndex("byUserId", (q) => q.eq("userId", user._id));

    let items = await itemsQuery.collect();

    // Filter by type if provided
    if (args.type) {
      items = items.filter((item) => item.type === args.type);
    }

    // Filter by tags if provided
    if (args.tags && args.tags.length > 0) {
      items = items.filter((item) =>
        args.tags!.every((tag) => item.tags.includes(tag)),
      );
    }

    // In a real implementation, this would generate the appropriate format
    // For now, we'll just return the items
    return {
      format: args.format,
      items,
      // In a real implementation, you would return a URL to download the file
      // downloadUrl: "https://example.com/download/123",
    };
  },
});
