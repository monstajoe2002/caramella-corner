import { connectToDatabase } from "@caramella-corner/database/lib/connection";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const MONGODB_URI = process.env.MONGO_URI!;

await connectToDatabase(MONGODB_URI);
