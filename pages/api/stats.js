import prisma from "./../../prisma";

export default async function handler(req, res) {
    console.log('req:stats by: ', req.query.userId)
    if(req.query.userId){
        const userStats = await prisma.userStats.findUnique({
            where: {
                userId: req.query.userId,
            }
        })
        if(userStats) {
            res.status(200).json(userStats)
            return;
        } else {
            return
        }
        
    }
    res.status(400).json({ error: 'Bad request' })
}