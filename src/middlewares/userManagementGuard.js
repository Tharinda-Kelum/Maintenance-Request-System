const userManagementGuard = (req, res, next) => {
  const allowedRoles = ['DEAN', 'HOD', 'HEAD_OF_MAINTENANCE', 'SUPERVISOR'];
  
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access Denied: Only Dean, HOD, Head of Maintenance, or Supervisors can create users.' 
    });
  }
  next();
};

module.exports = userManagementGuard;