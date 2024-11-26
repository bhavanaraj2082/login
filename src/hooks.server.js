import {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DATABASE,
} from "$env/static/private";
import mongoose from "mongoose";

let isConnected = false;
const MONGODB_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`;

export const handle = async ({ event, resolve }) => {
  if (!isConnected) {
    try {
      await mongoose.connect(MONGODB_URI);
      isConnected = true;
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw new Error("Failed to connect to the database");
    }
  }

  const response = await resolve(event);

  return response;
};

export async function handleError() {
  const errorId = crypto.randomUUID();

  return {
    message: "Whoops!",
    errorId,
  };
}
