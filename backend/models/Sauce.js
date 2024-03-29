// Importation des dépendances

const mongoose = require('mongoose')

// * Création du schéma des sauces
// * On précise quelles sont les valeurs attendues dans la base de données partant du modèle suivant :
// ● manufacturer : String — fabricant de la sauce
// ● description : String — description de la sauce
// ● mainPepper : String — le principal ingrédient épicé de la sauce
// ● imageUrl : String — l'URL de l'image de la sauce téléchargée par l'utilisateur
// ● heat : Number — nombre entre 1 et 10 décrivant la sauce
// ● likes : Number — nombre d'utilisateurs qui aiment (= likent) la sauce
// ● dislikes : Number — nombre d'utilisateurs qui n'aiment pas (= dislike) la
// sauce
// ● usersLiked : [ "String <userId>" ] — tableau des identifiants des utilisateurs
// qui ont aimé (= liked) la sauce
// ● usersDisliked : [ "String <userId>" ] — tableau des identifiants

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, min: 1, max: 10, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: [String],
  usersDisliked: [String],
});


// Exportation du schéma

module.exports = mongoose.model('Sauce', sauceSchema)