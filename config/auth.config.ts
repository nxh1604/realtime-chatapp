import Google from "@auth/core/providers/google";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [Google({})],
} satisfies NextAuthConfig;
