# 🚀 EventShots Pro - Roadmap de développement

## 📋 Vue d'ensemble
Projet : Plateforme pour photographes - Upload et partage de photos d'événements

---

## 🎯 Phase 1 : Authentification & Utilisateurs

### Setup Base de données

- [x] Installer Prisma et dépendances
- [x] Configurer Prisma avec SQLite
- [x] Créer le schéma User
- [x] Générer et exécuter la première migration
- [x] Tester la connexion à la DB

### Système d'inscription

- [x] Créer la page `/register`
- [x] Créer le composant `RegisterForm`
- [x] Créer l'API `/api/auth/register` (POST)
- [x] Hasher les mots de passe avec bcrypt
- [x] Valider les données avec Zod
- [x] Gérer les erreurs (email déjà utilisé, etc.)

### Amélioration du login

- [x] Modifier l'API `/api/login` pour utiliser la DB
- [x] Vérifier le password hashé avec bcrypt
- [x] Améliorer la gestion d'erreurs
- [x] Tester le flow complet login

### Sécurisation

- [x] Améliorer `lib/auth.ts` (vérification JWT_SECRET)
- [x] Ajouter validation du payload JWT
- [x] Créer types TypeScript pour les tokens
- [x] Documenter les variables d'environnement (.env.example)

---

## 🎪 Phase 2 : Gestion des Événements

### Modèle de données
- [x] Créer le schéma Event dans Prisma
- [x] Ajouter relation User -> Events
- [x] Exécuter la migration
- [x] Créer types TypeScript

### Création d'événement
- [x] Créer la page `/dashboard/events/new`
- [x] Créer le composant `EventForm`
- [x] Créer l'API `/api/events` (POST)
- [x] Générer un slug unique
- [x] Générer un lien de partage unique
- [x] Rediriger vers le dashboard après création

### Liste des événements
- [x] Modifier `/dashboard` pour afficher les événements de l'utilisateur
- [x] Créer le composant `EventCard`
- [x] Afficher nombre de photos par événement
- [x] Ajouter lien vers détail événement

### Détail et édition
- [x] Créer la page `/dashboard/events/[id]`
- [x] Afficher les infos de l'événement
- [x] Créer la page `/dashboard/events/[id]/edit`
- [x] Créer l'API `/api/events/[id]` (PATCH)
- [x] Implémenter la modification

### Suppression
- [x] Créer l'API `/api/events/[id]` (DELETE)
- [ ] Ajouter bouton de suppression
- [ ] Ajouter confirmation avant suppression
- [ ] Gérer la cascade (supprimer les photos associées)

### Lien visiteur
- [x] Afficher le lien de partage dans le détail
- [x] Bouton copier le lien
- [x] Créer la page publique `/e/[shareLink]`
- [x] Afficher les infos de l'événement (sans auth)

---

## 📸 Phase 3 : Gestion des Images

### Modèle de données
- [ ] Créer le schéma Photo dans Prisma
- [ ] Ajouter relation Event -> Photos
- [ ] Exécuter la migration
- [ ] Créer types TypeScript

### Setup stockage
- [ ] Choisir solution stockage (Uploadthing / Cloudinary)
- [ ] Installer les dépendances
- [ ] Configurer les clés API
- [ ] Tester l'upload simple

### Upload d'images
- [ ] Créer la page `/dashboard/events/[id]/upload`
- [ ] Créer le composant `UploadZone` (drag & drop)
- [ ] Créer l'API `/api/photos/upload` (POST)
- [ ] Implémenter upload vers le stockage
- [ ] Sauvegarder les métadonnées en DB
- [ ] Afficher progress bar
- [ ] Gérer upload multiple

### Optimisation images
- [ ] Générer des thumbnails automatiquement
- [ ] Compresser les images si trop lourdes
- [ ] Afficher la taille des fichiers
- [ ] Limite de taille par fichier (ex: 10MB)

### Galerie photographe
- [ ] Afficher les photos dans `/dashboard/events/[id]`
- [ ] Créer le composant `PhotoGrid`
- [ ] Lazy loading des images
- [ ] Modal fullscreen pour voir photo
- [ ] Bouton suppression de photo
- [ ] API `/api/photos/[id]` (DELETE)

