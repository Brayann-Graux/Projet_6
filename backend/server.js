// Importation des modules nécessaires
const http = require('http'); // Importation du module HTTP de Node.js pour créer le serveur.
const app = require('./app'); // Importation de l'application Express configurée dans app.js.

// Fonction pour normaliser le port d'écoute du serveur
// Cette fonction vérifie que le port est un nombre valide et retourne le port normalisé.
const normalizePort = val => {
    const port = parseInt(val, 10); // Parse la valeur du port en un entier.

    if (isNaN(port)) { // Si la valeur n'est pas un nombre, retourne la valeur brute (val).
        return val;
    }
    if (port >= 0) { // Si le port est un nombre valide et non négatif, le retourne.
        return port;
    }
    return false; // Sinon, retourne false.
};

// Récupération du port d'écoute depuis les variables d'environnement ou utilisation du port 4000 par défaut.
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port); // Définit le port dans l'application Express.

// Gestionnaire d'erreurs pour le serveur HTTP
const errorHandler = error => {
    if (error.syscall !== 'listen') { // Si l'erreur n'est pas liée à l'écoute du serveur, la lance.
        throw error;
    }
    const address = server.address(); // Récupère l'adresse à laquelle le serveur est lié.
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Détermine si l'adresse est une chaîne ou un port.

    // Gestion des différentes erreurs possibles
    switch (error.code) {
        case 'EACCES': // Erreur liée à des permissions insuffisantes
            console.error(bind + ' requires elevated privileges.'); // Affiche un message d'erreur.
            process.exit(1); // Quitte le processus avec un code d'erreur.
            break;
        case 'EADDRINUSE': // Erreur lorsque le port est déjà utilisé
            console.error(bind + ' is already in use.'); // Affiche un message d'erreur.
            process.exit(1); // Quitte le processus avec un code d'erreur.
            break;
        default: // Pour toute autre erreur
            throw error; // Lève l'erreur.
    }
};

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gestion des événements sur le serveur
server.on('error', errorHandler); // Lorsque le serveur rencontre une erreur, appelle la fonction errorHandler.
server.on('listening', () => { // Lorsque le serveur commence à écouter, exécute cette fonction.
    const address = server.address(); // Récupère l'adresse du serveur.
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Détermine si l'adresse est une chaîne ou un port.
    console.log('Listening on ' + bind); // Affiche un message indiquant que le serveur écoute.
});

// Le serveur commence à écouter sur le port défini
server.listen(port);
