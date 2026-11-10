# Bascule et retour arrière

La livraison actuelle est une préproduction sur Vercel. Aucun DNS, WordPress public ou base Give n'est modifié.

## Conditions avant bascule

1. Sauvegarder fichiers, base WordPress complète, configuration, zone DNS et certificats. Conserver séparément la base Give et son historique : ne jamais les verser dans Git.
2. Confirmer le compte Stripe existant, la devise, les montants et le processus de reçus. Le symbole `$` et l'ancien acuse SAT ne suffisent pas à les déterminer.
3. Préparer Give sur un hôte indépendant, par exemple un sous-domaine choisi par le propriétaire, avec HTTPS, base préservée, URL WordPress adaptées, CORS/ressources et webhooks Stripe reconfigurés. Aucun hôte de ce type n'est créé dans cette livraison. Modifier `PUBLIC_GIVE_URL` vers cette adresse réelle.
4. Ou remplacer le lien Give par un backend Stripe : création de session serveur, validation stricte montant/devise, contrôle des signatures sur le corps brut, stockage atomique des identifiants d'événements pour l'idempotence, retour de confirmation fondé sur le paiement vérifié. Tester réussite, annulation, erreur, signature invalide et webhook dupliqué en mode test.
5. Faire valider les droits des médias et les contenus institutionnels. Confirmer les fonctions actuelles du bureau ; l'équipe reproduit les fonctions présentées par le site source. Faire revoir l'avis de confidentialité récupéré : son code postal diffère de la page Contact et sa référence aux textes applicables doit être confirmée par le responsable.
6. Compléter l'inventaire à partir d'un export WXR, de la bibliothèque médias et des données Search Console. L'accès aux API pages/catégories, au robots et au sitemap d'origine a été refusé : le relevé HTML couvre les pages découvertes mais ne garantit pas l'exhaustivité des URL orphelines.
7. Réviser le mapping `migration/url-inventory.json` et `migration/redirect-map.json`. Les redirections spécifiques vont vers leurs équivalents et conservent les anciennes routes d'activités.
8. Vérifier les anciennes URL de médias : le rewrite Vercel `/wp-content/uploads/:year/:month/:file` appelle la fonction de redirection 301, dont la table est régénérée après chaque build. Elle couvre les médias du manifeste. Ajouter au manifeste les éventuels médias supplémentaires révélés par l'export complet ou Search Console.

## Mise en ligne

- Tester d'abord le futur hôte Give indépendamment du domaine de la vitrine.
- Configurer les domaines apex et `www` dans Vercel en conservant `www` comme canonique. Choisir un seul sens de redirection pour l'apex.
- Enregistrer la version Vercel et la zone DNS précédentes. Abaisser le TTL suffisamment à l'avance.
- Dans l'environnement **de production du projet final**, définir `SITE_LIVE=true` et `PUBLIC_GIVE_URL` vers l'hôte testé. Exécuter localement `SITE_LIVE=true node scripts/configure-hosting.mjs` avant la commande de déploiement, puis faire un nouveau build avec la même variable : elle retire le noindex du HTML, du robots.txt et des en-têtes générés. Ne pas l'activer sur le projet de préproduction.
- Déployer par la CLI Vercel. Vérifier les en-têtes de la nouvelle configuration puis changer les DNS.
- Contrôler les 200, 301, 404, canoniques, sitemap, médias, contact, parcours Give et retour de paiement. Confirmer que `/donar-ahora/` ne se renvoie pas à lui-même.
- Soumettre le sitemap dans Search Console et surveiller couverture, erreurs et trafic, sans déduire des promesses SEO de la refonte.

## Retour arrière

- En cas de défaut critique, restaurer la zone DNS précédente vers WordPress et conserver ses bases. Le WordPress n'a pas été supprimé.
- Pour un défaut de vitrine seul, restaurer la version Vercel précédente via la CLI / les déploiements Vercel, puis vérifier les routes.
- Ne jamais restaurer aveuglément une ancienne sauvegarde de la base Give : cela pourrait effacer des dons intervenus depuis. Préserver les transactions et réconcilier les événements avec le prestataire.
- Vérifier TLS et propagation DNS. Conserver des horodatages et les identifiants des versions de déploiement.
