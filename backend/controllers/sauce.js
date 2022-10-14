const Sauce = require('../models/sauce');
const fs = require('fs');

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

exports.likeSauce = (req, res, next) => {
   const sauceObject = { ...req.body.sauce };
   delete sauceObject._userId;
   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
        userId = sauce.userId
        usersLiked = sauce.usersLiked
        console.log(sauce)
        console.log(userId)
        console.log(sauce.likes)
        console.log(req.body)
        if(req.body.like == 1) {
          console.log("on rentre dans la boucle 1")
          console.log(req.body.like)
          sauce.usersLiked.push(userId)
          console.log(sauce.usersLiked)
          Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Objet liké !'}))
          .catch(error => res.status(401).json({ error }));
        } 
        if(req.body.like == -1) {
          console.log("on rentre dans la boucle -1")
          console.log(req.body.like)
          sauce.usersDisliked.push(userId)
          console.log(sauce.usersDisliked)
          Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Objet disliké !'}))
          .catch(error => res.status(401).json({ error }));

          // sauce.usersDisliked.push(userId)
          // console.log(usersDisliked)
          // Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
          // .then(() => res.status(200).json({message : 'Objet disliké !'}))
          // .catch(error => res.status(401).json({ error }));
        }
        if(req.body.like == 0) {
          console.log("on rentre dans la boucle 0")
          console.log(req.body.like)
          console.log(sauce.usersLiked)
          if(sauce.usersLiked.includes(userId)) {
            for( let i = 0; i < sauce.usersLiked.length; i++){ 
              if ( sauce.usersLiked[i] === userId) { 
                sauce.usersLiked.splice(i, 1); 
              }
            }
          }          
          console.log(sauce.usersDisliked)

          if(sauce.usersDisliked.includes(userId)) {
            for( let i = 0; i < sauce.usersDisliked.length; i++){ 
              if ( sauce.usersDisliked[i] === userId) { 
                sauce.usersDisliked.splice(i, 1); 
              }          
            }          
          }
          console.log(sauce.usersLiked)
          console.log(sauce.usersDisliked)
          Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Objet liké !'}))
          .catch(error => res.status(401).json({ error }));

        }
        // Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
        // .then(() => res.status(200).json({message : 'Objet liké!'}))
        // .catch(error => res.status(401).json({ error }));
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
};

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