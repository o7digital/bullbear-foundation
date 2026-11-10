# Bull & Bear Foundation

Refonte éditoriale en espagnol du Mexique : Astro 7, React 19 et TypeScript. Le HTML principal est statique ; une fonction Vercel résout les anciennes URL de médias en redirections HTTP 301 ; les filtres et la visionneuse utilisent des îlots React. Les photos et les polices sont servies localement.

## Lancer

Node.js 24.15+ recommandé (minimum Astro : 22.23.4). Les versions réellement installées sont verrouillées dans `package-lock.json`.

```sh
npm ci
npm run dev
```

Ouvrir explicitement dans Firefox : `open -a Firefox http://127.0.0.1:4321/`.

```sh
npm run check
npm run build
npm test
npm run preview
```

`npm run test:browser` vérifie Firefox aux largeurs 360, 390, 768, 1280 et 1440 px, le menu, les filtres, la galerie, le clavier et le HTML sans JavaScript. Installer au besoin `npx playwright install firefox`. `node scripts/lighthouse.mjs` mesure trois pages en émulation mobile avec le moteur Chrome requis par Lighthouse ; Firefox reste le navigateur de prévisualisation. Les résultats vont dans `artifacts/`, hors du dépôt.

## Contenus

- `src/content/activities.json` : fiches historiques, récits, dates et médias.
- `src/content/programs.json` : quatre axes d'action.
- `src/content/albums.json` : associations activité / photographies ; chaque galerie reprend la liste de sa fiche activité.
- `src/content/documents.json` : documents consultables et provenance.
- `src/content.config.ts` : schémas validés par Astro.
- `src/data/archive-indexes.json` : sélection des index mensuels historiques.
- `src/data/document-metadata.json` : descriptions et dates des documents revus par OCR et inspection visuelle.
- `src/data/privacy.html` : texte légal récupéré, conservé sans réécriture juridique.
- `src/assets/source/` : médias sources ; le manifeste complet est dans `migration/media-manifest.json`.

Pour ajouter une activité : dupliquer une entrée, renseigner un `id` unique correspondant au chemin souhaité, `title`, `sourceUrl`, les dates connues (ou `null`), `validation`, le résumé et les paragraphes. Copier les images dans `src/assets/source/` et inscrire leurs noms complets dans `images`. Ne pas inventer une date à partir d'un chemin d'upload. La route `/<id>/` se construit automatiquement. Les dates de publication et d'activité sont distinctes. Ajouter l'album et le manifeste de provenance correspondant, puis lancer check, build et tests.

Les photographies des personnes sont celles publiées par le site d'origine. Les autorisations de publication ne sont pas déductibles du HTML ; le détenteur du site doit confirmer les consentements lors de la recette de migration.

Les scripts `recover-*` sont les outils de collecte ponctuelle, sans contournement ni relance automatique après refus. Les originaux et erreurs HTTP sont conservés sous `migration/`. Les collections sont désormais les sources éditoriales : ne pas relancer `build-content.mjs` sur des modifications éditoriales manuelles, car il reconstruit les collections à partir du relevé de migration.

## Dons et contact

La page de don ouvre le formulaire Give du WordPress existant. Elle ne prend aucun paiement dans Astro. Le WordPress doit rester en service sur son domaine actuel pendant cette préproduction. Le paiement, la devise, les webhooks et les transactions n'ont pas été validés ; aucun paiement réel n'a été tenté.

**Ne pas basculer le domaine avant d'avoir préparé un hôte Give indépendant et testé, ou une intégration Stripe complète.** `.env.example` décrit `PUBLIC_GIVE_URL`. Si le domaine actuel pointe vers Astro avec la valeur par défaut, le lien de don rebouclerait : c'est un point bloquant de bascule, pas une solution pérenne.

Une intégration Stripe nécessitera l'accès au compte existant, la devise confirmée, un stockage durable pour l'idempotence, un backend Checkout, un webhook signé et un test de bout en bout en mode test. L'historique Give reste dans la base WordPress, hors du dépôt. Aucun secret ni donnée de donateur n'a été importé.

Le contact et le bénévolat utilisent des liens mailto/tel réels. Aucun formulaire, abonnement à une newsletter ou message d'envoi fictif n'est affiché. L'envoi d'un e-mail dépend du logiciel de messagerie du visiteur.

## Déploiement

La préproduction est prévue sur un projet Vercel distinct : `bullbear-foundation-preview`. Le domaine public WordPress n'est pas modifié. L'identité locale Vercel est dans `.vercel/` et reste ignorée ; la configuration portable est dans `vercel.json`.

```sh
vercel link --project bullbear-foundation-preview --scope olivier-steineur
vercel deploy --prod
```

`SITE_LIVE` reste absent ou `false` : meta robots, robots.txt et en-tête HTTP interdisent l'indexation. Le sitemap et les canoniques anticipent le domaine final. `npm run build` génère aussi les redirections HTTP et les en-têtes depuis `scripts/configure-hosting.mjs`.

La procédure de bascule et de retour arrière est dans `migration/CUTOVER.md`. Le rapport de livraison distingue les vérifications réellement faites et les dépendances restantes dans `migration/DELIVERY.md`.

## Livraison ZIP

Après commit, `npm run package` produit `artifacts/Bull_Bear_Foundation_Astro_React.zip` depuis l'état Git commité : ni `.env`, ni `.vercel`, ni secrets, ni `node_modules`, ni dépendances installées. Le ZIP contient les sources, le lockfile et les originaux de migration ; il n'inclut pas le build généré.
