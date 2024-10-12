import NextAuth from 'next-auth'
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google],
    callbacks: {
        session: async ({ session }) => {
            if (session) {
                session.user.id = session.userId;
            }
            
            return session;
        },
    },
})