import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
 
export default { providers: [
    Credentials({
        async authorize(credentials) {
            const validateFields = LoginSchema.safeParse(credentials);

            if (validateFields.success) {
                const { email, password } = validateFields.data;

                const user = await getUserByEmail(email);
                if (!user || !user.password) return null;
                console.log('user', user);
                const passwordMatch = await bcrypt.compare(password, user.password);
                console.log("passwordMatch", passwordMatch);

                if (passwordMatch) {
                    return user;
                }

            }
            return null;
        }
    })
] } satisfies NextAuthConfig