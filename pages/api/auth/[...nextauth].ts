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
   signIn: async ({user }) => {
    console.log('am i even called? signin')
    console.log('signed in user: ', user)
    await prisma.userStats.update({
      where: {
        userId: user.id
      },
      data: {
        online_status: true
      }
    })
  },
  signOut: async({session}) => {
    console.log('am i even called? signout')
    console.log('signed out user: ', session);
    console.log('session.userId', session.userId)
    await prisma.userStats.update({
      where: {
        userId: session.userId
      },
      data: {
        online_status: false
      }
    })
  }
}
}

export default NextAuth(authOptions);
