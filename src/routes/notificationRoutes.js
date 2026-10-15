const router = require('express').Router();
const controller = require('../controllers/notificationController');
const { authenticateToken } = require('../middlewares/auth');
router.use(authenticateToken);
router.get('/', controller.getUserNotifications);
router.patch('/read-all', controller.markAllAsRead);
router.patch('/:id', controller.markAsRead);
module.exports = router;
