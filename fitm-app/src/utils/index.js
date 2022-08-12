const hashOperations = require("./hash-operations");
const regularExpressions = require("./regex");
const mailSender = require("./mail-sender");
const getValidationErrors = require("./getValidationErrors");
const flatten = require("./flatten");
module.exports = {
  hashOperations,
  regularExpressions,
  mailSender,
  getValidationErrors,
  flatten,
};
