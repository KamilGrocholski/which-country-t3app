import { createRouter } from "./context"
import { z } from 'zod'

export const voteRouter = createRouter()
    .mutation('cast', {
        input: z
            .object({
                votedFor: z.number(),
                votedAgainst: z.number()
            }),
        async resolve({ ctx, input }) {
            const { votedFor, votedAgainst } = input
            const vote = await ctx.prisma.vote.create({
                data: {
                    votedForId: votedFor,
                    votedAgainstId: votedAgainst
                }
            })
            return { status: 'success', vote }
        }
    })