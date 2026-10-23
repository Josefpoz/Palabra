# Palabra Stories 0.6a.3 – Werkstattbericht

## Umfang

- Zwei Geschichten: **El gato que quiere viajar** (A1/A2) und **La última función del Cine Luna** (A2/B1)
- Zwei Niveaufassungen pro Geschichte, jeweils drei Kapitel: **12 Kapitel**
- **4538** Wortvorkommen, **776** Satz-/Dialogeinheiten
- **305** automatisch vorgeschlagene grammatische Beziehungen, darunter Subjekt–Verb-Kongruenz und reflexive Bezüge
- **213** redaktionell übersetzte Sätze; übrige bieten eine als solche gekennzeichnete Wort-für-Wort-Lesehilfe
- **24** optionale Leseverständnisfragen (zwei pro Kapitel)
- Die ursprüngliche Kurzgeschichte *El libro sin nombre* ist aus dem Katalog entfernt
- Keine Freischaltbedingungen: alle Kapitel und alle verfügbaren Niveaus direkt zugänglich
- Basis-Vocabulary 1–5 (1.000 Karten), Mini-Dialoge (50), Sammlungen und SRS bleiben unverändert

## Automatisiert – funktioniert

1. Quelltexte getrennt von Palabra Main halten (`story_tools/texts/`).
2. Absätze, Anführungszeichen, Uhrzeiten, Zahlen, Wörter und Wortpositionen erfassen.
3. Wortformen mit einem lokalen Wörterbuch und bestehenden Vokabeln verbinden; **4538 von 4538 Token haben ein nicht-leeres deutsches Bedeutungsfeld**. Das ist eine formale Vollständigkeitsprüfung, *keine* Bestätigung, dass jede Übersetzung kontextuell richtig ist.
4. Alle Lexikpositionen mit einem Satzbaustein erfassen, so dass Grammatikblick technisch lückenlos gerendert wird.
5. Rollen und einige grammatische Bezüge *vorschlagen*; beim erneuten Build vollständig reproduzieren.
6. `catalog.json` (Studio-Schnittstelle) und `catalog.js` (lokaler file://-Adapter) generieren.

## Noch nicht zuverlässig automatisiert

**Grammatikrichtigkeit:** Unser derzeitiges Script benutzt transparente lexikalische Heuristiken statt eines trainierten spanischen Syntaxparsers. Die 305 Beziehungen sind Vorschläge, keine abschließend geprüften Analysen. Besonders Nebensätze, unausgesprochene Subjekte, das unpersönliche/reflexive *se*, verkettete Verbformen und nicht benachbarte Satzteile brauchen Kontextkontrolle. Farbig vollständig bedeutet nur *technisch erfasst*, nicht *linguistisch sicher richtig*.

**Übersetzung im Kontext:** Deutsche Einzelausdrücke sind vorhanden, aber eine isolierte Form kann mehrere Bedeutungen haben. Wörtliche Übersetzungen werden nur dann angezeigt, wenn sie separat kuratiert sind. Die natürlichen Satzübersetzungen wurden bewusst nicht durch eine ungeprüfte Wortaneinanderreihung ersetzt.

**Autorentätigkeit:** Erst Quelltext prüfen, dann alle Worterklärungen und Syntaxrollen redaktionell korrigieren, Beziehungen gezielt setzen, idiomatische Übersetzungen ergänzen und anschließend Browser-/Layouttests durchführen.

## Wichtigste Erkenntnis für Palabra Studio

Wir brauchen kein großes Sprachmodell *im Reader*. Für die Redaktion lohnt sich ein externes Studio mit:

1. **Analyse-Vorschlagsdienst:** Tokenizer, spanischer morphologischer Analysator, Dependency-Parser (optional; Autorität liegt bei Redaktion)
2. **Satzglieder-Editor:** Blöcke per Drag-/Klick markieren, verschachtelte Nebensätze anzeigen, sämtliche Tokenpositionen auf Vollständigkeit prüfen
3. **Beziehungs-Editor:** Pronomen–Bezugswort, Subjekt–Prädikat, syntaktische Referenzen, klare Vorschau gemeinsamer Hervorhebung
4. **Übersetzungs-Editor und Translation Memory:** Bereits geprüfte Wörter, Wendungen und wiederkehrende Sätze automatisch vorschlagen
5. **Qualitätssicherung:** Fehlende und zweifelhafte Analysen nach Priorität anzeigen und erst nach menschlicher Freigabe als *geprüft* markieren
6. **Unverändertes Format:** JSON exportieren, von Main einfach lesen lassen; Fortschrittsdaten nie ins Storyformat schreiben

## Satzrollenverteilung (technische Gruppierungen)
- adjunct: 784
- predicate: 741
- subject: 415
- direct: 280
- connector: 188
- negation: 51
- attribute: 27

## Offene Review-Punkte

- Automatische Erkennung ist kein Ersatz für individuelle Syntaxprüfung. Vor echter Veröffentlichung besonders Cine Luna B1 prüfen.
- Die Textaufteilung in eigenständige Sätze ist grammatisch nicht immer ideal, etwa bei eingeschobenen Sprecherangaben; Quellabsätze sind erhalten.
- Die A1-Geschichte enthält wenige Formen und Wörter oberhalb reiner A1-Grundlagen. Diese werden durch den Reader erklärt, aber sollten im nächsten didaktischen Lektorat überarbeitet werden.
- Die Wortliste wird bewusst noch nicht erweitert; die Ergänzung um nützliche Storyvokabeln wird pro Geschichte separat entschieden.
