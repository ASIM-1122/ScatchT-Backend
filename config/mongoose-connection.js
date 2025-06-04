const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');
const config = require('config');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || config.get('MONGO_URI'); // Use env var first

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    dbgr('✅ MongoDB Connected Successfully');
  } catch (err) {
    dbgr(`❌ MongoDB Connection Failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
