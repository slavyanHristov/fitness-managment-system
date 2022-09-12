const db = require("../models");

const connectToDB = async () => {
  console.log("Checking database connection...");
  try {
    await db.sequelize.authenticate();
    console.log("Database connection is established!");
    await syncModelsWithDB();
  } catch (err) {
    console.log("Something went wrong with the connection to DB: ");
    console.log(err.message);
    process.exit(1);
  }
};

const syncModelsWithDB = async () => {
  console.log("Synchronizing ORM models with the DB...");
  try {
    // await db.sequelize.sync();
  } catch (err) {
    console.log("Couldn't synchronize models:");
    console.log(err.message);
  }
};

const closeConnection = async () => {
  try {
    await db.sequelize.close();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  connectToDB,
  closeConnection,
};
