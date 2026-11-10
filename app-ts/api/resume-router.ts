import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { resumes } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const resumeRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    const db = getDb();
    return db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, ctx.user.id))
      .orderBy(desc(resumes.updatedAt));
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(resumes)
        .where(eq(resumes.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        templateId: z.number(),
        title: z.string().min(1).max(255),
        purpose: z.enum(["job", "academic"]).default("job"),
        data: z.record(z.string(), z.unknown()).default({}),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const db = getDb();
      await db.insert(resumes).values({
        userId: ctx.user.id,
        templateId: input.templateId,
        title: input.title,
        purpose: input.purpose,
        data: input.data,
      });
      return { success: true };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        data: z.record(z.string(), z.unknown()).optional(),
        purpose: z.enum(["job", "academic"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const db = getDb();
      const { id, ...updates } = input;
      await db
        .update(resumes)
        .set(updates)
        .where(eq(resumes.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const db = getDb();
      await db.delete(resumes).where(eq(resumes.id, input.id));
      return { success: true };
    }),
});
