# Scentsopedia - Cadrage MVP

## 1. Pitch

Scentsopedia est un carnet olfactif personnel sur iPhone. L'application permet d'enregistrer les parfums decouverts, testes, possedes ou souhaites, puis de garder une trace claire de ses impressions, de ses coups de coeur et de l'evolution de ses gouts.

L'objectif n'est pas de creer une boutique ni un clone de Fragrantica. Scentsopedia doit etre pense comme un repertoire personnel premium : un espace elegant, intime et pratique pour documenter son parcours olfactif.

## 2. Promesse utilisateur

Avec Scentsopedia, l'utilisateur peut :

- Ajouter rapidement un parfum a son carnet.
- Completer une fiche detaillee s'il le souhaite.
- Noter ses impressions personnelles apres un test.
- Classer ses parfums par maison, famille olfactive, notes, saisons et statuts.
- Retrouver facilement un parfum grace a la recherche et aux filtres.
- Gerer une wishlist et des priorites d'achat.
- Visualiser progressivement son profil olfactif.

Tous les champs doivent rester optionnels afin de permettre deux usages :

- un ajout rapide, pour noter une decouverte sans friction ;
- un ajout complet, pour documenter precisement un parfum.

## 3. Positionnement du MVP

Le MVP doit prouver que l'application fonctionne comme un carnet personnel de parfums.

Il doit prioriser :

- la creation d'une fiche parfum ;
- la consultation d'un repertoire ;
- la fiche detail d'un parfum ;
- la wishlist ;
- une premiere lecture simple des preferences utilisateur.

Le MVP ne doit pas chercher a tout faire. Il doit offrir une experience fluide, elegante et coherente, meme avec un nombre limite de fonctionnalites.

## 4. Plateforme et experience

- Application mobile iOS uniquement.
- Format portrait uniquement.
- Interface mobile-first.
- React Native.
- Experience premium, sombre et minimaliste.
- Navigation principale par bottom tab bar.

Direction artistique :

- fond noir / anthracite ;
- texte creme ;
- accents dores ;
- cards visuelles ;
- tags doux et lisibles ;
- composants arrondis ;
- ambiance carnet personnel / parfumerie niche.

## 5. Navigation MVP

La navigation principale contient 5 entrees :

1. Accueil
2. Repertoire
3. Ajouter
4. Wishlist
5. Profil / Statistiques

Le bouton Ajouter peut etre mis en avant au centre de la barre de navigation avec un bouton rond dore.

## 6. Ecrans du MVP

### 6.1 Accueil

Objectif : donner une vue rapide du carnet de l'utilisateur.

Contenu MVP :

- message d'accueil ;
- nombre de parfums enregistres ;
- nombre de parfums en wishlist ;
- nombre de coups de coeur ;
- note moyenne ;
- derniers parfums ajoutes ;
- apercu des coups de coeur ;
- apercu des familles olfactives preferees.

Cet ecran doit rester simple. Il sert de tableau de bord personnel, pas d'ecran analytique complet.

### 6.2 Repertoire

Objectif : consulter et retrouver rapidement les parfums ajoutes.

Contenu MVP :

- titre "Mon repertoire" ;
- barre de recherche ;
- filtres sous forme de chips ;
- grille de cards parfum ;
- acces a la fiche detail.

Filtres MVP :

- maison ;
- famille olfactive ;
- saison ;
- statut ;
- note.

Card parfum :

- image du flacon si disponible ;
- nom ;
- maison ;
- note globale ;
- indicateur favori ;
- tags principaux.

### 6.3 Fiche detail parfum

Objectif : consulter une fiche comme une page de carnet.

Contenu MVP :

- image du parfum ;
- nom ;
- maison ;
- concentration ;
- note globale ;
- tags principaux ;
- section Informations ;
- section Experience ;
- section Suivi ;
- actions Modifier et Ajouter / Retirer de la wishlist.

Sections recommandees :

Informations :

- maison ;
- parfumeur / createur ;
- concentration ;
- famille olfactive ;
- notes olfactives ;
- saison ;
- occasion.

Experience :

- note globale ;
- sillage ;
- tenue ;
- evolution ;
- notes personnelles.

Suivi :

- statut ;
- prix ;
- boutique ;
- date de decouverte ;
- support du test ;
- product URL.

