import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),
    credits: v.optional(v.number()),
  }).index("by_token", ["tokenIdentifier"]),
  subscriptions: defineTable({
    userId: v.optional(v.string()),
    stripeId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    currency: v.optional(v.string()),
    interval: v.optional(v.string()),
    status: v.optional(v.string()),
    planType: v.optional(v.string()), // "free", "basic", "pro"
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    amount: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    customerCancellationReason: v.optional(v.string()),
    customerCancellationComment: v.optional(v.string()),
    metadata: v.optional(v.any()),
    customFieldData: v.optional(v.any()),
    customerId: v.optional(v.string()),
  })
    .index("userId", ["userId"])
    .index("stripeId", ["stripeId"]),
  webhookEvents: defineTable({
    type: v.string(),
    stripeEventId: v.string(),
    createdAt: v.string(),
    modifiedAt: v.string(),
    data: v.any(),
  })
    .index("type", ["type"])
    .index("stripeEventId", ["stripeEventId"]),
  invoices: defineTable({
    createdTime: v.optional(v.number()), // Timestamp as number
    invoiceId: v.string(),
    subscriptionId: v.string(),
    amountPaid: v.string(),
    amountDue: v.string(),
    currency: v.string(),
    status: v.string(),
    email: v.string(),
    userId: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_invoiceId", ["invoiceId"])
    .index("by_subscriptionId", ["subscriptionId"]),

  // Educora specific tables
  subjects: defineTable({
    name: v.string(),
    description: v.string(),
    createdAt: v.string(),
  }),

  generatedQuestions: defineTable({
    userId: v.id("users"),
    subjectId: v.optional(v.id("subjects")),
    subject: v.string(),
    difficulty: v.optional(v.string()),
    prompt: v.string(),
    model: v.string(),
    status: v.string(),
    questions: v.array(v.string()),
    aiResponse: v.union(v.string(), v.null()),
    createdAt: v.string(),
    savedStatus: v.boolean(),
    savedTags: v.array(v.string()),
  }).index("byUserId", ["userId"]),

  questionCorrections: defineTable({
    userId: v.id("users"),
    questionText: v.string(),
    imageUrl: v.optional(v.string()),
    model: v.string(),
    status: v.string(),
    aiResponse: v.union(v.string(), v.null()),
    createdAt: v.string(),
    savedStatus: v.boolean(),
    savedTags: v.array(v.string()),
  }).index("byUserId", ["userId"]),

  savedItems: defineTable({
    userId: v.id("users"),
    type: v.string(), // "question", "answer", "correction"
    content: v.string(),
    subject: v.optional(v.string()),
    tags: v.array(v.string()),
    createdAt: v.string(),
    originalItemId: v.optional(v.string()), // Reference to the original item
  })
    .index("byUserId", ["userId"])
    .index("byType", ["type"])
    .index("byTags", ["tags"]),

  studyPlans: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    prompt: v.string(),
    model: v.string(),
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
  }).index("byUserId", ["userId"]),
});
