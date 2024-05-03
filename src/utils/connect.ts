import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

async function connect() {
  const dbUri = config.get<string>("dbUri");
  try {
    const connect = await mongoose.connect(dbUri);
    logger.info("Connected to MongoDB", connect.connection.name);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error connecting to MongoDB:", error.message);
    } else {
      logger.error("An unexpected error occurred:", error);
    }

    process.exit(1); // Exit if we can't connect
  }
}

export default connect;
