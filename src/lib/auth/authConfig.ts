import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
// import { setName } from "@/src/lib/auth/setNameServerAction";
// import { clearStaleTokens } from "./clearStaleTokensServerAction";
import { db } from "@/lib/db/index";
import Resend from "next-auth/providers/resend";
import { sendVerificationRequest } from "@/lib/email/sendVerificationRequest";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET, // Used to sign the session cookie so AuthJS can verify the session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds (this value is also the default)
  },
  pages: {
    signIn: "/auth/login",
    // verifyRequest: "/auth/auth-success",
    // error: "/auth/auth-error",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, // Allow automatic linking of users table to accounts table in database - not dangerous when used with OAuth providers that already perform email verification (like Google)
    }),
    Resend({
      // If your environment variable is named differently than default
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
    async jwt({ token, user, session, trigger }) {
      //   if (trigger === "update" && session?.name !== token.name) {
      //     token.name = session.name;

      //     try {
      //       await setName(token.name);
      //     } catch (error) {
      //       console.error("Failed to set user name:", error);
      //     }
      //   }

      if (user) {
        // await clearStaleTokens(); // Clear up any stale verification tokens from the database after a successful sign in
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("session callback", { session, token });
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
