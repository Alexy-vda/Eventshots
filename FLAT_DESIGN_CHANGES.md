# 🎨 Flat Design UI Modernization

## ✅ Changements appliqués

### 1. **Palette de couleurs** (globals.css + layout.tsx)
- ✅ Fond principal: `#f5f5f5` (gris très clair)
- ✅ Cartes/composants: `#fafafa` et `#ffffff` (nuances de blanc)
- ✅ Texte principal: `#1a1a1a`
- ✅ Texte secondaire: `#666`, `#999`
- ✅ Accent principal: `#6366f1` (indigo moderne)
- ✅ Success: `#22c55e`, Error: `#ef4444`

### 2. **Suppression des ombres et bordures**
- ✅ Toasts: `boxShadow: "none"`, bordure subtile
- ✅ Cards: plus de `shadow-md`, utilisation de `bg-white` sur fond gris
- ✅ Boutons: pas d'ombre, juste changement de couleur au hover

### 3. **Padding réduit sur les boutons**
- ✅ Avant: `px-6 py-3`
- ✅ Après: `px-4 py-2`

### 4. **Suppression des emojis**
- ✅ Dashboard: retiré ➕ du bouton "Créer un événement"
- ✅ Login: retiré 📸, 🙈, 👁️, ✅, ⚠️
- ✅ Upload: retiré ✅, 💡 (gardé ✓ pour la liste car c'est fonctionnel)
- ⚠️  À retirer: 🗑️, 📅, 📍, 📥 (dans event detail et autres pages)

### 5. **Border radius minimal**
- ✅ `rounded-md` (6px) au lieu de `rounded-lg` (12px)
- ✅ Composants plus épurés

## 📋 Fichiers modifiés

1. ✅ `/app/globals.css` - Nouvelle palette flat
2. ✅ `/app/layout.tsx` - Fond + toast sans ombre
3. ✅ `/app/dashboard/page.tsx` - Boutons, cards, couleurs
4. ✅ `/app/login/page.tsx` - Retrait emojis, nouvelles couleurs
5. ✅ `/components/auth/LoginForm.tsx` - Bouton show/hide sans emoji
6. ✅ `/app/dashboard/events/[id]/upload/page.tsx` - Style flat, moins de padding

## 🎯 À faire ensuite

### Pages à moderniser:
- [ ] `/app/dashboard/events/[id]/page.tsx` - Retirer 🗑️, 📅, 📍
- [ ] `/components/PhotoGallery.tsx` - Retirer emojis, flat design
- [ ] `/components/PublicPhotoGallery.tsx` - Retirer 📥
- [ ] `/components/EventList.tsx` - Flat design
- [ ] `/app/dashboard/events/new/page.tsx` - Formulaire flat
- [ ] Navbar/DashboardNav - Si existe

### Composants UI génériques:
- [ ] `/components/ui/Button.tsx` - Moins de padding, flat
- [ ] `/components/ui/Card.tsx` - Sans ombre
- [ ] `/components/ui/Input.tsx` - Fond gris clair

## 🎨 Guidelines du nouveau design

### Hiérarchie visuelle par nuances:
```
- Fond principal: #f5f5f5
- Cards/sections: #fafafa ou #ffffff
- Éléments interactifs: #fafafa hover → #f0f0f0
- Dividers: #f0f0f0
```

### Boutons:
```css
/* Primary */
bg-[#6366f1] hover:bg-[#4f46e5]
px-4 py-2 rounded-md

/* Secondary/Ghost */
bg-[#fafafa] hover:bg-[#f0f0f0]
px-4 py-2 rounded-md
```

### Texte:
```css
/* Titres */ text-[#1a1a1a]
/* Corps */ text-[#666]
/* Muted */ text-[#999]
```

### États:
```css
/* Success */ bg-[#f0fdf4] text-[#22c55e]
/* Error */ bg-[#fef2f2] text-[#ef4444]
/* Info */ bg-[#e0e7ff] text-[#6366f1]
```
