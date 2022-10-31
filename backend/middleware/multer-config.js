// Importation des dépendanceds

const multer = require('multer');

// Création d'un objet MIME_TYPES permettant d'associer l'extension de fichier correspondant à chaque type d'image

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de multer
// On précise la destination de l'image ainsi que les règles de nommage de celle-ci
// On évite ainsi d'avoir des problèmes avec plusieurs images qui pourraient avoir le même nom

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Exportation des règles de configuration de multer

module.exports = multer({storage: storage}).single('image');