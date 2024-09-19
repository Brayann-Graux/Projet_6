const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken')


exports.signup = async (req, res, next) => {
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      await user.save();
      res.status(201).json({ message: "Utilisateur créé !" });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ error: error.message });
    }
  };

  exports.login = async (req, res, next) => {
    try {

      const user = await User.findOne({ email: req.body.email });
      
      if (!user) {
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
      }
  
      const valid = await bcrypt.compare(req.body.password, user.password);
      
      if (!valid) {
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
      }
  
      const token = jwt.sign(
        { userId: user._id },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
      );
  
      res.status(200).json({
        userId: user._id,
        token: token,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: error.message });
    }
  };
  