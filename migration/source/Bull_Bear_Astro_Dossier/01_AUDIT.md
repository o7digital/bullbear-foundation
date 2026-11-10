# Audit public — Bull & Bear Foundation

Date : 9 novembre 2026 (Mexico). Inspection du navigateur sur ordinateur et lecture des pages publiques. Aucun accès administrateur, audit de sécurité, test de paiement ou mesure Lighthouse/CrUX.

## Conclusion

Une refonte est justifiée. L’exécution actuelle donne une impression de thème insuffisamment finalisé, avec des défauts éditoriaux, des incohérences de navigation et des bases SEO incomplètes. WordPress n’est pas intrinsèquement mauvais pour le SEO ; les défauts observés concernent cette installation. Astro est un choix pertinent pour une vitrine éditoriale, à condition de réussir l’import, les contenus, les parcours et les redirections.

## Constats vérifiés

| Élément | Observation | Conséquence / nuance |
|---|---|---|
| Contact | Le lien de l’adresse e-mail aboutit à `https://www.bullandbear-foundation.com/contacto/contacto@bullandbear-foundation.com`. | Le `mailto:` manque ; c’est un défaut fonctionnel concret. |
| Titres de pages | Accueil : `Bull & Bear Foundation – Bull & Bear Foundation`. | Redondant et peu descriptif. |
| Méta-description | Absente du DOM inspecté de l’accueil, Quiénes somos, Galería, Transparencia, Contacto et Donar ahora. | Des descriptions éditoriales sont à rédiger ; leur absence ne prouve pas une pénalité. Google peut choisir un autre extrait. |
| Titres HTML | Accueil : 13 H1 dans le DOM, dont plusieurs dans des blocs cachés. Quiénes somos : 4 H1. Galería et Contacto : aucun H1 détecté. | Hiérarchie incohérente. Plusieurs H1 ne constituent pas à eux seuls une pénalité automatique. |
| Démonstration résiduelle | L’accueil contient dans son HTML des menus anglais, du Lorem ipsum et des références à Manhattan/Bronx. Des éléments sont cachés visuellement mais apparaissent dans l’extraction textuelle. | Les retirer du contenu publié après archivage ; ne pas confondre contenu extrait et contenu effectivement visible à l’écran. |
| Navigation | Des liens du pied de page de l’accueil passent par `/pruebas/`. | Nettoyage nécessaire. Le lien `/pruebas/contacto/` a bien redirigé vers `/contacto/` : il n’a pas été constaté comme cassé. Les autres ne sont pas tous testés. |
| Libellés / URL | `Transparecia`, `Enteráte`, `/haleria/`, `/voluntareado/`. | Corriger les libellés ; planifier des 301 si les URL sont corrigées. |
| Actualité | L’accueil présente une période janvier–mai 2025, une campagne juin–juillet sans année explicite et une section COVID. | Dater et reclasser l’historique ; confirmer toute campagne présentée comme active. |
| Transparence | La page comporte une phrase sur le reçu CFDI et une image de document SAT. | Ne pas la qualifier de vide. Prévoir une explication lisible, une date, et l’original téléchargeable si disponible. Ne pas déduire un statut fiscal actuel d’une image ancienne. |
| Don | Un formulaire Give avec Stripe est présent. | Une refonte purement statique ne remplace pas sa logique serveur. Fonctionnement de paiement non testé. |
| En-têtes | L’accueil et les pages internes n’emploient pas exactement le même en-tête, logo et traitement des CTA. | Unifier les composants et la hiérarchie. |
| Images | Sur l’accueil, 21 des 30 balises img n’ont pas de texte alternatif non vide. | Examiner chaque image : un alt vide convient aux éléments décoratifs, mais pas aux photos informatives sans équivalent textuel. |
| Données structurées | Aucun bloc JSON-LD détecté sur l’accueil. | Ajouter un balisage pertinent et fidèle au contenu ; cela n’est pas une promesse de résultat enrichi. |

## Technologie observée

Les chemins de ressources identifient WordPress, le thème Caridad/Caridad Child, Elementor et Elementor Pro, WooCommerce, Give et Stripe. Des ressources Site Kit, Clarity et Burst Statistics sont également présentes.

Au moment du relevé, l’accueil comportait 80 balises de scripts externes et 63 liens de feuilles de style. Ce sont des comptages dans le DOM, pas une mesure de requêtes réseau, de poids transféré, de vitesse ou de Core Web Vitals. Certains scripts viennent de dépendances et d’injections tierces. Cette surface justifie un travail d’allègement, sans permettre d’inventer un score de performance.

## Ce qui existe déjà et mérite d’être préservé

- Identité, logo, mission et historique de la fondation.
- Actions réelles, archives et photographies.
- Coordonnées et réseaux sociaux.
- Parcours de don et documents de transparence à réexaminer.
- Canonical autoréférente correcte sur l’accueil et langue HTML `es`.

## Direction visuelle proposée

Un site de fondation crédible, chaleureux et éditorial : vert profond, ivoire et accent vert du logo ; grands titres élégants ; vrais reportages photo ; sections plus courtes et mieux hiérarchisées. Montrer rapidement les actions, les moyens d’aider et les preuves d’impact.

Le premier écran actuel est très générique : grande photo de mains réunies, slogan large, boutons verts massifs. La proposition premium mettrait d’abord en valeur la spécificité de la fondation et ses actions au Mexique. Il s’agit d’un jugement de design, pas d’une mesure SEO.

## Limites

Pas de données Search Console exploitables dans cette session : le connecteur a refusé l’accès faute d’abonnement actif. Aucune conclusion sur le trafic, les positions, les backlinks ou l’indexation réelle. Robots.txt et les sitemaps n’ont pas été vérifiés. La version mobile n’a pas été testée dans un viewport mobile. Plusieurs URL n’ont pas été accessibles au lecteur web : cela ne suffit pas à conclure à des erreurs HTTP pour tous les visiteurs.

## Sources

- https://www.bullandbear-foundation.com/
- https://www.bullandbear-foundation.com/quienes-somos/
- https://www.bullandbear-foundation.com/contacto/
- https://www.bullandbear-foundation.com/transparencia/
- https://www.bullandbear-foundation.com/haleria/
- https://www.bullandbear-foundation.com/actividades-bb-foundation/
- https://www.bullandbear-foundation.com/enterate/
- https://www.bullandbear-foundation.com/donar-ahora/
- Astro : https://docs.astro.build/en/concepts/islands/
- Google, migration : https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

