const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({ email: {type:String},name: { type: String }, item: { type: [String] }, price: { type: String }, street: { type: String }, city: { type: String }, state: { type: String }, zip: { type: String }, status: { type: String, default: 'Order Placed' } }, { timestamps: true });

const ordermong = mongoose.model('orders', orderSchema);

module.exports = ordermong;