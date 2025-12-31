# 🚀 Démarrage rapide - LMS Frontend

## En 3 étapes simples

### 1. 📥 Installation
```bash
cd lms-frontend
npm install
```

### 2. ⚙️ Configuration
Créer `.env.local`:
```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8088
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8086
NEXT_PUBLIC_KEYCLOAK_REALM=lms-realm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=lms-frontend
```

### 3. 🚀 Lancement
```bash
npm run dev
```

**C'est tout !** L'application tourne sur http://localhost:3000

## 🎯 Fonctionnalités clés

✅ **Authentification** - Login avec Keycloak  
✅ **Dashboard** - Analytics et statistiques  
✅ **Cours** - Liste et gestion des formations  
✅ **Inscriptions** - Suivi des étudiants  
✅ **Paiements** - Historique des transactions  
✅ **Analytics** - Graphiques et rapports  

## 🔐 Comptes demo

| Rôle | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Instructor | instructor | instructor123 |
| Student | student | student123 |

## 📱 Pages principales

- `/` - Dashboard
- `/login` - Connexion
- `/courses` - Cours
- `/enrollments` - Inscriptions
- `/payments` - Paiements
- `/analytics` - Analytics (admin)

## 🛠️ Stack

- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **HTTP**: Axios

## 📦 Scripts

```bash
npm run dev      # Développement
npm run build    # Build
npm run start    # Production
```

Bonne utilisation ! 🎓