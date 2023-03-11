import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    console.log('made it to stats api call')

    const userStats = await prisma.user.findUnique({
        where: {
            id: req.query.userId,
        },
        select: {
            userStats: true
        }
    })
    
    res.status(200).json(userStats.userStats)
}