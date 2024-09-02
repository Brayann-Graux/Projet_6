// app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user'); // Importer les routes d'utilisateur
const stuffRoutes = require('../backend/routes/stuff');
const app = express();


// Servir les fichiers statiques du dossier "images"
// Cette ligne indique à l'application de servir les fichiers du répertoire "images" lorsqu'ils sont demandés via une URL qui commence par "/images".
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json()); // Middleware pour parser le corps des requêtes HTTP en JSON. Utile pour les API REST qui reçoivent des données au format JSON.

// Middleware pour gérer les permissions CORS (Cross-Origin Resource Sharing)
// Ce middleware ajoute des en-têtes à chaque réponse HTTP pour permettre l'accès aux ressources du serveur depuis n'importe quelle origine (domaine).
// Cela est nécessaire pour les applications web qui communiquent avec un backend situé sur un domaine différent de celui du frontend.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines à accéder aux ressources.
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Spécifie les en-têtes autorisés dans les requêtes.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Spécifie les méthodes HTTP autorisées.
  if (req.method === "OPTIONS") { // Si la méthode est "OPTIONS" (pré-vérification CORS), renvoie une réponse immédiate.
    return res.status(200).end(); // Terminer la requête avec un statut 200 OK.
  }
  next(); // Passe à l'étape suivante du traitement de la requête.
});

// Connexion à la base de données MongoDB via Mongoose
// Cette partie tente de se connecter à MongoDB en utilisant l'URL fournie. Si la connexion réussit, un message est affiché dans la console.
// Si la connexion échoue, l'erreur est capturée et affichée dans la console.
mongoose.connect('mongodb+srv://grauxbrayann:Bg10061997@cluster0.st5fa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !')) // Affiche ce message en cas de succès.
  .catch((error) => console.log('Connexion à MongoDB échouée !', error)); // Affiche ce message en cas d'échec.

// Définition des routes
// Cette ligne indique à l'application d'utiliser les routes définies dans "userRoutes" pour toutes les requêtes qui commencent par "/api/auth".
// De même, les routes définies dans "stuffRoutes" sont utilisées pour les requêtes commençant par "/api/books".
app.use('/api/auth', userRoutes);
app.use('/api/books', stuffRoutes);

module.exports = app;
