# 🔧 Fix Hydration Error - DashboardNav

## Problème

```
Hydration failed because the server rendered text didn't match the client.
```

**Cause** : Le composant `DashboardNav` lisait `localStorage` avec lazy initialization :

```typescript
const [username, setUsername] = useState<string>(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("username") || "";
  }
  return "";
});
```

**Résultat** :
- 🖥️ **Server** : rend `""` (chaîne vide)
- 💻 **Client** : rend `"alexy.vda"` (depuis localStorage)
- ❌ **Mismatch** : React détecte une différence et déclenche une erreur d'hydratation

---

## Solution : `useSyncExternalStore`

### Pattern React 18+ recommandé

```typescript
import { useSyncExternalStore } from "react";

const username = useSyncExternalStore(
  // subscribe: fonction appelée côté client uniquement
  () => {
    // Pas besoin d'écouter les changements (statique après login)
    return () => {};
  },
  // getSnapshot: valeur côté client
  () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("username") || "";
  },
  // getServerSnapshot: valeur côté serveur (toujours vide)
  () => ""
);
```

### Pourquoi ça fonctionne ?

1. **Server-side** : Utilise `getServerSnapshot()` → retourne `""`
2. **Client-side** : Utilise `getSnapshot()` → retourne `localStorage.getItem("username")`
3. **Hydration** : React sait qu'il y aura une différence et ne déclenche pas d'erreur
4. **Update** : React met à jour le DOM client avec la bonne valeur automatiquement

---

## Comparaison des approches

### ❌ Lazy initialization (ancien)
```typescript
const [username, setUsername] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("username") || "";
  }
  return "";
});
```
**Problème** : Server et client ont des valeurs différentes dès le premier render

### ⚠️ useEffect (alternative)
```typescript
const [username, setUsername] = useState("");

useEffect(() => {
  setUsername(localStorage.getItem("username") || "");
}, []);
```
**Problème** : Cascading renders + double render (SSR → client → useEffect)

### ✅ useSyncExternalStore (recommandé)
```typescript
const username = useSyncExternalStore(
  () => () => {},
  () => localStorage.getItem("username") || "",
  () => ""
);
```
**Avantages** :
- ✅ Hydration-safe par design
- ✅ Pas de double render
- ✅ Pas de warning React
- ✅ Pattern officiel React 18+ pour stores externes

---

## Ressources

- [React Docs - useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
- [Next.js - Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [React 18 - External Stores](https://react.dev/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

---

**Status** : ✅ Résolu avec `useSyncExternalStore`
