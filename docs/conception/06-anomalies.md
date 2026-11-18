# Traitement des anomalies

## 1. Interprétation incomplète d'une période mixte

- **Constat** : pour la période 1997-01 → 1998-12, le texte indiquait seulement « dépasse le seuil El Niño », alors que l'ONI descend à -1,5 °C fin 1998 (La Niña).
- **Cause** : la phase était déduite du seul pic (valeur la plus éloignée de 0) ; l'API ne fournissait ni minimum ni maximum.
- **Reproduction** : tests `backend/tests/test_analysis.py` et `frontend/src/interpretation.test.ts`, écrits avant le correctif et en échec (captures `bug-tests-failing-back.png` et `bug-tests-failing-front.png`).
- **Correctif** : l'API renvoie `min_value` et `max_value` ; l'interprétation teste séparément le franchissement de chaque seuil.
- **Non-régression** : les deux tests passent, ainsi que tous les tests existants (captures `bug-tests-passing-back.png` et `bug-tests-passing-front.png`).

## 2. Contraste insuffisant des textes de seuil

Textes des seuils de la courbe en #808080 (3,9:1, sous le minimum WCAG AA de 4,5:1) ; couleur fixée à #4a4a4a (8,9:1). Détails dans `06-verifications-ux.md`.

## 3. Débordement de la courbe sur mobile

La courbe gardait sa largeur après un redimensionnement et élargissait la page ; corrigé par `overflow: hidden` sur son conteneur. Détails dans `06-verifications-ux.md`.
