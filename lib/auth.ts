import { NextAuthOptions } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // Providers will be configured in Phase 3
    ],
    session: {
        strategy: "jwt",
    },
}
