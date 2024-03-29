import { ollamaRouter } from "y/server/api/routers/ollama";
import { createTRPCRouter } from "y/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ollama: ollamaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
