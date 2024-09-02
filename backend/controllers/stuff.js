const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    try {
        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;
        delete bookObject._userId;

        const { title, author, year, genre } = bookObject;

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            title: title,
            author: author,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            year: year,
            genre: genre
        });

        book.save()
            .then(() => {
                console.log('Livre créé avec succès');
                res.status(201).json({ message: 'Livre créé avec succès !' });
            })
            .catch(error => {
                console.error('Erreur lors de la sauvegarde du livre :', error);
                res.status(400).json({ error });
            });
    } catch (error) {
        console.error('Erreur dans createBook :', error);
        res.status(400).json({ error: 'Erreur lors de la création du livre' });
    }
};

exports.getOneBook = async (req, res) => {
    try {
        console.log('Recherche du livre avec ID:', req.params.id);
        const book = await Book.findById(req.params.id);
        if (!book) {
            console.log('Livre non trouvé');
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        console.log('Livre trouvé:', book);
        res.status(200).json(book);
    } catch (error) {
        console.error('Erreur lors de la récupération du livre:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().catch((error) =>
            res.status(400).json({ error })
        );
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    
    // Rechercher le livre
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            // Vérifier si l'utilisateur authentifié est celui qui a créé le livre
            if (book.userId !== req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            // Si une nouvelle image est téléchargée, supprimer l'ancienne image
            if (req.file) {
                const oldFilename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldFilename}`, (err) => {
                    if (err) console.error('Erreur lors de la suppression de l\'ancienne image:', err);
                });
            }

            // Mettre à jour le livre
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};



exports.deleteBook = (req, res, next) => {
    // Rechercher le livre
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            // Vérifier si l'utilisateur authentifié est celui qui a créé le livre
            if (book.userId !== req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            // Supprimer le fichier d'image associé
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // Supprimer le livre
                Book.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};






exports.ratingNotation = async (req, res) => {
    try {
        const { userId, rating } = req.body;
        const bookId = req.params.id;
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
        }
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé.' });
        }
        const existingRating = book.ratings.find(r => r.userId === userId);
        if (existingRating) {
            return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
        }
        book.ratings.push({ userId, grade: rating });
        const totalRatings = book.ratings.length;
        const totalScore = book.ratings.reduce((sum, r) => sum + r.grade, 0);
        book.averageRating = totalScore / totalRatings;
        await book.save();
        console.log('Note ajoutée avec succès:', book);
        res.status(200).json(book);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la note:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la note.' });
    }
};


exports.getBestRatingBooks = async (req, res) => {
    try {
        // Trouver les livres triés par note moyenne (averageRating) en ordre décroissant
        const books = await Book.find().sort({ averageRating: -1 }).limit(3); // Limite à 3 livres par exemple
        console.log('Livres avec les meilleures notes:', books);
        res.status(200).json(books);
    } catch (error) {
        console.error('Erreur lors de la récupération des livres les mieux notés:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des livres les mieux notés.' });
    }
};