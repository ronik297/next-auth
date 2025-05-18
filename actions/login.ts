"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas/index";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success) {
        return {
            error: "Invalid fields",
        };
    }

   const { email, password } = validateFields.data;
   try {
        await signIn("credentials", {
            email, password, redirectsTo: DEFAULT_LOGIN_REDIRECT
        })
        return { success: "Login successful" }
   } catch (error) {
        if(error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin": 
                    return { error: "Invalid credentials" }
                default: 
                return { error: "Unknown error"}
            }
        }
        // IMPORTANT: otherwise it will not redirect you
        throw error;
    }
}


