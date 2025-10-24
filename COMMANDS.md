# 🛠️ Commandes Utiles - EventShot

## Développement

### Démarrage
```bash
# Développement avec hot reload
npm run dev

# Build de production
npm run build

# Démarrer la version production
npm run start

# Linter
npm run lint

# Corriger automatiquement les erreurs de lint
npm run lint -- --fix
```

### Base de données
```bash
# Créer une migration
npx prisma migrate dev --name ma_migration

# Appliquer les migrations
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (interface DB)
npx prisma studio
```

## 📊 Performance & Monitoring

### Analyse du bundle
```bash
# Installer l'analyzer
npm install -D @next/bundle-analyzer

# Analyser le build
ANALYZE=true npm run build
```

### Lighthouse
```bash
# Build production
npm run build && npm run start

# Puis dans Chrome DevTools > Lighthouse
# Ou avec CLI :
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### Tests de charge (Rate Limiting)
```bash
# Installer Apache Bench
brew install ab  # macOS

# Tester le rate limiting (100 requêtes simultanées)
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/events
```

## 🧪 Tests (à implémenter)

### Setup Vitest
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Lancer les tests
```bash
# Tests unitaires
npm run test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 🚀 Déploiement

### Vercel (recommandé)
```bash
# Installer Vercel CLI
npm install -g vercel

# Premier déploiement
vercel

# Déploiement production
vercel --prod

# Variables d'environnement
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add UPLOADTHING_TOKEN
```

### Docker (alternatif)
```bash
# Build l'image
docker build -t eventshot .

# Lancer le container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  eventshot
```

## 🔍 Debugging

### Logs Prisma
```bash
# Voir toutes les requêtes SQL
DEBUG="prisma:query" npm run dev
```

### Logs Next.js
```bash
# Mode verbose
NEXT_PUBLIC_LOG_LEVEL=debug npm run dev
```

### TypeScript
```bash
# Vérifier les types sans build
npx tsc --noEmit

# Mode watch
npx tsc --noEmit --watch
```

## 📦 Gestion des Dépendances

### Mettre à jour
```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour interactive
npx npm-check-updates -i

# Mettre à jour tout (attention!)
npm update
```

### Nettoyer
```bash
# Supprimer node_modules et reinstaller
rm -rf node_modules package-lock.json
npm install

# Nettoyer le cache Next.js
rm -rf .next
```

## 🔐 Sécurité

### Audit des dépendances
```bash
# Audit de sécurité
npm audit

# Corriger automatiquement
npm audit fix

# Audit complet (breaking changes possibles)
npm audit fix --force
```

### Générer JWT secret
```bash
# Générer un secret sécurisé
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 Git & CI/CD

### Commits conventionnels
```bash
git commit -m "feat: ajouter rate limiting sur API"
git commit -m "fix: corriger le bug de refresh token"
git commit -m "perf: optimiser le chargement des images"
git commit -m "docs: mettre à jour README"
```

### Pre-commit hooks (Husky)
```bash
# Installer Husky
npm install -D husky lint-staged

# Setup
npx husky init
```

## 🎨 Design System

### Storybook (à implémenter)
```bash
# Installer Storybook
npx storybook@latest init

# Lancer Storybook
npm run storybook

# Build static
npm run build-storybook
```

## 🌐 i18n (internationalisation future)

### Next-intl
```bash
# Installer
npm install next-intl

# Structure
/messages
  /en.json
  /fr.json
```

## 📊 Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics

# Dans app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
```

### Posthog
```bash
npm install posthog-js

# Init dans layout
posthog.init('YOUR_KEY', { api_host: 'https://app.posthog.com' })
```

## 🐛 Troubleshooting

### Problèmes courants

**Erreur Prisma "Can't reach database"**
```bash
# Vérifier le DATABASE_URL
echo $DATABASE_URL

# Régénérer le client
npx prisma generate
npx prisma migrate deploy
```

**Port 3000 déjà utilisé**
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 PID

# Ou utiliser un autre port
PORT=3001 npm run dev
```

**Build échoue avec erreurs TypeScript**
```bash
# Vérifier les types
npx tsc --noEmit

# Souvent dû à des types manquants
npm install -D @types/node @types/react
```

**Images ne se chargent pas**
```bash
# Vérifier next.config.ts
# Ajouter le domaine dans images.remotePatterns
```

## 📚 Documentation

### Générer la doc API
```bash
# Installer TypeDoc
npm install -D typedoc

# Générer
npx typedoc --out docs src
```

### Swagger/OpenAPI (à implémenter)
```bash
npm install swagger-jsdoc swagger-ui-react
```

## 🎯 Raccourcis VSCode

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 🔄 Scripts personnalisés

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "clean": "rm -rf .next node_modules",
    "reinstall": "npm run clean && npm install"
  }
}
```

---

**Astuce** : Créer des alias shell pour les commandes fréquentes :

```bash
# Dans ~/.zshrc
alias nrd="npm run dev"
alias nrb="npm run build"
alias nrs="npm run start"
alias ps="npx prisma studio"
```

---

**Dernière mise à jour** : 24 octobre 2025
