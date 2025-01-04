import { connect, connection } from "mongoose";

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
  } catch (error) {
    console.error("Database connection error", error);
    throw error;
  }
}
