import prisma from "./../../prisma";
import abilities from "./../../json/abilities.json";

async function rollForItemDrop(lootTableTypeNames) {
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
  let abilityBattleText = 'You attacked for ';
  const { userStats, monsterStats, selectedMove } = req.body;
  const levelDifferenceScalingFactor = (userLevel, monsterLevel) => {
    const levelDifference = userLevel - monsterLevel;
    return 1 + levelDifference * 0.05;
  };
  const effectiveStat = (baseStat, level) => {
    return baseStat + level * 0.5;
  };
  const isAbilityUnlocked = (ability, userLevel) => {
    return userLevel >= ability.requiredLevel;
  };
 
  const calculateUserDamage = () => {
    const ability = abilities.find((a) => a.id.toString() === selectedMove);
    const scalingFactor = levelDifferenceScalingFactor(userStats.level, monsterStats.level);
    if (ability && isAbilityUnlocked(ability, userStats[ability.type])) {
      abilityBattleText = ability ? ability.battleText : 'You attacked for ';
      console.log('abilityBattleText: ', abilityBattleText)
      const baseStat = effectiveStat(userStats[ability.type], userStats.level) * ability.effect.damageMultiplier;
      const base = baseStat * 3;
      const random = Math.floor(Math.random() * (base * 2));
      const defenseFactor = (monsterStats.base_def + monsterStats.base_res + monsterStats.base_eva) * 0.1;
      const calc = (base + random) / defenseFactor * scalingFactor;
      console.log('calc: ', calc)
      return calc;
    } else {
      console.log('no newability selected')
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
  console.log('userDamage: ', userDamage, typeof(userDamage))
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
    
    if (newLevel !== userStats.level) {
      // check if the user has used an ability or a default move
      const ability = abilities.find((a) => a.id === parseInt(selectedMove));
      let statType;

      // check if its an ability or a default move, and set statType to the associated type, can only be 'str', 'rng' or 'mag'
      if(ability) {
        console.log('ability: ', ability)
        console.log('IS ABILITY')
        statType = ability.type
        console.log('statType: (should be str, mag, or rng): ', statType)
      }
      if(!ability) {
        console.log('IS NOT AN ABILITY')
        statType = selectedMove
        console.log('statType: (should be str, mag or rng): ', statType)
      }
      //increase the updateData[statType] which is updateData.str, updateData.rng or updateData.mag by 1
      updateData[statType] = userStats[statType] + Math.floor(Math.random() * 2) + 1;
      console.log('updateData[statType]: ', updateData[statType])
      //increase the usersStats.level by 1
      updateData.level = newLevel;

      // check the updateData[ability.type] is greater than or equal to the ability.requiredLevel
      const checkAbilityRequirements = (ability, updateData) => {
        // updateData[ability.type] can only be updateData.str, updateData.mag or updateData.rng
        console.log('updateData[ability.type]: ', updateData[ability.type])
        return updateData[ability.type] >= ability.requiredLevel;
      }
      // return the abilities that meet the requirements
      const getNewlyUnlockedAbilities = (abilities, updateData) => {
        // takes an array of possible abilities and returns the ones that pass the checkAbilityRequirements check
        console.log('abilities: ', abilities)
        return abilities.filter(ability => checkAbilityRequirements(ability, updateData))
      }
      // should return the abilities from getNewlyUnlockedAbilities
      const newlyUnlockedAbilities = getNewlyUnlockedAbilities(abilities, updateData);
      console.log('newlyUnlockedAbilities: ', newlyUnlockedAbilities)
      
      if (newlyUnlockedAbilities.length > 0) {
        // store the newlyUnlockedAbilities in updateData.unlockAbilities
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
  res.status(200).json({ outcome: winner, updatedUserStats: updateData, updatedMonsterStats, item, abilityText: abilityBattleText });
  return
  }
  // Monster's turn
  const monsterDamage = calculateMonsterDamage();
  updatedUserStats.hp_current -= Math.round(monsterDamage);
  if (updatedUserStats.hp_current <= 0) {
    winner = 'monster';
    res.status(200).json({ outcome: winner, updatedUserStats, updatedMonsterStats, abilityText: abilityBattleText });
    return;
  }
  // No winner yet
  const responseObject = {
    outcome: winner,
    updatedUserStats,
    updatedMonsterStats,
    userDamage,
    monsterDamage,
  }
  if(abilityBattleText !== 'You attacked for ') {
    responseObject.abilityText = abilityBattleText;
  } else {
    responseObject.abilityText = 'You attacked for ';
  }
  res.status(200).json(responseObject);
  return
}