# ER Stats - Statistiques Eternal Return

> **Auteur** : Arthur Magès

## 🎯 Pitch du Projet

**Quoi ?** ER Stats est une application web moderne qui permet de consulter les statistiques détaillées des joueurs d'Eternal Return, un jeu de battle royale.

**Pourquoi ?** Le jeu ne propose pas d'interface suffisamment détaillée pour analyser ses performances. ER Stats comble ce manque en offrant une vue complète des statistiques, historiques de parties et classements.

**Pour qui ?** Destiné aux joueurs d'Eternal Return souhaitant analyser leurs performances, suivre leur progression et comparer leurs statistiques avec d'autres joueurs.

## 🛠️ Stack Technique

- **Frontend** : React 19.2.0 avec React Router pour le routing
- **Styling** : Tailwind CSS pour un design moderne et responsive
- **API** : Axios pour les appels à l'API officielle Eternal Return
- **Déploiement** : GitHub Pages avec GitHub Actions
- **Serveur de développement** : Express.js avec proxy CORS

## 🚀 Installation et Lancement

### 1. Obtenir une clé API
1. Rendez-vous sur [Eternal Return Developer Portal](https://developer.eternalreturn.io/)
2. Créez un compte et générez une clé API
3. Copiez votre clé API

### 2. Configuration du projet
```bash
# Cloner le repository
git clone https://github.com/arthurvergnes/erstats.git
cd erstats

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env et remplacer 'your_api_key_here' par votre vraie clé API
```

### 3. Lancement
```bash
# Développement (avec serveur proxy)
npm run dev

# Frontend uniquement
npm start

# Build de production
npm run build
```

## 🏗️ Architecture Technique

### Routing (React Router)
- `/` - Page d'accueil avec recherche
- `/player/:nickname` - Profil joueur avec statistiques
- `/rankings` - Classements des meilleurs joueurs
- `/characters` - Statistiques par personnage
- `/unions` - Informations sur les équipes

### Composants Principaux
```
src/
├── components/
│   ├── SearchBar.js          # Barre de recherche joueurs
│   ├── PlayerCard.js         # Carte profil joueur
│   ├── PlayerStats.js        # Statistiques détaillées
│   ├── GameHistory.js        # Historique des parties
│   └── CharacterImage.js     # Images des personnages
├── pages/
│   ├── Home.js              # Page d'accueil
│   ├── Rankings.js          # Page classements
│   ├── CharacterStats.js    # Statistiques personnages
│   └── Unions.js            # Page équipes
├── services/
│   └── api.js               # Service API Eternal Return
└── data/
    ├── characters.js        # Mapping des personnages
    └── characterImageNames.js # Noms des images
```

### Services
- **api.js** : Gestion centralisée des appels API avec rate limiting
- **Rate Limiting** : 1.5s entre chaque requête pour respecter les limites
- **Gestion d'erreurs** : Intercepteurs Axios pour logging et gestion d'erreurs

## 📡 Endpoints API Utilisés

### API Officielle Eternal Return
**Documentation** : [https://developer.eternalreturn.io/](https://developer.eternalreturn.io/)

| Endpoint | Description | Usage |
|----------|-------------|-------|
| `GET /v1/user/nickname` | Recherche joueur par pseudo | Recherche de joueurs |
| `GET /v2/user/stats/{userNum}/{seasonId}/{matchingMode}` | Statistiques joueur | Stats Normal/Classé |
| `GET /v1/user/games/{userNum}` | Historique des parties | Dernières parties jouées |
| `GET /v1/rank/{userNum}/{seasonId}/{matchingTeamMode}` | Rang du joueur | Classement individuel |
| `GET /v1/rank/top/{seasonId}/{matchingTeamMode}` | Top joueurs | Classements globaux |
| `GET /v1/unionTeam/{userNum}/{seasonId}` | Équipe du joueur | Informations équipe |

### Modes de Jeu
- **Mode 2** : Normal Squad (3v3v3...)
- **Mode 3** : Ranked Squad (3v3v3...)

### Saisons
- **Saison 35** : Saison actuelle avec données disponibles

## 🌐 Déploiement

Le projet est automatiquement déployé sur GitHub Pages via GitHub Actions lors des push sur la branche `main`.

**URL de production** : [https://arthurvergnes.github.io/erstats](https://arthurvergnes.github.io/erstats)

## 📱 Fonctionnalités

- ✅ Recherche de joueurs par pseudo
- ✅ Statistiques détaillées (Normal/Classé)
- ✅ Historique des 20 dernières parties
- ✅ Calculs de performance (Top 3, K/D, rang moyen)
- ✅ Interface responsive (mobile/desktop)
- ✅ Thème sombre moderne
- ✅ Navigation persistante avec URL
- ✅ Gestion des erreurs et loading states

## 📸 Captures d'écran

### Page d'accueil
![Page d'accueil](./screenshots/Capture%20d'écran%202025-11-07%20150507.png)

### Recherche de joueur
![Recherche](./screenshots/Capture%20d'écran%202025-11-07%20150619.png)

### Profil joueur - Vue d'ensemble
![Profil joueur](./screenshots/Capture%20d'écran%202025-11-07%20150650.png)

### Statistiques détaillées - Mode Classé
![Stats Classé](./screenshots/Capture%20d'écran%202025-11-07%20150704.png)

### Statistiques détaillées - Mode Normal
![Stats Normal](./screenshots/Capture%20d'écran%202025-11-07%20150738.png)

### Historique des parties - Mode Classé
![Historique Classé](./screenshots/Capture%20d'écran%202025-11-07%20150755.png)

### Historique des parties - Mode Normal
![Historique Normal](./screenshots/Capture%20d'écran%202025-11-07%20150816.png)

### Page Classements
![Classements](./screenshots/Capture%20d'écran%202025-11-07%20150830.png)

### Version Mobile - Accueil
![Mobile Accueil](./screenshots/Capture%20d'écran%202025-11-07%20151225.png)

### Version Mobile - Profil joueur
![Mobile Profil](./screenshots/Capture%20d'écran%202025-11-07%20151240.png)
