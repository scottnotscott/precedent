import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import DiscordProvider from "next-auth/providers/discord";
const prismaAdapter = PrismaAdapter(prisma);

const customPrismaAdapter = {
  ...prismaAdapter,
  createUser: async (profile) => {
    const user = await prismaAdapter.createUser(profile);
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/registerUser?userId=${user.id}`, {
      method: "POST",
    });

    return user;
  },
};

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }),
  ],

callbacks: {
  async session(session, ) {
    return session;
  },
  
},
events: {
   signIn: async ({account, isNewUser }) => {
  }
}
}

export default NextAuth(authOptions);
