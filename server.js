require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Maintenance Tracking API running' });
});

// Route modules will be mounted here as they're built, e.g.:
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/requests', require('./routes/requests'));

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
