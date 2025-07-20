"use client"

import React, { useActionState, useEffect, useState } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { requestResetPass } from "@/app/resetpass/server/action"
import { useFormStatus } from "react-dom";

const forgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address"),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordPage = () => {
    const form = useForm<ForgotPasswordForm>({
        mode: "all",
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const [state, formAction] = useActionState(
        (prevState: { success: boolean } | undefined, formData: FormData) =>
            requestResetPass(formData),
        { success: false }

    )

    return (
        state?.success ?
            <div className="min-h-screen flex items-center justify-center bg-black-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">
                                Check Your Email
                            </CardTitle>
                            <CardDescription className="text-center">
                                A reset link has been sent to your email address if it exists in our system.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-center">
                            <Link href="/signin" className="font-medium text-primary hover:underline">
                                Back to Sign In
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div> :
            <div className="min-h-screen flex items-center justify-center bg-black-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <Card>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/signin"
                                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to sign in
                                </Link>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">
                                Forgot your password?
                            </CardTitle>
                            <CardDescription className="text-center">
                                Enter your email address and we'll send you a link to reset your password.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Form  {...form}>
                                <form action={formAction} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Enter your email"
                                                            className="pl-10"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <ButtonWithLoader errors={form.formState.errors} />
                                </form>
                            </Form>
                        </CardContent>

                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-muted-foreground">
                                Remember your password?{" "}
                                <Link href="/signin" className="font-medium text-primary hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
    )
}

export default ForgotPasswordPage


function ButtonWithLoader({ errors }: any) {
    const [disabled, setDisabled] = useState(true)
    const { pending } = useFormStatus();
    const form = useFormContext();

    useEffect(() => {
        const email = form.getValues("email");
        if (Object.keys(errors).length === 0 && !pending && email) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [errors, pending, form])

    return (
        <Button
            type="submit"
            className="w-full flex justify-center items-center gap-2"
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
            {pending ? "Logging In" : "Login"}
        </Button>
    );
}
