import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }),
  ],

  // This callback function runs when a new session is created
  callbacks: {
    async session(session, user) {
      // Check if this is the user's first session
       const isNewUser = await prisma.user.findUnique({
         where: { id: session.user.id },
       include: {
        userInventory: true,
        userStats: true,
       }
       });
        if (!isNewUser.userStats.length && !isNewUser.userInventory.length) {
          console.log('hello: ', session.user.name)
          await prisma.userStats.create({
            data: {
               id: isNewUser.id,
               str: 4,
               exp: 900,
               hp_current: 1000,
               user: { connect: { id: isNewUser.id } },
            },
          });
          await prisma.userInventory.create({
           data: {
              id: isNewUser.id,
              user: { connect: { id: isNewUser.id } },
            },
          });
        } else {
          await prisma.userStats.update({
            //TODO:: finish implementing user stats
            where: {
              id: isNewUser.id,
            },
            data: {
              online_status: true
            }
          })
        }
        

     // Return the updated session
      return session;
    },
  },
};

export default NextAuth(authOptions);
