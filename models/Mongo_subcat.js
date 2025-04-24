const mongoose = require('mongoose');

const subcatSchema = new mongoose.Schema({ category: { type: String, required: true }, product: { type: String, required: true } }, { timestamps: true });

const subcatmong = mongoose.model('subcategory', subcatSchema);

module.exports = subcatmong;