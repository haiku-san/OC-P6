# OC Projet 6

Projet n°6 de la formation développeur frontend d'Openclassrooms :
"Construisez une API sécurisée pour une application d'avis gastronomiques"


## Installation

Clonez le repo GitHub
```bash
  git clone https://github.com/haiku-san/OC-P6/tree/main
```

Installez les packages npm

```bash
  cd OC-P6
  npm install
```
## Variables d'environnement

Pour déployer ce projet, vous aurez besoin d'ajouter les variables d'environnement suivantes au fichier .env

`MONGODB_SERVER` : l'adresse de votre serveur MongoDB

`RANDOM_TOKEN_KEY` : Une clé complexe pour la génération aléatoire des tokens de connexion 


## Démarrer le programme localement

Lancez le serveur frontend

```bash
  cd frontend
  npm run start
```

Lancez le serveur backend

```bash
  cd backend
  nodemon server
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

