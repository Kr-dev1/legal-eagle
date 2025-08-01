"use server";

import { auth } from "@/auth";
import { APIError } from "better-auth/api";

export const signUp = async (formData: FormData) => {
  const name = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      console.error("API Error:", error.message);
    }
  }
};
