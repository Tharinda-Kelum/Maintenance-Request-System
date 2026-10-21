const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Department = require('../models/Department');
const { publicUser, audit } = require('../services/portalService');
const { departmentIds, idOf } = require('../services/accessService');
const { fail, text, objectId } = require('../utils/http');
const { issueSession, cookieOptions } = require('../middlewares/auth');

const attempts = new Map();
exports.login = async (req, res) => {
  const login = text(req.body.username || req.body.email, 'Username or email', 200).toLowerCase();
  const password = text(req.body.password, 'Password', 200);
  const key = `${req.ip}:${login}`;
  const previous = attempts.get(key);
  if (previous && previous.until > Date.now() && previous.count >= 10) fail(429, 'Too many sign-in attempts. Please try again in 15 minutes.');
  const user = await User.findOne({ $or: [{ username: login }, { email: login }] }).select('+password').populate({ path: 'departmentId', populate: { path: 'parentId' } });
  if (!user || user.isActive === false || !await bcrypt.compare(password, user.password)) {
    attempts.set(key, { count: previous?.until > Date.now() ? previous.count + 1 : 1, until: Date.now() + 900000 });
    if (attempts.size > 10000) for (const [entry, value] of attempts) if (value.until <= Date.now()) attempts.delete(entry);
    fail(401, 'Invalid username or password.');
  }
  attempts.delete(key);
  user.lastLogin = new Date();
  await user.save();
  const token = issueSession(res, user);
  res.json({ success: true, token, user: publicUser(user) });
};
exports.googleLogin = async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) fail(503, 'Google sign-in is not configured. Set GOOGLE_CLIENT_ID in the backend environment.');
  const credential = text(req.body.credential, 'Google credential', 10000);
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  } catch (error) {
    if (error.name === 'GaxiosError') throw error;
    fail(401, 'Google sign-in could not verify your account. Please try again.');
  }
  const identity = ticket.getPayload();
  if (!identity?.email || identity.email_verified !== true) fail(401, 'Use a Google account with a verified email address.');
  const user = await User.findOne({ email: identity.email.toLowerCase() }).populate({ path: 'departmentId', populate: { path: 'parentId' } });
  if (!user || user.isActive === false) fail(401, 'No active project account is linked to this Google email.');
  user.lastLogin = new Date();
  await user.save();
  const token = issueSession(res, user);
  res.json({ success: true, token, user: publicUser(user) });
};
exports.me = async (req, res) => res.json({ success: true, user: publicUser(req.user) });
exports.logout = async (req, res) => { res.clearCookie('mrs_session', cookieOptions()); res.json({ success: true }); };
exports.changePassword = async (req, res) => {
  const current = text(req.body.currentPassword, 'Current password', 200);
  const next = text(req.body.newPassword, 'New password', 200);
  if (next.length < 8) fail(400, 'Use at least 8 characters for your new password.');
  const user = await User.findById(req.user._id).select('+password');
  if (!await bcrypt.compare(current, user.password)) fail(400, 'Your current password is incorrect.');
  user.password = await bcrypt.hash(next, 12);
  user.sessionVersion = (user.sessionVersion || 0) + 1;
  await user.save();
  issueSession(res, user);
  await audit(req.user, 'CHANGE_PASSWORD', 'Users', user._id, 'Account password changed.');
  res.json({ success: true, message: 'Password changed successfully.' });
};
const managedScope = async (user) => ['HOD', 'DEAN'].includes(user.role) ? { departmentId: { $in: await departmentIds(user.departmentId) } } : {};
exports.getUsers = async (req, res) => {
  const users = await User.find(await managedScope(req.user)).populate({ path: 'departmentId', populate: { path: 'parentId' } }).sort({ name: 1 });
  res.json({ success: true, data: users.map(publicUser) });
};
exports.getDirectory = async (req, res) => {
  const allowed = ['HOD', 'DEAN', 'HEAD_OF_MAINTENANCE', 'SUPERVISOR', 'TECHNICIAN', 'STORE_KEEPER', 'SUPER_ADMIN'];
  if (!allowed.includes(req.user.role)) return res.json({ success: true, data: [] });
  const users = await User.find({ role: { $in: ['TECHNICIAN', 'SUPERVISOR'] }, isActive: { $ne: false } }).populate({ path: 'departmentId', populate: { path: 'parentId' } }).sort({ name: 1 });
  res.json({ success: true, data: users.map(publicUser) });
};
const allowedCreates = { HOD: ['STAFF'], DEAN: ['STAFF', 'HOD'], HEAD_OF_MAINTENANCE: ['SUPERVISOR', 'TECHNICIAN', 'STORE_KEEPER'], SUPERVISOR: ['TECHNICIAN'], SUPER_ADMIN: User.ROLES };
exports.createUser = async (req, res) => {
  const name = text(req.body.name, 'Name', 160);
  const email = text(req.body.email, 'Email', 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'Enter a valid email address.');
  const password = text(req.body.password, 'Password', 200);
  if (password.length < 8) fail(400, 'Use at least 8 characters for the initial password.');
  const role = req.body.backendRole || req.body.role;
  if (!allowedCreates[req.user.role]?.includes(role)) fail(403, 'You cannot create an account with that role.');
  const departmentId = objectId(req.body.departmentId, 'Department');
  if (!await Department.exists({ _id: departmentId })) fail(400, 'Choose an existing department.');
  if (['HOD', 'DEAN'].includes(req.user.role) && !(await departmentIds(req.user.departmentId)).includes(departmentId)) fail(403, 'Choose a department within your faculty or department.');
  const username = req.body.username ? text(req.body.username, 'Username', 80).toLowerCase() : email;
  const user = await User.create({ name, email, username, password: await bcrypt.hash(password, 12), role, departmentId, phone: req.body.phone || '', trade: req.body.trade || '', createdBy: req.user._id });
  await user.populate({ path: 'departmentId', populate: { path: 'parentId' } });
  await audit(req.user, 'CREATE_USER', 'Users', user._id, `Created ${role} account for ${email}.`);
  res.status(201).json({ success: true, data: publicUser(user) });
};
exports.updateUser = async (req, res) => {
  const id = objectId(req.params.id, 'User');
  const user = await User.findOne({ _id: id, ...await managedScope(req.user) });
  if (!user) fail(404, 'Account not found.');
  if (idOf(user) === idOf(req.user)) fail(400, 'You cannot suspend or reset your own account here.');
  if (req.user.role !== 'SUPER_ADMIN' && !allowedCreates[req.user.role]?.includes(user.role)) fail(403, 'You cannot manage this account.');
  if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;
  if (req.body.newPassword !== undefined) {
    const password = text(req.body.newPassword, 'New password', 200);
    if (password.length < 8) fail(400, 'Use at least 8 characters for the new password.');
    user.password = await bcrypt.hash(password, 12);
  }
  user.sessionVersion = (user.sessionVersion || 0) + 1;
  await user.save();
  await user.populate({ path: 'departmentId', populate: { path: 'parentId' } });
  await audit(req.user, 'UPDATE_USER', 'Users', user._id, 'Account access updated.');
  res.json({ success: true, data: publicUser(user) });
};
exports.allowedCreates = allowedCreates;
