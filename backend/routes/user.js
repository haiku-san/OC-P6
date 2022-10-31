// Importation des dépendances

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user')

// Création des routes de l'api

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation des routes

module.exports = router;