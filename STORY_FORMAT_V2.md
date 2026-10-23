# Palabra Storyformat v2 – Nutzung in 0.6a.4

`stories/catalog.json` bleibt bei `format: "palabra-story-v1", formatVersion: 2`.
Die App liest die lokale `stories/catalog.js`, sodass auch `file://` ohne Netzwerk funktioniert.

`stories[]` enthält vier edition IDs, aufgeteilt in zwei `workId`s und in je drei Kapitel.
Jede `sentences[]`-Einheit enthält:

- `id`, `es`, **`de` (natürliche deutsche Übersetzung, verpflichtend)**, optional `literal`
- `tokens[]` (Token-IDs, Text, führende Satzzeichen/Leerzeichen, POS, Lemma,
  deutsche Kontextbedeutung, Form, optional Hinweis/Wortteile)
- `trailing`, `paragraphStart`
- **optional `grammarFocus`** mit `title`, `why`, `spans[]`

`grammarFocus.spans[]`: `members` ist eine Liste gültiger Token-IDs, `kind` kann
`subject`, `verb`, `clause`, `reference`, `detail`, `link` sein, `label` ist der
kurze farbige Hinweis. **Die Spans müssen nicht alle Tokens des Satzes umfassen.**

Nur Sätze mit `grammarFocus` bekommen 💡. 🌐 wird an jedem Satz gezeigt.
Die vormals verpflichtenden `syntax` und `groups` sind im 0.6a.4-Export leere
Legacy-Felder. Der neue Reader zeigt keine automatische Subjekt-/Objekt-Analyse mehr,
und das Wortfenster zeigt diese alten Vorschläge ebenfalls nicht an.

## Export-/Validierungsregeln

1. Alle spanischen Sätze rekonstruieren sich exakt aus den Token-Texten.
2. Jede Satz-/Dialogeinheit hat eine nichtleere deutsche Übersetzung.
3. Jeder `grammarFocus.span.members`-Verweis zeigt auf eine vorhandene Token-ID.
4. `grammarFocus` benötigt eine manuell überprüfte deutsche Erklärung.
5. Alle Original-Edition-/Kapitel-/Satz-/Token-IDs bleiben stabil, damit Lesefortschritt erhalten bleibt.
6. Story-Vokabeln sind unabhängig vom Basisdeck. Ein Story-Wort muss nicht als SRS-Karte vorliegen.

Die notwendige Softwarequalitätssicherung ist `story_tools/test_06a4.py`.
