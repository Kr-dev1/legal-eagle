import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "./lib/verification/sendEmail";
import { nextCookies } from "better-auth/next-js";
import { sendResetEmail } from "./lib/verification/sendResetEmail";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
    maxPasswordLength: 100,
    revokeSessionsOnPasswordReset: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendResetEmail({
        to: user.email,
        subject: "Reset your password",
        url,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      if (user.emailVerified) return;
      const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
      const createdAt = new Date(user.createdAt).getTime();
      const now = Date.now();
      const timeSinceCreated = now - createdAt;
      if (timeSinceCreated >= TWO_DAYS_MS) {
        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          url,
        });
      }
    },
  },
  plugins: [nextCookies()],
});
