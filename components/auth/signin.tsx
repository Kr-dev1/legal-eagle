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
import { useForm } from "react-hook-form"
import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom";
import Link from "next/link"
import { signIn } from "@/app/signin/server/action"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
            message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character",
        }),
})

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
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
        }
    }, [state, router])

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
                    <p className="text-xs mt-4 text-right">Don&apos;t have an account? <Link className="text-indigo-300" href="/signin">Sign
                        In</Link></p>
                </CardContent>
            </Card>
        </div>
    )
}

function ButtonWithLoader({ errors }: any) {
    const { pending } = useFormStatus();

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
