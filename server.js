require('dotenv').config({ path: require('node:path').join(__dirname, '.env'), quiet: true });
const mongoose = require('mongoose');
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('Set JWT_SECRET to a random value of at least 16 characters in the backend .env file.');
  process.exit(1);
}
const app = require('./src/app');
const port = Number(process.env.PORT || 5000);
let server;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maintenance_db', { serverSelectionTimeoutMS: 5000 }).then(() => {
  server = app.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Maintenance API running at http://${process.env.HOST || '127.0.0.1'}:${port}`));
  server.on('error', (error) => { console.error(error.message); process.exitCode = 1; mongoose.disconnect(); });
}).catch((error) => { console.error('MongoDB connection failed:', error.message); process.exitCode = 1; });
const stop = () => { if (server) server.close(() => mongoose.disconnect().then(() => process.exit(0))); else mongoose.disconnect().then(() => process.exit(0)); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