### 6.4 Ajouter un parfum

Objectif : permettre un ajout rapide ou detaille sans rendre le formulaire intimidant.

Le formulaire est decoupe en etapes.

Etapes MVP :

1. Informations generales
2. Profil olfactif
3. Mon experience
4. Usage et suivi
5. Medias

Tous les champs sont optionnels. Cependant, pour eviter des fiches vides, l'application doit soit :

- demander au minimum un nom ;
- soit autoriser l'enregistrement sous le nom automatique "Parfum sans nom".

### 6.5 Wishlist

Objectif : suivre les parfums que l'utilisateur souhaite tester ou acheter.

Contenu MVP :

- liste verticale des parfums en wishlist ;
- filtres par priorite ;
- nom du parfum ;
- maison ;
- prix si renseigne ;
- priorite ;
- indicateur favori.

Priorites :

- basse ;
- moyenne ;
- haute.

### 6.6 Profil / Statistiques

Objectif : donner une premiere lecture des preferences olfactives.

Contenu MVP :

- familles olfactives preferees ;
- notes olfactives les plus presentes ;
- top 5 des parfums les mieux notes ;
- total de parfums ;
- total wishlist ;
- maisons les plus presentes.

Les statistiques doivent rester simples dans le MVP. Elles deviennent plus pertinentes lorsque l'utilisateur a ajoute assez de parfums.

## 7. Champs du formulaire MVP

### 7.1 Informations generales

- Nom du parfum
- Maison
- Parfumeur / createur
- Concentration
- Histoire / inspiration

Concentrations suggerees :

- Eau de Cologne
- Eau de Toilette
- Eau de Parfum
- Extrait de parfum
- Parfum
- Huile
- Autre

### 7.2 Profil olfactif

- Familles olfactives
- Notes olfactives libres
- Notes de tete
- Notes de coeur
- Notes de fond
- Saisons
- Occasions

Familles olfactives suggerees :

- Gourmand
- Floral
- Boise
- Ambre
- Epice
- Frais
- Aromatique
- Cuir
- Musque
- Autres

Saisons :

- Printemps
- Ete
- Automne
- Hiver

Occasions :

- quotidien ;
- bureau ;
- soiree ;
- rendez-vous ;
- occasion elegante ;
- signature ;
- vacances ;
- temps froid ;
- temps chaud.

### 7.3 Mon experience

- Note globale
- Sillage
- Tenue
- Evolution du parfum
- Notes personnelles

Sillage :

- discret ;
- modere ;
- present ;
- puissant ;
- tres puissant.

Tenue :

- faible, moins de 3h ;
- moyenne, 3h a 5h ;
- bonne, 5h a 7h ;
- tres longue, plus de 9h.

Evolution :

- ouverture ;
- apres 30 minutes ;
- fond / drydown.

### 7.4 Usage et suivi

- Statut principal
- Favori
- Wishlist
- Priorite wishlist
- Prix
- Format en ml
- Prix pour 100 ml, calcule automatiquement
- Boutique
- Date de decouverte
- Support du test
- Product URL

Statuts principaux recommandes :

- a tester ;
- teste ;
- a retester ;
- possede ;
- achat prevu ;
- decevant ;
- trop cher.

Il est recommande de separer certains concepts :

- `mainStatus` pour le statut principal ;
- `isFavorite` pour le coup de coeur ;
- `isWishlist` pour la wishlist ;
- `wishlistPriority` pour la priorite d'achat.

Cela evite les contradictions comme un parfum a la fois "possede", "wishlist" et "decevant" dans un seul champ difficile a interpreter.

Le champ `pricePer100ml` ne doit pas etre saisi manuellement. Il est calcule automatiquement avec la formule :

```txt
(price / formatMl) * 100
```

Support du test :

- peau ;
- mouillette ;
- echantillon ;
- decant ;
- flacon ;
- autre.

### 7.5 Medias

- Photo du flacon
- Image importee depuis la galerie
- Image par URL, optionnelle

Pour le MVP, une seule image par parfum suffit.

## 8. Modele de donnees recommande

