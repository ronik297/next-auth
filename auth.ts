import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter  } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "@/data/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

export const { handlers : { GET, POST }, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async linkAccount({user}) {
            await db.user.update({
                where: {id: user.id},
                data: {  emailVerified: new Date()}
            }) 
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allow OAuth without email verification
            if(account?.provider !== "credentials") {
                return true;
            }

            const existingUser = await getUserById(user.id as string);

            // Prevent sign in without email verification
            if (!existingUser?.emailVerified) {
                return false;
            }

            if(existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id as string);

                if(!twoFactorConfirmation) {
                    return false;
                }

                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                })

                return true;
            }
            // TODO: Add 2FA check

            return true;
        },
        async session({ token, session }) {
            if(token.sub && session.user) session.user.id = token.sub;

            if(token.role && session.user)  session.user.role = token.role as UserRole;

            return session;
        },
        async jwt({ token }) {
            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;

            token.role = existingUser.role;
            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" }, 
    ...authConfig,
})