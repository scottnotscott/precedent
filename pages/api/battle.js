import prisma from "./../../prisma";

async function getLootTableTypeIdByName(name) {
  const lootTableType = await prisma.lootTableType.findFirst({
    where: {
      name: name,
    },
  });

  return lootTableType?.id;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const expForLevel = (level) => {
    return 1000 * (level - 1) * (level - 1);
  };

  const { userStats, monsterStats, selectedMove } = req.body;

  const levelDifferenceScalingFactor = (userLevel, monsterLevel) => {
    const levelDifference = userLevel - monsterLevel;
    return 1 + levelDifference * 0.05;
  };
  
  const effectiveStat = (baseStat, level) => {
    return baseStat + level * 0.5;
  };
  
  const calculateUserDamage = () => {
    const scalingFactor = levelDifferenceScalingFactor(userStats.level, monsterStats.level);
    const baseStat = effectiveStat(userStats[selectedMove], userStats.level);
    const base = baseStat * 3;
    const random = Math.floor(Math.random() * (base * 2));
    const defenseFactor = (monsterStats.base_def + monsterStats.base_res + monsterStats.base_eva) * 0.1;
    const calc = (base + random) / defenseFactor * scalingFactor;
    return calc;
  };
  
  const calculateMonsterDamage = () => {
    const scalingFactor = levelDifferenceScalingFactor(monsterStats.level, userStats.level);
    const baseStat = effectiveStat(monsterStats.base_str + monsterStats.base_mag + monsterStats.base_rng, monsterStats.level);
    const base = baseStat;
    const random = Math.floor(Math.random() * (base * 2));
    const defenseFactor = (userStats.def + userStats.res + userStats.eva) * 0.1;
    const calc = (base + random) / defenseFactor * scalingFactor;
    return calc;
  };

  const updatedUserStats = { ...userStats };
  const updatedMonsterStats = { ...monsterStats };

  // User's turn
  const userDamage = calculateUserDamage();
  updatedMonsterStats.hp -= userDamage;



  async function rollForItemDrop(lootTableTypeNames) {
    console.log("Rolling for item drop with lootTableTypeNames:", lootTableTypeNames);

    const lootTables = await prisma.lootTable.findMany({
      where: {
        lootTableType: {
          name: { in: lootTableTypeNames },
        },
      },
      include: {
        items: true,
        lootTableType: true,
      },
    });
  
    const itemsWithChances = lootTables.flatMap((lootTable) =>
      lootTable.items.map((item) => ({
        item: item,
        dropChance: lootTable.dropChance,
      }))
    );

    console.log("Possible items:", itemsWithChances.length);

    let randomNumber = Math.random() * 100;

    let selectedItem = null;

    for (const itemWithChance of itemsWithChances) {
      if (randomNumber < itemWithChance.dropChance) {
        selectedItem = itemWithChance.item;
        break;
      } else {
        randomNumber -= itemWithChance.dropChance;
      }
    }
    return selectedItem;
  }



  if (updatedMonsterStats.hp <= 0) {
    const winner = 'user';
    const xpGain = monsterStats.xp_reward;
    const newExp = userStats.exp + xpGain;

    let newLevel = userStats.level;
    while (newExp >= expForLevel(newLevel + 1)) {
      newLevel += 1;
    }

    const updateData = { exp: newExp };
    if (newLevel !== userStats.level) {
      console.log('############################')
      console.log(updateData[selectedMove])
      updateData.level = newLevel;
      updateData.str = userStats.str + Math.floor(Math.random() * userStats.level) + 1;
      updateData.mag = userStats.mag + Math.floor(Math.random() * userStats.level) + 1;
      updateData.rng = userStats.rng + Math.floor(Math.random() * userStats.level) + 1;
      updateData.def = userStats.def + Math.floor(Math.random() * userStats.level) + 1;
      updateData.res = userStats.res + Math.floor(Math.random() * userStats.level) + 1;
      updateData.eva = userStats.eva + Math.floor(Math.random() * userStats.level) + 1;
    }

    await prisma.userStats.update({
      where: { userId: userStats.userId },
      data: updateData,
    });
    const lootTableTypeNames = [];
    if (monsterStats.item_loot_table === 'JACKPOT') {
      lootTableTypeNames.push('JACKPOT', 'RARE', 'UNCOMMON', 'COMMON');
    } else if (monsterStats.item_loot_table === 'RARE') {
      lootTableTypeNames.push('RARE', 'UNCOMMON', 'COMMON');
    } else if (monsterStats.item_loot_table === 'UNCOMMON') {
      lootTableTypeNames.push('UNCOMMON', 'COMMON');
    } else {
      lootTableTypeNames.push('COMMON');
    }
    const item = await rollForItemDrop(lootTableTypeNames);

    if (item) {
      const userInventory = await prisma.userInventory.findFirst({
        where: { userId: userStats.userId },
      });
      const existingSlot = Object.entries(userInventory).find(([key, value]) => {
        if (!key.startsWith("slot") || !value) return false;
        const { id, quantity } = value;
        return id === item.id && (!item.stackable || quantity < item.stackLimit);
      });

      if (existingSlot) {
        const [slotKey, slotValue] = existingSlot;
        const slotData = slotValue;
        await prisma.userInventory.update({
          where: { userId: userStats.userId },
          data: { [slotKey]: { ...slotData, quantity: slotData.quantity + 1 } },
        });
      } else {
        const emptySlots = Object.entries(userInventory).filter(([key, value]) => key.startsWith("slot") && value === null);
        if (emptySlots.length) {
          const [firstEmptySlot] = emptySlots;

          await prisma.userInventory.update({
            where: { userId: userStats.userId },
            data: { [firstEmptySlot[0]]: { ...item, quantity: 1 } },
          });
        } else {
          // Handle the case when there's no room in the inventory, e.g., show a message to the user
        }
      }
    }

    res.status(200).json({ outcome: winner, updatedUserStats, updatedMonsterStats, item });
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
  res.status(200).json({ outcome: null, updatedUserStats, updatedMonsterStats, userDamage, monsterDamage });
}
