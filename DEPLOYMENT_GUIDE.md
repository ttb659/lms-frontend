# Guide de déploiement rapide - LMS Frontend

## 📦 Installation sans Docker

### 1. Prérequis
- Node.js 18 ou plus récent
- npm ou yarn

### 2. Installation
```bash
# Naviguer dans le dossier frontend
cd lms-frontend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.local.example .env.local
# Éditer .env.local avec vos configurations

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur http://localhost:3001

## 🐳 Installation avec Docker

### 1. Construire l'image Docker
```bash
cd lms-frontend
docker build -t lms-frontend .
```

### 2. Lancer le conteneur
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8088 \
  -e NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8086 \
  -e NEXT_PUBLIC_KEYCLOAK_REALM=lms-realm \
  -e NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=lms-frontend \
  lms-frontend
```

## ⚙️ Configuration requise

### Variables d'environnement

Créer un fichier `.env.local`:

```env
# Configuration API Gateway
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080

# Configuration Keycloak
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=lms-realm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=lms-frontend

# Configuration application
NEXT_PUBLIC_APP_NAME=LMS Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🚀 Build pour production

```bash
# Build de production
npm run build

# Lancer en production
npm start
```

## 📁 Structure après build

```
lms-frontend/
├── .next/              # Build production
├── public/             # Assets statiques
├── src/                # Code source
├── package.json
└── README.md
```

## 🔧 Scripts npm

```bash
npm run dev      # Développement
npm run build    # Build production
npm run start    # Production
npm run lint     # ESLint
npm run type-check # TypeScript
```

## 🌐 URLs importantes

- **Frontend** : http://localhost:3000
- **Login** : http://localhost:3000/login
- **Dashboard** : http://localhost:3000
- **Cours** : http://localhost:3000/courses

## 🔐 Comptes de démonstration

- **Admin**: admin / admin123
- **Instructor**: instructor / instructor123
- **Student**: student / student123

## 🆘 Support

Si vous rencontrez des problèmes:

1. Vérifiez que tous les services backend tournent
2. Vérifiez la configuration des URLs dans .env.local
3. Consultez la console du navigateur pour les erreurs
4. Vérifiez les logs du serveur Next.js

## 📱 Responsive

L'application est fully responsive et fonctionne sur:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablette (768px+)
- Mobile (320px+)

Bon déploiement ! 🎉