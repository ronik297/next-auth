"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas/index";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { generateTwoFactorToken  } from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success) {
        return {
            error: "Invalid fields",
        };
    }

   const { email, password, code } = validateFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.password || !existingUser.email) {
        return {
            error: "Email does not exist",
        };
    }

    if(!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return {
            success: "Confirmation email sent!",
        }
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email) {
        if(code) {
            // Check if the code is valid
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if(!twoFactorToken) {
                return {
                    error: "Invalid code!",
                }
            }

            if(twoFactorToken.token !== code) {
                return {
                    error: "Invalid code!",
                }
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if(hasExpired) {
                return {
                    error: "Code has expired!",
                }
            }

            // Delete the token
            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id as string);

            if(existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id as string,
                }
            })
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);

            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token); 

            return {
                twoFactor: true,
            }
        }
    }

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


