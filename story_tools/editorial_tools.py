import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
cat=json.loads((ROOT/'stories/catalog.json').read_text(encoding='utf-8'))
for name in ('coco-a2','cine-a2','cine-b1'):
    text=(ROOT/'story_tools/manual_de'/f'{name}.txt').read_text(encoding='utf-8')
    sections={}; ch=None
    for line in text.splitlines():
        if line.startswith('## '):
            ch=line[3:].strip();sections[ch]={}
        elif line.strip():
            n,v=line.split('|',1); i=int(n)
            if i in sections[ch]:raise Exception(('duplicate',name,ch,i))
            sections[ch][i]=v
    st=next(x for x in cat['stories'] if x['id']==name)
    for chapter in st['chapters']:
        ss=chapter['sentences'];
        if chapter['id'] not in sections:continue
        trans=sections[chapter['id']];
        if sorted(trans)!=list(range(1,len(ss)+1)):raise Exception(('missing translation',name,chapter['id'],[i for i in range(1,len(ss)+1) if i not in trans]))
        for i,s in enumerate(ss,1):s['de']=trans[i]

# Purge unreviewed automatic syntactic role guesses and link proposals.
for st in cat['stories']:
    for ch in st['chapters']:
        for s in ch['sentences']:
            s['syntax']=[];s['groups']=[]
            s.pop('grammarFocus',None)

# A curated collection of learning moments. Every example receives a human-authored explanation.
# Format: edition, chapter, sentence number, heading, explanation, (phrase, short label, category)...
focus=[]
def F(st,ch,i,title,why,*spans):focus.append((st,ch,i,title,why,spans))

# Coco A1: frequent but selective explanations of fundamental sentence patterns.
F('coco-a1',1,1,'Ein vollständiger einfacher Satz','Pablo ist die Person, über die wir etwas erfahren. vive ist die konjugierte Verbform: Er wohnt.',('Pablo','Wer?','subject'),('vive','Was tut er?','verb'))
F('coco-a1',1,3,'So stellt man einen Namen vor','Su nombre bedeutet „sein Name“. Mit es wird der Name angegeben: „Sein Name ist Coco“.',('Su nombre','sein Name','detail'),('es','ist','verb'))
F('coco-a1',1,5,'Zwei Aussagen verbunden','pero bedeutet „aber“. Nach no wird die Aussage verneint: no quiere = er möchte nicht.',('Pero','aber','link'),('no quiere','möchte nicht','verb'))
F('coco-a1',1,6,'Eine Fahrt ankündigen','ir a + Ort heißt „an einen Ort gehen/fahren“. va ist die 3. Person Singular von ir.',('va a Madrid','fährt nach Madrid','verb'))
F('coco-a1',1,7,'Geburtstag auf Spanisch','Es el cumpleaños de … ist eine einfache Art, „… hat Geburtstag“ zu sagen. Wörtlich: „Es ist der Geburtstag von …“.',('el cumpleaños de su hermana Clara','der Geburtstag seiner Schwester Clara','detail'))
F('coco-a1',1,14,'Tú – du','Das Personalpronomen tú sagt ausdrücklich, wer gemeint ist. vienes ist die Verbform von venir für „du“.',('Tú','du','subject'),('vienes','du kommst','verb'))
F('coco-a1',1,20,'Fragen mit dónde','¿Dónde? fragt nach einem Ort: „Wo?“. estás ist die Form von estar für die 2. Person Singular (du).',('Dónde','wo','detail'),('estás','du bist','verb'))
F('coco-a1',1,17,'Es gibt / da ist','Hay bedeutet „es gibt“ oder „da ist“. Anders als tener drückt es hier nicht aus, wem etwas gehört.',('hay','es gibt','verb'))
F('coco-a1',2,2,'Eine Abfahrtszeit nennen','El tren ist das Subjekt; sale ist die Verbform von salir. Bei Abfahrten bedeutet salir „abfahren“.',('El tren','der Zug','subject'),('sale','fährt ab','verb'))
F('coco-a1',2,11,'Zwei kurze Hauptsätze','Pablo ist das Subjekt und abre ist das konjugierte Verb. la bolsa ist das, was er öffnet.',('Pablo','wer?','subject'),('abre','öffnet','verb'),('la bolsa','was?','detail'))
F('coco-a1',2,14,'Eine einfache Frage','¿Qué? = „was?“. haces ist die Form von hacer für tú: „du machst“.',('Qué','was','detail'),('haces','du machst','verb'))
F('coco-a1',2,25,'Eine Notwendigkeit ausdrücken','necesita heißt „braucht“. Das Subjekt Coco steht ausdrücklich davor.',('Coco','wer?','subject'),('necesita','braucht','verb'))
F('coco-a1',2,29,'Eine Uhrzeit nennen','Son las … verwendet man bei Uhrzeiten außer ein Uhr. Die Zahl zehn steht für zehn Uhr.',('Son las','es ist (Uhrzeit)','verb'))
F('coco-a1',2,32,'Gemeinsam etwas tun','tenemos ist die Form von tener für nosotros („wir“). Obwohl nosotros fehlt, zeigt die Verbform, wer gemeint ist.',('tenemos','wir müssen / wir haben','verb'))
F('coco-a1',3,4,'Eine Überraschung','Qué sorpresa! ist ein häufiger Ausruf: „Was für eine Überraschung!“ Das ist kein gewöhnlicher Aussagesatz.',('Qué sorpresa','was für eine Überraschung','detail'))
F('coco-a1',3,5,'Ein Geburtstagswunsch','¡Feliz cumpleaños! ist die feste Wendung „Alles Gute zum Geburtstag!“.',('Feliz cumpleaños','Alles Gute zum Geburtstag','detail'))
F('coco-a1',3,17,'Ein Geschenk geben','Pablo gibt; Clara bekommt etwas. Das Spanische verwendet dafür dar: Pablo da un regalo a Clara.',('Pablo','wer gibt?','subject'),('da','gibt','verb'),('a Clara','an wen?','detail'))
F('coco-a1',3,20,'Verneinung mit no','no steht direkt vor hay und macht daraus „es gibt nicht / da ist kein“.',('no hay','es gibt kein','verb'))
F('coco-a1',3,21,'Eine Frage mit por qué','¿Por qué? bedeutet „warum?“. In Fragen wird es getrennt und mit Akzent geschrieben.',('Por qué','warum','detail'))
F('coco-a1',3,33,'Wer macht das Foto?','Los tres bedeutet „alle drei“ und ist das Subjekt. Das Verb hacen steht in der 3. Person Plural.',('Los tres','alle drei','subject'),('hacen','machen','verb'))

