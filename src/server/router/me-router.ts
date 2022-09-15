import { z } from "zod"
import { createProtectedRouter } from "./context"

export const meRouter = createProtectedRouter()
    .query('get-the-most-recent', {
        async resolve({ ctx }) {
            return await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session.user.id
                },
                include: {
                    votes: {
                        take: 30,
                        include: {
                            votedFor: true,
                            votedAgainst: true
                        }
                    }
                }  
            })
        }
    })
    .mutation('cast-vote', {
        input: z
            .object({
                votedFor: z.number(),
                votedAgainst: z.number()
            }),
        async resolve({ ctx, input }) {
            const { votedFor, votedAgainst } = input
            const vote = await ctx.prisma.vote.create({
                data: {
                    userId: ctx.session.user.id, 
                    votedForId: votedFor,
                    votedAgainstId: votedAgainst
                }
            })
            return { status: 'success', vote }
        }
    })