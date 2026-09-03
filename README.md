# 🚗 Select Your Car In Congo (S.C.I.C)

Une plateforme e-commerce moderne pour la vente et la location de véhicules en République du Congo, construite avec **React**, **FastAPI** et **MongoDB**.

## 🌟 Fonctionnalités

### Pour les Utilisateurs
- 👤 **Authentification sécurisée** avec tokens JWT
- 🚗 **Navigation des véhicules** avec filtres avancés (marque, prix, condition, localisation)
- 💳 **Paiement via MTN Mobile Money**
- 📝 **Publier des annonces** de vente/location
- 📊 **Tableau de bord personnel** pour gérer ses annonces
- 💬 **Messagerie** pour contacter les vendeurs/locataires

### Pour les Administrateurs
- ✅ **Gestion des annonces** (approbation/rejet)
- 👥 **Gestion des utilisateurs**
- 💰 **Suivi des paiements**
- 📊 **Statistiques et rapports**

## 🛠️ Stack Technologique

### Frontend
- **React 18** - Bibliothèque UI
- **React Router 7** - Navigation
- **Tailwind CSS** - Styling
- **Radix UI** - Composants accessibles
- **Axios** - Client HTTP
- **React Hook Form** - Gestion des formulaires

### Backend
- **FastAPI** - Framework web asynchrone
- **MongoDB** - Base de données NoSQL
- **Motor** - Pilote MongoDB asynchrone
- **JWT** - Authentification
- **Pydantic** - Validation des données

## 📋 Prérequis

- **Node.js** >= 18.0.0
- **Python** >= 3.10
- **MongoDB** >= 6.0
- **npm** ou **yarn**

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/selectyourcarincongo/selectyourcarincongo.git
cd selectyourcarincongo
```

### 2. Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos configurations
nano .env
```

**Variables essentielles à configurer :**
- `MONGO_URL` - URL de connexion MongoDB
- `REACT_APP_BACKEND_URL` - URL du backend (ex: http://localhost:8001)
- `SECRET_KEY` - Clé secrète pour JWT (générez une longue chaîne aléatoire)
- `CORS_ORIGINS` - Origines autorisées (ex: http://localhost:3000)
- Identifiants MTN Mobile Money (optional pour développement)

### 3. Installation Frontend

```bash
cd frontend
npm install
# ou
yarn install
```

### 4. Installation Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 🎯 Démarrage

### Mode Développement

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Backend sera accessible sur : `http://localhost:8001`

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

Frontend sera accessible sur : `http://localhost:3000`

### Documentation API
Une fois le backend démarré, consultez la documentation interactive :
- **Swagger UI** : http://localhost:8001/docs
- **ReDoc** : http://localhost:8001/redoc

## 📦 Build pour la Production

### Frontend
```bash
cd frontend
npm run build
```

Les fichiers compilés seront dans `frontend/build/`

### Backend
```bash
# Utiliser gunicorn ou uvicorn en mode production
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
```

## 📁 Structure du Projet

```
selectyourcarincongo/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Composants React réutilisables
│   │   ├── pages/           # Pages principales
│   │   ├── ui/              # Composants UI (Radix UI)
│   │   ├── utils/           # Utilitaires (auth, API)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Bibliothèques utilitaires
│   │   ├── App.js           # Composant principal
���   │   └── index.js         # Point d'entrée
│   ├── package.json
│   ├── tailwind.config.js
│   └── craco.config.js
├── backend/
│   ├── server.py            # Application FastAPI principale
│   ├── models.py            # Modèles Pydantic
│   ├── database.py          # Configuration MongoDB
│   ├── auth.py              # Authentification JWT
│   ├── config.py            # Configuration de l'application
│   └── requirements.txt
└── README.md
```

## 🔐 Sécurité

### Points Importants
1. **Ne jamais commiter le fichier `.env`** - Il est dans `.gitignore`
2. **Changer `SECRET_KEY`** en production - Utilisez une clé secrète forte et unique
3. **CORS_ORIGINS** - Restrictif en production (domaines spécifiques uniquement)
4. **HTTPS obligatoire** en production
5. **Valider/Sanitizer** tous les inputs utilisateur
6. **Rate limiting** recommandé en production

### Variables Sensibles
```bash
# Générer une clé secrète sécurisée
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 🧪 Tests

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
pytest
```

## 📝 API Documentation

### Endpoints Principaux

#### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Profil utilisateur actuel

#### Véhicules
- `GET /api/vehicles/public` - Lister les véhicules (public)
- `POST /api/vehicles` - Créer une annonce (authentifié)
- `GET /api/vehicles/{id}` - Détails d'un véhicule
- `PUT /api/vehicles/{id}` - Modifier une annonce

#### Paiements
- `POST /api/payments/initiate` - Initier un paiement
- `POST /api/payments/confirm` - Confirmer le paiement
- `GET /api/payments/history` - Historique des paiements

Voir `http://localhost:8001/docs` pour la documentation complète.

## 🐛 Dépannage

### Le frontend ne peut pas se connecter au backend
```bash
# Vérifier que le backend est lancé
curl http://localhost:8001/docs

# Vérifier REACT_APP_BACKEND_URL dans .env
# Par défaut: http://localhost:8001
```

### Erreur MongoDB
```bash
# Vérifier la connexion MongoDB
# Assurez-vous que mongod est en cours d'exécution
mongosh  # ou mongo pour les anciennes versions
```

### Erreur d'authentification
```bash
# Assurez-vous que SECRET_KEY est cohérent
# en frontend et backend
```

## 🚢 Déploiement

### Déploiement Frontend (Vercel, Netlify, GitHub Pages)
1. Push vers GitHub
2. Configurer les secrets GitHub
3. Deployment automatique via GitHub Actions

### Déploiement Backend (Heroku, Railway, DigitalOcean)
1. Configurer les variables d'environnement
2. Deployment manuel ou CI/CD

Voir `.github/workflows/` pour les actions GitHub.

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés © 2024 Select Your Car In Congo.

## 👨‍💼 Auteur

**Select Your Car In Congo (SCIC)**
- GitHub: [@selectyourcarincongo](https://github.com/selectyourcarincongo)
- Email: support@selectyourcarincongo.cg

## 🤝 Support

Pour toute question ou problème :
1. Consultez la [documentation](./README.md)
2. Créez une [Issue](https://github.com/selectyourcarincongo/selectyourcarincongo/issues)
3. Contactez l'équipe support

---

**Dernière mise à jour** : Septembre 2024
**Version** : 1.0.0