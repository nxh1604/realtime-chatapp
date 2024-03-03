import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import NextAuth, { User } from "next-auth";
import redis from "./db";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth((req) => {
  return {
    adapter: UpstashRedisAdapter(redis),
    session: { strategy: "jwt" },
    providers: [GitHub, Google],
    callbacks: {
      signIn: ({ user }) => {
        console.log({ user });
        return true;
      },
      async jwt({ token, user }) {
        const userDb = await redis.get<User>(`user:${token.id}`);
        console.log(userDb);
        return token;
      },
      async redirect({ baseUrl }) {
        return `${baseUrl}/dashboard`;
      },
      async session({ session, token }) {
        console.log({ session, token });

        return session;
      },
    },
  };
});
