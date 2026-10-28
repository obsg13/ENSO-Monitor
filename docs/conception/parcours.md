# Parcours utilisateurs — ENSO Monitor

## Parcours principal : explorer et comparer (Visiteur)

### Parcours nominal

1. Le visiteur ouvre l'application.
2. La courbe ONI s'affiche sur toute la période disponible, avec l'unité (°C), la source (NOAA CPC, ONI v6) et la date d'extraction. *(US1)*
3. Le visiteur saisit une date de début et une date de fin, puis valide avec le bouton « Appliquer ». *(US2)*
4. La courbe et le tableau des valeurs se mettent à jour sur la période choisie. *(US2, US4)*
5. Le visiteur repère les passages au-dessus de +0,5 °C (El Niño) et en dessous de -0,5 °C (La Niña) grâce aux lignes de seuil. *(US1)*
6. Dans la zone de comparaison, le visiteur choisit deux périodes ; deux épisodes sont proposés par défaut (1997-1998 et 2015-2016) et restent modifiables. *(US3)*
7. Il valide avec le bouton « Comparer ».
8. L'application affiche pour chaque période la durée, le pic, la saison du pic et la moyenne, suivis d'un texte d'interprétation et d'un encadré des limites. *(US3)*

### Cas d'erreur

- **Date de début postérieure à la date de fin** : un message s'affiche sous le filtre ; la courbe garde la période précédente. *(US2)*
- **Aucune valeur sur la période** : le message « Aucune donnée sur cette période » remplace la courbe et le tableau. *(US2)*
- **API indisponible** : un message d'erreur remplace la courbe et invite à réessayer plus tard. *(US1)*
- **Période de comparaison vide** : le message indique quelle période ne contient pas de données. *(US3)*

## Parcours secondaire : mettre à jour les données (Administrateur)

1. L'administrateur lance la commande d'import depuis un terminal. *(US6)*
2. L'ETL télécharge la page ONI v6 de la NOAA et enregistre une copie datée avec son empreinte SHA-256.
3. L'ETL nettoie les valeurs, écarte les saisons invalides et les doublons.
4. L'ETL insère les nouvelles valeurs et met à jour celles révisées par la NOAA.
5. Le terminal affiche le bilan de l'import : lignes lues, insérées, mises à jour, ignorées.

### Cas d'erreur

- **Page NOAA inaccessible** : l'import s'arrête, il est enregistré avec le statut « failed » ; les données déjà en base restent intactes et le site continue de fonctionner.
