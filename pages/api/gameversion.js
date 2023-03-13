import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function handler(req, res) {
    console.log('req:gameversion by: ', req.query.userId)
    const gameversion = await prisma.serverInformation.findMany()
    res.status(200).json(gameversion)
}