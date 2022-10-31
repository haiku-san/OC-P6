// Importation des dépendances

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma des utilisateurs
// Quelles sont les données attendues et sous quel format
// ● email : String — adresse e-mail de l'utilisateur [unique]
// ● password : String — mot de passe de l'utilisateur haché

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Utilisation du plugin "uniqueValidator" qui permet de faire en sorte que chaque adresse mail soit unique

userSchema.plugin(uniqueValidator);

// Exportation du schéma User

module.exports = mongoose.model('User', userSchema);