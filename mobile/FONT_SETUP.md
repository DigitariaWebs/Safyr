# Configuration de la police Montserrat

La police Montserrat est configurée et chargée pour être utilisée dans toute l'application.

## Configuration actuelle

- ✅ **Polices chargées** : Les fichiers de police Montserrat sont chargés depuis `assets/fonts/` via `expo-font` dans `_layout.tsx`
- ✅ **CSS global** : Montserrat est chargée depuis Google Fonts pour le web via `global.css`
- ✅ **Tailwind** : Configuré avec Montserrat comme police par défaut
- ✅ **Composant Text personnalisé** : Créé dans `components/ui/text.tsx` avec mapping automatique des font weights
- ✅ **Composant Input** : Configuré pour utiliser Montserrat
- ✅ **Typography** : Configurée avec Montserrat

## Polices chargées

Les polices suivantes sont chargées depuis `assets/fonts/` :
- `Montserrat-Regular` (400)
- `Montserrat-Medium` (500)
- `Montserrat-SemiBold` (600)
- `Montserrat-Bold` (700)

## Utilisation

### Dans les composants React Native

Le composant Text personnalisé détecte automatiquement le `fontWeight` et utilise la bonne variante de Montserrat :

```tsx
import { Text } from "@/components/ui";

<Text style={{ fontWeight: "600" }}>Texte en SemiBold</Text>
<Text style={{ fontWeight: "bold" }}>Texte en Bold</Text>
```

### Helper disponible

Un helper est disponible dans `src/utils/fonts.ts` :

```tsx
import { getMontserratFont } from "@/utils/fonts";

const fontFamily = getMontserratFont("600"); // Retourne "Montserrat-SemiBold"
```

## Notes

- Les polices sont chargées au démarrage de l'application
- Le splash screen reste visible pendant le chargement des polices
- Sur le web, Montserrat est chargée depuis Google Fonts
- Sur mobile, les polices locales sont utilisées
