const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../../config/config");
const basename = path.basename(__filename);
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DB_DIALECT,
  timezone: "Europe/Sofia",
  dialectOptions: {
    timezone: "local",
  },
  logging: true // false => to disable logging
});
const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db); // EXPLAIN THIS TO YOURSELF
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;