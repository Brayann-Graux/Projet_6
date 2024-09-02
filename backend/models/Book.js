const mongoose = require('mongoose');
const ratingSchema = require('./Rating');

// Définition du schéma pour le modèle Book
const bookSchema = mongoose.Schema({
    title: { type: String, required: true }, // Le titre du livre, requis
    author: { type: String, required: true }, // L'auteur du livre, requis
    imageUrl: { type: String, required: true }, // URL de l'image associée au livre, requis
    year: { type: Number, required: true }, // L'année de publication du livre, requis
    genre: { type: String, required: true }, // Le genre du livre (par exemple: fiction, non-fiction), requis
    userId: { type: String, required: true }, // L'ID de l'utilisateur qui a créé le livre, requis
    ratings: [ratingSchema], // Un tableau de schémas de notation pour stocker les notes du livre
    averageRating: { type: Number, required: true, default: 0 } // La note moyenne du livre, par défaut 0
});

// Exportation du modèle Book pour pouvoir l'utiliser ailleurs dans l'application
module.exports = mongoose.model('Book', bookSchema);
