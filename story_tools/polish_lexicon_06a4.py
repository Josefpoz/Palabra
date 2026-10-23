"""Targeted human-review corrections to legacy heuristic POS/glosses.
Apply AFTER editorial_tools.py. No vocabulary deck entries or SRS state are modified."""
from pathlib import Path
import json
p=Path(__file__).resolve().parents[1]/'stories/catalog.json'
d=json.loads(p.read_text(encoding='utf-8'))
# Common unambiguous surface forms where the old heuristic noun fallback was wrong.
fixed={
'azul':('adjective','azul','blau','Adjektiv'),
'rojo':('adjective','rojo','rot','Adjektiv'),
'roja':('adjective','rojo','rot','Adjektiv, feminin'),
'rojas':('adjective','rojo','rot','Adjektiv, feminin Plural'),
'rojos':('adjective','rojo','rot','Adjektiv, maskulin Plural'),
'durante':('preposition','durante','während / lang','Präposition'),
'después':('adverb','después','danach / später','Adverb'),
'antes':('adverb','antes','vorher / davor','Adverb'),
'casi':('adverb','casi','fast / beinahe','Adverb'),
'tan':('adverb','tan','so (sehr)','Gradadverb'),
'bastante':('adverb','bastante','ziemlich / ausreichend','Gradadverb'),
'donde':('adverb','donde','wo / an dem','Relatives Ortsadverb'),
'dónde':('adverb','dónde','wo?','Frageadverb'),
'delante':('adverb','delante','vorne / davor','Ortsadverb'),
'detrás':('adverb','detrás','dahinter / hinten','Ortsadverb'),
'fuera':None, # contextual below
'dentro':('adverb','dentro','drinnen / innerhalb','Ortsadverb'),
'lejos':('adverb','lejos','weit weg','Ortsadverb'),
'junto':('adverb','junto','zusammen / neben','Adverb'),
'juntos':('adverb','juntos','zusammen','Adverbial verwendetes Adjektiv'),
'de repente':('adverb','de repente','plötzlich','Feste adverbiale Wendung'),
'dos':('numeral','dos','zwei','Zahlwort'),
'doce':('numeral','doce','zwölf','Zahlwort'),
'diez':('numeral','diez','zehn','Zahlwort'),
'ocho':('numeral','ocho','acht','Zahlwort'),
'once':('numeral','once','elf','Zahlwort'),
'cuatro':('numeral','cuatro','vier','Zahlwort'),
'cinco':('numeral','cinco','fünf','Zahlwort'),
'siete':('numeral','siete','sieben','Zahlwort'),
'seis':('numeral','seis','sechs','Zahlwort'),
'treinta':('numeral','treinta','dreißig','Zahlwort'),
'primer':('adjective','primero','erste / erster','Ordnungszahl / Adjektiv'),
'primera':('adjective','primero','erste','Ordnungszahl / Adjektiv, feminin'),
'última':('adjective','último','letzte','Adjektiv, feminin'),
'último':('adjective','último','letzte / letzter','Adjektiv'),
'antiguo':('adjective','antiguo','alt / antik','Adjektiv'),
'antiguas':('adjective','antiguo','alte / antike','Adjektiv, feminin Plural'),
'antiguos':('adjective','antiguo','alte / antike','Adjektiv, maskulin Plural'),
'antigua':('adjective','antiguo','alt / antik','Adjektiv, feminin'),
'pintadas':('adjective','pintado','bemalt / aufgemalt','Partizip als Adjektiv, feminin Plural'),
'cerrado':('adjective','cerrado','geschlossen','Partizip als Adjektiv, maskulin'),
'cerrada':('adjective','cerrado','geschlossen','Partizip als Adjektiv, feminin'),
'cerradas':('adjective','cerrado','geschlossen','Partizip als Adjektiv, feminin Plural'),
'cansado':('adjective','cansado','müde','Adjektiv'),
'cansada':('adjective','cansado','müde','Adjektiv, feminin'),
'diferente':('adjective','diferente','anders / verschieden','Adjektiv'),
'diferentes':('adjective','diferente','verschiedene','Adjektiv Plural'),
'mayor':('adjective','mayor','älter / größer','Adjektiv'),
'pequeño':('adjective','pequeño','klein','Adjektiv'),
'pequeños':('adjective','pequeño','kleine','Adjektiv'),
'pequeñas':('adjective','pequeño','kleine','Adjektiv, feminin Plural'),
'naranja':None, # adjective or fruit noun, context below
'bonita':('adjective','bonito','schön / hübsch','Adjektiv, feminin'),
'bonito':('adjective','bonito','schön / hübsch','Adjektiv'),
'bonitos':('adjective','bonito','schön / hübsch','Adjektiv, Plural'),
'hermoso':('adjective','hermoso','wunderschön','Adjektiv'),
'hermosa':('adjective','hermoso','wunderschön','Adjektiv, feminin'),
'completamente':('adverb','completamente','vollständig','Adverb'),
'principal':('adjective','principal','wichtigste / Haupt-','Adjektiv'),
'igual':('adjective','igual','gleich / genauso','Adjektiv'),
'imposible':('adjective','imposible','unmöglich','Adjektiv'),
'final':('adjective','final','letzte / am Ende','Adjektiv oder Substantiv je nach Kontext'),
'algo':('pronoun','algo','etwas','Indefinitpronomen'),
'nadie':('pronoun','nadie','niemand','Indefinitpronomen'),
'otro':('adjective','otro','anderer / noch ein','Begleiter / Adjektiv'),
'otra':('adjective','otro','andere / noch eine','Begleiter / Adjektiv'),
'otras':('adjective','otro','andere','Begleiter / Adjektiv'),
'otros':('adjective','otro','andere','Begleiter / Adjektiv'),
'aquella':('determiner','aquel','jene / damals die','Demonstrativbegleiter, feminin'),
'aquel':('determiner','aquel','jener / damals der','Demonstrativbegleiter'),
'aquellos':('determiner','aquel','jene','Demonstrativbegleiter, Plural'),
'ese':('determiner','ese','dieser / jener','Demonstrativbegleiter'),
'esa':('determiner','ese','diese / jene','Demonstrativbegleiter, feminin'),
'eso':('pronoun','eso','das / jenes','Demonstrativpronomen'),
'este':('determiner','este','dieser','Demonstrativbegleiter'),
'esta':('determiner','este','diese','Demonstrativbegleiter'),
'esto':('pronoun','esto','das / dies','Demonstrativpronomen'),
'cada':('determiner','cada','jede / jeder','Begleiter'),
'algún':('determiner','alguno','irgendein','Begleiter'),
'ningún':('determiner','ninguno','kein','Begleiter'),
'miau':('interjection','miau','miau','Lautmalerei'),
'hay':('verb','haber','es gibt / da ist','Unpersönliche Präsensform von haber'),
'gracias':('interjection','gracias','danke','Dankesformel'),
'además':('adverb','además','außerdem','Adverb'),
'sino':('conjunction','sino','sondern','Gegenüberstellende Konjunktion'),
'lugar':('noun','lugar','Ort / Stelle / Platz','Substantiv, maskulin'),
'fueran':('verb','ser','wären / waren möglicherweise','Imperfecto de Subjuntivo, 3. Person Plural'),
'fuese':('verb','ser','wäre','Imperfecto de Subjuntivo'),
'sea':('verb','ser','sei / ist (Subjuntivo)','Subjuntivo Präsens, 3. Person Singular'),
'sean':('verb','ser','seien','Subjuntivo Präsens, 3. Person Plural'),
'pueda':('verb','poder','kann (Subjuntivo)','Subjuntivo Präsens, 1./3. Person Singular'),
'puedan':('verb','poder','können (Subjuntivo)','Subjuntivo Präsens, 3. Person Plural'),
'cerraran':('verb','cerrar','schlössen / schlossen (Subjuntivo)','Imperfecto de Subjuntivo, 3. Person Plural'),
'desapareciera':('verb','desaparecer','verschwände / verschwand (Subjuntivo)','Imperfecto de Subjuntivo, 1./3. Person Singular'),
'sintiera':('verb','sentir','empfände (Subjuntivo)','Imperfecto de Subjuntivo, 1./3. Person Singular'),
'acabara':('verb','acabar','hätte gerade … (in acabar de)','Imperfecto de Subjuntivo, 1./3. Person Singular'),
'siguiera':('verb','seguir','weiterhin wäre / bliebe (Subjuntivo)','Imperfecto de Subjuntivo, 1./3. Person Singular'),
'sería':('verb','ser','wäre','Konditional, 1./3. Person Singular'),
}
# Fill actually unknown infinitives previously left with a review placeholder.
infinitives={'esperar':'warten / hoffen','comprobar':'überprüfen','recuperar':'wiederbekommen / zurückholen',
 'protestar':'protestieren','cocinar':'kochen','explorar':'erkunden','tirar':'werfen / abreißen',
 'respirar':'atmen','guardar':'aufbewahren / verstauen','discutir':'diskutieren / streiten','caer':'fallen',
 'repartir':'verteilen','funcionar':'funktionieren','imaginar':'sich vorstellen','participar':'teilnehmen'}