### Galerie publique (visiteurs)
- [ ] Afficher les photos dans `/e/[shareLink]`
- [ ] Grid responsive
- [ ] Modal preview
- [ ] Bouton téléchargement par photo
- [ ] Bouton télécharger tout (zip)

### Téléchargement
- [ ] Créer l'API `/api/photos/[id]/download`
- [ ] Stream le fichier haute qualité
- [ ] Incrémenter compteur de téléchargements
- [ ] Gérer les headers de cache
- [ ] (Optionnel) Générer ZIP pour téléchargement multiple

---

## 🏠 Phase 4 : Landing Page

### Contenu
- [ ] Rédiger le texte de présentation
- [ ] Définir les sections (Hero, Features, CTA)
- [ ] Trouver/créer les images illustratives
- [ ] Ajouter témoignages (fake pour démo)

### Implémentation
- [ ] Refaire complètement `/app/page.tsx`
- [ ] Section Hero avec CTA
- [ ] Section Features (3-4 avantages)
- [ ] Section "Comment ça marche"
- [ ] Footer avec liens
- [ ] Lien vers inscription

---

## 🎨 Phase 5 : UI/UX & Polish

### Design system
- [ ] Définir palette de couleurs
- [ ] Choisir typographie
- [ ] Créer composants réutilisables (Button, Card, Input)
- [ ] Unifier les espacements

### Navigation
- [ ] Créer composant `Navbar`
- [ ] Menu photographe (Dashboard, Événements, Profil)
- [ ] Responsive mobile
- [ ] Bouton logout visible

### Pages
- [ ] Améliorer style page login
- [ ] Améliorer style page register
- [ ] Améliorer style dashboard
- [ ] Améliorer style création événement
- [ ] Améliorer style galerie publique
- [ ] Améliorer style upload

### Feedback utilisateur
- [ ] Toast notifications (succès, erreur)
- [ ] Loading states partout
- [ ] États vides (pas d'événements, pas de photos)
- [ ] Messages d'erreur clairs
- [ ] Skeleton loaders

### Responsive
- [ ] Tester mobile (320px - 768px)
- [ ] Tester tablette (768px - 1024px)
- [ ] Tester desktop (1024px+)
- [ ] Ajuster grids et layouts

---

## 📚 Phase 6 : Documentation & Finitions

### Documentation
- [ ] Réécrire `README.md` complet
- [ ] Documenter l'architecture
- [ ] Créer `.env.example`
- [ ] Ajouter instructions de setup
- [ ] Documenter les API routes

### Tests
- [ ] Test unitaire : hash password
- [ ] Test unitaire : JWT sign/verify
- [ ] Test API : register
- [ ] Test API : login
- [ ] Test API : création événement

### Optimisations
- [ ] Vérifier les erreurs ESLint
- [ ] Optimiser les images (next/image)
- [ ] Ajouter meta tags SEO
- [ ] Tester performance Lighthouse

### Déploiement
- [ ] Setup Vercel
- [ ] Configurer variables d'environnement
- [ ] Setup base de données production (Vercel Postgres / Neon)
- [ ] Premier déploiement
- [ ] Tester en production

---

## 🎯 Checklist finale avant présentation

- [ ] Toutes les fonctionnalités marchent
- [ ] Aucune erreur dans la console
- [ ] README professionnel
- [ ] .env.example présent
- [ ] Code propre et commenté
- [ ] TypeScript sans erreurs
- [ ] Responsive sur mobile
- [ ] Déployé et accessible en ligne

---

## 📊 Progression

**Phase 1** : ✅✅✅✅✅ 15/15 (Complété !)
**Phase 2** : ✅✅✅✅⬜ 18/22 (82% complété)
**Phase 3** : ⬜⬜⬜⬜⬜ 0/20  
**Phase 4** : ⬜⬜⬜⬜⬜ 0/6  
**Phase 5** : ⬜⬜⬜⬜⬜ 0/15  
**Phase 6** : ⬜⬜⬜⬜⬜ 0/14  

**Total** : 33/92 tâches (36% complété)

---

*Dernière mise à jour : 23 octobre 2025*
