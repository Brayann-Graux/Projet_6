require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/user');
const booksRoutes = require('./routes/book');
const app = express();

// Mongoose connect
mongoose.connect(`mongodb+srv://${process.env.MONGOOSE_ID}:${process.env.MONGOOSE_MDP}@cluster0.st5fa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));


  // Middleware request number limiter. 150 requests every 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  standardHeaders: 'draft-7',
});

// Middlewares application
app.use(limiter);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(helmet());

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


// Use of main routes
app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);

module.exports = app;
