const mongoose = require('mongoose');

// Définition du schéma pour les notations (ratings)
const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true }, // L'ID de l'utilisateur qui a donné la note, requis
    grade: { type: Number, required: true } // La note (évaluation) donnée par l'utilisateur, requis
});

// Exportation du schéma de notation pour l'utiliser dans d'autres modèles
module.exports = ratingSchema;
