import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function handler(req, res) {
    console.log('made it to gameversion api call')

    const gameversion = await prisma.serverInformation.findMany()
    console.log(gameversion)
    
    res.status(200).json(gameversion)
}