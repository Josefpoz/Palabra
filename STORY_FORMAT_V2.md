# Palabra Story Format – v2 (0.6a.3)

Die Daten-Schnittstelle zwischen dem späteren **Palabra Studio** und dem **Palabra Main Stories Reader**. Palabra Main enthält nur eine Darstellungsengine, keine automatische Sprachanalyse. Diese v2 ersetzt die experimentelle Grammatikdarstellung aus Formatversion 1, ohne die eigentlichen Storytexte oder Kapitel-IDs zu ändern.

## Offline-Transport

- `stories/catalog.json`: kanonischer Datenexport mit `format: "palabra-story-v1"` und `formatVersion: 2` (Formatkennung wird aus Kompatibilitätsgründen beibehalten).
- `stories/catalog.js`: automatisch erzeugtes `window.PALABRA_STORY_CATALOG = ...`, damit dieselben Inhalte lokal über `file://` ohne `fetch` verfügbar sind.
- `story_tools/demo_source.json`: kuratierte Story mit menschlich lesbaren `syntax[]`-Bausteinen und `groups[]`-Verknüpfungen.
- `story_tools/build_stories.py`: normalisiert und validiert alle Wort-IDs und erzeugt beide Transportschichten. Fehler beim Export blockieren die Veröffentlichung.

## Datenhierarchie

`stories[]` → `chapters[]` → `sentences[]` → `tokens[]` / `syntax[]` / `groups[]`.

`sentences[]` enthält: `id`, `es`, `de`, `literal`, `tokens`, `trailing`, `syntax`, `groups`.

Ein `tokens[]`-Eintrag hat `id`, `text`, `before`, `lemma`, `de`, `literal`, `pos`, `form`, `note`, optional `vocabId` und optional `parts[]`. `parts[]` ermöglicht weiterhin die getrennte Analyse angehängter Objektpronomen wie `guárda + lo`.

### Vollständige Satzglieder: `syntax[]`

Jeder Satz muss alle anklickbaren Token- oder Wortteil-IDs **genau einmal** einer primären Satzfunktion zuordnen. Beispiel:

```json
{
  "id": "c1-s5-x3",
  "role": "indirect",
  "members": ["c1-s5-w3"],
  "label": "",
  "why": ""
}
```

Unterstützte Rollen:

| Rolle (`role`) | Grammatik im Reader |
|---|---|
| `subject` | Subjekt |
| `predicate` | Prädikat / Verbgruppe |
| `direct` | Direktes Objekt |
| `indirect` | Indirektes Objekt |
| `adjunct` | Umstandsangabe: Zeit, Ort, Art und Weise usw. |
| `attribute` | Ergänzung / Eigenschaft |
| `connector` | Satzverbindung / Satzanschluss |
| `negation` | Verneinung |

Alle Wörter einer zusammenhängenden `syntax`-Einheit werden als **ein gemeinsamer Satzbaustein** visualisiert. Farbwerte sind ausschließlich im Reader definiert. Satzzeichen bleiben unmarkiert.

### Übergreifende grammatische Beziehungen: `groups[]`

Neben den primären Satzgliedern dürfen beliebig viele Beziehungen zwischen nicht benachbarten IDs hinterlegt werden, beispielsweise:

```json
{
  "id": "c1-s5-g1",
  "role": "recipient",
  "label": "Empfängerin: se ↔ a María",
  "members": ["c1-s5-w3", "c1-s5-w7", "c1-s5-w8"],
  "why": "Se und a María bezeichnen dieselbe Empfängerin."
}
```

Beim Antippen einer solchen Gruppe werden alle Mitglieder zusätzlich erkennbar markiert. Die Rolle `indirect` sorgt zugleich für dieselbe Grundfarbe der beiden Satzbausteine. Manche Rollen können sich überlagern; `syntax[]` definiert die *primäre* Satzfunktion, `groups[]` enthält Zusatzbeziehungen.

## Validierung

- Exakte Zeichenrekonstruktion: `tokens` + `before` + `trailing` muss exakt `es` ergeben.
- `parts` muss exakt das zugrunde liegende geschriebene Token rekonstruieren.
- Keine doppelten Token-IDs; jede ID muss genau einmal in `syntax[]` stehen.
- Jeder Verweis aus `groups[]` muss auf eine vorhandene Token-/Teil-ID zeigen.
- Unbekannte `role`-Werte werden zurückgewiesen.
- Storykapitel-IDs und Word-IDs ändern sich bei einer reinen Neuannotation nicht.
- Worterklärfenster zeigen das Feld `literal` nur, wenn es sich von `de` unterscheidet. Redaktionell sollte `literal` nur bei echtem Lernmehrwert vom normalen Deutsch abweichen.

## Bedienung

Der Reader bietet 💡 als Satz-Schalter direkt neben 🌐. Mehrere Sätze können unabhängig aktiviert werden. Die Farblegende erscheint nur bei aktivem Grammatikblick. Verständnisfragen sind optional und nicht Voraussetzung zum Beenden eines Kapitels. Das SRS bleibt unabhängig.

## Grenzen der ersten Version

Das Modell markiert **die oberste primäre Satzfunktion** jedes lexikalischen Teils. Eine vollständige, theoretisch ausgefeilte Abbildung beliebig verschachtelter Teilsätze ist damit noch nicht implementiert. Für die Probe haben wir 19 Sätze von Hand vollständig annotiert, nicht automatisch analysiert. Bei einem zukünftigen Studio können automatisch vorgeschlagene Analysen kuratiert und in genau dieses Format exportiert werden.


## Stories-Katalog ab 0.6a.3

- `workId`: gemeinsame Werk-ID für mehrere Niveauversionen, z. B. `coco`.
- `id`: individuelle Fassungs-ID, z. B. `coco-a1` und `coco-a2`; Lernstände sind getrennt.
- `level`, `genre`, `description`: Metadaten für freie Niveau- und Genre-Auswahl.
- `sentences[].paragraphStart`: Start des nächsten Erzählabsatzes.
- `sentences[].de`: eine **redaktionell geprüfte** natürliche Satzübersetzung oder leere Zeichenfolge.
  Fehlt die geprüfte Satzübersetzung, zeigt der Reader eine klar so benannte Wort-für-Wort-Lesehilfe.
- `sentences[].literal`: nur befüllen, wenn eine gesonderte wörtliche Satzübersetzung echten Mehrwert liefert.
- `sentences[].syntax`: alle Wortpositionen müssen genau einmal abgedeckt sein. Die
  technische Vollständigkeit garantiert noch nicht, dass die Satzglieder richtig sind.
- `sentences[].groups`: zusätzliche grammatische Beziehungen. Diese werden unabhängig
  von den Satzgliederrollen verwaltet und dürfen Wörter aus mehreren Blöcken verbinden.

**Produktion:** `story_tools/compile_library.py` baut `stories/catalog.json` und `stories/catalog.js`
aus den redaktionellen `.txt`-Texten. Der Reader importiert die Daten, führt selbst aber keine
morphologische oder syntaktische Analyse aus. Diese ist künftig Aufgabe von Palabra Studio.
