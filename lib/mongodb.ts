import dns from "node:dns";
import mongoose from "mongoose";

// Set custom DNS servers to bypass Node.js Windows SRV resolution bug
try {
  dns.setServers(["1.1.1.1", "1.0.0.1"]);
} catch (e) {
  console.warn("Could not set custom DNS servers:", e);
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/iskcon_tvn";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}
