# Diagramme de séquence — consultation de la courbe

Diagramme : `docs/diagrams/sequence.drawio.svg`

Le diagramme suit le filtrage de la courbe sur 1997-1998, du clic du visiteur jusqu'à la mise à jour de l'affichage.

- **Validation avant la base** : l'API vérifie le format des dates et que le début précède la fin avant toute requête SQL. Une entrée invalide renvoie un code 422 sans solliciter PostgreSQL.
- **Cas nominal** : deux requêtes paramétrées (recherche de l'indice, puis lecture des observations filtrées et triées par date) ; l'API renvoie un code 200 et les observations en JSON, que le navigateur affiche dans la courbe et le tableau.
- **Indice inconnu** (non représenté) : même enchaînement que le cas nominal, mais la première requête ne trouve aucun indice ; l'API renvoie alors un code 404.
- **Robustesse côté interface** : en cas d'erreur, le message s'affiche et la courbe conserve la période précédente.
