import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function handler(req, res) {
    console.log('req:monsters by: ', req.query.id)

    const monsters = await prisma.monsters.findFirst({
        where: {
            id: parseInt(req.query.id),
        }
    })
    res.status(200).json(monsters)
}