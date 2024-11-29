require("dotenv").config();


module.exports = {

  development: {
    client: "pg",
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: "./db/migrations",
    },
    debug: true,
  }

};
