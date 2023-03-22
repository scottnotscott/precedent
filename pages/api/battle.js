import prisma from "./../../prisma";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const expForLevel = (level) => {
    return 1000 * (level - 1) * (level - 1);
  };

  const { userStats, monsterStats, selectedMove } = req.body;

  const calculateUserDamage = () => {
    if (selectedMove === 'strength') {
      console.log('user=user=user=user')
      let base = (userStats.str + 2) * 2;
      let random = Math.floor(Math.random() * base);
      console.log('USER', '\n', 'stat:', userStats.str, '\n base:', base, '\n', 'random:', random, '\n', 'calculation: ( base:', base, ' + random:', random, ' ): ', base + random);
      return base + random;
    } else if (selectedMove === 'magic') {
      let base = (userStats.mag + 2) * 2;
      let random = Math.floor(Math.random() * base);
      return base + random;
    } else {
      let base = (userStats.rng + 2) * 2;
      let random = Math.floor(Math.random() * base);
      return base + random;
    }
  };

  const calculateMonsterDamage = () => {
    console.log('mon=mon=mon=mon')
    let base = (monsterStats.base_str + 2) * 1;
    let random = Math.floor(Math.random() * base);
    let calc = (base+random) - userStats.def
    console.log('MONSTER', '\n', 'stat: ', monsterStats.base_str, '\n base: ', base, '\n', 'random: ', random, '\n', 'calculation: (( base:', base, ' + random:', random, ' ) - userStats.def:',userStats.def, ' ): ', calc);
    
    return calc
  };

  const updatedUserStats = { ...userStats };
  const updatedMonsterStats = { ...monsterStats };

  // User's turn
  const userDamage = calculateUserDamage();
  updatedMonsterStats.hp-= userDamage;

  async function getLootTableTypeIdByName(name) {
    const lootTableType = await prisma.lootTableType.findFirst({
      where: {
        name: name,
      },
    });
  
    return lootTableType?.id;
  }
  
  async function rollForItemDrop(lootTableTypeId) {
    const lootTables = await prisma.lootTable.findMany({
      where: {
        lootTableTypeId: lootTableTypeId,
      },
      include: {
        item: true,
      },
    });
  
    const itemsWithChances = lootTables.map((lootTable) => ({
      item: lootTable.item,
      dropChance: lootTable.dropChance,
    }));
  
    let randomNumber = Math.random() * 100; // Change const to let
    let selectedItem = null;
  
    for (const itemWithChance of itemsWithChances) {
      if (randomNumber < itemWithChance.dropChance) {
        selectedItem = itemWithChance.item;
        break;
      } else {
        randomNumber -= itemWithChance.dropChance;
      }
    }
    console.log('selected item: ', selectedItem)
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
    const globalLootTableTypeId = await getLootTableTypeIdByName('GLOBAL');
    const item = await rollForItemDrop(globalLootTableTypeId);
    if (item) {
      console.log('globalLootTableTypeId: ', globalLootTableTypeId)
      console.log('item: ', item)
      const userInventory = await prisma.userInventory.findFirst({
        where: { userId: userStats.userId },
      });

      console.log('fetched user ok');
      console.log('userInventory: ', userInventory)
    
      const emptySlots = Object.entries(userInventory).filter(([key, value]) => key.startsWith("slot") && value === null);
    
      console.log('empty slots: ', emptySlots)
      if (emptySlots.length) {
        const [firstEmptySlot] = emptySlots;
    
        await prisma.userInventory.update({
          where: { userId: userStats.userId },
          data: { [firstEmptySlot[0]]: item.id },
        });
      } else {
        // Handle the case when there's no room in the inventory, e.g., show a message to the user
      }
    }
  
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
  res.status(200).json({ outcome: null, updatedUserStats, updatedMonsterStats, userDamage, monsterDamage });
}
