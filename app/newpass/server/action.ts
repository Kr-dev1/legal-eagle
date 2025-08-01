"use server";

import { auth } from "@/auth";
import { APIError } from "better-auth/api";

export const updatePassword = async (formData: FormData, token: string) => {
  if (!token) {
    console.error("No token provided");
    return { success: false, error: "Invalid token" };
  }

  const newPassword = formData.get("password") as string;
  
  try {
    await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      console.error("API Error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
};