# Coco A2: interesting past tenses, periphrases and object pronouns.
F('coco-a2',1,2,'le gehörte alles','le bezieht sich auf Coco: „ihm“. Bei pertenecer gehört die Sache jemandem: le pertenecían = „sie gehörten ihm“.',('le pertenecían','gehörten ihm','reference'))
F('coco-a2',1,4,'Vergangenheit im Hintergrund','estaba preparando beschreibt eine gerade ablaufende Handlung in der Vergangenheit: Pablo war dabei, die Reise vorzubereiten.',('estaba preparando','war dabei vorzubereiten','verb'))
F('coco-a2',1,5,'Ein Geschenk machen','darle = dar + le. Das angehängte le verweist auf Clara, die das Geschenk bekommen soll.',('darle','ihr geben','reference'))
F('coco-a2',1,12,'Eine Meinung ausdrücken','estar de acuerdo heißt „einverstanden sein“. Coco no parecía estar de acuerdo: Coco schien nicht einverstanden zu sein.',('estar de acuerdo','einverstanden sein','detail'))
F('coco-a2',1,19,'Zwei Zeitstufen in der Vergangenheit','regresó und descubrió erzählen Ereignisse. había olvidado blickt auf etwas zurück, das schon vorher passiert war.',('regresó','kehrte zurück','verb'),('había olvidado','hatte vergessen','verb'))
F('coco-a2',1,29,'lo: Wer wird gebracht?','lo steht hier für al gato / Coco. Spanisch nennt das direkte Objekt nicht jedes Mal erneut.',('lo llevó','brachte ihn','reference'))
F('coco-a2',1,42,'Lo que und ein erklärender Nebensatz','lo que no sabía = „was er nicht wusste“. Nach era que folgt die eigentliche Erklärung; mientras bedeutet „während“.',('Lo que no sabía','was er nicht wusste','clause'),('mientras hablaba con Rosa','während er mit Rosa sprach','clause'))
F('coco-a2',2,14,'lo verweist zurück','Dos ojos verdes lo miraban: lo meint Pablo, nicht die Augen. Die Augen schauten ihn an.',('lo miraban','schauten ihn an','reference'))
F('coco-a2',2,19,'Acabar de + Infinitiv','acaba de aparecer heißt „ist gerade aufgetaucht“. acabar de + Infinitiv beschreibt etwas, das unmittelbar zuvor geschehen ist.',('acaba de aparecer','ist gerade aufgetaucht','verb'))
F('coco-a2',2,22,'Verneinung mit sicher sein','no estaba seguro de que … führt hier den Subjuntivo fuera ein: Pablo war nicht sicher, ob „schön“ passend war.',('no estaba seguro de que','war nicht sicher, dass / ob','clause'),('fuera','wäre / war (Subjuntivo)','verb'))
F('coco-a2',2,38,'uno statt eines Nomens','uno steht für un transportín. Man muss die Transportbox nicht ein zweites Mal nennen.',('uno','eine (Transportbox)','reference'))
F('coco-a2',2,44,'Plusquamperfekt','había salido bedeutet „war abgefahren“: Der Zug war bereits weg, bevor Pablo auf die Uhr schaute.',('había salido','war abgefahren','verb'))
F('coco-a2',2,63,'Relativsatz mit que','que verbindet unas vacaciones mit der Aussage organiza … . las mías ersetzt mis vacaciones: „meine“.',('que mi gato organiza','die mein Kater organisiert','clause'),('las mías','meine (Ferien)','reference'))
F('coco-a2',3,2,'Vorvergangenheit','había dormido heißt „hatte geschlafen“ und beschreibt etwas, das bereits vor der Ankunft passiert war.',('Había dormido','hatte geschlafen','verb'))
F('coco-a2',3,9,'No sabía que …','no sabía que venías bedeutet „ich wusste nicht, dass du kommst“. venías ist Imperfecto von venir.',('No sabía que venías','ich wusste nicht, dass du kommst','clause'))
F('coco-a2',3,24,'le: Wem gibt Pablo das Geschenk?','le verweist auf Clara: Pablo überreichte ihr sein Geschenk. Anders als lo steht le hier für die Empfängerin.',('le entregó','übergab ihr','reference'))
F('coco-a2',3,43,'lo bezieht sich auf den Strumpf','lo steht für un calcetín rojo aus dem Satz davor. Weil calcetín männlich ist, lautet das Pronomen lo.',('Lo dejó','er legte ihn hin','reference'))
F('coco-a2',3,50,'Decidir + Infinitiv','decidieron hacerse una fotografía: Sie beschlossen, ein Foto von sich machen zu lassen. hacerse enthält das angehängte se.',('Decidieron hacerse','sie beschlossen, von sich ... machen zu lassen','verb'))
F('coco-a2',3,51,'Ein Grund mit porque','porque erklärt, weshalb das Foto misslang. Das ist ein einfacher begründender Nebensatz.',('porque el gato estaba mirando hacia otro lado','weil der Kater wegschaute','clause'))

