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
  const lootTableType1 = await prisma.lootTableType.create({
    data: {
      name: 'GLOBAL',
    },
  });
  console.log('created item table type')
  const itemCommon1 = await prisma.item.create({
    data: {
      name: 'Common Item 1',
      type: 'Example Type',
      rarity: 'COMMON',
      image: 'path/to/image.png',
    },
  });
  
  const itemUncommon1 = await prisma.item.create({
    data: {
      name: 'Uncommon Item 1',
      type: 'Example Type',
      rarity: 'UNCOMMON',
      image: 'path/to/image.png',
    },
  });
  
  const itemRare1 = await prisma.item.create({
    data: {
      name: 'Rare Item 1',
      type: 'Example Type',
      rarity: 'RARE',
      image: 'path/to/image.png',
    },
  });
  
  const itemJackpot1 = await prisma.item.create({
    data: {
      name: 'Jackpot Item 1',
      type: 'Example Type',
      rarity: 'JACKPOT',
      image: 'path/to/image.png',
    },
  });
  console.log('created item(s)')
  await prisma.lootTable.create({
    data: {
      itemId: itemCommon1.id,
      lootTableTypeId: lootTableType1.id,
      dropChance: 60,
      rarity: 'COMMON',
    },
  });
  
  await prisma.lootTable.create({
    data: {
      itemId: itemUncommon1.id,
      lootTableTypeId: lootTableType1.id,
      dropChance: 30,
      rarity: 'UNCOMMON',
    },
  });
  
  await prisma.lootTable.create({
    data: {
      itemId: itemRare1.id,
      lootTableTypeId: lootTableType1.id,
      dropChance: 9,
      rarity: 'RARE',
    },
  });
  
  await prisma.lootTable.create({
    data: {
      itemId: itemJackpot1.id,
      lootTableTypeId: lootTableType1.id,
      dropChance: 1,
      rarity: 'JACKPOT',
    },
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
