require('dotenv').config();


const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;


// Funkcja do uruchomienia seeda
const runSeed = async () => {
  const seed = require('../prisma/seed'); // Import skryptu seed
  await seed(); // Uruchomienie seeda
};

const startServer = async () => {
  try {
    await runSeed(); // Uruchomienie seeda przed startem serwera
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1); // Zatrzymanie aplikacji w przypadku błędu
  }
};

startServer();
