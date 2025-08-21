"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm, useFormContext } from "react-hook-form"
import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom";
import Link from "next/link"
import { signIn } from "@/app/signin/server/action"
import { useRouter } from "next/navigation"
import GoogleButton from "./social/google"
import { signInSchema } from "@/app/signin/server/schema."
import { toast } from "sonner"



export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        mode: "all",
        defaultValues: {
            email: "",
            password: ""
        },
    })
    const [state, formAction] = useActionState(
        (prevState: { success: boolean } | undefined, formData: FormData) =>
            signIn(formData),
        { success: false }
    )

    useEffect(() => {
        if (state?.success) {
            router.push("/dashboard")
            toast.success("LoggedIn")
        }
    }, [state, router])

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Login to your account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below or continue with Google to log in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form action={formAction} className="space-y-8">
                            <GoogleButton />
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
                                            <Input type="password" placeholder="••••••••"  {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs text-right">
                                            <Link href='resetpass'>
                                                Forgot Password?
                                            </Link>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <ButtonWithLoader errors={form.formState.errors} />
                        </form>
                    </Form>
                    <p className="text-xs mt-4 text-right">Don&apos;t have an account? <Link className="text-indigo-300" href="/signup">Register</Link></p>
                </CardContent>
            </Card>
        </div>
    )
}

function ButtonWithLoader({ errors }: any) {
    const { pending } = useFormStatus();
    const [disabled, setDisabled] = useState(true)
    const form = useFormContext();

    useEffect(() => {
        const email = form.getValues("email");
        const password = form.getValues("password");
        if (Object.keys(errors).length === 0 && !pending && email && password) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [errors, pending, form])
    return (

        <Button
            type="submit"
            className="w-full flex justify-center items-center gap-2"
            disabled={pending || errors.email || errors.password}
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
