const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({ category: { type: String, required: true }, image: { type: String } }, { timestamps: true })


const catmong = mongoose.model('category', catSchema);

module.exports = catmong;