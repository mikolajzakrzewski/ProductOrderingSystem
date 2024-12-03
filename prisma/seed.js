const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const seed = async () => {
  const statuses = ['UNCONFIRMED', 'CONFIRMED', 'CANCELED', 'COMPLETED'];
  const categories = ['Electronics', 'Books', 'Clothing', 'Furniture', 'Toys'];

  // Seed statusy zamówień
  for (const status of statuses) {
    await prisma.orderStatus.upsert({
      where: { name: status },
      update: {},
      create: { name: status },
    });
  }
  console.log('Order statuses seeded.');

  // Seed kategorie
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

  
  const existingClient = await prisma.user.findUnique({
    where: { email: 'klient@gmail.com' },
  });

  if (!existingClient) {
    await prisma.user.create({
      data: {
        email: 'klient@gmail.com',
        password: hashedPasswordClient,
        role: 'KLIENT',
      },
    });
    console.log('Client user seeded.');
  } else {
    console.log('Client user already exists.');
  }

  
  const existingWorker = await prisma.user.findUnique({
    where: { email: 'pracownik@gmail.com' },
  });

  if (!existingWorker) {
    await prisma.user.create({
      data: {
        email: 'pracownik@gmail.com',
        password: hashedPasswordWorker,
        role: 'PRACOWNIK',
      },
    });
    console.log('Worker user seeded.');
  } else {
    console.log('Worker user already exists.');
  }
};

module.exports = seed;
