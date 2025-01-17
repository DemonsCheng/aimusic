import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/index";
import Resend from "next-auth/providers/resend";
import { sendVerificationRequest } from "@/lib/email/sendVerificationRequest";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async (params) => {
        await sendVerificationRequest({
          ...params,
          provider: {
            ...params.provider,
            from: process.env.EMAIL_FROM!,
          },
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
    async signIn({ user, account, profile }) {
      try {
        console.log("Sign in attempt:", { user, account, profile });
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
  },
});
