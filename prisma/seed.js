const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const seed = async () => {
  const statuses = ['UNCONFIRMED', 'CONFIRMED', 'CANCELED', 'COMPLETED'];
  const categories = ['Electronics', 'Books', 'Clothing', 'Furniture', 'Toys'];

  // seed statusy zamówień
  for (const status of statuses) {
    await prisma.orderStatus.upsert({
      where: { name: status },
      update: {},
      create: { name: status },
    });
  }
  console.log('Order statuses seeded.');

  // seed kategorie
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });
  }
  console.log('Categories seeded.');

  const hashedPasswordClient = await bcrypt.hash('klient', 10);
  const hashedPasswordWorker = await bcrypt.hash('pracownik', 10);

  // Seed users
  await prisma.user.upsert({
    where: { email: 'klient@gmail.com' },
    update: {},
    create: {
      email: 'klien@gmail.com',
      password: hashedPasswordClient,
      role: 'KLIENT',
    },
  });

  await prisma.user.upsert({
    where: { email: 'pracownik@gmail.com' },
    update: {},
    create: {
      email: 'pracownik@gmail.com',
      password: hashedPasswordWorker,
      role: 'PRACOWNIK',
    },
  });
};

module.exports = seed; 
