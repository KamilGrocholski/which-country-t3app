// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { countryRouter } from "./country-router";
import { protectedRouter } from "./protected-router";
import { voteRouter } from "./vote-router";
import { meRouter } from "./me-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("countries.", countryRouter)
  .merge('vote.', voteRouter)
  .merge("auth.", protectedRouter)
  .merge('me.', meRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
