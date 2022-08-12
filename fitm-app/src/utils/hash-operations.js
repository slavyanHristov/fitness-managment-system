const bcrypt = require("bcrypt");
const env = process.env.NODE_ENV || "development";
const { BCRYPT_SALT } = require("../../config/config")[env];
exports.hashSecret = async (plainSecret) => {
  return await bcrypt.hash(plainSecret, BCRYPT_SALT);
};

exports.compare = async (plainSecret, hashFromDB) => {
  return await bcrypt.compare(plainSecret, hashFromDB);
};
