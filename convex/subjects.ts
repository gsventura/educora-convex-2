import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all subjects
export const getAllSubjects = query({
  handler: async (ctx) => {
    const subjects = await ctx.db.query("subjects").collect();
    return subjects;
  },
});

// Add a new subject
export const addSubject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const subjectId = await ctx.db.insert("subjects", {
      name: args.name,
      description: args.description,
      createdAt: new Date().toISOString(),
    });
    return subjectId;
  },
});

// Seed initial subjects if none exist
export const seedSubjects = mutation({
  handler: async (ctx) => {
    const existingSubjects = await ctx.db.query("subjects").collect();

    if (existingSubjects.length === 0) {
      const subjects = [
        {
          name: "Mathematics",
          description: "Numbers, algebra, geometry, and calculus",
        },
        {
          name: "Physics",
          description: "Study of matter, energy, and the fundamental forces",
        },
        {
          name: "Chemistry",
          description: "Study of substances, their properties, and reactions",
        },
        {
          name: "Biology",
          description: "Study of living organisms and their interactions",
        },
        {
          name: "History",
          description: "Study of past events and human civilization",
        },
        {
          name: "Geography",
          description:
            "Study of places and relationships between people and environments",
        },
        {
          name: "Literature",
          description: "Study of written works and their contexts",
        },
        {
          name: "Computer Science",
          description: "Study of computers and computational systems",
        },
        {
          name: "Economics",
          description:
            "Study of production, distribution, and consumption of goods",
        },
        {
          name: "Philosophy",
          description:
            "Study of fundamental questions about existence, knowledge, and ethics",
        },
        { name: "Psychology", description: "Study of mind and behavior" },
        {
          name: "Sociology",
          description:
            "Study of society, social relationships, and institutions",
        },
        {
          name: "Art",
          description: "Study of visual arts, their history and techniques",
        },
        {
          name: "Music",
          description: "Study of musical theory, history, and performance",
        },
        {
          name: "Foreign Languages",
          description: "Study of languages other than one's native language",
        },
      ];

      for (const subject of subjects) {
        await ctx.db.insert("subjects", {
          name: subject.name,
          description: subject.description,
          createdAt: new Date().toISOString(),
        });
      }

      return { success: true, count: subjects.length };
    }

    return { success: false, message: "Subjects already exist" };
  },
});
