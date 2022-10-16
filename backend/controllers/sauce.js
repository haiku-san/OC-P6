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
  //  const sauceObject = { ...req.body.sauce };
  //  delete sauceObject._userId;
   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
        let sauceObject = sauce
        userId = req.body.userId
        console.log(userId)
        usersLiked = sauceObject.usersLiked
        console.log(sauceObject)
        console.log(userId)
        console.log(sauceObject.likes)
        console.log(req.body)
        if(req.body.like == 1) {
          console.log("on rentre dans la boucle 1")
          console.log(req.body.like)
          sauceObject.usersLiked.push(userId)
          sauceObject.likes++
          console.log(sauceObject.usersLiked)
          
          // console.log(sauceObject)

        } 
        if(req.body.like == -1) {
          console.log("on rentre dans la boucle -1")
          console.log(req.body.like)
          sauceObject.usersDisliked.push(userId)
          sauceObject.dislikes++
          console.log(sauceObject.usersDisliked)
          console.log(sauceObject.dislikes)
          console.log(sauceObject)

        }
        if(req.body.like == 0) {
          console.log("on rentre dans la boucle 0")
          console.log(req.body.like)
          console.log(sauceObject.usersLiked)
          if(sauceObject.usersLiked.includes(userId)) {
            for( let i = 0; i < sauceObject.usersLiked.length; i++){ 
              if ( sauceObject.usersLiked[i] === userId) { 
                sauceObject.usersLiked.splice(i, 1); 
              }
            }
            sauceObject.likes--
          }          
          console.log(sauceObject.usersDisliked)

          if(sauceObject.usersDisliked.includes(userId)) {
            for( let i = 0; i < sauceObject.usersDisliked.length; i++){ 
              if ( sauceObject.usersDisliked[i] === userId) { 
                sauceObject.usersDisliked.splice(i, 1); 
              }          
            }     
            sauceObject.dislikes--

          }
          console.log(sauceObject.usersLiked)
          console.log(sauceObject.usersDisliked)

        }
        // delete sauceObject._id
        // delete sauceObject.__v

        console.log(sauceObject._doc)

        // console.log(sauceObject._id)
      
        Sauce.updateOne({ _id: req.params.id}, { ...({likes,dislikes,usersLiked,usersDisliked} = sauceObject._doc)})
        .then((e) => {
          console.log(e)
          return res.status(200).json({message : 'Objet liké !'})
        })
        .catch(error => res.status(401).json({ error }));
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