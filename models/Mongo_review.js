const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({ name: { type: String,required:true }, rating: { type: String,required:true }, review: { type: String,required:true } }, { timestamps: true });

const reviewmong = mongoose.model('reviews', reviewSchema);

module.exports = reviewmong;