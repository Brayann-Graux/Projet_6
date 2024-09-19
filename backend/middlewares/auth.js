const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       const authorizationHeader = req.headers.authorization;
       
       if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
           return res.status(401).json({ message: 'Authorization header missing or malformed!' });
       }
       
       const token = authorizationHeader.split(' ')[1];

       const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
       const userId = decodedToken.userId;

       req.auth = {
           userId: userId,
           token: token
       };
       
       next();
   } catch (error) {
       res.status(401).json({ message: 'Authentication failed!', error });
   }
};