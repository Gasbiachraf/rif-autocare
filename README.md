# Rif AutoCare — Concept Demo

Site de démonstration Innovatechs (portfolio, concept n°12) : garage mécanique et detailing automobile à Al Hoceima.
Marque, adresse, prix et réalisations **fictifs ou illustratifs** — ce n'est pas le site d'un garage réel.

## Parcours principal

Accueil (« Devis express » dans le hero) ou `/services` (8 onglets, `?cat=` dans l'URL) ou pack detailing → demande de devis `/devis` en 4 étapes courtes :

1. services cochés (multi-sélection, pré-remplis via `?service=`, `?pack=` ou `?cat=`) ;
2. véhicule : marque, modèle, année, kilométrage, carburant ;
3. description du problème (obligatoire pour la mécanique, facultative pour le detailing), photo optionnelle (JPG/PNG/WebP/HEIC, 5 Mo max., vérifiée et prévisualisée), créneau ;
4. nom, téléphone, consentement (loi 09-08).

→ récapitulatif « ceci est une demande » → message WhatsApp pré-rempli (services, véhicule, problème). Site statique : la photo n'est pas téléversée, l'utilisateur la joint dans la conversation WhatsApp.

`/realisations` : galerie filtrable (`?cat=`), slider avant/après accessible au clavier (l'état « avant » est une simulation signalée), lightbox (`<dialog>`, flèches, Échap).

## Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS 4 · React Router 7 · Vitest. Site statique, déployé sur Vercel.

- Langues : français (défaut), arabe (RTL), anglais — préfixe d'URL `/fr`, `/ar`, `/en`.
- Textes : `src/i18n/*.ts` (typés : une traduction manquante fait échouer le build) · services, packs, galerie : `src/data/services.ts`.
- `VITE_WHATSAPP_NUMBER` : numéro WhatsApp (défaut : ligne Innovatechs).
- `VITE_PHONE_NUMBER` : facultatif. Vide → aucun bouton « Appeler » n'est affiché.

## Commandes

```bash
npm install
npm run dev      # développement
npm test         # tests (validation par étape, photo, pré-sélection, message WhatsApp, règles de contenu)
npm run build    # build de production dans dist/
```

## Mentions

Aucun prix ferme (tous « à partir de / indicatif » ou « sur devis »), aucune garantie constructeur, aucun logo de marque automobile ni partenariat, aucun avis client.
Photos : Unsplash (licence Unsplash), choisies et recadrées pour ne montrer aucun logo de marque.
# rif-autocare
