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
import { useFormStatus } from "react-dom"
import { updatePassword } from "@/app/newpass/server/action"
import { useSearchParams } from 'next/navigation'

const forgotPasswordSchema = z.object({
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
            message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character",
        }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

const UpdatePassword = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    // Add token validation
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Invalid Token</CardTitle>
                        <CardDescription>
                            The password reset link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "all",
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    })

    const [state, formAction] = useActionState(
        async (prevState: { success: boolean } | undefined, formData: FormData) => {
            formData.append("token", token)
            return updatePassword(formData, token)
        },
        { success: false }
    )


    return (
        <div className="min-h-screen flex items-center justify-center bg-black-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Enter New Password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter you Password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form  {...form}>
                            <form action={formAction} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Re-Enter Password"
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

export default UpdatePassword

function ButtonWithLoader({ errors }: any) {
    const [disabled, setDisabled] = useState(true)
    const { pending } = useFormStatus();
    const form = useFormContext();

    useEffect(() => {
        const password = form.getValues("password");
        const confirmPassword = form.getValues("confirmPassword");
        if (Object.keys(errors).length === 0 && !pending && password && confirmPassword) {
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
            Update Password
        </Button>
    );
}