import prisma from "./../../prisma";

export default async function handler(req, res) {
    console.log('Heartbeat -> ', req.query.userId)

    const heartbeat = await prisma.userStats.findUnique({
        where: {
            id: req.query.userId
        },
        select: {
            activity: true
        }
    })
    res.status(200).json(heartbeat)
}