ct=0
for st in d['stories']:
 for ch in st['chapters']:
  for s in ch['sentences']:
   toks=s['tokens']
   for i,t in enumerate(toks):
    w=t['text'].casefold()
    if w=='fuera':
     if 'fuera correcta' in s['es'].lower() or 'tal vez fuera' in s['es'].lower():v=('verb','ser','wäre / war vielleicht','Imperfecto de Subjuntivo, 1./3. Person Singular')
     else:v=('adverb','fuera','draußen / hinaus','Ortsadverb')
    elif w=='naranja':
     v=('adjective','naranja','orange / orangefarben','Unveränderliches Farbadjektiv') if any(z in s['es'].casefold() for z in ('gato naranja','de color naranja','y naranja','sorpresa pequeña. y naranja')) else None
    else:v=fixed.get(w)
    if v:
     t['pos'],t['lemma'],t['de'],t['form']=v;ct+=1
     if w=='fuera' and v[0]=='verb':t['note']='Ausdruck von Unsicherheit oder Vermutung; die genaue Übersetzung ergibt sich aus dem Kontext.'
    elif w in infinitives and 'zur Endkontrolle' in t['de']:
     t['pos']='verb';t['lemma']=w;t['de']=infinitives[w];t['form']='Infinitiv';ct+=1
    if w=='la' and i+1<len(toks) and toks[i+1]['pos']=='verb' and (i==0 or toks[i-1]['text'].casefold()!='de'):
     # Before a verb, 'la' usually works as object pronoun; protect cases such as "la llevaban".
     if toks[i+1]['text'].casefold() not in ('es','está','era'):
      t['pos']='pronoun';t['lemma']='la';t['de']='sie (direktes Objekt)';t['form']='Unbetontes direktes Objektpronomen, feminin';ct+=1
    if w=='lugar' and 'zur Endkontrolle' in t['de']:
     t['pos']='noun';t['lemma']='lugar';t['de']='Ort / Platz';t['form']='Substantiv, maskulin';ct+=1
left=[(t['text'],t['de']) for st in d['stories'] for ch in st['chapters'] for s in ch['sentences'] for t in s['tokens'] if 'zur Endkontrolle' in t['de']]
assert not left,left
p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
(p.parent/'catalog.js').write_text('window.PALABRA_STORY_CATALOG = '+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Lexical corrections:',ct,'| No placeholders | SRS deck untouched')
