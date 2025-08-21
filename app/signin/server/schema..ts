import z from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
      message:
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character",
    }),
});
