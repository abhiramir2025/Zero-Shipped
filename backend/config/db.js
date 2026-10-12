const mongoose = require("mongoose");

async function connectDb() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/zero-shipped";
  await mongoose.connect(uri);
  console.log("[db] connected:", mongoose.connection.name);
}

module.exports = { connectDb };
