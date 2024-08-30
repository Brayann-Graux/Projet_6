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
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
        year: year,
        genre: genre,
      });
      book
        .save()
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

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        inmageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book ) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({  message: 'Non autorisé !'});
            } else {
                Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message: 'Objet modifié !'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

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

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ error }));
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