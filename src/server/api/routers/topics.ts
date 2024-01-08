import { Input } from "postcss";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const topicRouter = createTRPCRouter({
  // protectedProcedures are only available to authorized users
  // We're querying data, not mutating it, so we use a query procedure
  // Notes have topicId, it's user ID for a topic, which we get from the context
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.topic.findMany({
      where: { 
        // We get it from the session from the user and then their ID
        userId: ctx.session.user.id,
      },
    });
  }),

  // Input a title and create a topic with the title and the user ID
  create: protectedProcedure
  .input(z.object({ title: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.topic.create({
        data: {
            title: input.title,
            userId: ctx.session.user.id,
        },
    });
  }),
});
