const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true },mobile:{ type: String, required: true },pass:{ type: String, required: true } }, { timestamps: true })

const usermong = mongoose.model('users', userSchema);

module.exports = usermong;