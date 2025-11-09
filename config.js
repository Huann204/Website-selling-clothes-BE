require("dotenv").config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 5000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GHN_TOKEN: process.env.GHN_TOKEN,
  GHN_SHOP_ID: process.env.GHN_SHOP_ID,
  PHONE_SHOP: process.env.PHONE_SHOP,
  TMN_CODE: process.env.TMN_CODE,
  HASH_SECRET: process.env.HASH_SECRET,
  VNP_URL: process.env.VNP_URL,
  RETURN_URL: process.env.RETURN_URL,
  API_URL: process.env.API_URL,
  API_URL_CLIENT: process.env.API_URL_CLIENT,
};
