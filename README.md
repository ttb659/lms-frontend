# LMS Platform - Frontend Application

Frontend moderne pour la plateforme de gestion de formations en ligne (LMS) avec architecture microservices.

## 🚀 Fonctionnalités

- **Authentification complète** : Login/logout avec Keycloak integration
- **Tableau de bord** : Analytics en temps réel avec graphiques interactifs
- **Gestion des cours** : CRUD complet pour les formations
- **Gestion des inscriptions** : Suivi des étudiants et progression
- **Gestion des paiements** : Historique des transactions et revenus
- **Analytics avancés** : Statistiques détaillées et rapports
- **Design responsive** : Interface adaptative pour tous les appareils
- **État global** : Gestion d'état moderne avec Zustand

## 🛠️ Stack Technique

- **Framework** : Next.js 14 avec App Router
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Charts** : Recharts
- **Formulaires** : React Hook Form + Zod
- **État global** : Zustand
- **HTTP Client** : Axios
- **Icons** : Heroicons
- **Date handling** : date-fns

## 📁 Structure du projet

```
lms-frontend/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── layout.tsx         # Layout racine
│   │   ├── globals.css        # Styles globaux
│   │   ├── courses/           # Pages des cours
│   │   ├── enrollments/       # Pages des inscriptions
│   │   ├── payments/          # Pages des paiements
│   │   ├── analytics/         # Pages des analytics
│   │   ├── users/             # Pages des utilisateurs
│   │   └── login/             # Page de connexion
│   ├── components/            # Composants React réutilisables
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Button.tsx
│   │   ├── CourseCard.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── DashboardCharts.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ToastProvider.tsx
│   │   └── AuthProvider.tsx
│   ├── features/              # Fonctionnalités par domaine
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   ├── useEnrollments.ts
│   │   ├── usePayments.ts
│   │   └── useAnalytics.ts
│   ├── lib/                   # Utilitaires et configurations
│   │   └── api-client.ts
│   ├── types/                 # Types TypeScript
│   │   └── index.ts
│   └── utils/                 # Fonctions utilitaires
│       └── index.ts
├── public/                    # Assets statiques
├── .env.local                 # Variables d'environnement
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
cd lms-frontend
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env.local` à la racine du projet :

```env
# API Gateway Configuration
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080

# Keycloak Configuration
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=lms-realm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=lms-frontend

# Application Configuration
NEXT_PUBLIC_APP_NAME=LMS Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
```

4. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

L'application est accessible sur http://localhost:3000

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Build
npm run build        # Build pour la production
npm run start        # Lance l'application en production

# Qualité
npm run lint         # ESLint
npm run type-check   # Vérification TypeScript
```

## 🔐 Authentification

Le système d'authentification utilise Keycloak avec JWT tokens. Les comptes de démonstration disponibles sont :

- **Administrateur** : `admin` / `admin123`
- **Instructeur** : `instructor` / `instructor123`
- **Étudiant** : `student` / `student123`

## 📱 Pages principales

- `/` - Tableau de bord avec analytics
- `/login` - Page de connexion
- `/courses` - Liste et gestion des cours
- `/enrollments` - Gestion des inscriptions
- `/payments` - Historique des paiements
- `/analytics` - Analytics détaillés (Admin)
- `/users` - Gestion des utilisateurs (Admin)

## 🎨 Design System

Le projet utilise un design system cohérent avec Tailwind CSS :

### Couleurs principales
- **Primary** : Bleu (#0ea5e9)
- **Secondary** : Grays (#64748b)
- **Success** : Vert (#22c55e)
- **Warning** : Orange (#f59e0b)
- **Error** : Rouge (#ef4444)
- **Accent** : Jaune (#eab308)

### Composants réutilisables
- **Button** : Boutons avec variants (primary, secondary, etc.)
- **Card** : Conteneurs avec ombres et bordures
- **Form inputs** : Champs de formulaire stylisés
- **LoadingSpinner** : Indicateurs de chargement
- **Badges** : Étiquettes colorées pour les statuts

## 🔌 Intégration API

Le frontend communique avec les microservices backend via l'API Gateway :

```typescript
// Exemple d'utilisation
import apiClient from '@/lib/api-client';

// Récupérer les cours
const courses = await apiClient.getCourses();

// Créer une inscription
const enrollment = await apiClient.createEnrollment({
  userId: '123',
  courseId: '456'
});
```

## 📊 Analytics

Le dashboard inclut plusieurs graphiques interactifs :
- Inscriptions par cours (BarChart)
- Revenus par cours (BarChart)
- Évolution mensuelle (LineChart)
- Statistiques clés (KPI cards)

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

Les fichiers optimisés sont générés dans le dossier `.next/`.

### Déploiement Docker (optionnel)
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Tests

Les tests peuvent être ajoutés avec Jest et React Testing Library :

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 📚 Documentation API

Le frontend s'intègre avec les microservices suivants :

- **User Service** : Gestion des utilisateurs
- **Course Service** : Gestion des cours
- **Enrollment Service** : Gestion des inscriptions
- **Payment Service** : Traitement des paiements
- **Analytics Service** : Statistiques et rapports
- **Auth Service** : Authentification et autorisation

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub ou contacter l'équipe de développement.

---

**LMS Platform** - Plateforme de formation en ligne moderne et scalable 🎓