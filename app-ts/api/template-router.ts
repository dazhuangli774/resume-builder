import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { templates } from "@db/schema";
import { eq } from "drizzle-orm";

export const templateRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(templates);
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(templates)
        .where(eq(templates.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),
});
