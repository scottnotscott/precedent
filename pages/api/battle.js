import prisma from "./../../prisma";
import abilities from "./../../json/abilities.json";
async function getLootTableTypeIdByName(name) {
  const lootTableType = await prisma.lootTableType.findFirst({
    where: {
      name: name,
    },
  });
  return lootTableType?.id;
}
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
export default async function handler(req, res) {
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let winner = null;
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
  const isAbilityUnlocked = (abilityId, userLevel) => {
    const ability = abilities.find((a) => a.id === abilityId);
    return ability && userLevel >= ability.requiredLevel;
  };
  function findAbilityByName(name) {
    return abilities.find((ability) => ability.name === name);
  }
  const calculateUserDamage = () => {
    const ability = abilities.find((a) => a.id === selectedMove);
    if (ability && isAbilityUnlocked(selectedMove, userStats.level)) {
      const scalingFactor = levelDifferenceScalingFactor(userStats.level, monsterStats.level);
      const baseStat = effectiveStat(userStats[ability.type], userStats.level) * ability.effect.damageMultiplier;
      const base = baseStat * 3;
      const random = Math.floor(Math.random() * (base * 2));
      const defenseFactor = (monsterStats.base_def + monsterStats.base_res + monsterStats.base_eva) * 0.1;
      const calc = (base + random) / defenseFactor * scalingFactor;
      return calc;
    } else {
      const scalingFactor = levelDifferenceScalingFactor(userStats.level, monsterStats.level);
      const baseStat = effectiveStat(userStats[selectedMove], userStats.level);
      const base = baseStat * 3;
      const random = Math.floor(Math.random() * (base * 2));
      const defenseFactor = (monsterStats.base_def + monsterStats.base_res + monsterStats.base_eva) * 0.1;
      const calc = (base + random) / defenseFactor * scalingFactor;
      return calc;
    }
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
  updatedMonsterStats.hp -= Math.round(userDamage);

  
  if (updatedMonsterStats.hp <= 0) {
    winner = 'user';
    const xpGain = monsterStats.xp_reward;
    const newExp = userStats.exp + xpGain;
    let newLevel = userStats.level;
    while (newExp >= expForLevel(newLevel + 1)) {
      newLevel += 1;
    }
    const updateData = {
      ...updatedUserStats,
      exp: newExp,
      hp_current: Math.round(updatedUserStats.hp_current),
    };
    console.log('updateData: ', updateData)
    if (newLevel !== userStats.level) {
      const ability = findAbilityByName(selectedMove);
      let statType = selectedMove;

      if (ability) {
        statType = ability.type;
      }
      updateData[statType] = userStats[statType] + Math.floor(Math.random() * 2) + 1;
      updateData.level = newLevel;
      const newlyUnlockedAbilities = abilities.filter(ability => {
        return updateData[statType] >= ability.requiredLevel
      })
      console.log('newlyUnlockedAbilities: ', newlyUnlockedAbilities)
      if (newlyUnlockedAbilities.length > 0) {
        updateData.unlockedAbilities = newlyUnlockedAbilities
        
      }
  }
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
            // Handle the case when there's no room in the inventory, show a message to the user
          }
        }
    }
  await prisma.userStats.update({ where: { userId: userStats.userId }, data: updateData });
  res.status(200).json({ outcome: winner, updatedUserStats: updateData, updatedMonsterStats, item });
  return
  }
  // Monster's turn
  const monsterDamage = calculateMonsterDamage();
  updatedUserStats.hp_current -= Math.round(monsterDamage);
  if (updatedUserStats.hp_current <= 0) {
    winner = 'monster';
    res.status(200).json({ outcome: winner, updatedUserStats, updatedMonsterStats });
    return;
  }
  // No winner yet
  res.status(200).json({ outcome: winner, updatedUserStats, updatedMonsterStats, userDamage, monsterDamage });
  return
}
