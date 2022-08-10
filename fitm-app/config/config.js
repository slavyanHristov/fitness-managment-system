const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

module.exports = {
  HOST: process.env.APP_HOST,
  PORT: process.env.PORT,
  DB_DIALECT: process.env.DB_DIALECT,
  DB: process.env.DB_DATABASE,
  USER: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: 240, //240
  JWT_REFRESH_EXPIRATION: 360, //360
  RESET_PASSWORD_EXPIRATION: 360,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  PAYPAL_MODE: process.env.PAYPAL_MODE,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  EMAIL: process.env.EMAIL,
  BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT),
  CLIENT_URL: process.env.CLIENT_URL,
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
