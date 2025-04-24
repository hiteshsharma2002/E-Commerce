const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({ file: { type: [String], required: true } });

const slidemong = mongoose.model('slides', slideSchema);

module.exports = slidemong;