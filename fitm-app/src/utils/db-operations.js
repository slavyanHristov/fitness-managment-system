const db = require("../models");

const syncWithDB = async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log("Synced!");
  } catch (err) {
    console.log(err);
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
  syncWithDB,
  closeConnection,
};
