# Palabra Deck Standard (PDS) 1.0 — Entwurf

**Dateiformat:** CSV, UTF-8 (mit oder ohne BOM), Komma als Trennzeichen, Kopfzeile erforderlich. Felder mit Kommas müssen nach CSV-Regeln in Anführungszeichen stehen.

## Spalten

| Spalte | Pflicht | Bedeutung |
|---|---|---|
| `id` | ja | Eindeutige, stabile Kennung innerhalb des Decks; nachträglich nicht ändern. |
| `spanish` | ja | Spanisches Lemma oder feste Wendung; Substantive mit Artikel. |
| `german` | ja | Deutsche Hauptbedeutung. |
| `part_of_speech` | ja | `noun`, `verb`, `adjective`, `adverb`, `phrase`, `pronoun`, `determiner`, `quantifier`, `interrogative`, `preposition`, `conjunction`, `numeral`, `interjection`, `particle`, `other`. |
| `category` | ja | Thematischer Bereich, z. B. Körper, Essen und Trinken. **Nicht** die Wortart. |
| `level` | nein | Orientierendes Niveau: A1, A2, B1, B2, C1, C2. |
| `example_es` | nein | Spanischer Beispielsatz. |
| `example_de` | nein | Deutsche Übersetzung des Beispielsatzes. |
| `tags` | nein | Mehrere Tags durch Semikolon trennen. |
| `conjugation_key` | nein | Verweis auf Infinitiv für spätere Konjugationstabellen. |

## Import- und Lernstandsregeln für die geplante V5

- Decks haben künftig eine separate `deck_id` und eine Version; IDs der einzelnen Einträge bleiben stabil.
- Der Importer validiert Pflichtfelder, Wortarten und doppelte IDs vor der Übernahme.
- Einträge werden nicht nur anhand der Schreibweise blind zusammengelegt: Mehrdeutige Wörter und verschiedene Wortarten müssen getrennt bleiben können.
- **Lernstände sind von den Wortdaten getrennt**; Import und Aktualisierung überschreiben niemals SRS-Daten.
- MC-Ablenker werden aus derselben Wortart gezogen, möglichst aus verwandten Themen und mit plausibler Bedeutung. Bei zu kleinem Pool besser weniger Optionen oder freie Antwort statt unpassender Ablenker.
- CSV-Daten und Beispielsätze sind untrusted input und dürfen niemals als HTML-Code interpretiert werden.

## Qualitätshinweis

Die beigefügte 1000er-Liste ist eine **didaktisch kuratierte Basis-Auswahl**, keine durch ein Sprachkorpus empirisch ermittelte Rangliste der exakt 1000 häufigsten spanischen Wortformen. Die Niveaueinstufungen sind vorläufig. Sie dient als Ausgangsbasis für Prüfung und Nutzertests. Die Daten sind nicht automatisch mit Palabra V4 kompatibel; die PDS-Importfunktion wird erst in V5 implementiert.
