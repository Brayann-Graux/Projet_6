const express = require('express');
const router = express.Router();

// Importation du middleware d'authentification
const auth = require('../middleware/auth');

// Importation du middleware de gestion des fichiers (multer) pour le téléchargement des images
const multer = require('../middleware/multer-config');

// Importation du contrôleur qui gère la logique pour les routes liées aux livres
const stuffCtrl = require('../controllers/stuff');

// Routes ne nécessitant pas d'authentification

// Récupération des livres avec les meilleures notes
router.get('/bestrating', stuffCtrl.getBestRatingBooks);

// Récupération de tous les livres
router.get('/', stuffCtrl.getAllBooks);

// Récupération d'un livre spécifique par son ID
router.get('/:id', stuffCtrl.getOneBook);

// Routes nécessitant une authentification

// Création d'un nouveau livre (authentification et téléchargement d'image nécessaires)
router.post('/', auth, multer, stuffCtrl.createBook);

// Modification d'un livre existant (authentification et téléchargement d'image nécessaires)
router.put('/:id', auth, multer, stuffCtrl.modifyBook);

// Suppression d'un livre (authentification nécessaire)
router.delete('/:id', auth, stuffCtrl.deleteBook);

// Ajout d'une notation à un livre (authentification nécessaire)
router.post('/:id/rating', auth, stuffCtrl.ratingNotation);

// Exportation du routeur pour qu'il soit disponible dans d'autres parties de l'application
module.exports = router;
