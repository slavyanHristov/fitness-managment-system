const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

module.exports = {
  HOST: process.env.APP_HOST,
  PORT: process.env.PORT,
  DB_DIALECT: process.env.DB_DIALECT,
  DB: process.env.DB_DATABASE,
  USER: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: 60,
  JWT_REFRESH_EXPIRATION: 120,
  RESET_PASSWORD_EXPIRATION: 120,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  EMAIL: process.env.EMAIL,
  BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT),
  CLIENT_URL: process.env.CLIENT_URL
};

// module.exports = {
//   development: {
//     DB: process.env.DB_DATABASE,
//     USER:  process.env.DB_USERNAME,
//     PASSWORD: process.env.DB_PASSWORD,
//     HOST: process.env.APP_HOST,
//     PORT: process.env.PORT,
//     DB_DIALECT: process.env.DB_DIALECT,
//   },
//   production: {
//     DB: process.env.DB_DATABASE,
//     USER:  process.env.DB_USERNAME,
//     PASSWORD: process.env.DB_PASSWORD,
//     HOST: process.env.APP_HOST,
//     PORT: process.env.PORT,
//     DB_DIALECT: process.env.DB_DIALECT,
//   },
// }