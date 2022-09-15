import { createRouter } from "./context";
// import { z } from "zod";
// import { prisma } from "../db/client";
import getRandomIds from "../utils/getRandomIds";

export const countryRouter = createRouter()
  .query("get-all", {
    async resolve({ ctx }) {
      return await ctx.prisma.country.findMany();
    },
  })
  .query('get-all-orderBy-votesFor', {
    async resolve({ ctx }) {
      return await ctx.prisma.country.findMany({
        orderBy: {
          votesFor: { _count: 'desc' }
        },
        select: {
          id: true,
          name: true,
          iso2: true,
          _count: {
            select: {
                votesFor: true,
                votesAgainst: true
            }
          }
        }
      })
    }
  })
  .query('get-country-pair', {
    async resolve({ ctx }) {
      const nCountries = await ctx.prisma.country.count()
      const twoRandomIds = getRandomIds(1, nCountries)
      const pair = await ctx.prisma.country.findMany({
        where: {
          id: { in: twoRandomIds }
        }
      })
      return { firstCountry: pair[0], secondCountry: pair[1] }
    }
  })
