const { MongoClient } = require("mongodb");

// Load .env.local first, then .env
require("dotenv").config({ path: ".env.local" });
require("dotenv").config(); // Fallback to .env if .env.local doesn't exist

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing in .env");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

module.exports = clientPromise;

