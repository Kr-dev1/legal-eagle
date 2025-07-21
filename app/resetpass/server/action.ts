"use server";

import { auth } from "@/auth";
import { APIError } from "better-auth/api";

export const requestResetPass = async (formData: FormData) => {
  const email = formData.get("email") as string;
  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "http://localhost:3000/newpass"
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      console.error("API Error:", error.message);
    }
  }
};
