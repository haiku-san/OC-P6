// Importation des dépendances

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passwordValidator = require('password-validator');
const dotenv = require("dotenv");
dotenv.config();
const RANDOM_TOKEN_KEY = process.env.RANDOM_TOKEN_KEY;

// * Création des règles de validation du mot de passe
// Création d'une nouvelle instance de l'objet passwordValidator()
// à laquelle on applique des contraintes
// Le moit de passe doit contenir :
// - au moins 8 caractères
// - au max 100 caractères
// - au moins 1 majuscule
// - au moins 1 minuscule
// - au moins 1 chiffre
// - au moins 1 symbole
// - aucun espace

let passwordRules = new passwordValidator();

passwordRules
.is().min(8)                        
.is().max(100)                        
.has().uppercase()                             
.has().lowercase()                             
.has().digits()      
.has().symbols()                         
.has().not().spaces();                  

// * Fonction de création de nouveau compte
// Méthode POST
// Request body : { email: string, password: string }
// Réponse attendue : { message: string }
// Hachage du mot de passe de l'utilisateur, ajout de l'utilisateur à la base de données.

exports.signup = (req, res, next) => {
    if(passwordRules.validate(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save() 
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
    } else {
        return res.status(401).json({ message: "Le mot de passe saisi n'est pas assez complexe"});

    }
};

// * Fonction de connexion à un compte existant
// Méthode POST
// Request body : { email: string, password: string }
// Réponse attendue : { userId: string, token: string }
// Vérification des informations d'identification de l'utilisateur, 
// renvoie l _id de l'utilisateur depuis la base de données et un token web JSON signé
// (contenant également l'_id de l'utilisateur).

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
       .then(user => {
           if (!user) {
               return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
           }
           bcrypt.compare(req.body.password, user.password)
               .then(valid => {
                   if (!valid) {
                       return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                   }
                   res.status(200).json({
                       userId: user._id,
                       token: jwt.sign(
                        { userId: user._id },
                        `${RANDOM_TOKEN_KEY}`,
                        { expiresIn: '24h' }
                        )
                   });
               })
               .catch(error => res.status(500).json({ error }));
       })
       .catch(error => res.status(500).json({ error }));
};