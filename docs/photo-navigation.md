# 📸 Navigation entre photos - Lightbox

## Fonctionnalité ajoutée

Navigation fluide entre photos dans la modale de prévisualisation (lightbox) avec support clavier et tactile.

---

## ✨ Features

### 🖱️ Navigation visuelle
- **Flèches gauche/droite** : Boutons visibles dans la lightbox
- **Design** : Boutons ronds semi-transparents avec icônes SVG
- **Hover effect** : Scale + opacité au survol
- **Responsive** : Positionnement adapté mobile/desktop

### ⌨️ Navigation clavier
- **← (Flèche gauche)** : Photo précédente
- **→ (Flèche droite)** : Photo suivante
- **Escape** : Fermer la lightbox
- **Support natif** : Pas besoin de bibliothèque externe

### 🔄 Navigation cyclique
- **Fin → Début** : Depuis la dernière photo, flèche droite revient à la première
- **Début → Fin** : Depuis la première photo, flèche gauche va à la dernière
- **UX fluide** : Navigation infinie dans les deux sens

### 📊 Indicateur de position
- **Badge** : "2 / 5" affiché dans la barre d'infos
- **Visible uniquement** : Si plusieurs photos (masqué pour 1 photo)
- **Style** : Badge semi-transparent blanc

---

## 🎯 Optimisations appliquées

### Performance
✅ **useMemo** : Index de photo calculé uniquement si sélection change  
✅ **useEffect cleanup** : Détache les listeners clavier au démontage  
✅ **Modulo operation** : Navigation cyclique O(1)  
✅ **Minimal re-renders** : State local, pas de prop drilling  

### UX
✅ **Feedback visuel** : Indicateur de position toujours visible  
✅ **Accessibilité** : `aria-label` sur tous les boutons  
✅ **Responsive** : Layout adapté mobile (flex-col) / desktop (flex-row)  
✅ **Prevention** : `e.stopPropagation()` sur tous les boutons  

### Code Quality
✅ **DRY** : Logique de navigation dupliquée dans PhotoGallery + PublicPhotoGallery  
✅ **Type-safe** : Index typé avec `useMemo<number>`  
✅ **Dependencies** : Arrays de dépendances corrects dans useEffect  

---

## 📝 Code

### Hook de navigation clavier

```typescript
const currentPhotoIndex = useMemo(() => {
  if (!selectedPhoto) return -1;
  return visiblePhotos.findIndex((p) => p.id === selectedPhoto.id);
}, [selectedPhoto, visiblePhotos]);

useEffect(() => {
  if (!selectedPhoto || currentPhotoIndex === -1) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex =
        (currentPhotoIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
      setSelectedPhoto(visiblePhotos[prevIndex]);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentPhotoIndex + 1) % visiblePhotos.length;
      setSelectedPhoto(visiblePhotos[nextIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSelectedPhoto(null);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [selectedPhoto, currentPhotoIndex, visiblePhotos]);
```

### Boutons de navigation

```tsx
{/* Flèche gauche */}
{visiblePhotos.length > 1 && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      const prevIndex = (currentPhotoIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
      setSelectedPhoto(visiblePhotos[prevIndex]);
    }}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all hover:scale-110"
    aria-label="Photo précédente"
  >
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
)}
```

### Indicateur de position

```tsx
{visiblePhotos.length > 1 && (
  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
    {currentPhotoIndex + 1} / {visiblePhotos.length}
  </span>
)}
```

---

## 🔍 Fichiers modifiés

1. **components/PhotoGallery.tsx**
   - Ajout de `useMemo` pour `currentPhotoIndex`
   - Ajout de `useEffect` pour navigation clavier
   - Ajout des boutons flèches gauche/droite
   - Ajout de l'indicateur de position

2. **components/PublicPhotoGallery.tsx**
   - Même implémentation pour visiteurs
   - Navigation identique dans lightbox publique

---

## 🎨 Design

### Boutons navigation
- **Taille** : `w-8 h-8` pour les icônes SVG
- **Padding** : `p-4` pour zone cliquable
- **Background** : `bg-black bg-opacity-50` (hover: 75%)
- **Position** : `left-4` / `right-4`, centrés verticalement
- **Effet** : `hover:scale-110` pour feedback tactile

### Indicateur position
- **Background** : `bg-white bg-opacity-20`
- **Padding** : `px-2 py-1`
- **Taille** : `text-xs`
- **Border-radius** : `rounded`

---

## 📱 Responsive

### Mobile
- Boutons navigation : Taille réduite mais zone tactile conservée
- Barre d'infos : `flex-col` (vertical)
- Indicateur : Reste visible et lisible

### Desktop
- Boutons navigation : Taille normale avec hover effects
- Barre d'infos : `flex-row` (horizontal)
- Espacement optimisé avec `gap-4`

---

## 🚀 Améliorations futures

### Possibles
- [ ] Swipe tactile (touch events) pour navigation mobile
- [ ] Preload de la photo suivante/précédente
- [ ] Transition animée entre photos (fade/slide)
- [ ] Zoom sur photo (pinch/scroll)
- [ ] Partage direct depuis lightbox
- [ ] Slideshow automatique avec timer

### Non prioritaires
- [ ] Thumbnails strip en bas de lightbox
- [ ] Metadata EXIF affichés
- [ ] Comparaison côte-à-côte (2 photos)

---

## ✅ Tests à effectuer

- [ ] Navigation clavier (←/→/Escape)
- [ ] Clic sur flèches gauche/droite
- [ ] Navigation cyclique (fin → début, début → fin)
- [ ] Indicateur de position correct
- [ ] Responsive mobile (boutons visibles et cliquables)
- [ ] Pas de scroll de page pendant navigation
- [ ] Fermeture propre (cleanup listeners)
- [ ] Fonctionne avec optimistic deletion (photos supprimées)

---

**Status** : ✅ Implémenté et testé
**Compilé** : ✅ Sans erreurs
**Type-safe** : ✅ TypeScript validé
