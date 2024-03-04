import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import NextAuth, { User } from "next-auth";
import redis from "./db";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: UpstashRedisAdapter(redis),
  session: { strategy: "jwt" },
  providers: [GitHub, Google],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await redis.get(`user:${token.id}`)) as User;

      if (!dbUser) {
        if (user && user.id) {
          token.id = user!.id;
        }

        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token && token.id && token.email) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
});
