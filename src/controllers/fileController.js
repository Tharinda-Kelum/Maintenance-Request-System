const path = require('node:path');
const fs = require('node:fs/promises');
const multer = require('multer');
const { randomUUID } = require('node:crypto');
const Attachment = require('../models/Attachment');
const Request = require('../models/Request');
const { fail, objectId } = require('../utils/http');
const { idOf, scopedTicket } = require('../services/accessService');
const { publicAttachment } = require('../services/portalService');

const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'));
const extensions = { 'image/jpeg': '.jpg', 'image/png': '.png', 'application/pdf': '.pdf' };
const upload = multer({
  storage: multer.memoryStorage(), limits: { files: 5, fileSize: 15 * 1048576 },
  fileFilter: (req, file, done) => done(extensions[file.mimetype] ? null : Object.assign(new Error('Choose JPG, PNG, or PDF files.'), { status: 400 }), Boolean(extensions[file.mimetype]))
}).array('files', 5);
const fileSignatureMatches = (file) => {
  if (file.mimetype === 'image/png') return file.buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (file.mimetype === 'image/jpeg') return file.buffer[0] === 255 && file.buffer[1] === 216 && file.buffer[2] === 255;
  return file.buffer.subarray(0, 5).toString() === '%PDF-';
};
exports.upload = upload;
exports.save = async (req, res) => {
  if (!req.files?.length) fail(400, 'Choose at least one file.');
  if (req.files.some((file) => !fileSignatureMatches(file))) fail(400, 'A file does not match its JPG, PNG, or PDF format.');
  await fs.mkdir(uploadDirectory, { recursive: true });
  const created = [];
  try {
    for (const file of req.files) {
      const filename = `${randomUUID()}${extensions[file.mimetype]}`;
      await fs.writeFile(path.join(uploadDirectory, filename), file.buffer, { flag: 'wx' });
      const attachment = await Attachment.create({ uploadedBy: req.user._id, filename: path.basename(file.originalname), filepath: filename, mimetype: file.mimetype, size: file.size });
      created.push(attachment);
    }
  } catch (error) {
    for (const file of created) { await fs.unlink(path.join(uploadDirectory, file.filepath)).catch(() => {}); await file.deleteOne(); }
    throw error;
  }
  res.status(201).json({ success: true, data: created.map(publicAttachment) });
};
exports.download = async (req, res) => {
  const attachment = await Attachment.findById(objectId(req.params.id, 'File'));
  if (!attachment) fail(404, 'File not found.');
  if (idOf(attachment.uploadedBy) !== idOf(req.user)) {
    if (!attachment.ticketId || !await Request.exists(await scopedTicket(req.user, String(attachment.ticketId)))) fail(404, 'File not available to your account.');
  }
  const resolvedPath = path.resolve(uploadDirectory, attachment.filepath);
  if (!resolvedPath.startsWith(uploadDirectory + path.sep)) fail(404, 'File not found.');
  res.set('Content-Type', attachment.mimetype);
  res.set('Cache-Control', 'private, no-store');
  res.set('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(attachment.filename)}`);
  res.sendFile(resolvedPath, { dotfiles: 'allow' });
};
