import { authRouter } from "./auth-router";
import { templateRouter } from "./template-router";
import { resumeRouter } from "./resume-router";
import { aiRouter } from "./ai-router";
import { peotRouter } from "./peot-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  template: templateRouter,
  resume: resumeRouter,
  ai: aiRouter,
  peot: peotRouter,
});

export type AppRouter = typeof appRouter;
