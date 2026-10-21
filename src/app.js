const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const { authenticateToken, authorizeRoles } = require('./middlewares/auth');
const portal = require('./controllers/portalController');
const files = require('./controllers/fileController');
const app = express();
app.disable('x-powered-by');
const origins = new Set((process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map((value) => value.trim()));
app.use(cors({ origin: (origin, callback) => callback(null, !origin || origins.has(origin)), credentials: true }));
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Cache-Control', 'no-store');
  const origin = req.get('origin');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && origin && !origins.has(origin) && origin !== `${req.protocol}://${req.get('host')}`) return res.status(403).json({ success: false, message: 'This origin cannot make changes to the portal.' });
  next();
});
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (req, res) => res.json({ success: true, service: 'maintenance-api', database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workflow', require('./routes/workflowRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.get('/api/settings', authenticateToken, portal.getSettings);
app.put('/api/settings', authenticateToken, authorizeRoles('SUPER_ADMIN'), portal.saveSettings);
app.get('/api/locations', authenticateToken, portal.getLocations);
app.post('/api/locations', authenticateToken, authorizeRoles('SUPER_ADMIN'), portal.addLocation);
app.get('/api/departments', authenticateToken, portal.getDepartments);
app.get('/api/audit-logs', authenticateToken, authorizeRoles('SUPER_ADMIN'), portal.getAuditLogs);
app.post('/api/uploads', authenticateToken, files.upload, files.save);
app.get('/api/files/:id', authenticateToken, files.download);
app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'API endpoint not found.' }));
const frontendDirectory = path.resolve(process.env.FRONTEND_DIST || path.join(__dirname, '../..', 'Maintenance-Request-System', 'dist'));
if (fs.existsSync(path.join(frontendDirectory, 'index.html'))) {
  app.use(express.static(frontendDirectory));
  app.get('/{*path}', (req, res) => res.sendFile(path.join(frontendDirectory, 'index.html')));
}
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || (error.code === 11000 ? 409 : error.name === 'ValidationError' || error.name === 'CastError' || error.name === 'MulterError' ? 400 : 500);
  const message = error.code === 11000 ? 'That username, email, or record already exists.' : error.code === 'LIMIT_FILE_SIZE' ? 'Each attachment must be 15 MB or smaller.' : status === 503 ? error.message : status < 500 ? error.message : 'The server could not complete this action. Please try again.';
  if (status >= 500) console.error(error);
  res.status(status).json({ success: false, message });
});
module.exports = app;
