const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({email:{type:String}, name: { type: String, required: true }, street: { type: String, required: true }, city: { type: String, required: true }, state: { type: String, required: true }, zip: { type: String, required: true } }, { timestamps: true })

const addmong = mongoose.model('address', addressSchema);

module.exports = addmong;