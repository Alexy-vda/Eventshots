# 🎨 Design System EventShot - Palette Chaleureuse

## 🎯 Vision

Transition d'un design froid (bleu/violet) vers une esthétique **chaleureuse et professionnelle** avec des tons terreux, serif/sans-serif mixé, et coins moins arrondis.

---

## 🎨 Palette de couleurs

### Couleurs principales

| Nom | Hex | Usage | Exemple |
|-----|-----|-------|---------|
| **Cream** | `#f4f1de` | Background principal | Fond de page |
| **Terracotta** | `#e07a5f` | Primary (CTA, actions) | Boutons principaux |
| **Navy** | `#3d405b` | Texte principal | Titres, paragraphes |
| **Sage** | `#81b29a` | Secondary (success, accent) | Boutons secondaires, success |
| **Gold** | `#f2cc8f` | Accent (highlights) | Badges, hover states |

### Variations

```css
/* Terracotta */
--primary: #e07a5f
--primary-light: #e89580
--primary-dark: #d35f44

/* Sage */
--secondary: #81b29a
--secondary-light: #9bc4af
--secondary-dark: #6a9e85

/* Gold */
--accent: #f2cc8f
--accent-light: #f5d7a5
--accent-dark: #efc179
```

---

## ✍️ Typographies

### Famille de polices

1. **Playfair Display** (Serif)
   - Usage : H1, H2, H3, logo
   - Weights : 400, 700
   - Variable : `--font-playfair`

2. **Inter** (Sans-serif)
   - Usage : Body, H4-H6, UI
   - Weights : 400, 600
   - Variable : `--font-inter`

### Hiérarchie

```tsx
// Titres (Serif)
<h1 className="font-serif text-4xl md:text-7xl font-bold text-navy">
<h2 className="font-serif text-2xl md:text-5xl font-bold text-navy">
<h3 className="font-serif text-xl md:text-2xl font-bold text-navy">

// Sous-titres (Sans-serif)
<h4 className="font-sans text-lg font-semibold text-navy">
<p className="text-base text-navy/70">
```

---

## 🔲 Border Radius

### Anciens vs Nouveaux

| Classe | Ancien | Nouveau | Différence |
|--------|--------|---------|------------|
| `rounded-sm` | 8px | **6px** | -2px |
| `rounded` / `rounded-md` | 12px | **8px** | -4px |
| `rounded-lg` | 16px | **12px** | -4px |
| `rounded-xl` | 24px | **16px** | -8px |
| `rounded-2xl` | - | **20px** | Pour boutons (ex rounded-full) |

### Usage

```tsx
// Cards
<Card className="rounded-lg border-2 border-sage/20">

// Buttons
<button className="rounded-lg"> {/* 12px */}

// Delete button (moins rond)
<button className="rounded-2xl"> {/* 20px au lieu de full */}

// Inputs
<input className="rounded-lg border-2">
```

---

## 🎭 Composants UI

### Button

