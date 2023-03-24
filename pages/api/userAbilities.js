// pages/api/userAbilities.js
import prisma from './../../lib/prisma';
import abilities from './../../json/abilities.json';

export default async function handler(req, res) {
  const { userId } = req.query;
  console.log('user id: ', userId)

  const abilities = await prisma.userStats.findUnique({
    where: { id: userId },
    select: {
      unlockedAbilities: true,
    },
  });

  

  res.status(200).json(abilities);
}