# Bull & Bear Foundation Studio

Studio privé : https://bull-bear-foundation-studio.up.railway.app. Site connecté : https://bullbear-foundation-preview.vercel.app/. Le chemin `/studio/` du site redirige vers le Studio. Le WordPress d'origine reste indépendant.

Le Studio reprend la navigation, l'éditeur, les bibliothèques visuelles et les usages du Studio Academy, avec l'identité verte de Foundation. Son projet Railway, son PostgreSQL, ses fichiers Directus, ses sessions et ses jetons sont propres à Foundation. Aucune donnée ou clé d'Academy n'est réutilisée.

## Accès

Le compte propriétaire utilise `ADMIN_EMAIL` du service **directus** du projet Railway **bullbear-foundation-studio**. Le mot de passe initial aléatoire est disponible uniquement dans sa variable `ADMIN_PASSWORD` ; il n'est présent ni dans le dépôt ni dans les fichiers publics. Après connexion à l'administration Directus, il peut être changé dans le profil. Un rôle **Foundation editor**, limité aux contenus et fichiers, est prêt pour les comptes de l'équipe. Créer ces comptes avec leurs adresses réelles depuis Directus.

Les sessions du Studio sont chiffrées, limitées à huit heures, renouvelées via Directus et stockées dans un cookie HttpOnly, Secure et SameSite Strict. Les écritures exigent l'origine du Studio. Les fichiers uploadés restent privés dans Directus. Les lecteurs anonymes n'ont pas accès à l'API éditoriale ni aux fichiers privés. L'interface du Studio et ses miniatures d'archives ne sont pas confidentielles ; la gestion et les uploads exigent une connexion.

## Édition

- **Inicio** : photographie du hero, titre, sous-titre, texte et lien du bouton, cadrage et principaux textes de l'accueil. Le Studio conserve le hero de mains existant. La photographie et la composition du hero avec les jeunes restent introuvables : le CMS ne résout pas ce manque de référence.
- **Actividades** : les 55 récits importés sont éditables avec leur date, catégorie, texte, résumé, couverture et galerie. Une nouvelle activité obtient une URL lisible à partir du titre ou de l'adresse choisie ; les URL existantes ne changent pas. Une fiche publiée devient visible au prochain déploiement. Archiver une activité la retire du prochain build.
- **Programas** et **Transparencia** : quatre programmes et 23 documents, avec images et liens. Les textes institutionnels et les textes de participation/contact sélectionnés sont également éditables. Les fonctionnalités de don restent raccordées au canal Give existant ; aucun encaissement nouveau n'est créé.
- **Fotos y galería** : photos des récits existants, recherche, filtres et choix de page. Les photos importées restent dans leur récit ; une photo nouvelle peut être publiée dans une page ou ajoutée à la galerie d'une activité depuis l'éditeur. Le sélecteur présente les 1 116 fichiers d'origine en miniatures. Ces miniatures ne remplacent pas les originaux.
- **Vídeos** : coller un lien complet ou commençant par `www.`. YouTube et Vimeo utilisent un lecteur intégré ; les fichiers HTTPS MP4/WebM utilisent un lecteur natif. Les autres plateformes restent des liens vers leur page. Le serveur ne télécharge jamais une adresse vidéo fournie par l'éditeur. La lecture dépend des autorisations du fournisseur.

L'envoi de photos accepte jusqu'à 20 fichiers par lot et 25 Mo par fichier : JPG, PNG, WebP et AVIF. Le serveur décode réellement le fichier, refuse les faux formats et les animations, applique l'orientation et retire les métadonnées en produisant une version WebP de qualité 88. Le fichier fourni n'est pas conservé comme original brut : conserver aussi les originaux de prise de vue hors du Studio. Chaque photo est enregistrée en brouillon. Le titre, le crédit, la description alternative et le cadrage sont éditables ; une description alternative est exigée avant publication. Les dimensions affichées correspondent au fichier stocké. Une erreur peut être relancée sans renvoyer un fichier déjà stocké avec succès dans ce lot.

Les boutons de groupe modifient le statut des photos sélectionnées. Une modification concurrente d'une fiche est refusée avec un message demandant de recharger la version actuelle. Le Studio ne remplace pas silencieusement l'édition d'un collègue.

## Publication et stockage