# Cine A2: controlled grammar discoveries.
F('cine-a2',1,1,'Había = es gab','Hier ist había unpersönlich und heißt „es gab“. un cine ist dabei nicht das grammatische Subjekt.',('había','es gab','verb'))
F('cine-a2',1,4,'Llevar + Zeit + Zustand','llevaba doce años cerrado: „war seit zwölf Jahren geschlossen“. llevar beschreibt hier, wie lange etwas schon so ist.',('llevaba doce años cerrado','war seit zwölf Jahren geschlossen','clause'))
F('cine-a2',1,17,'Imperfecto für Gewohnheiten','era und iba beschreiben hier die Kindheit und regelmäßige Kinobesuche – deshalb Imperfecto statt Indefinido.',('Cuando era pequeña','als sie klein war','clause'),('iba al cine','ging regelmäßig ins Kino','verb'))
F('cine-a2',1,20,'No quiero que …','Nach querer que steht für einen Wunsch über jemand anderen der Subjuntivo: desaparezca.',('No quiero que','ich will nicht, dass','clause'),('desaparezca','verschwindet (Subjuntivo)','verb'))
F('cine-a2',1,32,'Acabar de + Infinitiv','acaba de encender: „hat gerade eingeschaltet“. Diese feste Konstruktion drückt die unmittelbare Vergangenheit aus.',('acaba de encender','hat gerade eingeschaltet','verb'))
F('cine-a2',1,43,'lo = die Eintrittskarte','lo verweist auf uno / un billete antiguo im Zusammenhang. Im Deutschen übersetzen wir sinngemäß „sie“ für die Eintrittskarte; Spanisch verwendet lo wegen billete (maskulin).',('lo sacó','zog es heraus','reference'))
F('cine-a2',2,33,'Plusquamperfekt und Bericht','habían visto bedeutet „sie hatten gesehen“: Die Beobachtung liegt vor Paulas Erklärung.',('habían visto','hatten gesehen','verb'))
F('cine-a2',2,36,'les = ihnen','les bezieht sich auf Paula und Nico. Inés erzählte ihnen etwas über ihren Großvater.',('Les contó','sie erzählte ihnen','reference'))
F('cine-a2',2,38,'Antes de que + Subjuntivo','vor einer befürchteten oder zukünftigen Handlung steht nach antes de que der Subjuntivo: desapareciera.',('antes de que','bevor','clause'),('desapareciera','verschwände (Subjuntivo)','verb'))
F('cine-a2',2,42,'Quiero demostrar que','Hier folgt auf quiero direkt der Infinitiv demostrar, da Inés selbst etwas tun möchte. Nach demostrar que steht die Feststellung mit puede im Indikativ. Das ist kein Subjuntivo-Fall.',('Quiero demostrar','ich möchte zeigen','verb'),('que este lugar todavía puede','dass dieser Ort weiterhin kann','clause'))
F('cine-a2',2,57,'ella bezieht sich auf die Frau','Junto a ella bedeutet „neben ihr“. ella verweist auf die Frau im unmittelbar vorherigen Satz.',('ella','ihr (der Frau)','reference'))
F('cine-a2',3,17,'Vorvergangenheit im Bericht','había limpiado: Inés hatte das Gebäude schon geputzt, als die Vorstellung begann.',('había limpiado','hatte geputzt','verb'))
F('cine-a2',3,24,'Ein Relativsatz mit que','que muchos vecinos recordaban beschreibt personas genauer: Menschen, an die sich viele Nachbarn erinnerten.',('que muchos vecinos recordaban','an die sich viele Nachbarn erinnerten','clause'))
F('cine-a2',3,39,'Quiero que + Subjuntivo','Inés wünscht sich eine weitere Chance für das Kino. Deshalb steht tenga (Subjuntivo) und nicht tiene.',('quiero que','ich möchte, dass','clause'),('tenga','bekommt (Subjuntivo)','verb'))
F('cine-a2',3,48,'Encargarse de','encargarse de algo heißt „sich um etwas kümmern / etwas übernehmen“. Das Pronomen me gehört zum reflexiven Verb.',('puedo encargarme de','ich kann mich kümmern um','verb'))

