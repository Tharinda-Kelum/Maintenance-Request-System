const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public/Authenticated list of hierarchical departments
router.get('/tree', authenticateToken, departmentController.getDepartmentTree);

// Department creation restricted to administrative roles
router.post(
  '/',
  authenticateToken,
  authorizeRoles('DEAN', 'HOD', 'HEAD_OF_MAINTENANCE'),
  departmentController.createDepartment
);

module.exports = router;