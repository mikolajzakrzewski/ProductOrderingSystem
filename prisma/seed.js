const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
  const statuses = ['UNCONFIRMED', 'CONFIRMED', 'CANCELED', 'COMPLETED'];
  const categories = ['Electronics', 'Books', 'Clothing', 'Furniture', 'Toys'];

  // Dodaj statusy zamówień
  for (const status of statuses) {
    await prisma.orderStatus.upsert({
      where: { name: status },
      update: {},
      create: { name: status },
    });
  }
  console.log('Order statuses seeded.');

  // Dodaj kategorie
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });
  }
  console.log('Categories seeded.');
};

module.exports = seed; // Eksport funkcji seed
