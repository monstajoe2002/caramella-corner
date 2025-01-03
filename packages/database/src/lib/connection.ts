import mongoose from "mongoose";

export async function connectToDatabase(mongoUrl: string) {
  try {
    await mongoose.connect(mongoUrl, {
      maxPoolSize: 10,
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
