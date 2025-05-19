"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas/index";
import bcrypt from "bcryptjs";
import {db} from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return {
            error: "Invalid fields",
        };
    }

    const { email, password, name } = validateFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return {
            error: "Email already in use",
        };
    }

    await db.user.create({
       data : {
        email,
        password: hashedPassword,
        name,
       }
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmation email sent!" };
}