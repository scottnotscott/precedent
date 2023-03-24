import prisma from "./../../prisma";

export default async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    const { userId } = req.query;

    if(!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }

    try {
        await prisma.userStats.upsert({
            where: { userId: userId },
            update: {},
            create: {
              userId: userId,
              str: 4,
              exp: 900,
              hp_current: 1000,
            },
          });
          await prisma.userInventory.upsert({
            where: { userId: userId },
            update: {},
            create: {
              userId: userId,
            },
          });

          res.status(200).json({ message: "Succesfully registered user: ", userId})
    } catch(error) {
        console.error("Error registering user. Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }

  }
  