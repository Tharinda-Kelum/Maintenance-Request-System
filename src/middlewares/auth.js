const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { fail } = require('../utils/http');

const authenticateToken = async (req, res, next) => {
  const bearer = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  const cookie = req.headers.cookie?.split(';').map((value) => value.trim()).find((value) => value.startsWith('mrs_session='))?.slice(12);
  const token = bearer || cookie;
  if (!token) return next(Object.assign(new Error('Please sign in to continue.'), { status: 401 }));
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return next(Object.assign(new Error('Your session has expired. Please sign in again.'), { status: 401 })); }
  const user = await User.findById(payload.id).populate({ path: 'departmentId', populate: { path: 'parentId' } });
  if (!user || user.isActive === false || (user.sessionVersion || 0) !== (payload.version || 0)) fail(401, 'This session is no longer valid. Please sign in again.');
  if (req.get('X-MRS-User') && req.get('X-MRS-User') !== String(user._id)) return res.status(409).json({ success: false, code: 'SESSION_CHANGED', message: 'Another tab changed the signed-in account. Your workspace is being refreshed. Please review the account before trying again.' });
  req.user = user;
  next();
};
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(Object.assign(new Error('Your role cannot perform this action.'), { status: 403 }));
  next();
};
const cookieOptions = () => ({ httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/api', maxAge: 8 * 60 * 60 * 1000 });
const issueSession = (res, user) => {
  const token = jwt.sign({ id: String(user._id), version: user.sessionVersion || 0 }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.cookie('mrs_session', token, cookieOptions());
  return token;
};
module.exports = { authenticateToken, authorizeRoles, cookieOptions, issueSession };
