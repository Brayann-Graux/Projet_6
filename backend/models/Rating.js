const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true }
});

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    imageUrl: { type: String, required: true },
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    userId: { type: String, required: true }
  });
  
  // Méthode pour mettre à jour la moyenne des notes
  bookSchema.methods.updateAverageRating = function() {
    if (this.ratings.length > 0) {
      const total = this.ratings.reduce((sum, rating) => sum + rating.grade, 0);
      this.averageRating = Math.round((total / this.ratings.length) * 10) / 10;
    } else {
      this.averageRating = 0;
    }
    return this.save();
  };
  

module.exports = ratingSchema; 
