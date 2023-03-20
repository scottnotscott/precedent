import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { userStats, monsterStats, selectedMove } = req.body;

  const calculateUserDamage = () => {
    if (selectedMove === 'strength') {
      return (userStats.str + 2) * 2;
    } else if (selectedMove === 'magic') {
      return (userStats.mag + 2) * 2;
    } else {
      return (userStats.rng + 2) * 2;
    }
  };

  const calculateMonsterDamage = () => {
    return (monsterStats.base_str + 2) * 2;
  };

  const updatedUserStats = { ...userStats };
  const updatedMonsterStats = { ...monsterStats };

  // User's turn
  const userDamage = calculateUserDamage();
  updatedMonsterStats.hp-= userDamage;

  // have a list of levels and their exp requirements
  // e.g. level: 2 = 2000, level 3 = 4500, level 4 = 8000
  

  if (updatedMonsterStats.hp <= 0) {
    const winner = 'user';
    const xpGain = monsterStats.xp_reward;
    // check users xp level, and if it meets threshhold then level the user up
    await prisma.userStats.update({
      where: { userId: userStats.userId },
      data: { exp: userStats.exp + xpGain },
    });

    res.status(200).json({ outcome: winner, updatedUserStats, updatedMonsterStats });
    return;
  }

  // Monster's turn
  const monsterDamage = calculateMonsterDamage();
  updatedUserStats.hp -= monsterDamage;

  if (updatedUserStats.hp <= 0) {
    const winner = 'monster';
    res.status(200).json({ outcome: winner, updatedUserStats, updatedMonsterStats });
    return;
  }

  // No winner yet
  res.status(200).json({ outcome: null, updatedUserStats, updatedMonsterStats });
}
