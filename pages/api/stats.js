import prisma from "./../../prisma";

export default async function handler(req, res) {
    console.log('req:stats by: ', req.query.userId)
    if(req.query.userId){
        const userStats = await prisma.user.findUnique({
            where: {
                id: req.query.userId,
            },
            select: {
                userStats:true,
            }
        })
        res.status(200).json(userStats.userStats[0])
        return;
    }
    res.status(400).json({ error: 'Bad request' })
}