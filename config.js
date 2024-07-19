import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});

const ROOT_URL = process.env.ROOT_URL;
const PORT = process.env.PORT;
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
const MAX_API_BOOK_LIMIT = process.env.MAX_API_BOOK_LIMIT;
const FINE_PER_DAY = process.env.FINE_PER_DAY;
const DUE_DAY_COUNT = process.env.DUE_DAY_COUNT;
const MAX_RENEWAL_COUNT = process.env.MAX_RENEWAL_COUNT;
const RENEWAL_EXTENDED_DAY_COUNT = process.env.RENEWAL_EXTENDED_DAY_COUNT;
const MAX_LIBRARY_CARD_COUNT = process.env.MAX_LIBRARY_CARD_COUNT;
const ACCOOUNT_SID = process.env.ACCOOUNT_SID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
export {
  ROOT_URL,
  PORT,
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD,
  MAX_API_BOOK_LIMIT,
  FINE_PER_DAY,
  DUE_DAY_COUNT,
  MAX_RENEWAL_COUNT,
  RENEWAL_EXTENDED_DAY_COUNT,
  MAX_LIBRARY_CARD_COUNT,
  AUTH_TOKEN,
  ACCOOUNT_SID,
};
