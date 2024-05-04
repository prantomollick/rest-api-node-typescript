import { config } from "dotenv";
config();

export default {
  port: process.env.PORT,
  dbUri: process.env.DB_URI,
  saltWorkFactor: process.env.SALT_WORK_FACTOR,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL,
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL,
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY
};