**Variants** :
- `primary` : Terracotta (#e07a5f)
- `secondary` : Sage (#81b29a)
- `danger` : Terracotta/80
- `ghost` : Navy avec hover Gold/20

**Code** :
```tsx
<Button variant="primary" size="lg">
  Se connecter
</Button>

// Classes
"bg-terracotta text-white hover:bg-terracotta/90 hover:scale-[1.02]"
```

### Input

**État normal** :
```tsx
<Input 
  label="Email" 
  className="border-2 border-sage/30 focus:ring-terracotta"
/>
```

**État erreur** :
```tsx
// border-terracotta/50 focus:ring-terracotta
// text-terracotta pour message d'erreur
```

### Card

**Base** :
```tsx
<Card className="rounded-lg border-2 border-sage/20 shadow-lg">
  <CardHeader>...</CardHeader>
  <CardBody>...</CardBody>
</Card>
```

**Hover** :
```tsx
<Card hover className="...hover:border-sage/50">
```

---

## 🖼️ Pages principales

### Landing Page (`app/page.tsx`)

**Hero** :
- Background : `bg-linear-to-br from-navy via-sage to-terracotta`
- Titre : `font-serif text-navy` (over white wave)
- CTA : `bg-terracotta` + `bg-sage/30` (ghost)

**Features** :
- Cards : `bg-cream/50 border-2 border-sage/20`
- Hover : `hover:border-sage/40 hover:shadow-xl`

**Steps** :
- Badges : `bg-sage/20 border-2 border-sage rounded-2xl`
- Numéros : Terracotta, Gold, Sage

**CTA Section** :
- Background : `bg-linear-to-r from-terracotta to-sage`

**Footer** :
- Background : `bg-navy text-cream/80`
- Hover links : `hover:text-gold`

### Login/Register (`app/login/page.tsx`)

**Background** :
```tsx
bg-linear-to-br from-cream via-gold/20 to-sage/10
```

**Card** :
```tsx
<Card className="bg-white border-2 border-sage/20">
  <h2 className="font-serif text-navy">Connexion</h2>
</Card>
```

**Success message** :
```tsx
bg-sage/10 border-2 border-sage/40 text-sage
```

### Dashboard Nav (`components/layout/DashboardNav.tsx`)

**Nav** :
```tsx
bg-white/95 border-b-2 border-sage/20 backdrop-blur-lg
```

**Logo** :
```tsx
font-serif text-navy hover:text-terracotta
```

**User Dropdown** :
```tsx
bg-gold/10 hover:bg-gold/20 border-2 border-sage/20
focus:ring-terracotta/50 focus:border-terracotta
```

**Dropdown Menu** :
```tsx
border-2 border-sage/30
border-b-2 border-gold/30 (séparateur)
```

---

## 📸 Photo Gallery

### Grid

**Item placeholder** :
```tsx
bg-linear-to-br from-cream to-gold/30 
border-2 border-sage/10
```

**Hover overlay** :
```tsx
bg-navy bg-opacity-70 px-4 py-2 rounded-lg
```

### Delete button

**Mobile** (toujours visible) :
```tsx
bg-terracotta hover:bg-terracotta/90
rounded-2xl  // Moins rond que full
opacity-100
```

**Desktop** (hover only) :
```tsx
md:opacity-0 md:group-hover:opacity-100
```

### Toast notifications

```tsx
// Success
bg-sage text-white

// Error
bg-terracotta text-white
```

### Modal suppression

**Overlay** :
```tsx
bg-navy/50 backdrop-blur-sm
```

**Card** :
```tsx
bg-white border-2 border-terracotta/20
```

**Buttons** :
```tsx
// Annuler
border-2 border-sage/30 hover:bg-sage/10

// Supprimer
bg-terracotta hover:bg-terracotta/90
```

---

## 🎯 États interactifs

### Hover

```css
/* Buttons */
hover:bg-terracotta/90
hover:scale-[1.02]

/* Links */
hover:text-terracotta
hover:text-gold

/* Cards */
hover:border-sage/40
hover:shadow-xl
```

### Focus

```css
/* Inputs */
focus:ring-2 focus:ring-terracotta
focus:border-terracotta

/* Buttons */
focus:ring-2 focus:ring-terracotta/50
focus:ring-offset-2
```

### Disabled

```css
/* Buttons */
disabled:bg-terracotta/40
disabled:opacity-50
disabled:cursor-not-allowed
```

---

## 🌈 Gradients

### Linéaires

```tsx
// Hero
bg-linear-to-br from-navy via-sage to-terracotta

// Landing sections
bg-linear-to-r from-terracotta to-sage

// Backgrounds
bg-linear-to-br from-cream via-gold/20 to-sage/10

// Placeholders
bg-linear-to-br from-cream to-gold/30
```

---

## 📐 Spacing & Sizing

### Espacement

```tsx
// Cards
p-6 sm:p-8

// Sections
py-16 sm:py-20 md:py-32

// Gaps
gap-3 sm:gap-4
space-y-4 sm:space-y-6
```

### Borders

```tsx
// Subtle
border-2 border-sage/20

// Accent
border-2 border-terracotta/30

// Strong
border-2 border-sage/40
```

---

## ✅ Checklist migration

- [x] `globals.css` : Variables CSS + theme
- [x] `tailwind.config.ts` : Couleurs + radius
- [x] `layout.tsx` : Fonts (Inter + Playfair Display)
- [x] `Button.tsx` : Variants avec nouvelle palette
- [x] `Input.tsx` : Borders + focus colors
- [x] `Card.tsx` : Borders + rounded
- [x] `LoginForm.tsx` : Inputs + buttons
- [x] `DashboardNav.tsx` : Nav + dropdown
- [x] `app/page.tsx` : Hero + sections
- [x] `app/login/page.tsx` : Background + card
- [x] `PhotoGallery.tsx` : Grid + modals + toasts
- [ ] `PublicPhotoGallery.tsx` : À harmoniser
- [ ] Dashboard pages : À harmoniser
- [ ] Event pages : À harmoniser

---

## 🎨 Inspiration

**Mood** : Chaleureux, professionnel, terreux  
**Références** : Céramique, photographie argentique, ateliers d'artistes  
**Typographie** : Contraste serif/sans-serif = élégance + modernité  
**Couleurs** : Palette naturelle inspirée du sud de la France

---

## 📝 Notes d'implémentation

### Tailwind config

Les couleurs sont définies dans `tailwind.config.ts` :
```ts
colors: {
  cream: "#f4f1de",
  terracotta: "#e07a5f",
  navy: "#3d405b",
  sage: "#81b29a",
  gold: "#f2cc8f",
  primary: { DEFAULT: "#e07a5f", ... },
  secondary: { DEFAULT: "#81b29a", ... },
}
```

### CSS Variables

Dans `globals.css` :
```css
:root {
  --cream: #f4f1de;
  --terracotta: #e07a5f;
  --navy: #3d405b;
  --sage: #81b29a;
  --gold: #f2cc8f;
}
```

### Fonts loading

```tsx
const inter = Inter({ variable: "--font-inter", ... });
const playfair = Playfair_Display({ variable: "--font-playfair", ... });
```

---

**Version** : 1.0  
**Date** : Octobre 2024  
**Status** : ✅ Core design system implémenté
