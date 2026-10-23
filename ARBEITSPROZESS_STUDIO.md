# Palabra Stories – Erkenntnisse aus Version 0.6a.4

## Didaktische Neuausrichtung

Grammatikblick bedeutet **kuratierte Entdeckung**, nicht komplette automatische Satzgliedklassifikation.
Jeder Satz bekommt weiterhin Worterklärung und eine **natürliche deutsche Übersetzung**. Nur
für tatsächlich lernrelevante Stellen bekommt er zusätzlich `grammarFocus`.

- A1: kurze Grundmuster, Verneinung, Fragen, Verbkonjugation und Subjekt/Verb.
- A2: Vergangenheitsformen, feste Wendungen, Pronomen und Konjunktionen.
- B1: referenzielle Pronomen, Subjuntivo, komplexe Nebensätze, Zeitstufen,
  Ellipsen und Redewendungen.

Die gelbe Glühbirne ist bewusst ein selteneres, inhaltlich lohnendes Angebot.
Sie fehlt bei einfachen, ohne Hilfe gut lesbaren Sätzen.

## Messwerte

- 12 Kapitel / vier Niveauversionen / zwei Geschichten.
- 776 Satz- und Dialogeinheiten; **776 von 776 besitzen natürliche deutsche Übersetzungen**.
- 81 manuell ausgewählte und beschriebene Lerntipps (10,4 % der Satzeinheiten).
- 372 konservative Korrekturen der bisherigen automatischen Wortklassen/Grundformen/Glossen;
  einige weitere Fehler im nicht vollständig redaktionell geprüften Wortlexikon sind möglich.
- 0 automatisch zugeschriebene Subjekt/Prädikat/Objekt-Farbgruppen im publizierten Reader.
- Keine Änderung an 1.000 Basisvokabeln, SRS, Sammlungen und Story-Lesefortschritt.

## Aufwand und Automatisierungsstrategie

**Gut automatisierbar:** Text segmentieren, Tokens/IDs, häufige Lemmas, einfache Wortarten,
Token-Abdeckung prüfen, Auswahlkandidaten für besondere Konstruktionen suchen,
Versionen und Kapitel exportieren, Übersetzungs-Vollständigkeit prüfen.

**Redaktionell sinnvoll:** natürliches Deutsch, mehrdeutige Wortbedeutungen,
kontextbezogene Pronomenreferenzen, Auswahl der relevanten Lerntipps und klare
pädagogische Erklärungen.

Es ist ausdrücklich kein Ziel mehr, 100 % aller Sätze syntaktisch vollständig
zu zerteilen. Studio soll zuerst einen Editor für Übersetzungen und **optionale**
Lerntipps bekommen. Bei A1 ist ein höherer Anteil der normalen Satzanalyse weiterhin
gewollt, um Satzbaugrundlagen zu zeigen.

## Reproduzierbare Erstellung

Der ursprüngliche Generator `story_tools/compile_library.py` erzeugt noch den
0.6a.3-Grundentwurf einschließlich der alten, im finalen Reader nicht mehr verwendeten
Satzgliedvorschläge. Auf diesen Grundentwurf folgen daher zwingend:

```bash
python story_tools/compile_library.py
python story_tools/editorial_tools.py
python story_tools/polish_lexicon_06a4.py
python story_tools/test_06a4.py
```

Achtung: Ein alleiniger Aufruf von `compile_library.py` oder `editorial_tools.py`
überschreibt den finalen Export! Nur die vollständige Pipeline liefert 0.6a.4.

Die echte spätere Studio-Architektur soll diese Redaktionsschritte in eine
visuelle Oberfläche integrieren und alle überprüften Daten als eigenständige
Story-Datei exportieren.
