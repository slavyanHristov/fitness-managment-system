const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const basename = path.basename(__filename);
const db = {};

const createDBConnection = () => {
  return new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DB_DIALECT,
    timezone: "Europe/Sofia",
    dialectOptions: {
      timezone: "local",
    },
  });
};
const sequelize = createDBConnection(); // create sequelize instance

const getModelsAndAttach = () => {
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
};
const associateModels = () => {
  getModelsAndAttach();
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};
associateModels();
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
