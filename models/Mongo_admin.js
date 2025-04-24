const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({ email: { type: String, required: true }, pass: { type: String, required: true } }, { timestamps: true })

const adminmong = mongoose.model('admins', adminSchema);

module.exports = adminmong;