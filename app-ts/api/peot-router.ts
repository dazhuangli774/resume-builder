import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { peots } from "@db/schema";
import { eq, like, desc, sql } from "drizzle-orm";

export const peotRouter = createRouter({
  // LIST: 分页 + 搜索
  list: publicQuery
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        keyword: z.string().optional(),
        dynasty: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const pageSize = input?.pageSize ?? 10;
      const keyword = input?.keyword ?? "";
      const dynasty = input?.dynasty ?? "";

      let query = db.select().from(peots);

      // Build where conditions
      const conditions = [];
      if (keyword) {
        conditions.push(like(peots.name, `%${keyword}%`));
      }
      if (dynasty) {
        conditions.push(eq(peots.dynasty, dynasty));
      }

      // Get total count
      let totalResult;
      if (conditions.length > 0) {
        totalResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(peots)
          .where(conditions[0]);
      } else {
        totalResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(peots);
      }
      const total = totalResult[0]?.count ?? 0;

      // Get paginated data
      let data;
      if (conditions.length > 0) {
        data = await db
          .select()
          .from(peots)
          .where(conditions[0])
          .orderBy(desc(peots.createdAt))
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        data = await db
          .select()
          .from(peots)
          .orderBy(desc(peots.createdAt))
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      }

      return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }),

  // GET BY ID
  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(peots)
        .where(eq(peots.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  // CREATE
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        gender: z.enum(["男", "女"]).default("男"),
        dynasty: z.string().min(1).max(50),
        title: z.string().max(255).optional(),
        style: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(peots).values({
        name: input.name,
        gender: input.gender,
        dynasty: input.dynasty,
        title: input.title ?? null,
        style: input.style ?? null,
      });
      return { success: true };
    }),

  // UPDATE
  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        gender: z.enum(["男", "女"]).optional(),
        dynasty: z.string().min(1).max(50).optional(),
        title: z.string().max(255).optional(),
        style: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      // Remove undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined)
      );
      await db.update(peots).set(cleanUpdates).where(eq(peots.id, id));
      return { success: true };
    }),

  // DELETE
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(peots).where(eq(peots.id, input.id));
      return { success: true };
    }),

  // GET ALL DYNASTIES (for filter dropdown)
  dynasties: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({ dynasty: peots.dynasty })
      .from(peots)
      .groupBy(peots.dynasty)
      .orderBy(peots.dynasty);
    return result.map((r) => r.dynasty);
  }),
});
