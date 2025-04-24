const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({ category: { type: String }, subcategory: { type: String }, product: { type: String }, price: { type: Number }, discount: { type: String }, desc: { type: String }, avail: { type: String }, image: { type: [String] } }, { timestamps: true });

const productmong = mongoose.model('products', productSchema);

module.exports = productmong;