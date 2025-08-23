"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/prisma";
import { APIError } from "better-auth/api";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    const hasContracts = await prisma.contractDetails.findMany({
      where: {
        userID: response.user.id,
      },
    });

    return { success: true, hasContract: !!hasContracts.length };
  } catch (error) {
    if (error instanceof APIError) {
      console.error("API Error:", error);
      return { success: false, message: error.message };
    }
  }
};
