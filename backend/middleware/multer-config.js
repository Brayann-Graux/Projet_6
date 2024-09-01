const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');  // Correction ici
        const fileNameWithoutExt = name.replace(/\.[^/.]+$/, "");
        const extension = MIME_TYPES[file.mimetype];
        if (!extension) {
            return callback(new Error('Invalid file type'), false);
        }

        callback(null, fileNameWithoutExt + '_' + Date.now() + '.' + extension);  // Ajout d'un timestamp pour l'unicité
    }
});

module.exports = multer({ storage }).single('image');
