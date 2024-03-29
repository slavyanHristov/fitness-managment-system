const paypal = require("paypal-rest-sdk");
const env = process.env.NODE_ENV || "development";
const { PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } =
  require("../../config/config")[env];

paypal.configure({
  mode: PAYPAL_MODE, //sandbox or live
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_CLIENT_SECRET,
});
