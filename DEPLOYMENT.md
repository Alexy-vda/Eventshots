# 🚀 Guide de déploiement - EventShot (Mode Démo)

Ce guide vous explique comment déployer EventShot sur Vercel pour faire des démonstrations.

> **Note importante** : En mode démo avec SQLite, la base de données est réinitialisée à chaque redéploiement. Parfait pour des présentations, mais les données ne persistent pas.

---

## 📋 Prérequis

- Un compte [GitHub](https://github.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit)
- Un compte [UploadThing](https://uploadthing.com) (gratuit)

---

## 🔧 Étape 1 : Préparer le projet

### 1.1 Créer un fichier `.env.example`

Créez un fichier `.env.example` à la racine du projet avec ce contenu :

```env
# Base de données (SQLite local pour dev)
DATABASE_URL="file:./dev.db"

# JWT Secret (générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# UploadThing (pour l'upload de photos)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_TOKEN="sk_live_..."

# Next.js
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 1.2 Mettre à jour le `.gitignore`

Assurez-vous que votre `.gitignore` contient :

```
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/
build
dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/*.db
prisma/*.db-journal
prisma/migrations
```

### 1.3 Optimiser le `package.json`

Vérifiez que vos scripts de build sont corrects :

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
```

---

## 📤 Étape 2 : Pusher sur GitHub

### 2.1 Initialiser Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### 2.2 Créer un repository GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. Nom du repo : `eventshots-pro` (ou autre)
3. Laissez **Public** ou **Private** selon votre choix
4. **Ne cochez rien** (pas de README, .gitignore, etc.)
5. Cliquez "Create repository"

### 2.3 Pusher le code

```bash
# Remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE_USERNAME/eventshots-pro.git
git branch -M main
git push -u origin main
```

---

## 🎯 Étape 3 : Configurer UploadThing

### 3.1 Créer un compte et une app

1. Allez sur [uploadthing.com](https://uploadthing.com)
2. Créez un compte (connexion GitHub recommandée)
3. Créez une nouvelle app : **"EventShot"**

### 3.2 Récupérer les clés API

1. Dans le dashboard UploadThing, cliquez sur votre app
2. Allez dans **"API Keys"**
3. Copiez les deux valeurs :
   - `UPLOADTHING_SECRET` (commence par `sk_live_...`)
   - `UPLOADTHING_TOKEN` (commence par `sk_live_...`)

---

## 🚀 Étape 4 : Déployer sur Vercel

### 4.1 Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez "Sign Up"
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repos

### 4.2 Importer le projet

1. Sur le dashboard Vercel, cliquez **"Add New Project"**
2. Cherchez et sélectionnez votre repo `eventshots-pro`
3. Cliquez **"Import"**

### 4.3 Configurer les variables d'environnement

**Avant de déployer**, ajoutez les variables d'environnement :

1. Dans la section **"Environment Variables"**, ajoutez :

```
DATABASE_URL = file:./prisma/prod.db
```

```
JWT_SECRET = [GÉNÉREZ UN SECRET CI-DESSOUS]
```

```
UPLOADTHING_SECRET = sk_live_... [COPIEZ DEPUIS UPLOADTHING]
```

```
UPLOADTHING_TOKEN = sk_live_... [COPIEZ DEPUIS UPLOADTHING]
```

```
NODE_ENV = production
```

**Pour générer JWT_SECRET**, exécutez en local :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.4 Déployer

1. Cliquez **"Deploy"**
2. Attendez 2-3 minutes ⏱️
3. Votre app est live ! 🎉

Vous aurez une URL du type :
```
https://eventshots-pro.vercel.app
```

---

## 👤 Étape 5 : Créer un compte de démonstration

### 5.1 Accéder à votre app

Ouvrez l'URL Vercel dans votre navigateur.

### 5.2 Créer un compte photographe

1. Cliquez sur **"S'inscrire"**
2. Remplissez :
   - Nom : **Sophie Martin**
   - Email : **demo@eventshots.app**
   - Mot de passe : **demo1234**
3. Cliquez **"S'inscrire"**

### 5.3 Créer des événements de démo

1. Créez un événement : **"Mariage Sophie & Marc"**
   - Date : Choisissez une date future
   - Lieu : Aix-en-Provence
   - Description : "Un mariage magique en Provence"

2. Uploadez 5-10 photos de démonstration

3. Répétez pour d'autres types d'événements :
   - Baptême
   - Anniversaire
   - Shooting photo

---

## 🎬 Étape 6 : Préparer votre démo

### 6.1 Scénario de démonstration

**Compte photographe** :
- Email : `demo@eventshots.app`
- Mot de passe : `demo1234`

**Points à montrer** :
1. **Dashboard** : Vue d'ensemble des événements avec cartes visuelles
2. **Création d'événement** : Formulaire simple
3. **Upload de photos** : Drag & drop multiple
4. **Galerie privée** : Design type Instagram
5. **Lien de partage** : Copier et ouvrir en navigation privée
6. **Vue publique** : Galerie accessible aux clients

### 6.2 Script de présentation (2 minutes)

> "EventShot est une plateforme SaaS pour photographes indépendants. Elle permet de :
> 
> 1. **Gérer les événements** : Dashboard visuel avec aperçu des galeries
> 2. **Upload rapide** : Drag & drop de multiples photos à la fois
> 3. **Partage sécurisé** : Un lien unique par événement, protégeable par code
> 4. **Téléchargement HD** : Les clients téléchargent les photos haute qualité
> 
> Stack technique : Next.js 15, React 19, Prisma, TypeScript, TailwindCSS, UploadThing"

---

## 🔄 Mettre à jour l'app

### Après modifications locales

```bash
# 1. Commit les changements
git add .
git commit -m "Description des changements"

# 2. Pusher sur GitHub
git push

# 3. Vercel redéploie automatiquement ! ✨
```

⚠️ **Rappel** : La base de données SQLite sera réinitialisée, recréez les données de démo.

---

## 🐛 Troubleshooting

### La base de données est vide après déploiement

**C'est normal** avec SQLite sur Vercel. Chaque déploiement crée un nouveau conteneur.

**Solution** : Recréez les données de démo manuellement après chaque déploiement.

### Erreur "Prisma Client not found"

```bash
# En local, régénérez le client Prisma
npx prisma generate

# Puis redéployez
git push
```

### Les photos ne s'uploadent pas

1. Vérifiez que `UPLOADTHING_SECRET` et `UPLOADTHING_TOKEN` sont bien configurés dans Vercel
2. Allez dans Vercel → Settings → Environment Variables
3. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs

### Erreur 500 au login

1. Vérifiez que `JWT_SECRET` est bien configuré (minimum 32 caractères)
2. Allez dans Vercel → Settings → Environment Variables
3. Régénérez un nouveau secret si nécessaire

---

## 📊 Monitoring

### Logs en temps réel

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Cliquez sur **"Logs"** dans le menu
4. Filtrez par niveau : Error, Warning, Info

### Analytics

Vercel fournit gratuitement :
- Nombre de visiteurs
- Temps de chargement
- Erreurs runtime
- Consommation de bande passante

---

## 💡 Conseils pour la démo

### Avant chaque présentation

1. ✅ Testez que l'app est accessible
2. ✅ Créez un événement frais avec de belles photos
3. ✅ Testez le lien de partage en navigation privée
4. ✅ Préparez 2-3 événements différents (mariage, baptême, etc.)

### Pendant la démo

1. 🎯 Montrez d'abord le **dashboard** (première impression)
2. 📸 Démontrez l'**upload** (drag & drop impressionne)
3. 🔗 Partagez le **lien public** (ouvrez en incognito)
4. 💼 Expliquez le **cas d'usage** photographe

### Après la démo

Partagez le lien live :
```
https://votre-app.vercel.app
Email démo : demo@eventshots.app
Mot de passe : demo1234
```

---

## 🎓 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://prisma.io/docs)
- [Documentation UploadThing](https://docs.uploadthing.com)

---

## ✨ Améliorations futures (post-démo)

Si vous voulez passer en production réelle :

1. **Migrer vers PostgreSQL** (Vercel Postgres, Supabase, ou Neon)
2. **Ajouter l'authentification OAuth** (Google, GitHub)
3. **Implémenter un système de paiement** (Stripe)
4. **Ajouter des analytics** (Plausible, Posthog)
5. **Configurer un domaine personnalisé** (eventshots.app)

---

**Bon déploiement ! 🚀**

Si vous rencontrez des problèmes, vérifiez d'abord les logs Vercel et les variables d'environnement.
