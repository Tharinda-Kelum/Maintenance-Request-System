const fs = require('fs');
const path = require('path');
const dns = require('dns');
const mongoose = require('mongoose');

const dnsServers = (process.env.MONGODB_DNS_SERVERS || '1.1.1.1,8.8.8.8')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);

dns.setServers(dnsServers);

async function connectDB() {
  // const configPath = path.join(__dirname, 'db.config.json');

  // if (!fs.existsSync(configPath)) {
  //   console.error(
  //     'Missing config/db.config.json.\n' +
  //     'Copy config/db.config.example.json to config/db.config.json and paste in your real Atlas connection string.'
  //   );
  //   process.exit(1);
  // }

  // const { mongodb_uri } = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
