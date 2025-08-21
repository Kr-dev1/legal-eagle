"use server";

import { auth } from "@/auth";
import { APIError } from "better-auth/api";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      console.error("API Error:", error);
      return { success: false, message: error.message };
    }
  }
};
