# Reprise de la direction artistique de l'accueil — 10 novembre 2026

## Réalisé

- Navigation à 16 px sur grand écran, logo et CTA rééquilibrés. Le bouton de don est nommé « Donar » ; découvrir la fondation, proposer une participation et donner ont des liens distincts.
- Accueil recomposé : présentation factuelle de la fondation et des personnes accompagnées ; trois programmes illustrés et un axe communautaire explicite ; un reportage principal et deux récits secondaires ; documentation datée ; participation ; coordonnées directes.
- Suppression des numéros décoratifs, des flèches systématiques, des grands titres en italique et des slogans répétés sur l'accueil. Pied de page simplifié.
- Textes fondés sur les actions documentées : lecture et émotions à Fraternidad sin Fronteras le 19 mai 2023, lecture à Yolia le 23 avril 2023, mandalas à Cuajimalpa le 25 août 2023. Ces dates proviennent des récits existants, pas du nom des fichiers.
- Couvertures de l'accueil choisies parmi des originaux de 768 à 2 560 px de largeur. Proportions communes en 16:9 pour les couvertures, positions de cadrage explicites et dimensions de génération limitées à la définition de la source. Le portrait de participation garde son format distinct et ses visages.
- Les images de 383 px, collages, documents et photos non sélectionnées sont conservés dans leurs reportages et la galerie. Les cartes d'archives sans couverture photographique validée présentent un récit typographique plutôt qu'un collage agrandi.
- Trois vrais documents sont accessibles directement : constance UIC du 20 mars 2025, formation Bienestar du 4 avril 2024, acuse SAT signé le 9 août 2023. Aucun statut fiscal actuel n'est déduit de ces documents.
- Formulations concernant la migration ou la fabrication du site retirées des textes visiteurs concernés, y compris les archives et le parcours de don. Aucun compteur, témoignage ou partenariat inventé.
- Les collections importées, les routes d'activités, les paramètres Give, les coordonnées mailto/tel, la galerie React, les filtres et les règles SEO sont conservés.

## Hero demandé : référence manquante

Le hero avec le groupe de jeunes n'a pas été retrouvé dans les commits disponibles, les branches, les reflogs, les fichiers/archives inspectés ou les déploiements précédents du projet. Le premier commit possède déjà la photo de Noël ; le seul autre hero documenté est celui de mains réunies provenant du WordPress indiqué lors de l'intervention précédente.

**La restauration du hero avec les jeunes n'est donc pas terminée.** Le bloc de mains existant n'est pas présenté comme ce hero manquant. Il est conservé sans nouvelle interprétation et la photo de Noël/Sears reste exclue du hero d'accueil.

Il manque précisément :

1. Le fichier photographique original du groupe de jeunes utilisé dans le hero.
2. Le composant/code de cette version, ou une capture/ancienne URL accessible montrant la composition de référence.
3. Les textes, libellés et destinations des boutons, ainsi que les cadrages ordinateur/mobile, s'ils ne sont pas lisibles dans cette référence.

Ces fichiers n'ayant pas de nom ni de chemin identifié dans les sources disponibles, aucun fichier de groupe approchant n'a été substitué. Les autres photographies de groupe présentes dans les reportages ne prouvent pas quelle était la composition du hero demandé.

## Vérifications

- Build de production, TypeScript et 6 tests du dépôt.
- Contrôles Firefox aux largeurs 360, 390, 768, 1 100, 1 280 et 1 440 px : cadrages, dimensions natives et absence de débordement sur l'accueil.
- Contrôles de navigation, menu, clavier, filtres, galerie, contact/don et contenu sans JavaScript avec le script de recette du dépôt.
- Recette de publication et captures dans `artifacts/home-art-direction/` après déploiement sur le projet Vercel existant.

Le dossier de preuves sur le hero est `hero-recovery.json`. La reprise visuelle et sa publication ne valent pas restauration du hero avec les jeunes tant que sa référence manque.
