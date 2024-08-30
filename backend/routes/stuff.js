const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/stuff');

// Authentification non requise
router.get('/', stuffCtrl.getAllBooks); // array of books
router.get('/:id', stuffCtrl.getOneBook); // single book
// router.get('api/books/bestrating', stuffCtrl.getBestRatingBooks); // array of books best rating /* CREER LE getBestRatingBooks */

// Authentification requise
router.post('/', auth, multer, stuffCtrl.createBook);
router.put('/:id', auth, multer, stuffCtrl.modifyBook);
// router.delete('/api/books/:id', auth, stuffCtrl.deleteBook);
// router.post('/api/books/:id/rating', auth, stuffCtrl.ratingNotation); // For rating notation books /* CREER LE ratingNotation */ 

module.exports = router;