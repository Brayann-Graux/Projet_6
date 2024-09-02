// app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user'); // Importer les routes d'utilisateur
const stuffRoutes = require('../backend/routes/stuff');
const app = express();


// Servir les fichiers statiques du dossier "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json()); // Pour parser le JSON des requêtes

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// MONGOOSE CONNECT
mongoose.connect('mongodb+srv://grauxbrayann:Bg10061997@cluster0.st5fa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

// Utiliser les routes d'utilisateur
app.use('/api/auth', userRoutes);
app.use('/api/books', stuffRoutes);

module.exports = app;
