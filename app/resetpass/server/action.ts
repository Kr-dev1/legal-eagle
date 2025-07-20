import {betterAuth} from "better-auth";
import {sendEmail} from "/";
import {APIError} from "better-auth/api"; // your email sending function

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,

        onPasswordReset: async ({user}, request) => {
            try {
                await auth.api.requestPasswordReset({
                    body: {
                        name,
                        email,
                        password,
                    },
                });
                return {success: true};
            } catch (error) {
                if (error instanceof APIError) {
                    console.log("API Error:", error.message);
                }
            }
        },
    },
});