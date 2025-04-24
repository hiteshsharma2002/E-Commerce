const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({email:{type:String}, product: { type: String }, price: { type: String }, discount: { type: String }, avail: { type: String }, image: { type: String } }, { timestamps: true })


const cartmong = mongoose.model('cart', cartSchema);

module.exports = cartmong;