# B1: less frequent, deep cross-sentence and structural explanations.
F('cine-b1',1,1,'Zustand über einen Zeitraum','había permanecido cerrado ist Vorvergangenheit: „war geschlossen geblieben“. Durante doce años bezeichnet die Dauer, nicht das Subjekt.',('Durante doce años','zwölf Jahre lang','detail'),('el Cine Luna','das Cine Luna','subject'),('había permanecido cerrado','war geschlossen geblieben','verb'))
F('cine-b1',1,4,'Tal vez + Subjuntivo','tal vez drückt eine Vermutung aus. Mit fueran (Imperfecto de Subjuntivo von ser) wirkt die Aussage vorsichtig und hypothetisch. Die genannten Balkone sind hier eine mögliche Erklärung für die Schönheit des Kinos, kein direktes Objekt.',('Tal vez','vielleicht','clause'),('fueran','wären / waren vielleicht','verb'))
F('cine-b1',1,5,'Ellipse – ein unvollständiger Satz','Der Satz „O las pequeñas estrellas…“ hat kein ausgesprochenes Verb. Gedanklich wird „tal vez fueran“ aus dem vorherigen Satz wiederholt.',('O','oder','link'),('las pequeñas estrellas','die kleinen Sterne','detail'))
F('cine-b1',1,8,'Früher regelmäßig','la llevaba … los sábados: llev(a)ba beschreibt eine Gewohnheit aus der Kindheit, keinen einmaligen Kinobesuch.',('la llevaba','nahm sie mit','reference'),('los sábados','samstags','detail'))
F('cine-b1',1,28,'Das Vorhaben: iba a + Infinitiv','iba a responder bedeutet „war im Begriff zu antworten“. Es ist nicht einfach eine Bewegung zu einem Ort.',('iba a responder','wollte gerade antworten','verb'))
F('cine-b1',1,50,'Perspektive mit subjuntivo','que no sea un fantasma steht nach demonstrar que in der verneinten Konstruktion „du kannst nicht beweisen, dass …“. sea ist Subjuntivo.',('que no sea un fantasma','dass es kein Geist ist (Subjuntivo)','clause'))
F('cine-b1',1,11,'Eine häufige Konstruktion','estar a punto de + Infinitiv: „gerade im Begriff sein, etwas zu tun“. Hier beschreibt sie eine fast erfolgte Handlung.',('estaba a punto de','war kurz davor','verb'))
F('cine-b1',1,44,'Einleitendes lo','lo del coche bedeutet ungefähr „das mit dem Auto“. lo bezieht sich hier nicht auf ein bestimmtes männliches Substantiv.',('lo del coche','die Sache mit dem Auto','reference'))
F('cine-b1',1,77,'Das Subjekt steckt im Zusammenhang','distinguió heißt „er/sie erkannte“. Aus dem vorherigen Zusammenhang wissen wir, dass Paula die Gestalt hinter der Scheibe erkannte. Das Pronomen ella muss nicht stehen.',('distinguió','sie erkannte','verb'))
F('cine-b1',2,7,'Gleichzeitige Hintergrundhandlungen','estaban cerrando und comenzaba a caer beschreiben laufende Vorgänge im Hintergrund, während Paula und Nico ankamen.',('estaban cerrando','schlossen gerade','verb'),('comenzaba a caer','begann zu fallen','verb'))
F('cine-b1',2,25,'Bis etwas geschieht: antes de que','antes de que aparezca steht mit Subjuntivo, weil das Auftauchen einer maskierten Person nur befürchtet wird.',('antes de que aparezca','bevor jemand erscheint','clause'))
F('cine-b1',2,34,'Al + Infinitiv','Al llegar bedeutet hier „als sie ankamen“. Al + Infinitiv kann einen zeitlichen Nebensatz ersetzen.',('Al llegar','als sie ankamen','clause'))
F('cine-b1',2,50,'No … sino …','nicht berühmte Filme, sondern Aufnahmen: no … sino … stellt einen Gegensatz her, bei dem das Zweite das Erste ersetzt.',('No eran películas famosas, sino grabaciones','es waren keine berühmten Filme, sondern Aufnahmen','clause'))
F('cine-b1',2,58,'Querer que + Subjuntivo','quiero que recuerden: Inés möchte, dass sich die Verantwortlichen erinnern. recuerden steht deswegen im Subjuntivo.',('quiero que recuerden','ich möchte, dass sie sich erinnern','clause'))
F('cine-b1',2,67,'Vergangener Wunsch mit que','Quería que la gente sintiera …: Nach einem Wunsch in der Vergangenheit steht in der abhängigen Aussage der Imperfecto de Subjuntivo: sintiera.',('Quería que','ich wollte, dass','clause'),('sintiera','empfinden würde (Subjuntivo)','verb'))
F('cine-b1',2,80,'Das Herz macht einen Sprung','sentir que el corazón le daba un vuelco ist eine bildhafte Redewendung: Paula erschrickt bzw. ist plötzlich sehr aufgewühlt. le bezieht sich auf Paula.',('el corazón le daba un vuelco','ihr Herz machte einen Sprung','reference'))
F('cine-b1',2,95,'Como si + Subjuntivo','como si leitet einen Vergleich mit einer vorgestellten Situation ein. Deshalb stehen acabara und die hypothetische Bedeutung „als hätte sie …“.',('Como si','als ob / als hätte','clause'),('acabara de reconocer','gerade wiedererkannt hätte','verb'))
F('cine-b1',3,3,'Langer Relativsatz mit Rückbezug','que había saludado a una cámara beschreibt das Mädchen. que volvería a verse beschreibt eine Zukunft aus der damaligen Vergangenheit: Sie würde sich später wiedersehen.',('que había saludado','das gewinkt hatte','clause'),('que volvería a verse','dass es sich wiedersehen würde','clause'))
F('cine-b1',3,17,'Antes de que + Subjuntivo','antes de que cerraran el cine: bevor das Kino schloss. Nach antes de que steht der Subjuntivo (cerraran), wenn er eine noch ausstehende Handlung aus der damaligen Perspektive beschreibt.',('antes de que cerraran el cine','bevor sie das Kino schlossen','clause'))
F('cine-b1',3,37,'Ein Pronomen ersetzt viel Text','comprobándola = comprobando + la. la verweist auf la calidad aus dem Satz davor: Nico prüft „sie“ (die Qualität).',('comprobándola','sie überprüfend (die Qualität)','reference'))
F('cine-b1',3,59,'Eine Erklärung innerhalb des Satzes','donde ver películas beschreibt lugar. No era solamente un lugar donde … = „Es war nicht nur ein Ort, an dem …“.',('donde ver películas','an dem man Filme ansieht','clause'))
F('cine-b1',3,76,'Gerundio: Ergebnis einer Entwicklung','terminó convirtiéndose en lágrimas: terminar + Gerundio bedeutet, dass ein Vorgang schließlich in etwas anderem endet.',('terminó convirtiéndose en lágrimas','wurde schließlich zu Tränen','verb'))
F('cine-b1',3,85,'Passiv mit se','se decidirá bedeutet hier „es wird entschieden“. Die verantwortlichen Personen werden nicht genannt; das Thema wird in den Vordergrund gestellt.',('se decidirá','es wird entschieden','verb'))
F('cine-b1',3,92,'Konditional für eine vorsichtige Einschätzung','sería justo = „es wäre richtig“. Bevor eine Entscheidung fällt, formuliert die Sprecherin ihre Einschätzung vorsichtig.',('sería justo','es wäre richtig','verb'))
F('cine-b1',3,103,'Gracias por + Infinitiv','Gracias por enseñarnos … heißt „Danke, dass du uns … gezeigt hast“. -nos in enseñarnos bedeutet „uns“.',('Gracias por enseñarnos','danke, dass du uns gezeigt hast','reference'))
F('cine-b1',3,110,'Volver a + Infinitiv','había vuelto a llenarse: volver a + Infinitiv bedeutet, dass etwas erneut geschieht; hier: „war wieder voll geworden“.',('había vuelto a llenarse','war wieder voll geworden','verb'))
F('cine-b1',3,131,'Por si acaso','por si acaso bedeutet „für alle Fälle / sicherheitshalber“. Mit quería que siguiera … wird ein Wunsch in der Vergangenheit formuliert; siguiera steht im Subjuntivo.',('Por si acaso','für alle Fälle','detail'),('quería que el cine siguiera','sie wollte, dass das Kino weiterhin …','clause'))

