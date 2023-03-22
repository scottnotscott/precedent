const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.account.deleteMany();
  console.log('flushed accounts')
  await prisma.session.deleteMany();
  console.log('flushed sessions')
  await prisma.user.deleteMany();
  console.log('flushed users')
  await prisma.userInventory.deleteMany();
  console.log('flushed inventories')
  await prisma.userStats.deleteMany();
  console.log('flushed userStats')
  await prisma.item.deleteMany();
  console.log('flushed items')
  await prisma.lootTable.deleteMany();
  console.log('flushed loot tables')
  await prisma.lootTableType.deleteMany();
  console.log('flushed loot table types')
  const lootTableType_common = await prisma.lootTableType.create({
    data: { name: "COMMON"}
  })
  const lootTableType_uncommon = await prisma.lootTableType.create({
    data: { name: "UNCOMMON"}
  })
  const lootTableType_rare = await prisma.lootTableType.create({
    data: { name: "RARE"}
  })
  const lootTableType_jackpot = await prisma.lootTableType.create({
    data: { name: "JACKPOT"}
  })
  console.log('created item table type')
  const item_common1 = await prisma.item.create({
    data: {
      name: 'Small Health Potion',
      type: 'Consumable',
      rarity: 'COMMON',
      image: 'path/to/image.png',
      stackLimit: 25,
    },
  });
  const item_common2 = await prisma.item.create({
    data: {
      name: 'Potato Seed',
      type: 'Regent',
      rarity: 'COMMON',
      image: 'path/to/image.png',
      stackLimit: 25,
    },
  });

  const item_common3 = await prisma.item.create({
    data: {
      name: 'Vial of Water',
      type: 'Regent',
      rarity: 'COMMON',
      image: 'path/to/image.png',
      stackLimit: 25,
    },
  });
  
   const item_uncommon1 = await prisma.item.create({
    data: {
      name: 'Enchanted Necklace',
      type: 'Trinket',
      rarity: 'UNCOMMON',
      image: 'path/to/image.png',
      stackLimit: 1,
    },
  });
  
   const item_rare1 = await prisma.item.create({
    data: {
      name: 'Spiked mace of trauma',
      type: 'Weapon',
      rarity: 'RARE',
      image: 'path/to/image.png',
      stackLimit: 1,
    },
  });
  
   const item_jackpot1 = await prisma.item.create({
    data: {
      name: 'Tenderiser',
      type: 'Weapon',
      rarity: 'JACKPOT',
      image: 'path/to/image.png',
      stackLimit: 1,
    },
  });
  console.log('created item(s)')
  const lootTable_common = await prisma.lootTable.create({
    data: {
      lootTableTypeId: lootTableType_common.id,
      dropChance: 60, 
      rarity: 'COMMON',
      items: {
        connect: [
          {
            id: item_common1.id
          },
          {
            id: item_common2.id
          },
          {
            id: item_common3.id
          }
        ]
      },
    }
  });
  const lootTable_uncommon = await prisma.lootTable.create({
    data: {
      lootTableTypeId: lootTableType_uncommon.id,
      dropChance: 30, 
      rarity: 'UNCOMMON',
      items: {
        connect: [
          {
            id: item_uncommon1.id
          }
        ]
      },
    }
  });

  const lootTable_rare = await prisma.lootTable.create({
    data: {
      lootTableTypeId: lootTableType_rare.id,
      dropChance: 9, 
      rarity: 'RARE',
      items: {
        connect: [
          {
            id: item_rare1.id
          }
        ]
      },
    }
  });

  const lootTable_jackpot = await prisma.lootTable.create({
    data: {
      lootTableTypeId: lootTableType_jackpot.id,
      dropChance: 1, 
      rarity: 'JACKPOT',
      items: {
        connect: [
          {
            id: item_jackpot1.id
          }
        ]
      },
    }
  });
  
  console.log('created loot tables')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
