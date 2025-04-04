import { connect, connection } from "mongoose";
import { dotenvLoad } from "dotenv-mono";
const dotenv = dotenvLoad();
export async function connectToDatabase() {
  const connectionState = connection.readyState;
  if (connectionState === 1 || connectionState === 2) {
    return;
  }
  try {
    connect(process.env.MONGO_URI!, {
      dbName: "caramella_corner",
      bufferCommands: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error", error);
    throw error;
  }
}
