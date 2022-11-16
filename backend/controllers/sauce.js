// Importation des dépendances

const Sauce = require('../models/sauce');
const fs = require('fs');

// * Fonction de création d'une sauce
// Méthode POST
// Request body : { sauce: String, image: File }
// Réponse attendue : { message: String } Verb
// Capture et enregistre l'image, analyse la sauce transformée en chaîne de caractères 
// et l'enregistre dans la base de données en définissant correctement son imageUrl. 
// Initialise les likes et dislikes de la sauce à 0 et les usersLiked et usersDisliked 
// avec des tableaux vides. Remarquez que le corps de la demande initiale est vide ; 
// lorsque multer est ajouté, il renvoie une chaîne pour le corps 
// de la demande en fonction des données soumises avec le fichier.

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

// * Fonction de récupération des informations d'une sauce
// Méthode GET
// Réponse attendue : Single sauce
// Renvoie la sauce avec l’_id fourni

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// * Fonction de modification d'une sauce
// Méthode PUT 
// Request body : EITHER Sauce as JSO OR { sauce String image: File }
// Réponse attendue : { message: String }
// Met à jour la sauce avec l'_id fourni. Si une image est téléchargée, 
// elle est capturée et l’imageUrl de la sauce est mise à jour. 
// Si aucun fichier n'est fourni, les informations sur la sauce se trouvent 
// directement dans le corps de la requête (req.body.name, req.body.heat, etc.). 
// Si un fichier est fourni, la sauce transformée en chaîne de caractères se trouve dans req.body.sauce. 
// Notez que le corps de la demande initiale est vide ; 
// lorsque multer est ajouté, il renvoie une chaîne du corps 
// de la demande basée sur les données soumises avec le fichier.

exports.modifySauce = (req, res, next) => {
   const sauceObject = req.file ? {
       ...JSON.parse(req.body.sauce),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
 
   delete sauceObject._userId;
   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
};

// * Fonction du "like" d'une sauce
// Méthode POST
// Request body : { userId: String, like: Number }
// Réponse attendue : { message: String }
// Définit le statut « Like » pour l' userId fourni. 
// Si like = 1, l'utilisateur aime (= like) la sauce. 
// Si like = 0, l'utilisateur annule son like ou son dislike. 
// Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce. 
// L'ID de l'utilisateur doit être ajouté ou retiré du tableau approprié. 
// Cela permet de garder une trace de leurs préférences et les empêche 
// de liker ou de ne pas disliker la même sauce plusieurs fois : 
// un utilisateur ne peut avoir qu'une seule valeur pour chaque sauce. 
// Le nombre total de « Like » et de « Dislike » est mis à jour à chaque nouvelle notation

exports.likeSauce = (req, res, next) => {
   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
        let sauceObject = sauce
        userId = req.auth.userId
        usersLiked = sauceObject.usersLiked
        if(req.body.like == 1) {
          sauceObject.usersLiked.push(userId)
          sauceObject.likes++          
        } 
        if(req.body.like == -1) {
          sauceObject.usersDisliked.push(userId)
          sauceObject.dislikes++

        }
        if(req.body.like == 0) {
          if(sauceObject.usersLiked.includes(userId)) {
            for( let i = 0; i < sauceObject.usersLiked.length; i++){ 
              if ( sauceObject.usersLiked[i] === userId) { 
                sauceObject.usersLiked.splice(i, 1); 
              }
            }
            sauceObject.likes--
          }          

          if(sauceObject.usersDisliked.includes(userId)) {
            for( let i = 0; i < sauceObject.usersDisliked.length; i++){ 
              if ( sauceObject.usersDisliked[i] === userId) { 
                sauceObject.usersDisliked.splice(i, 1); 
              }          
            }     
            sauceObject.dislikes--

          }

        }


      
        Sauce.updateOne({ _id: req.params.id}, { ...({likes,dislikes,usersLiked,usersDisliked} = sauceObject._doc)})
        .then((e) => {
          return res.status(200).json({message : 'Objet liké !'})
        })
        .catch(error => res.status(401).json({ error }));
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
};


// * Fonction de récupération de la liste de toutes les sauces
// Méthode GET
// Réponse attendue : Array of sauces 
// Renvoie un tableau de toutes les sauces de la base de données.

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// * Fonction de suppression d'une sauce
// Méthode DELETE
// Réponse attendue : { message: String }
// Supprime la sauce avec l'_id fourni

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};