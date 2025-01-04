import { connect, connection } from "mongoose";

export async function connectToDatabase(uri: string) {
  const connectionState = connection.readyState;
  if (connectionState === 1) {
    return;
  }
  if (connectionState === 2) {
    console.log("Database is connecting");
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
