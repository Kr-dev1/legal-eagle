"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useFormContext } from "react-hook-form";
import { useActionState, useEffect, useState } from "react";
import { signUp } from "@/app/signup/server/action";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import GoogleButton from "./social/google";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
      message:
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character",
    }),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const [state, formAction] = useActionState(
    (prevState: { success: boolean } | undefined, formData: FormData) =>
      signUp(formData),
    { success: false },
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(
        "Registered successfully please check your email to verify your account",
      );
      router.replace("/signin");
      form.reset();
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-8">
              <GoogleButton />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="JhonDoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ButtonWithLoader errors={form.formState.errors} />
            </form>
          </Form>
          <p className="text-xs mt-4 text-right">
            Already have an account?{" "}
            <Link className="text-indigo-300" href="/signin">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ButtonWithLoader({ errors }: { errors: any }) {
  const { pending } = useFormStatus();
  const [disabled, setDisabled] = useState(true);
  const form = useFormContext();

  useEffect(() => {
    const email = form.getValues("email");
    const password = form.getValues("password");
    const username = form.getValues("username");

    if (
      Object.keys(errors).length === 0 &&
      !pending &&
      email &&
      username &&
      password
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [errors, pending, form]);

  return (
    <Button
      type="submit"
      className="w-full flex items-center justify-center gap-2"
      disabled={disabled}
    >
      {pending && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {pending ? "Registering" : "Register"}
    </Button>
  );
}
