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
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        year: year,
        genre: genre,
      });

      book.save()
        .then(() => {
          console.log("Livre créé avec succès");
          res.status(201).json({ message: "Livre créé avec succès !" });
        })
        .catch((error) => {
          console.error("Erreur lors de la sauvegarde du livre :", error);
          res.status(400).json({ error });
        });
    } catch (error) {
      console.error("Erreur dans createBook :", error);
      res.status(400).json({ error: "Erreur lors de la création du livre" });
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
    ); // si le serveur ne comprend pas la requete
    res.json(books); // Les livres sont envoyés au client sous forme de réponse JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRating = async (req, res, next) => {
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

exports.updateBook = (req, res, next) => {
  const bookId = req.params.id;
  const updatedBookData = req.body; // Les données envoyées depuis le front-end

  Book.findByIdAndUpdate(bookId, updatedBookData, { new: true })
    .then(updatedBook => {
      if (!updatedBook) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      res.status(200).json(updatedBook);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  const bookId = req.params.id;

  Book.findByIdAndDelete(bookId)
    .then(deletedBook => {
      if (!deletedBook) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      res.status(200).json({ message: 'Livre supprimé avec succès' });
    })
    .catch(error => res.status(500).json({ error }));
};


// exports.modifyBook = (req, res, next) => {
//     const bookObject = req.file ? {
//         ...JSON.parse(req.body.book),
//         inmageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     } : {...req.body };

//     delete bookObject._userId;
//     Book.findOne({_id: req.params.id})
//         .then((book ) => {
//             if (book.userId != req.auth.userId) {
//                 res.status(401).json({  message: 'Non autorisé !'});
//             } else {
//               fs.unlink(`images/${filename}`, () => {
//                 Book.deleteOne({_id: req.params.id})
//                 .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
//                 .catch(error => res.status(401).json({error}));
//             });
//                 Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
//                 .then(() => res.status(200).json({message: 'Objet modifié !'}))
//                 .catch(error => res.status(401).json({ error }));
//             }
//         })
//         .catch(error => res.status(400).json({ error }));
// };

// exports.getBestRating = (req, res, next) => {
//   // Récupération de tous les livres
//   // Puis tri par rapport aux moyennes dans l'ordre décroissant, limitation du tableau aux 3 premiers éléments
//   Book.find().sort({averageRating: -1}).limit(3)
//       .then((books)=>res.status(200).json(books))
//       .catch((error)=>res.status(404).json({ error }));
// };

// exports.createRating = (req, res, next) => {
//   const { userId, rating } = req.body;
//   const { id } = req.params; // Supposons que l'ID du livre soit passé en tant que paramètre d'URL

//   // Trouvez le livre par son ID
//   Book.findById(id)
//     .then(book => {
//       if (!book) {
//         return res.status(404).json({ message: 'Livre non trouvé' });
//       }

//       // Vérifiez si l'utilisateur a déjà noté ce livre
//       const existingRating = book.ratings.find(r => r.userId === userId);
//       if (existingRating) {
//         return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
//       }

//       // Ajoutez la nouvelle note au tableau des notes
//       book.ratings.push({ userId, grade: rating });

//       // Recalculez la note moyenne
//       const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
//       book.averageRating = totalRatings / book.ratings.length;

//       // Sauvegardez le livre avec la nouvelle note et la nouvelle moyenne
//       book.save()
//         .then(() => res.status(200).json({ message: 'Note ajoutée avec succès', book }))
//         .catch(error => res.status(400).json({ error }));
//     })
//     .catch(error => res.status(400).json({ error }));
// };

// exports.deleteBook = (req, res, next) => {
//     Book.findOne({_id: req.params.id})
//     .then(book => {
//         if (book.userId != req.auth.userId) {
//             res.status(401).json({message: 'Non autorisé !'});
//         } else {
//             const filname = book.imageUrl.split('/images') [1];
//             fs.unlink(`images/${filename}`, () => {
//                 Book.deleteOne({_id: req.params.id})
//                 .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
//                 .catch(error => res.status(401).json({error}));
//             });
//         }
        
//     } )
//     .catch(error => {
//         res.status(500).json({error});
//     })
// };


