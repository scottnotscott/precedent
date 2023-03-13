import { PrismaClient } from "@prisma/client";
import { CloudCog } from "lucide-react";
const prisma = new PrismaClient()

export default async function handler(req, res) {
    console.log('req:stats by: ', req.query.userId)

    const userStats = await prisma.user.findUnique({
        where: {
            id: req.query.userId,
        },
        select: {
            userStats: true
        }
    })

    //console.log('userStats.userStats[0]: ', userStats.userStats[0])
    
    res.status(200).json(userStats.userStats[0])
}