# Apply manually reviewed notes, strictly validate every highlighted phrase.
def ids_for(s,frag):
    starts=[];offset=0
    for t in s['tokens']:
        offset+=len(t['before']);starts.append((t['id'],offset,offset+len(t['text'])));offset+=len(t['text'])
    match=re.search(re.escape(frag),s['es'],flags=re.I)
    if not match:raise ValueError(('phrase missing',s['id'],frag,s['es']))
    a,b=match.span(); found=[id for id,x,y in starts if x<b and y>a]
    if not found:raise ValueError(('no tokens',s['id'],frag))
    return found
for st,ch,i,title,why,spans in focus:
    ed=next(a for a in cat['stories'] if a['id']==st)
    
    if not (0<=i-1<len(ed['chapters'][ch-1]['sentences'])):raise Exception(('out of range',st,ch,i,title))
    s=ed['chapters'][ch-1]['sentences'][i-1]
    s['grammarFocus']={'title':title,'why':why,'spans':[{'members':ids_for(s,fragment),'label':label,'kind':kind} for fragment,label,kind in spans]}

out=ROOT/'stories/catalog.json'
out.write_text(json.dumps(cat,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
(ROOT/'stories/catalog.js').write_text('window.PALABRA_STORY_CATALOG = '+json.dumps(cat,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

print('EDITION/CHAPTER: total, translated, grammar')
for ed in cat['stories']:
    for ch in ed['chapters']:
        s=ch['sentences'];print(ed['id'],ch['id'],len(s),sum(bool(t['de']) for t in s),sum(bool(t.get('grammarFocus')) for t in s))
print('TOTAL',sum(len(c['sentences']) for e in cat['stories'] for c in e['chapters']),'FOCI',len(focus))