```ts
export type PerfumeMainStatus =
  | "to_test"
  | "tested"
  | "to_retry"
  | "owned"
  | "planned_purchase"
  | "disappointing"
  | "too_expensive";

export type WishlistPriority = "low" | "medium" | "high";

export type Perfume = {
  id: string;

  name?: string;
  house?: string;
  perfumer?: string;
  inspiration?: string;
  concentration?: string;

  olfactoryFamilies?: string[];
  notes?: string[];
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  seasons?: string[];
  occasions?: string[];

  rating?: number;
  sillage?: string;
  longevity?: string;
  evolution?: {
    opening?: string;
    after30min?: string;
    drydown?: string;
  };
  personalNotes?: string;

  mainStatus?: PerfumeMainStatus;
  isFavorite?: boolean;
  isWishlist?: boolean;
  wishlistPriority?: WishlistPriority;

  price?: number;
  formatMl?: number;
  pricePer100ml?: number;
  productUrl?: string;
  shop?: string;
  discoveredAt?: string;
  testedOn?: string;

  imageUri?: string;

  createdAt: string;
  updatedAt: string;
};
```

## 9. Donnee d'exemple

```ts
const examplePerfume: Perfume = {
  id: "1",
  name: "Tubereuse Astrale",
  house: "Maison Crivelli",
  perfumer: "Jordi Fernandez",
  concentration: "Extrait de parfum",
  olfactoryFamilies: ["Gourmand", "Floral"],
  notes: ["Tubereuse", "Cannelle", "Musc", "Vanille"],
  topNotes: ["Cannelle"],
  heartNotes: ["Tubereuse"],
  baseNotes: ["Musc", "Vanille"],
  seasons: ["Automne", "Hiver"],
  occasions: ["Occasion elegante", "Signature"],
  rating: 9,
  sillage: "puissant",
  longevity: "tres_longue",
  evolution: {
    opening: "Ouverture florale intense et epicee.",
    after30min: "Le cote gourmand devient plus present.",
    drydown: "Fond chaud, vanille et musc."
  },
  personalNotes:
    "Une belle ouverture fleurs blanches, dominee ensuite par une facette gourmande et enveloppante.",
  mainStatus: "tested",
  isFavorite: true,
  isWishlist: true,
  wishlistPriority: "high",
  price: 200,
  formatMl: 50,
  pricePer100ml: 400,
  shop: "Galeries Lafayette",
  productUrl: "https://www.fragrantica.fr/...",
  discoveredAt: "2026-06-24",
  testedOn: "peau",
  imageUri: "local-or-remote-image-uri",
  createdAt: "2026-06-24T00:00:00.000Z",
  updatedAt: "2026-06-24T00:00:00.000Z"
};
```

## 10. Hors scope du MVP

Ces fonctionnalites peuvent etre gardees pour une version ulterieure :

- compte utilisateur en ligne ;
- synchronisation cloud ;
- partage public de fiches ;
- commentaires d'autres utilisateurs ;
- comparaison avancee entre parfums ;
- moteur de recommandation ;
- scraping automatique de Fragrantica ;
- scanner de code-barres ;
- achat direct depuis l'application ;
- plusieurs collections / carnets ;
- statistiques avancees.

## 11. Priorites de developpement

### Priorite 1

- Structure de navigation mobile.
- Repertoire des parfums.
- Creation d'une fiche parfum.
- Fiche detail.
- Stockage local ou backend simple.

### Priorite 2

- Wishlist.
- Favoris.
- Recherche.
- Filtres principaux.

### Priorite 3

- Statistiques simples.
- Ajout d'image.
- Edition d'une fiche.
- Etats vides soignes.

## 12. Criteres de validation du MVP

Le MVP est considere comme valide si :

- l'utilisateur peut ajouter un parfum avec peu ou beaucoup d'informations ;
- le parfum apparait dans le repertoire ;
- l'utilisateur peut ouvrir une fiche detail ;
- l'utilisateur peut marquer un parfum comme favori ;
- l'utilisateur peut ajouter un parfum a la wishlist ;
- les principaux filtres permettent de retrouver un parfum ;
- les statistiques affichent au moins les familles et notes les plus presentes ;
- l'interface reste lisible, elegante et coherente sur iPhone.

## 13. Phrase de presentation courte

Scentsopedia est une application mobile qui vous guide vers la decouverte de parfums, se proposant comme un carnet personnel : on y enregistre ses essais, ses impressions, ses coups de coeur et sa wishlist pour mieux comprendre son profil olfactif au fil du temps.
