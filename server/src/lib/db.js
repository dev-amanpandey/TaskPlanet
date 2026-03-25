const mongoose = require("mongoose");

let connectionPromise = null;

async function connectDb() {
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment");
  }

  connectionPromise = mongoose.connect(uri, {
    autoIndex: true,
  });

  return connectionPromise;
}

module.exports = { connectDb };

