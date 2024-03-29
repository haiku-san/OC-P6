// Importantion des dépendances

const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
const RANDOM_TOKEN_KEY = process.env.RANDOM_TOKEN_KEY;

// * Vérification de la validité du token de l'utilisateur
// Permet de sécuriser la conenxion en évitant qu'un individu se connecte à un contenu
// auquel il ne devrait pas avoir accès

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, `${RANDOM_TOKEN_KEY}`);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};