# Bull & Bear Foundation — dossier de refonte

Préparé le 9 novembre 2026, heure de Mexico.
Source : https://www.bullandbear-foundation.com/

Ce dossier prépare la réalisation par Codex d’une refonte premium en Astro + React. Le site de production n’a pas été modifié.

## Fichiers

- `01_AUDIT.md` : constats vérifiés, nuances et limites.
- `02_INSTRUCTIONS_CODEX.md` : mission d’implémentation complète, direction artistique, migration et critères de réception.
- `03_INVENTAIRE.json` : premier inventaire des routes et des médias publics repérés, avec leur état de récupération.
- `04_CONTENU_STRUCTURE.json` : base éditoriale condensée en espagnol, dérivée des pages consultées ; à rapprocher des originaux lors de l’import.

## État de la récupération

Les pages principales ont été examinées et les contenus utiles identifiés. Les coordonnées, les axes d’action et l’historique sont structurés dans le JSON. Les URL de médias sont inventoriées.

Ce dossier n’est PAS un clone exhaustif ni une sauvegarde WordPress. Il ne contient pas les fichiers images, les PDF originaux, tous les articles, les paramètres des formulaires ou la base des dons. Les téléchargements HTTP directs ont été refusés par Mod_Security (406), alors que les pages étaient consultables dans le navigateur. Aucun contournement n’a été tenté.

Pour terminer la récupération : utiliser un export WordPress WXR et une copie autorisée de `wp-content/uploads`, ou un accès public/API qui fonctionne depuis l’environnement de Codex. Vérifier l’exhaustivité des pages, articles, taxonomies, médias et dates. Conserver les données de donateurs hors du dépôt frontend.

## Démarrer dans Codex

Décompresser ce dossier dans le projet, puis donner à Codex :

> Lis entièrement `02_INSTRUCTIONS_CODEX.md`, puis réalise la refonte Astro + React décrite. Commence par compléter l’import et son inventaire. Utilise les contenus et médias de la fondation, traite les anomalies documentées, réalise toutes les pages utiles et vérifie les parcours. Livre le projet complet, le ZIP, les instructions de lancement, le rapport de tests et la configuration des redirections. La production actuelle reste en place jusqu’à la bascule convenue.