**Guardar cambios** enregistre dans PostgreSQL. **Publicar en el sitio** demande un build Vercel de `main` sur le projet de prévisualisation existant. Le message distingue la demande de publication et sa confirmation. Le Studio vérifie le fichier `/_foundation/status.json` du site pour confirmer qu'une compilation plus récente a été publiée ; si elle n'est pas confirmée après quinze minutes, il demande de vérifier Vercel. Ce statut est partagé dans le processus du Studio et est réinitialisé au redémarrage.

Le build utilise un compte technique de lecture. Il récupère les contenus publiés, télécharge uniquement les fichiers Directus référencés, puis produit les pages statiques Astro et les images locales. Les brouillons, les jetons et les données de provenance privées ne sont pas exportés dans l'instantané public. Une erreur de CMS ou de fichier bloque le nouveau build et laisse le déploiement précédent disponible.

Directus 12.6.1 applique ici des permissions par collection ; les filtres de permissions personnalisés ne sont pas disponibles dans ce palier. Le compte technique de build peut lire la collection éditoriale et les fichiers mais n'a pas de droit d'écriture. Son jeton reste dans les secrets Vercel et n'est jamais envoyé au navigateur. L'API publique du Studio reste inaccessible sans session.

PostgreSQL et les uploads Directus possèdent chacun un volume persistant avec sauvegardes Railway quotidiennes et hebdomadaires. Les identifiants non sensibles des services sont conservés dans `deployment.json`.

## Développement

```sh
npm ci
npm --prefix cms/studio ci
node cms/seed.mjs
npm run cms:sync
npm run check
npm run build
npm test
npm run cms:test
```

`cms/seed.mjs` construit les données de départ et les miniatures locales depuis les fichiers du dépôt. `cms/bootstrap.mjs` est limité à l'URL Directus Foundation déclarée dans `deployment.json` et ajoute seulement les fiches manquantes, sans écraser les éditions existantes. Utiliser `ADMIN_TOKEN` et `WEBSITE_READ_TOKEN` uniquement dans l'environnement du processus.

Variables privées du build Vercel : `DIRECTUS_URL`, `DIRECTUS_READ_TOKEN`. `PUBLIC_STUDIO_URL` contient seulement l'URL publique du Studio. Variables serveur du Studio : `DIRECTUS_URL`, `STUDIO_ORIGIN`, `STUDIO_SESSION_SECRET`, `STUDIO_PREVIEW_URL`, `VERCEL_PREVIEW_DEPLOY_HOOK`. Aucun fichier `.env` contenant des secrets ne doit être commité.

Sans `DIRECTUS_URL`, le frontend garde les contenus locaux. Les snapshots, les photos téléchargées et les miniatures sont générés et ignorés par Git. Le frontend peut être déployé avec Vercel CLI. Le Studio utilise `cms/studio/Dockerfile`. `npm run cms:deploy` régénère les miniatures, prépare un contexte isolé sans dépendances locales ni secrets puis appelle Railway CLI sur le service Foundation déclaré. Attendre le statut `SUCCESS` de Railway avant de considérer le Studio publié.

Les tests du serveur couvrent la session, le refus d'origine étrangère, la persistance, les conflits de version, le décodage des images et la confirmation de publication. `scripts/studio-qa.mjs` teste dans Firefox les liens vidéo, deux uploads réels, la destination, les descriptions et les actions groupées ; il exige des identifiants via variables d'environnement et consigne uniquement les identifiants temporaires à nettoyer.

## Recette de livraison

Le 10 novembre 2026 : neuf tests automatisés (site et serveur), build Astro, contrôle TypeScript et recette Firefox de 360 à 1 440 px. Une vidéo par lien `www.`, deux uploads réels, les descriptions et les actions groupées ont été vérifiés dans le Studio en ligne. Un build relié au CMS a aussi généré une photo téléversée, un lecteur vidéo et une nouvelle activité à URL lisible. Les fiches, fichiers et comptes de recette sont supprimés après vérification.

La politique Vercel de ce projet exige une signature de commit vérifiée pour les déploiements Git et les Deploy Hooks. Les livraisons destinées au bouton de publication doivent respecter cette politique ; la règle de sécurité reste activée.

Pour les livraisons sans clé de signature locale, la mutation GraphQL GitHub `createCommitOnBranch` permet de créer un commit signé par GitHub avec le compte authentifié. Vérifier ensuite `commit.verification.verified` avant de lancer le Deploy Hook.
