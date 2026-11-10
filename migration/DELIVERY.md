# Rapport de livraison — 10 novembre 2026 (Mexico)

## Réalisé

- Site en espagnol du Mexique, Astro 7.4.8, React 19, TypeScript strict, polices locales Lora et DM Sans avec licences OFL.
- Identité officielle, photos authentiques récupérées, direction ivoire / vert profond, en-tête et pied de page communs, responsive et réduction des mouvements.
- 55 fiches d'activités et bulletins, 10 index historiques, programmes, galerie, mission/histoire/valeurs/équipe source, participation, bénévolat, don, contact, transparence, confidentialité, archives COVID et agenda juin 2025.
- 81 captures HTML et deux articles API conservés. 87 chemins d'origine recensés. 38 activités possèdent un jour confirmé ; les 17 autres conservent une mention de date absente ou leur date de publication sans inventer de date d'activité.
- 1 115 fichiers médias téléchargés sur les 1 115 repérés, **variantes de taille comprises**. Aucun échec de téléchargement dans ce manifeste. Images locales, WebP, dimensions explicites et chargement différé hors premier écran.
- 23 documents publiés, avec OCR conservé et métadonnées revues visuellement. Le document Bienestar est correctement décrit comme participation à une formation. Le SAT est un acuse historique et ne démontre pas un statut fiscal actuel.
- 12 redirections de pages HTTP 301 configurées, sans boucle ni retour systématique à l'accueil. Fonction Vercel pour rediriger les 1 115 anciennes URL de médias vers leurs fichiers locaux ; vérification des destinations à chaque build.
- Titles/descriptions uniques, un H1, langue es-MX, canoniques absolues, Open Graph, NGO/Article/BreadcrumbList, sitemap, 404 et préproduction non indexable (HTML + robots.txt + en-tête HTTP).
- Texte de confidentialité d'origine conservé sans réécriture juridique. Les blocs de formulaire/bénévolat ajoutés à sa suite ont été retirés. Une revue par le responsable reste nécessaire avant bascule, notamment les incohérences de code postal et de références légales.
- Liens de contact mailto/tel corrigés. Les sollicitations de bénévolat ouvrent la messagerie ; aucun formulaire de collecte, fausse confirmation ou newsletter non connectée.

## Vérifié localement

- `npm run check` : aucune erreur TypeScript, aucun avertissement.
- `npm run build` : compilation de production réussie.
- `npm test` : 6 tests réussis. Le contrôle traverse tous les HTML, contrôle les liens, fichiers, images, métadonnées, dates et destinations de redirections, ainsi que les réponses 301/404/405 du résolveur de médias.
- `npm run test:browser` : Firefox, largeurs 360 / 390 / 768 / 1280 / 1440 px sur accueil, activités, don et contact ; aucun débordement horizontal.
- Interactions : menu mobile, Escape et retour du focus ; filtre année et catégorie ; ouverture/fermeture de galerie et flèches clavier ; lien d'évitement ; mailto/tel ; contenu principal présent sans JavaScript. Les captures de contrôle incluent un défilement pour charger les images différées.
- Inspection visuelle de l'accueil et des documents. Les originaux à faible résolution restent dans le dossier source ; la refonte ne crée pas artificiellement du détail absent des fichiers.
- `npm audit` après mise à jour de Sharp 0.35.5 : aucune vulnérabilité signalée.
- Recherche de signatures de clés privées, clés secrètes Stripe et tokens GitHub dans le périmètre livré : aucune trouvée. Le fichier d'authentification Vercel `.env.local` et `.vercel/` restent ignorés et hors ZIP.

Les mesures Lighthouse et la vérification du déploiement sont ajoutées après leur exécution. Les rapports et captures complets sont conservés dans `artifacts/` sur le poste de travail.

## Limites et accès encore nécessaires

1. **Dons** : Give + Stripe sont identifiés par l'audit fourni. L'accès à la page de don a été refusé par Mod_Security dans cet environnement. Le lien vers le WordPress existant est conservé pour la préproduction ; son encaissement n'est pas certifié ni testé de bout en bout. Il faut l'administration Give/Stripe, la devise confirmée et un hôte Give indépendant réellement fonctionnel ou une intégration serveur complète avant bascule. Aucun paiement réel ou test de carte n'a été effectué ; aucun historique de don n'a été déplacé.
2. **Exhaustivité** : l'API posts a fourni deux articles. Les requêtes API pages/catégories, robots.txt et sitemap ont été refusées. Les captures HTML des chemins découverts ont fonctionné via des requêtes ordinaires, sans contournement ni répétition des refus. Un export WordPress WXR et l'export de la bibliothèque médias restent nécessaires pour identifier les URL orphelines ou fichiers non référencés. Les scripts ne constituent pas une sauvegarde de la base WordPress.
3. **Actualité et droits** : bureau actuel, consentements de publication des photos, validité fiscale, campagnes et modalités de reçus à confirmer avec la fondation. Aucun partenaire actuel, chiffre global, témoignage ou autorisation fiscale n'a été inventé.
4. **Services externes** : messagerie, téléphone, cartes et réseaux sociaux s'ouvrent par liens. Aucun e-mail n'a été envoyé à un tiers dans les tests. Aucun paiement n'a été demandé et aucune newsletter n'a été créée.
5. **Bascule** : le domaine public et le WordPress restent en place. La préproduction est volontairement noindex. Les scores SEO Lighthouse sont donc diminués par l'interdiction d'indexation attendue ; elle doit rester active ici.

Voir `CUTOVER.md` pour la procédure de bascule et de retour arrière, `url-inventory.json` pour les chemins et décisions, `media-manifest.json` pour les provenances et `excluded-content.json` pour le tri éditorial.

## Lighthouse mobile — mesures locales finales

Mesures de laboratoire sur le build statique servi à localhost, le 10 novembre 2026. Ces scores ne sont pas des mesures CrUX ni des tests d'encaissement.

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| home | 98 | 100 | 100 | 69 | 2.3 s | 0.001 |
| activity | 100 | 100 | 100 | 69 | 0.8 s | 0 |
| donation | 99 | 100 | 100 | 69 | 2.2 s | 0 |

Le score SEO 69 est expliqué par le noindex et l'interdiction de crawl de la préproduction. Ils sont intentionnels et sont conservés. Aucun défaut de contraste détecté dans ces trois mesures finales. Les rapports HTML complets se trouvent dans artifacts/lighthouse/ et le résumé dans migration/reports/lighthouse-local.json.

## Déploiement vérifié

Préproduction : https://bullbear-foundation-preview.vercel.app/

Déploiement Vercel de la révision applicative c577cec, réalisé par la CLI et contrôlé le 2026-11-10T07:41:00.470Z. Le WordPress public et ses DNS sont conservés.

- 78 routes HTML hors page 404 : HTTP 200, noindex dans le HTML et dans l'en-tête HTTP.
- 12 mappings historiques : HTTP 301 directement, avec et sans barre finale ; destinations HTTP 200, sans chaîne intermédiaire.
- 6 anciennes URL de médias testées en ligne, dont un nom accentué : HTTP 301 puis image HTTP 200. Les 1 115 destinations sont contrôlées localement par les tests.
- URL inconnue : HTTP 404 ; robots.txt bloque le crawl ; sitemap disponible en HTTP 200.
- Site ouvert explicitement dans Firefox.

Résultats détaillés : migration/reports/deployment.json. Les changements finaux de documentation n'altèrent pas le build applicatif vérifié.
