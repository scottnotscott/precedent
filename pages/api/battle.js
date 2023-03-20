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
      return (userStats.str + 40) * 2;
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

  if (updatedMonsterStats.hp <= 0) {
    const winner = 'user';
    const xpGain = monsterStats.xp_reward;
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
