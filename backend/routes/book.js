const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { upload, convertImage } = require('../middlewares/multer-config');

const bookCtrl = require('../controllers/book');


// Authentification non requise
router.get('/bestrating', bookCtrl.getBestRatingBooks);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);

// Authentification requise
router.post('/', auth, upload, convertImage, bookCtrl.createBook);
router.put('/:id', auth, upload, convertImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.ratingNotation);

module.exports = router;