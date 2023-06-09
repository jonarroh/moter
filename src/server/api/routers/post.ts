import { type User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 3 requests per 1 minute per user
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});
const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.firstName,
    profilePhotoUrl: user.profileImageUrl,
  };
};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    const users = (
      await clerkClient.users.getUserList({
        userId: post.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    return post.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      if (!author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found",
        });

      return {
        post,
        author,
      };
    });
  }),

  getByPostUserNames: publicProcedure
    .input(
      z.object({
        authorName: z.string().min(1).max(280),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findMany({
        where: {
          autorName: input.authorName,
        },
        take: 100,
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
      const users = (
        await clerkClient.users.getUserList({
          userId: post.map((post) => post.authorId),
          limit: 100,
        })
      ).map(filterUserForClient);

      return post.map((post) => {
        const author = users.find((user) => user.id === post.authorId);
        if (!author)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Author not found",
          });

        return {
          post,
          author,
        };
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
        authorName: z.string().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }
      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId,
          autorName: input.authorName,
        },
      });
      return post;
    }),
});
