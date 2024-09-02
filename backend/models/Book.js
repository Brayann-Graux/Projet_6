const mongoose = require('mongoose');
const ratingSchema = require('./Rating');

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    userId: { type: String, require: true }, //permet de recuperer l'Id de celui qui crée le livre
    ratings: [ratingSchema], 
    averageRating: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Book', bookSchema);
