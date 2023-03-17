const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.userInventory.deleteMany();
  await prisma.userStats.deleteMany();
  await prisma.serverInformation.create({
    data: {
      version: '0.0.1'
    }
  })
  // await prisma.monsters.createMany({
  //   data: [
  //     {name: 'Goblin', image: 'https://i.imgur.com/OQMRP6G.png', description: 'A goblin wielding two short blades',},
  //     {name: 'Bandit', image: 'https://i.imgur.com/JRubfY8.png', description: 'A nasty bandit', level:3, monster_rarity:'NORMAL', base_hp:130, base_str:3, base_def:3, xp_reward:15, currency_reward:22},
  //     {name: 'Skeleton', image: 'https://i.imgur.com/WRyMztD.png', description: 'An angry Skeleton', level:3, monster_rarity:'NORMAL', base_hp:160, base_str:4, base_def:2, xp_reward:18, currency_reward: 20},
  //     {name: 'Witch', image: 'https://i.imgur.com/43utDNA.png', description: 'A magic embued Witch!', level:4, monster_rarity:'RARE', base_hp:200, base_mag:6, base_res:6, item_loot_table:'RARE', xp_reward: 25, currency_reward: 30},
  //     {name: "Goblin's Dad", image: 'https://i.imgur.com/Aew0Y0b.png', description: "A goblin's Dad, wielding a rather large club", level: 5, monster_rarity: 'RARE', base_hp: 230, base_str: 7, base_def: 7, item_loot_table: 'RARE', xp_reward: 25, currency_reward: 35
  //   },
  //   ]
  // })
  // add more deleteMany calls for all tables in your database
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
