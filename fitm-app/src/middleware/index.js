const notFound = require("./not-found");
const authJwt = require("./auth-jwt");
const upload = require("./upload");
const updates = require("./updates");
const checkFileType = require("./file-type");
module.exports = {
  notFound,
  authJwt,
  upload,
  checkFileType,
  updates,
};
