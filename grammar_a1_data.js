/* Palabra Grammar A1 – kuratierte Kursinhalte, 16 Module / 48 Lektionen, 0.7a.2. */
window.PalabraA1Curriculum = {
 "version": "0.7a.2",
 "modules": [
  {
   "id": "a1-01",
   "number": "01",
   "title": "Spanisch lesen und verstehen",
   "subtitle": "Laute, Betonung und Akzente",
   "tagline": "Die Schrift wird zum Wegweiser.",
   "lessons": [
    {
     "id": "a1-01-1",
     "title": "Die Buchstaben sprechen",
     "bridge": "Im Deutschen klingt „j“ oft wie in „ja“. Im Spanischen ist das anders.",
     "example": "José vive aquí.",
     "translation": "José wohnt hier.",
     "rule": "Spanische Schrift ist vergleichsweise lautgetreu. Das spanische j wird in vielen Varietäten als rauer oder weicher Reibelaut gesprochen, nicht wie deutsches j.",
     "watch": "Für Spanien und Lateinamerika gibt es mehrere gebräuchliche Aussprachen. Unsere Schreibweise bleibt gleich.",
     "quiz": {
      "question": "Welcher Buchstabe klingt in „José“ anders als das deutsche „j“?",
      "choices": [
       "é",
       "s",
       "j"
      ],
      "correct": 2,
      "explanation": "Das j hat einen anderen Lautwert; die Form „vive“ bedeutet „wohnt/lebt“."
     },
     "production": {
      "prompt": "José wohnt hier.",
      "answers": [
       "José vive aquí."
      ]
     },
     "builder": {
      "prompt": "José wohnt hier.",
      "tokens": [
       "José",
       "vive",
       "aquí."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-01-2",
     "title": "Ein stiller Anfang",
     "bridge": "Im Deutschen hören wir das h in „Haus“. Im Spanischen bleibt h normalerweise stumm.",
     "example": "Hola, Hannah.",
     "translation": "Hallo, Hannah.",
     "rule": "Das spanische h wird normalerweise nicht ausgesprochen. Die Buchstabenkombination ch ist ein eigener Laut und keine Ausnahme mit ausgesprochenem h.",
     "watch": "Nicht vom Deutschen auf die Aussprache schließen.",
     "quiz": {
      "question": "Welche Aussage über „hola“ ist richtig?",
      "choices": [
       "Das h bleibt stumm",
       "Das h klingt wie in Haus",
       "Das h klingt wie ein deutsches ch"
      ],
      "correct": 0,
      "explanation": "Die Begrüßung „hola“ beginnt schriftlich mit h – gesprochen hörst du es nicht."
     },
     "production": {
      "prompt": "Hallo, Ana.",
      "answers": [
       "Hola, Ana."
      ]
     },
     "builder": {
      "prompt": "Hallo, Hannah.",
      "tokens": [
       "Hola,",
       "Hannah."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-01-3",
     "title": "Betonung sichtbar machen",
     "bridge": "Auch Deutsch hat betonte Silben. Spanisch macht Ausnahmen durch einen Akzent oft sichtbar.",
     "example": "Mi amigo está aquí.",
     "translation": "Mein Freund ist hier.",
     "rule": "Bei Wörtern, die auf Vokal, n oder s enden, liegt die Betonung normalerweise auf der vorletzten Silbe; bei anderen Endungen normalerweise auf der letzten. Geschriebene Akzente markieren Abweichungen und manchmal Bedeutungsunterschiede.",
     "watch": "Ein Akzent ist keine Dekoration. „esta“ und „está“ sind verschiedene Formen.",
     "quiz": {
      "question": "Welches Wort trägt einen geschriebenen Betonungsakzent?",
      "choices": [
       "mi",
       "está",
       "amigo"
      ],
      "correct": 1,
      "explanation": "In „está“ zeigt der Akzent die Betonung auf der letzten Silbe."
     },
     "production": {
      "prompt": "Mein Freund ist hier.",
      "answers": [
       "Mi amigo está aquí."
      ]
     },
     "builder": {
      "prompt": "Mein Freund ist hier.",
      "tokens": [
       "Mi",
       "amigo",
       "está",
       "aquí."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-02",
   "number": "02",
   "title": "Ich, du, wir",
   "subtitle": "Personalpronomen und wer spricht",
   "tagline": "Ein Verb verrät oft schon die Person.",
   "lessons": [
    {
     "id": "a1-02-1",
     "title": "Wer spricht?",
     "bridge": "Im Deutschen wechseln wir „ich“, „du“, „wir“. Spanisch hat entsprechende Personalpronomen.",
     "example": "Yo estudio español.",
     "translation": "Ich lerne Spanisch.",
     "rule": "Yo bedeutet ich, tú bedeutet du. Spanisch unterscheidet unter anderem Person und Anzahl – genauso wie Deutsch.",
     "watch": "„Tú“ (du) mit Akzent ist nicht „tu“ (dein).",
     "quiz": {
      "question": "Welches Pronomen bedeutet „ich“?",
      "choices": [
       "yo",
       "tú",
       "él"
      ],
      "correct": 0,
      "explanation": "Du kannst „yo“ nennen; oft ist es nicht nötig."
     },
     "production": {
      "prompt": "Ich lerne Spanisch.",
      "answers": [
       "Yo estudio español.",
       "Estudio español."
      ]
     },
     "builder": {
      "prompt": "Ich lerne Spanisch.",
      "tokens": [
       "Yo",
       "estudio",
       "español."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-02-2",
     "title": "Die Endung spricht mit",
     "bridge": "Deutsch: ich lerne, du lernst. Auch Spanisch verändert die Verbendung.",
     "example": "Tú estudias español.",
     "translation": "Du lernst Spanisch.",
     "rule": "„Estudio“ und „estudias“ gehören zu estudiar. Die Endung zeigt, welche Person gemeint ist; deshalb lässt sich das Subjektpronomen oft weglassen.",
     "watch": "„Estudias“ ist du, nicht ich.",
     "quiz": {
      "question": "Welche Form gehört zu „tú“?",
      "choices": [
       "estudiamos",
       "estudias",
       "estudio"
      ],
      "correct": 1,
      "explanation": "Die Endung -as zeigt hier die zweite Person Singular."
     },
     "production": {
      "prompt": "Du lernst Spanisch.",
      "answers": [
       "Tú estudias español.",
       "Estudias español."
      ]
     },
     "builder": {
      "prompt": "Du lernst Spanisch.",
      "tokens": [
       "Tú",
       "estudias",
       "español."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-02-3",
     "title": "Ihr, Sie und ustedes",
     "bridge": "Deutsch unterscheidet „ihr“ und das höfliche „Sie“. Spanisch hat zusätzlich regionale Unterschiede.",
     "example": "Vosotros habláis español.",
     "translation": "Ihr sprecht Spanisch.",
     "rule": "In Spanien wird vosotros/vosotras im informellen Plural verwendet. In Lateinamerika steht dafür normalerweise ustedes. Usted ist die höfliche Anrede im Singular und verwendet Verbformen der dritten Person.",
     "watch": "„Ustedes“ heißt nicht überall automatisch „Sie“ im höflichen Sinn.",
     "quiz": {
      "question": "Welche informelle Pluralform ist in Spanien üblich?",
      "choices": [
       "usted",
       "yo",
       "vosotros"
      ],
      "correct": 2,
      "explanation": "Wir lernen auch vosotros; regionale Varianten erklären wir jeweils mit."
     },
     "production": {
      "prompt": "Ihr sprecht Spanisch.",
      "answers": [
       "Vosotros habláis español.",
       "Vosotras habláis español."
      ]
     },
     "builder": {
      "prompt": "Ihr sprecht Spanisch.",
      "tokens": [
       "Vosotros",
       "habláis",
       "español."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-03",
   "number": "03",
   "title": "Nomen und ihre Begleiter",
   "subtitle": "Artikel, Genus und Plural",
   "tagline": "Wörter bilden kleine Teams.",
   "lessons": [
    {
     "id": "a1-03-1",
     "title": "El oder la?",
     "bridge": "Deutsch kennt der, die, das. Spanisch unterscheidet bei Nomen meist maskulin und feminin.",
     "example": "El libro está aquí.",
     "translation": "Das Buch ist hier.",
     "rule": "El ist der bestimmte maskuline Singularartikel, la der feminine. Die Wortart „Nomen“ ist nicht dasselbe wie die grammatische Rolle im Satz.",
     "watch": "Das grammatische Geschlecht lässt sich nicht immer an der Endung erkennen: el día, la mano.",
     "quiz": {
      "question": "Welcher Artikel gehört zu „libro“?",
      "choices": [
       "las",
       "el",
       "la"
      ],
      "correct": 1,
      "explanation": "„El libro“ ist maskulin, obwohl „Buch“ im Deutschen sächlich ist."
     },
     "production": {
      "prompt": "Das Buch ist hier.",
      "answers": [
       "El libro está aquí."
      ]
     },
     "builder": {
      "prompt": "Das Buch ist hier.",
      "tokens": [
       "El",
       "libro",
       "está",
       "aquí."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-03-2",
     "title": "Ein Buch oder das Buch?",
     "bridge": "Deutsch: ein Buch vs. das Buch. Spanisch unterscheidet ebenfalls unbestimmt und bestimmt.",
     "example": "Una amiga lee un libro.",
     "translation": "Eine Freundin liest ein Buch.",
     "rule": "Un/una stellen eine Person oder Sache oft neu vor; el/la verweisen auf etwas im Kontext Bestimmtes. Das ist die Grundidee, die später noch Nuancen erhält.",
     "watch": "Nicht jeden deutschen Artikel gedankenlos eins zu eins übersetzen.",
     "quiz": {
      "question": "Welcher Artikel ist unbestimmt?",
      "choices": [
       "la",
       "el",
       "una"
      ],
      "correct": 2,
      "explanation": "„Una“ passt zu amiga und „un“ zu libro."
     },
     "production": {
      "prompt": "Eine Freundin liest ein Buch.",
      "answers": [
       "Una amiga lee un libro."
      ]
     },
     "builder": {
      "prompt": "Eine Freundin liest ein Buch.",
      "tokens": [
       "Una",
       "amiga",
       "lee",
       "un",
       "libro."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-03-3",
     "title": "Viele Bücher",
     "bridge": "Auch im Deutschen verändern sich Artikel und Nomen im Plural.",
     "example": "Los libros son interesantes.",
     "translation": "Die Bücher sind interessant.",
     "rule": "Bei vielen Nomen kommt im Plural -s nach Vokal und -es nach Konsonant. Bestimmte Artikel werden los/las.",
     "watch": "Nicht jedes Wort bildet den Plural regelmäßig; das üben wir später genauer.",
     "quiz": {
      "question": "Wie lautet der Plural von „el libro“?",
      "choices": [
       "los libros",
       "las libro",
       "el libros"
      ],
      "correct": 0,
      "explanation": "Artikel, Nomen und später auch Adjektive müssen zusammenpassen."
     },
     "production": {
      "prompt": "Die Bücher sind interessant.",
      "answers": [
       "Los libros son interesantes."
      ]
     },
     "builder": {
      "prompt": "Die Bücher sind interessant.",
      "tokens": [
       "Los",
       "libros",
       "son",
       "interesantes."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-04",
   "number": "04",
   "title": "Menschen und Dinge beschreiben",
   "subtitle": "Adjektive und Angleichung",
   "tagline": "Eigenschaften passen sich an.",
   "lessons": [
    {
     "id": "a1-04-1",
     "title": "Adjektive passen sich an",
     "bridge": "Deutsch: ein kleiner Hund, zwei kleine Hunde. Spanisch gleicht Adjektive häufig an.",
     "example": "La casa es bonita.",
     "translation": "Das Haus ist schön.",
     "rule": "Bonito wird in dieser Verwendung bei feminin Singular zu bonita. Adjektive richten sich oft nach Genus und Numerus des Nomens.",
     "watch": "Manche Adjektive, etwa inteligente, haben dieselbe Singularform für beide Genera.",
     "quiz": {
      "question": "Welches Adjektiv passt zu „la casa“?",
      "choices": [
       "bonito",
       "bonitos",
       "bonita"
      ],
      "correct": 2,
      "explanation": "Casa ist feminin: deshalb bonita."
     },
     "production": {
      "prompt": "Das Haus ist schön.",
      "answers": [
       "La casa es bonita."
      ]
     },
     "builder": {
      "prompt": "Das Haus ist schön.",
      "tokens": [
       "La",
       "casa",
       "es",
       "bonita."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-04-2",
     "title": "Mehrere Personen beschreiben",
     "bridge": "Deutsch: Die Kinder sind müde. Spanisch markiert ebenfalls den Plural.",
     "example": "Los gatos son pequeños.",
     "translation": "Die Kater sind klein.",
     "rule": "Bei „pequeño“ wird aus Singular „pequeños“ im maskulinen Plural. Die Form „pequeñas“ wäre feminin Plural.",
     "watch": "Bei gemischten Gruppen wird traditionell meist die maskuline Pluralform verwendet.",
     "quiz": {
      "question": "Welche Form passt zu „los gatos“?",
      "choices": [
       "pequeños",
       "pequeña",
       "pequeño"
      ],
      "correct": 0,
      "explanation": "Im Plural bekommen hier Nomen, Artikel und Adjektiv ein -s."
     },
     "production": {
      "prompt": "Die Kater sind klein.",
      "answers": [
       "Los gatos son pequeños."
      ]
     },
     "builder": {
      "prompt": "Die Kater sind klein.",
      "tokens": [
       "Los",
       "gatos",
       "son",
       "pequeños."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-04-3",
     "title": "Vor oder nach dem Nomen?",
     "bridge": "Deutsch stellt Adjektive meist vor das Nomen. Im Spanischen stehen beschreibende Adjektive häufig dahinter.",
     "example": "Tengo un coche rojo.",
     "translation": "Ich habe ein rotes Auto.",
     "rule": "Farbadjektive stehen normalerweise nach dem Nomen: un coche rojo. Andere Adjektive können auch davor stehen; manchmal ändert sich dadurch ihre Bedeutung.",
     "watch": "„Un viejo amigo“ und „un amigo viejo“ können Unterschiedliches hervorheben.",
     "quiz": {
      "question": "Wo steht „rojo“ im Beispielsatz?",
      "choices": [
       "Vor un",
       "Hinter coche",
       "Vor tengo"
      ],
      "correct": 1,
      "explanation": "Beachte die typische Reihenfolge Nomen + Farbe."
     },
     "production": {
      "prompt": "Ich habe ein rotes Auto.",
      "answers": [
       "Tengo un coche rojo."
      ]
     },
     "builder": {
      "prompt": "Ich habe ein rotes Auto.",
      "tokens": [
       "Tengo",
       "un",
       "coche",
       "rojo."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-05",
   "number": "05",
   "title": "Die spanische Verbmaschine",
   "subtitle": "Regelmäßiges Präsens",
   "tagline": "Du veränderst die Endung – und damit die Aussage.",
   "lessons": [
    {
     "id": "a1-05-1",
     "title": "-ar: Stamm und Endung",
     "bridge": "Deutsch: lernen → ich lerne. Spanisch: hablar → hablo.",
     "example": "Yo hablo español.",
     "translation": "Ich spreche Spanisch.",
     "rule": "Bei regelmäßigen -ar-Verben entfällt das -ar des Infinitivs. Für yo tritt -o an den Stamm: habl-ar → habl-o.",
     "watch": "Der Infinitiv ist die Grundform, nicht die Form für „ich“.",
     "quiz": {
      "question": "Welche Form heißt „ich spreche“?",
      "choices": [
       "hablo",
       "hablar",
       "hablas"
      ],
      "correct": 0,
      "explanation": "Der Stamm bleibt habl-, die Endung zeigt die Person."
     },
     "production": {
      "prompt": "Ich spreche Spanisch.",
      "answers": [
       "Yo hablo español.",
       "Hablo español."
      ]
     },
     "builder": {
      "prompt": "Ich spreche Spanisch.",
      "tokens": [
       "Yo",
       "hablo",
       "español."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-05-2",
     "title": "-er: eine zweite Familie",
     "bridge": "Deutsch: Wir essen. Spanisch: comemos.",
     "example": "Nosotros comemos juntos.",
     "translation": "Wir essen zusammen.",
     "rule": "Bei regelmäßigen -er-Verben bilden wir unter anderem yo como, tú comes, él come, nosotros comemos. Vergleiche die Endungen mit -ar.",
     "watch": "„Comamos“ gehört nicht zum normalen Präsens Indikativ von comer.",
     "quiz": {
      "question": "Welche Form heißt „wir essen“?",
      "choices": [
       "comes",
       "comemos",
       "comen"
      ],
      "correct": 1,
      "explanation": "-emos zeigt beim regelmäßigen -er-Verb die 1. Person Plural an."
     },
     "production": {
      "prompt": "Wir essen zusammen.",
      "answers": [
       "Nosotros comemos juntos.",
       "Comemos juntos."
      ]
     },
     "builder": {
      "prompt": "Wir essen zusammen.",
      "tokens": [
       "Nosotros",
       "comemos",
       "juntos."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-05-3",
     "title": "-ir: noch eine Endung",
     "bridge": "Deutsch: Sie leben hier. Spanisch: viven aquí.",
     "example": "Ellos viven aquí.",
     "translation": "Sie wohnen hier.",
     "rule": "Regelmäßige -ir-Verben haben eigene Pluralendungen: vivimos (wir leben), vivís (ihr lebt), viven (sie leben). Im Singular ähneln sie -er-Verben.",
     "watch": "„Vivimos“ und „vivís“ enthalten keinen Schreibfehler: Die Akzentregel ist Teil der Form.",
     "quiz": {
      "question": "Welche Form passt zu „vosotros“ bei vivir?",
      "choices": [
       "vivimos",
       "viven",
       "vivís"
      ],
      "correct": 2,
      "explanation": "Bei -ir-Verben lautet die vosotros-Endung im Präsens -ís."
     },
     "production": {
      "prompt": "Ihr wohnt hier.",
      "answers": [
       "Vosotros vivís aquí.",
       "Vosotras vivís aquí."
      ]
     },
     "builder": {
      "prompt": "Sie wohnen hier.",
      "tokens": [
       "Ellos",
       "viven",
       "aquí."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-06",
   "number": "06",
   "title": "Verben mit Besonderheiten",
   "subtitle": "Häufige unregelmäßige Verben",
   "tagline": "Muster erkennen statt Tabellen fürchten.",
   "lessons": [
    {
     "id": "a1-06-1",
     "title": "Ir und tener",
     "bridge": "Deutsch sagt „ich gehe“ und „ich habe“. Spanisch hat eigene unregelmäßige Muster.",
     "example": "Voy a casa.",
     "translation": "Ich gehe nach Hause.",
     "rule": "Ir bildet voy, vas, va, vamos, vais, van. Tener: tengo, tienes, tiene, tenemos, tenéis, tienen. Hier lernt man wiederkehrende Muster statt alle Formen als Einzelwörter.",
     "watch": "„Voy“ ist nicht von einem regelmäßigen Stamm „i-“ abgeleitet.",
     "quiz": {
      "question": "Welche Form von ir bedeutet „ich gehe“?",
      "choices": [
       "van",
       "voy",
       "va"
      ],
      "correct": 1,
      "explanation": "Voy ist die yo-Form von ir."
     },
     "production": {
      "prompt": "Ich gehe nach Hause.",
      "answers": [
       "Voy a casa."
      ]
     },
     "builder": {
      "prompt": "Ich gehe nach Hause.",
      "tokens": [
       "Voy",
       "a",
       "casa."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-06-2",
     "title": "Ein Vokal verändert sich",
     "bridge": "Manche Verben ändern den Stamm in mehreren Präsensformen.",
     "example": "Quiero aprender español.",
     "translation": "Ich möchte Spanisch lernen.",
     "rule": "Querer wird bei yo zu quiero und bei tú zu quieres, aber bei nosotros zu queremos. Das e → ie zeigt sich in betonten Stammpositionen.",
     "watch": "Nicht alle Personen haben einen Stammwechsel; nosotros/vosotros gewöhnlich nicht.",
     "quiz": {
      "question": "Welche Form gehört zu „nosotros“ bei querer?",
      "choices": [
       "quieremos",
       "quieren",
       "queremos"
      ],
      "correct": 2,
      "explanation": "Hier steht querer + Infinitiv."
     },
     "production": {
      "prompt": "Ich möchte Spanisch lernen.",
      "answers": [
       "Quiero aprender español."
      ]
     },
     "builder": {
      "prompt": "Ich möchte Spanisch lernen.",
      "tokens": [
       "Quiero",
       "aprender",
       "español."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-06-3",
     "title": "Ich mache – und andere ich-Formen",
     "bridge": "Manche Verben haben eine auffällige erste Person Singular.",
     "example": "Hago la cena.",
     "translation": "Ich mache das Abendessen.",
     "rule": "Hacer wird zu hago, salir zu salgo, venir zu vengo. Solche yo-Formen sind wichtig im Alltag.",
     "watch": "„Haco“ wäre keine korrekte yo-Form von hacer.",
     "quiz": {
      "question": "Was bedeutet „hago“?",
      "choices": [
       "ich mache",
       "du machst",
       "wir machen"
      ],
      "correct": 0,
      "explanation": "Hacer hat die unregelmäßige yo-Form hago."
     },
     "production": {
      "prompt": "Ich mache das Abendessen.",
      "answers": [
       "Hago la cena."
      ]
     },
     "builder": {
      "prompt": "Ich mache das Abendessen.",
      "tokens": [
       "Hago",
       "la",
       "cena."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-07",
   "number": "07",
   "title": "Ser, estar und tener",
   "subtitle": "Identität, Zustand und typische Ausdrücke",
   "tagline": "Ein deutsches „sein“ – zwei spanische Verben.",
   "lessons": [
    {
     "id": "a1-07-1",
     "title": "Ser: Wer oder was ist es?",
     "bridge": "Deutsch verwendet „sein“ für sehr unterschiedliche Aussagen.",
     "example": "Soy estudiante.",
     "translation": "Ich bin Student oder Studentin.",
     "rule": "Ser steht häufig bei Identität, Herkunft, Beruf oder Einordnung: soy, eres, es, somos, sois, son. Die Unterscheidung ist keine einfache Regel „dauerhaft“.",
     "watch": "Berufe stehen nach ser in einfachen Aussagen oft ohne Artikel: soy estudiante.",
     "quiz": {
      "question": "Welche Form heißt „wir sind“ bei ser?",
      "choices": [
       "estamos",
       "son",
       "somos"
      ],
      "correct": 2,
      "explanation": "Mit ser sagst du hier, wer du bist."
     },
     "production": {
      "prompt": "Ich bin Student.",
      "answers": [
       "Soy estudiante."
      ]
     },
     "builder": {
      "prompt": "Ich bin Student oder Studentin.",
      "tokens": [
       "Soy",
       "estudiante."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-07-2",
     "title": "Estar: Wo oder wie?",
     "bridge": "Deutsch „ich bin müde“ nutzt sein. Spanisch benutzt estar.",
     "example": "Estoy cansado.",
     "translation": "Ich bin müde (männlicher Sprecher).",
     "rule": "Estar steht oft bei Zuständen und Aufenthaltsorten: estoy, estás, está, estamos, estáis, están. Adjektive können mit ser und estar die Bedeutung verändern.",
     "watch": "Cansado/cansada richtet sich nach der beschriebenen Person, nicht nach dem Verb.",
     "quiz": {
      "question": "Welche Form heißt „ich bin“ bei estar?",
      "choices": [
       "estoy",
       "soy",
       "está"
      ],
      "correct": 0,
      "explanation": "Estar beschreibt hier einen Zustand."
     },
     "production": {
      "prompt": "Ich bin müde.",
      "answers": [
       "Estoy cansado.",
       "Estoy cansada."
      ]
     },
     "builder": {
      "prompt": "Ich bin müde (männlicher Sprecher).",
      "tokens": [
       "Estoy",
       "cansado."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-07-3",
     "title": "Tener: Ich habe Hunger",
     "bridge": "Deutsch sagt „ich bin hungrig“. Spanisch sagt häufig „ich habe Hunger“.",
     "example": "Tengo hambre.",
     "translation": "Ich habe Hunger.",
     "rule": "Für Alter, Hunger, Durst oder Angst nutzt Spanisch oft tener: tengo veinte años, tengo hambre, tengo miedo. Das ist eine Konstruktion, keine wörtliche Kopie des Deutschen.",
     "watch": "„Soy veinte años“ ist falsch, wenn du dein Alter nennen willst.",
     "quiz": {
      "question": "Wie sagt man „ich habe Hunger“?",
      "choices": [
       "estoy hambre",
       "tengo hambre",
       "soy hambre"
      ],
      "correct": 1,
      "explanation": "Manche Konzepte werden mit einer anderen Verbwahl ausgedrückt."
     },
     "production": {
      "prompt": "Ich habe Hunger.",
      "answers": [
       "Tengo hambre."
      ]
     },
     "builder": {
      "prompt": "Ich habe Hunger.",
      "tokens": [
       "Tengo",
       "hambre."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-08",
   "number": "08",
   "title": "Fragen, Antworten, Verneinung",
   "subtitle": "Fragewörter und klare Antworten",
   "tagline": "So entstehen echte kleine Gespräche.",
   "lessons": [
    {
     "id": "a1-08-1",
     "title": "Fragen stellen",
     "bridge": "Deutsch verschiebt beim Fragen oft das Verb. Spanisch kann die Satzstellung beibehalten und die Intonation ändern.",
     "example": "¿Hablas español?",
     "translation": "Sprichst du Spanisch?",
     "rule": "Ja/Nein-Fragen brauchen im Spanischen oft keine besondere Verbform. Geschrieben beginnt eine direkte Frage mit ¿ und endet mit ?.",
     "watch": "Das spanische Fragezeichen am Anfang wird nicht weggelassen, wenn korrekt geschrieben wird.",
     "quiz": {
      "question": "Welches Zeichen beginnt eine spanische Frage?",
      "choices": [
       "¿",
       "¡",
       "."
      ],
      "correct": 0,
      "explanation": "Das Verb verrät bereits, dass du eine Person mit tú ansprichst."
     },
     "production": {
      "prompt": "Sprichst du Spanisch?",
      "answers": [
       "¿Hablas español?",
       "Hablas español?"
      ]
     },
     "builder": {
      "prompt": "Sprichst du Spanisch?",
      "tokens": [
       "¿Hablas",
       "español?"
      ]
     },
     "number": 1
    },
    {
     "id": "a1-08-2",
     "title": "Fragewörter mit Akzent",
     "bridge": "Deutsch: Wo wohnst du? Spanisch: ¿Dónde vives?",
     "example": "¿Dónde vives?",
     "translation": "Wo wohnst du?",
     "rule": "Direkte Fragewörter wie qué, quién, cómo, cuándo, dónde und por qué tragen einen Akzent. Por qué wird in Fragen getrennt geschrieben.",
     "watch": "„Porque“ ist normalerweise die begründende Konjunktion „weil“, nicht das Fragewort.",
     "quiz": {
      "question": "Wie lautet das Fragewort „wo“?",
      "choices": [
       "cuando",
       "dónde",
       "donde"
      ],
      "correct": 1,
      "explanation": "Der Akzent ist wichtig – auch in indirekten Fragen."
     },
     "production": {
      "prompt": "Wo wohnst du?",
      "answers": [
       "¿Dónde vives?",
       "Dónde vives?"
      ]
     },
     "builder": {
      "prompt": "Wo wohnst du?",
      "tokens": [
       "¿Dónde",
       "vives?"
      ]
     },
     "number": 2
    },
    {
     "id": "a1-08-3",
     "title": "Nein, auch nicht",
     "bridge": "Deutsch: nicht, auch, auch nicht. Spanisch: no, también, tampoco.",
     "example": "No tengo tiempo.",
     "translation": "Ich habe keine Zeit.",
     "rule": "No steht in einfachen Verneinungen vor dem konjugierten Verb. También heißt „auch“, tampoco „auch nicht“.",
     "watch": "„No también“ ist normalerweise kein Ersatz für „tampoco“.",
     "quiz": {
      "question": "Wo steht no in „No tengo tiempo“?",
      "choices": [
       "Hinter tiempo",
       "Zwischen tengo und tiempo",
       "Vor tengo"
      ],
      "correct": 2,
      "explanation": "Die Verneinung steht hier direkt vor dem Verb."
     },
     "production": {
      "prompt": "Ich habe keine Zeit.",
      "answers": [
       "No tengo tiempo."
      ]
     },
     "builder": {
      "prompt": "Ich habe keine Zeit.",
      "tokens": [
       "No",
       "tengo",
       "tiempo."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-09",
   "number": "09",
   "title": "Wo ist was?",
   "subtitle": "Hay, estar und Präpositionen",
   "tagline": "Existenz und Ort sind nicht dasselbe.",
   "lessons": [
    {
     "id": "a1-09-1",
     "title": "Hay: Es gibt etwas",
     "bridge": "Deutsch: In der Straße gibt es eine Apotheke.",
     "example": "Hay una farmacia aquí.",
     "translation": "Hier gibt es eine Apotheke.",
     "rule": "Hay sagt aus, dass etwas vorhanden ist. Es bleibt in dieser Verwendung gleich, auch wenn mehrere Dinge genannt werden: hay una farmacia, hay dos farmacias.",
     "watch": "„Hay“ und „está“ sind nicht frei austauschbar.",
     "quiz": {
      "question": "Was bedeutet „hay“ hier?",
      "choices": [
       "ich habe",
       "es gibt",
       "es ist müde"
      ],
      "correct": 1,
      "explanation": "Bei der Existenzfrage ist hay unser Ausgangspunkt."
     },
     "production": {
      "prompt": "Hier gibt es eine Apotheke.",
      "answers": [
       "Hay una farmacia aquí.",
       "Aquí hay una farmacia."
      ]
     },
     "builder": {
      "prompt": "Hier gibt es eine Apotheke.",
      "tokens": [
       "Hay",
       "una",
       "farmacia",
       "aquí."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-09-2",
     "title": "Estar: Wo befindet es sich?",
     "bridge": "Deutsch: Die Apotheke ist neben dem Park.",
     "example": "La farmacia está al lado del parque.",
     "translation": "Die Apotheke liegt neben dem Park.",
     "rule": "Estar beschreibt den Standort einer bestimmten Person oder Sache. Häufig kommen Präpositionen und Ortsangaben dazu.",
     "watch": "„Está“ benötigt hier ein grammatisches Subjekt; „hay“ ist unpersönlich.",
     "quiz": {
      "question": "Was passt bei einer bestimmten Apotheke?",
      "choices": [
       "hay",
       "tengo",
       "está"
      ],
      "correct": 2,
      "explanation": "Mit estar geben wir die Lage einer identifizierten Apotheke an."
     },
     "production": {
      "prompt": "Die Apotheke liegt neben dem Park.",
      "answers": [
       "La farmacia está al lado del parque."
      ]
     },
     "builder": {
      "prompt": "Die Apotheke liegt neben dem Park.",
      "tokens": [
       "La",
       "farmacia",
       "está",
       "al",
       "lado",
       "del",
       "parque."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-09-3",
     "title": "Richtung und Ort",
     "bridge": "Deutsch unterscheidet „in der Stadt“ und „in die Stadt“. Spanisch verwendet unter anderem en und a.",
     "example": "Voy al mercado.",
     "translation": "Ich gehe zum Markt.",
     "rule": "A markiert häufig ein Ziel, en einen Ort. A + el verschmilzt zu al; de + el zu del. Das hängt vom konkreten Ausdruck ab.",
     "watch": "Bei Eigennamen wie El Salvador gelten Besonderheiten; al/del sind keine universellen Ersetzungen.",
     "quiz": {
      "question": "Wie entsteht „al“?",
      "choices": [
       "a + el",
       "a + la",
       "de + el"
      ],
      "correct": 0,
      "explanation": "Hier zeigt a die Richtung an."
     },
     "production": {
      "prompt": "Ich gehe zum Markt.",
      "answers": [
       "Voy al mercado."
      ]
     },
     "builder": {
      "prompt": "Ich gehe zum Markt.",
      "tokens": [
       "Voy",
       "al",
       "mercado."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-10",
   "number": "10",
   "title": "Wem gehört das?",
   "subtitle": "Besitz und Hinweisen",
   "tagline": "Zeigen, zuordnen, genauer werden.",
   "lessons": [
    {
     "id": "a1-10-1",
     "title": "Mein, dein, unser",
     "bridge": "Deutsch: mein Buch, dein Buch, unser Buch.",
     "example": "Mi hermana vive aquí.",
     "translation": "Meine Schwester wohnt hier.",
     "rule": "Vor Nomen nutzt man meist mi, tu, su, nuestro/a. Mi und tu ändern sich im Singular nicht nach dem Genus des Besitzes; nuestro/nuestra schon.",
     "watch": "„Tu“ = dein, „tú“ = du. Der Akzent ändert die Funktion.",
     "quiz": {
      "question": "Welches Wort bedeutet „mein“ vor einem Nomen?",
      "choices": [
       "mí",
       "yo",
       "mi"
      ],
      "correct": 2,
      "explanation": "Mi ist hier ein Possessivbegleiter, nicht das Personalpronomen."
     },
     "production": {
      "prompt": "Meine Schwester wohnt hier.",
      "answers": [
       "Mi hermana vive aquí."
      ]
     },
     "builder": {
      "prompt": "Meine Schwester wohnt hier.",
      "tokens": [
       "Mi",
       "hermana",
       "vive",
       "aquí."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-10-2",
     "title": "Dieses oder jenes",
     "bridge": "Deutsch: dieses Buch, jenes Haus. Spanisch: este, esa, aquel.",
     "example": "Este libro es interesante.",
     "translation": "Dieses Buch ist interessant.",
     "rule": "Demonstrativbegleiter richten sich nach Genus und Numerus des Nomens. Este/esta zeigen oft auf etwas Nahes, ese/esa auf etwas weiter Entferntes; aquel/aquella kann größere Distanz ausdrücken.",
     "watch": "Nähe ist nicht nur räumlich: auch Gesprächskontext zählt.",
     "quiz": {
      "question": "Was passt zu „libro“ im maskulinen Singular?",
      "choices": [
       "este",
       "esta",
       "estas"
      ],
      "correct": 0,
      "explanation": "Este steht vor dem maskulinen Singularnomen libro."
     },
     "production": {
      "prompt": "Dieses Buch ist interessant.",
      "answers": [
       "Este libro es interesante."
      ]
     },
     "builder": {
      "prompt": "Dieses Buch ist interessant.",
      "tokens": [
       "Este",
       "libro",
       "es",
       "interesante."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-10-3",
     "title": "Besitz mit de",
     "bridge": "Deutsch verwendet oft Genitiv oder „von“. Spanisch nutzt häufig de.",
     "example": "Es el libro de Pablo.",
     "translation": "Es ist Pablos Buch.",
     "rule": "Mit de lässt sich Zugehörigkeit ausdrücken: el libro de Pablo. De + el wird zu del, wenn el ein Artikel ist.",
     "watch": "Das ist keine allgemeine Aussage, dass jede deutsche Genitivkonstruktion de benötigt.",
     "quiz": {
      "question": "Wie drückst du „Pablos Buch“ aus?",
      "choices": [
       "el libro por Pablo",
       "el libro de Pablo",
       "el libro a Pablo"
      ],
      "correct": 1,
      "explanation": "„De Pablo“ bezeichnet hier den Besitzer."
     },
     "production": {
      "prompt": "Es ist Pablos Buch.",
      "answers": [
       "Es el libro de Pablo."
      ]
     },
     "builder": {
      "prompt": "Es ist Pablos Buch.",
      "tokens": [
       "Es",
       "el",
       "libro",
       "de",
       "Pablo."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-11",
   "number": "11",
   "title": "Zahlen, Mengen, Vergleiche",
   "subtitle": "Zeit, Datum und Vergleiche",
   "tagline": "Den Alltag genauer beschreiben.",
   "lessons": [
    {
     "id": "a1-11-1",
     "title": "Zahlen und Mengen",
     "bridge": "Deutsch: zwei Bücher, viele Bücher. Spanisch unterscheidet die gleichen Konzepte.",
     "example": "Tengo dos libros.",
     "translation": "Ich habe zwei Bücher.",
     "rule": "Zahlen wie uno, dos, tres geben eine Anzahl an. Uno wird vor maskulinen Singularnomen zu un: un libro; bei Mengenwörtern spielt die Angleichung ebenfalls eine Rolle.",
     "watch": "„Un libros“ ist falsch, weil un Singular ist.",
     "quiz": {
      "question": "Wie sagt man „zwei“?",
      "choices": [
       "dos",
       "doce",
       "diez"
      ],
      "correct": 0,
      "explanation": "Die Anzahl und der Plural des Nomens passen zusammen."
     },
     "production": {
      "prompt": "Ich habe zwei Bücher.",
      "answers": [
       "Tengo dos libros."
      ]
     },
     "builder": {
      "prompt": "Ich habe zwei Bücher.",
      "tokens": [
       "Tengo",
       "dos",
       "libros."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-11-2",
     "title": "Uhrzeit und Datum",
     "bridge": "Deutsch fragt: Wie spät ist es? Spanisch nutzt ser für Uhrzeiten.",
     "example": "Son las tres.",
     "translation": "Es ist drei Uhr.",
     "rule": "Für eins: es la una. Für zwei und mehr: son las dos, son las tres. Daten werden oft als „el + Zahl + de + Monat“ angegeben.",
     "watch": "„Es las tres“ ist in der gewöhnlichen Uhrzeitangabe nicht korrekt.",
     "quiz": {
      "question": "Welche Form passt zu drei Uhr?",
      "choices": [
       "son la tres",
       "son las tres",
       "es la tres"
      ],
      "correct": 1,
      "explanation": "Die Pluralform son passt hier zu las tres."
     },
     "production": {
      "prompt": "Es ist drei Uhr.",
      "answers": [
       "Son las tres."
      ]
     },
     "builder": {
      "prompt": "Es ist drei Uhr.",
      "tokens": [
       "Son",
       "las",
       "tres."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-11-3",
     "title": "Mehr, weniger, genauso",
     "bridge": "Deutsch: größer als, kleiner als. Spanisch: más ... que, menos ... que.",
     "example": "Mi casa es más grande que la tuya.",
     "translation": "Mein Haus ist größer als deins.",
     "rule": "Mehr- und Wenigervergleiche werden oft mit más/menos + Adjektiv + que gebildet. Für Gleichheit: tan + Adjektiv + como.",
     "watch": "Einige Adjektive haben unregelmäßige Vergleichsformen: mejor, peor.",
     "quiz": {
      "question": "Welches Wort verbindet den Vergleich „más grande ...“?",
      "choices": [
       "porque",
       "de",
       "que"
      ],
      "correct": 2,
      "explanation": "Más ... que entspricht hier dem deutschen Komparativ."
     },
     "production": {
      "prompt": "Mein Haus ist größer als deins.",
      "answers": [
       "Mi casa es más grande que la tuya."
      ]
     },
     "builder": {
      "prompt": "Mein Haus ist größer als deins.",
      "tokens": [
       "Mi",
       "casa",
       "es",
       "más",
       "grande",
       "que",
       "la",
       "tuya."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-12",
   "number": "12",
   "title": "Mein Alltag",
   "subtitle": "Reflexive Verben und Gewohnheiten",
   "tagline": "Was mache ich – und was mache ich mit mir?",
   "lessons": [
    {
     "id": "a1-12-1",
     "title": "Ich wasche mich",
     "bridge": "Deutsch unterscheidet „ich wasche das Kind“ und „ich wasche mich“.",
     "example": "Me lavo por la mañana.",
     "translation": "Ich wasche mich morgens.",
     "rule": "Ein Reflexivpronomen verweist auf dieselbe Person wie das Subjekt: me lavo, te lavas, se lava. Nicht jedes Verb ist in beiden Sprachen reflexiv.",
     "watch": "„Me lavo“ heißt nicht „ich wasche mich jemand anderem“.",
     "quiz": {
      "question": "Welches Pronomen passt zu „yo“?",
      "choices": [
       "se",
       "me",
       "te"
      ],
      "correct": 1,
      "explanation": "Das Reflexivpronomen steht hier vor dem konjugierten Verb."
     },
     "production": {
      "prompt": "Ich wasche mich morgens.",
      "answers": [
       "Me lavo por la mañana."
      ]
     },
     "builder": {
      "prompt": "Ich wasche mich morgens.",
      "tokens": [
       "Me",
       "lavo",
       "por",
       "la",
       "mañana."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-12-2",
     "title": "Morgens aufstehen",
     "bridge": "Deutsch: Ich stehe früh auf. Spanisch: Me levanto temprano.",
     "example": "Me levanto a las siete.",
     "translation": "Ich stehe um sieben auf.",
     "rule": "Levantarse ist der Infinitiv eines reflexiven Verbs. Beim Konjugieren steht das Pronomen in einfachen Präsenssätzen meist vor dem Verb: me levanto.",
     "watch": "Das se am Infinitiv ist kein extra Wort der Bedeutung „er“; es gehört zur reflexiven Angabe.",
     "quiz": {
      "question": "Wie heißt „du stehst auf“?",
      "choices": [
       "me levanto",
       "se levantan",
       "te levantas"
      ],
      "correct": 2,
      "explanation": "Ein guter Tagesablauf lässt sich aus wiederkehrenden Formeln bilden."
     },
     "production": {
      "prompt": "Ich stehe um sieben auf.",
      "answers": [
       "Me levanto a las siete."
      ]
     },
     "builder": {
      "prompt": "Ich stehe um sieben auf.",
      "tokens": [
       "Me",
       "levanto",
       "a",
       "las",
       "siete."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-12-3",
     "title": "Immer, manchmal, nie",
     "bridge": "Deutsch: Ich arbeite immer. Spanisch: Siempre trabajo.",
     "example": "A veces estudio por la noche.",
     "translation": "Manchmal lerne ich abends.",
     "rule": "Siempre, a veces, normalmente und nunca beschreiben Häufigkeit. „Nunca“ kann allein vor dem Verb stehen: nunca trabajo los domingos.",
     "watch": "Stellung kann variieren; „no ... nunca“ ist ebenfalls möglich.",
     "quiz": {
      "question": "Was bedeutet „a veces“?",
      "choices": [
       "manchmal",
       "immer",
       "niemals"
      ],
      "correct": 0,
      "explanation": "Häufigkeitsausdrücke helfen beim Erzählen von Routinen."
     },
     "production": {
      "prompt": "Manchmal lerne ich abends.",
      "answers": [
       "A veces estudio por la noche."
      ]
     },
     "builder": {
      "prompt": "Manchmal lerne ich abends.",
      "tokens": [
       "A",
       "veces",
       "estudio",
       "por",
       "la",
       "noche."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-13",
   "number": "13",
   "title": "Me gusta",
   "subtitle": "Vorlieben und indirekte Beziehungen",
   "tagline": "Wem gefällt eigentlich was?",
   "lessons": [
    {
     "id": "a1-13-1",
     "title": "Wer gefällt wem?",
     "bridge": "Deutsch: Ich mag Kaffee. Spanisch: Kaffee gefällt mir.",
     "example": "Me gusta el café.",
     "translation": "Ich mag Kaffee.",
     "rule": "Bei gustar ist die gefallende Sache das grammatische Subjekt; me bezeichnet die Person, der etwas gefällt. Deshalb „gusta“ mit el café.",
     "watch": "„Me gusto el café“ wäre eine falsche Mischung der Personen.",
     "quiz": {
      "question": "Was ist das grammatische Subjekt von „Me gusta el café“?",
      "choices": [
       "me",
       "gusta",
       "el café"
      ],
      "correct": 2,
      "explanation": "Der Perspektivwechsel macht gustar verständlicher."
     },
     "production": {
      "prompt": "Ich mag Kaffee.",
      "answers": [
       "Me gusta el café."
      ]
     },
     "builder": {
      "prompt": "Ich mag Kaffee.",
      "tokens": [
       "Me",
       "gusta",
       "el",
       "café."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-13-2",
     "title": "Gusta oder gustan?",
     "bridge": "Deutsch: Ich mag Bücher. Spanisch: Mir gefallen Bücher.",
     "example": "Me gustan los libros.",
     "translation": "Ich mag Bücher.",
     "rule": "Steht das Gefallende im Plural, nutzt man gustan. Bei Infinitiven gewöhnlich gusta: me gusta leer.",
     "watch": "Die Form richtet sich nicht danach, ob viele Menschen etwas mögen, sondern nach dem Gefallenden.",
     "quiz": {
      "question": "Welche Form passt zu „los libros“?",
      "choices": [
       "gustan",
       "gusta",
       "gustamos"
      ],
      "correct": 0,
      "explanation": "Das Subjekt ist los libros – deshalb Plural."
     },
     "production": {
      "prompt": "Ich mag Bücher.",
      "answers": [
       "Me gustan los libros."
      ]
     },
     "builder": {
      "prompt": "Ich mag Bücher.",
      "tokens": [
       "Me",
       "gustan",
       "los",
       "libros."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-13-3",
     "title": "A mí, a ti und encantar",
     "bridge": "Deutsch kann betonen: Mir gefällt das besonders! Spanisch tut das mit a mí.",
     "example": "A mí me encanta esta canción.",
     "translation": "Ich liebe dieses Lied (mir gefällt es sehr).",
     "rule": "A mí betont oder kontrastiert die betroffene Person; me bleibt trotzdem stehen. Encantar folgt im Grundmuster gustar.",
     "watch": "„A mí encanta“ ohne me ist in diesem einfachen Satz nicht korrekt.",
     "quiz": {
      "question": "Wozu dient „a mí“ hier?",
      "choices": [
       "Vergangenheit",
       "Betonung der Person",
       "Pluralbildung"
      ],
      "correct": 1,
      "explanation": "Die betonte Form ergänzt das unbetonte Pronomen."
     },
     "production": {
      "prompt": "Ich liebe dieses Lied.",
      "answers": [
       "Me encanta esta canción.",
       "A mí me encanta esta canción."
      ]
     },
     "builder": {
      "prompt": "Ich liebe dieses Lied (mir gefällt es sehr).",
      "tokens": [
       "A",
       "mí",
       "me",
       "encanta",
       "esta",
       "canción."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-14",
   "number": "14",
   "title": "Pronomen statt Wiederholungen",
   "subtitle": "Direkte und indirekte Objekte",
   "tagline": "Kleine Wörter mit klaren Aufgaben.",
   "lessons": [
    {
     "id": "a1-14-1",
     "title": "Ein Objekt vertreten",
     "bridge": "Deutsch: Ich sehe Maria → Ich sehe sie. Spanisch: Veo a María → La veo.",
     "example": "La veo todos los días.",
     "translation": "Ich sehe sie jeden Tag.",
     "rule": "La ersetzt ein feminines direktes Objekt im Singular. Weitere direkte Objektpronomen sind lo, los und las. Es geht um die Rolle, nicht nur um das Geschlecht des Worts.",
     "watch": "Bei Menschen steht vor dem vollen direkten Objekt häufig die persönliche Präposition a; vor la als Pronomen steht sie hier nicht.",
     "quiz": {
      "question": "Welches Pronomen ersetzt „a María“?",
      "choices": [
       "la",
       "le",
       "los"
      ],
      "correct": 0,
      "explanation": "Ein Pronomen vermeidet die erneute Nennung des Nomens."
     },
     "production": {
      "prompt": "Ich sehe sie jeden Tag.",
      "answers": [
       "La veo todos los días."
      ]
     },
     "builder": {
      "prompt": "Ich sehe sie jeden Tag.",
      "tokens": [
       "La",
       "veo",
       "todos",
       "los",
       "días."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-14-2",
     "title": "Wem gebe ich es?",
     "bridge": "Deutsch: Ich gebe Pablo ein Buch. Spanisch: Le doy un libro a Pablo.",
     "example": "Le doy un libro a Pablo.",
     "translation": "Ich gebe Pablo ein Buch.",
     "rule": "Le verweist hier auf den Empfänger, das indirekte Objekt. „A Pablo“ kann den Empfänger präzisieren. Der Begriff „indirekt“ beschreibt die Funktion, nicht die Wichtigkeit.",
     "watch": "Le kann je nach Kontext auf „ihm“, „ihr“ oder die höfliche Anrede verweisen.",
     "quiz": {
      "question": "Was ist in diesem Satz das indirekte Objekt?",
      "choices": [
       "doy",
       "Pablo beziehungsweise le",
       "un libro"
      ],
      "correct": 1,
      "explanation": "Die Satzwerkstatt hilft uns, die Rolle des Empfängers zu erkennen."
     },
     "production": {
      "prompt": "Ich gebe Pablo ein Buch.",
      "answers": [
       "Le doy un libro a Pablo."
      ]
     },
     "builder": {
      "prompt": "Ich gebe Pablo ein Buch.",
      "tokens": [
       "Le",
       "doy",
       "un",
       "libro",
       "a",
       "Pablo."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-14-3",
     "title": "Wo steht das Pronomen?",
     "bridge": "Deutsch: Ich sehe ihn. Spanisch: Lo veo.",
     "example": "Lo veo ahora.",
     "translation": "Ich sehe ihn jetzt.",
     "rule": "Bei einem konjugierten Verb im einfachen Aussagesatz steht ein unbetontes Objektpronomen normalerweise davor: lo veo, la conozco, le escribo.",
     "watch": "Mit Infinitiven kann sich die Stellung ändern; darauf kommen wir später zurück.",
     "quiz": {
      "question": "Welche Reihenfolge ist richtig?",
      "choices": [
       "veo lo",
       "yo lo a veo",
       "lo veo"
      ],
      "correct": 2,
      "explanation": "Vor dem einfachen konjugierten Verb steht das Pronomen davor."
     },
     "production": {
      "prompt": "Ich sehe ihn jetzt.",
      "answers": [
       "Lo veo ahora."
      ]
     },
     "builder": {
      "prompt": "Ich sehe ihn jetzt.",
      "tokens": [
       "Lo",
       "veo",
       "ahora."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-15",
   "number": "15",
   "title": "Wünsche, Pflichten, Pläne",
   "subtitle": "Modalverben und nahe Zukunft",
   "tagline": "Mehr ausdrücken mit zwei Verben.",
   "lessons": [
    {
     "id": "a1-15-1",
     "title": "Wollen und können",
     "bridge": "Deutsch: Ich will lernen; ich kann kommen.",
     "example": "Quiero aprender español.",
     "translation": "Ich möchte Spanisch lernen.",
     "rule": "Nach querer oder poder steht häufig ein Infinitiv: quiero aprender, puedo venir. Nur das erste Verb wird nach der Person konjugiert.",
     "watch": "„Quiero aprendo“ ist in dieser Bedeutung nicht korrekt.",
     "quiz": {
      "question": "Welche Form folgt auf „quiero“?",
      "choices": [
       "aprendes",
       "aprender",
       "aprendo"
      ],
      "correct": 1,
      "explanation": "Zwei Verben, aber nur das erste ist hier konjugiert."
     },
     "production": {
      "prompt": "Ich möchte Spanisch lernen.",
      "answers": [
       "Quiero aprender español."
      ]
     },
     "builder": {
      "prompt": "Ich möchte Spanisch lernen.",
      "tokens": [
       "Quiero",
       "aprender",
       "español."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-15-2",
     "title": "Müssen mit tener que",
     "bridge": "Deutsch: Ich muss arbeiten. Spanisch: Tengo que trabajar.",
     "example": "Tengo que estudiar hoy.",
     "translation": "Ich muss heute lernen.",
     "rule": "Tener que + Infinitiv beschreibt eine persönliche Notwendigkeit. Hay que + Infinitiv kann eine allgemeine Notwendigkeit ausdrücken.",
     "watch": "Das que ist hier ein fester Bestandteil der Konstruktion.",
     "quiz": {
      "question": "Welche Form heißt „ich muss lernen“?",
      "choices": [
       "tengo estudiar",
       "soy que estudiar",
       "tengo que estudiar"
      ],
      "correct": 2,
      "explanation": "Tener que bildet zusammen mit dem Infinitiv einen Ausdruck der Notwendigkeit."
     },
     "production": {
      "prompt": "Ich muss heute lernen.",
      "answers": [
       "Tengo que estudiar hoy."
      ]
     },
     "builder": {
      "prompt": "Ich muss heute lernen.",
      "tokens": [
       "Tengo",
       "que",
       "estudiar",
       "hoy."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-15-3",
     "title": "Bald: Ir a + Infinitiv",
     "bridge": "Deutsch: Ich werde morgen lernen. Spanisch: Voy a estudiar mañana.",
     "example": "Voy a visitar a mi amiga.",
     "translation": "Ich werde meine Freundin besuchen.",
     "rule": "Ir a + Infinitiv beschreibt häufig einen Plan oder eine nahe Zukunft. Das Verb ir wird konjugiert: voy, vas, va, vamos, vais, van.",
     "watch": "„Voy visitar“ lässt das notwendige a weg.",
     "quiz": {
      "question": "Was folgt auf „voy a“?",
      "choices": [
       "Infinitiv",
       "konjugiertes Verb im Präsens",
       "Artikel allein"
      ],
      "correct": 0,
      "explanation": "Die Form beschreibt einen geplanten Besuch."
     },
     "production": {
      "prompt": "Ich werde meine Freundin besuchen.",
      "answers": [
       "Voy a visitar a mi amiga."
      ]
     },
     "builder": {
      "prompt": "Ich werde meine Freundin besuchen.",
      "tokens": [
       "Voy",
       "a",
       "visitar",
       "a",
       "mi",
       "amiga."
      ]
     },
     "number": 3
    }
   ]
  },
  {
   "id": "a1-16",
   "number": "16",
   "title": "Sätze verbinden",
   "subtitle": "Konjunktionen und einfache Nebensätze",
   "tagline": "Aus Aussagen wird ein Gespräch.",
   "lessons": [
    {
     "id": "a1-16-1",
     "title": "Und, oder, aber",
     "bridge": "Deutsch verknüpft Ideen mit und, oder und aber. Spanisch ebenso.",
     "example": "Leo y escucho música.",
     "translation": "Ich lese und höre Musik.",
     "rule": "Y verbindet, o bietet Alternativen, pero stellt einen Gegensatz her. Vor einem i-Laut kann y zu e werden; vor einem o-Laut kann o zu u werden.",
     "watch": "„Y“ und „pero“ erfüllen unterschiedliche Aufgaben: Verbindung versus Gegensatz.",
     "quiz": {
      "question": "Welches Wort bedeutet „aber“?",
      "choices": [
       "y",
       "o",
       "pero"
      ],
      "correct": 2,
      "explanation": "Mit Konjunktionen können wir aus zwei Gedanken einen machen."
     },
     "production": {
      "prompt": "Ich lese und höre Musik.",
      "answers": [
       "Leo y escucho música."
      ]
     },
     "builder": {
      "prompt": "Ich lese und höre Musik.",
      "tokens": [
       "Leo",
       "y",
       "escucho",
       "música."
      ]
     },
     "number": 1
    },
    {
     "id": "a1-16-2",
     "title": "Warum? Weil ...",
     "bridge": "Deutsch: Ich bleibe zu Hause, weil ich müde bin.",
     "example": "Estoy en casa porque estoy cansado.",
     "translation": "Ich bin zu Hause, weil ich müde bin (männlicher Sprecher).",
     "rule": "Porque verbindet eine Aussage mit ihrem Grund. Das Fragewort por qué besteht aus zwei Wörtern mit Akzent.",
     "watch": "Im Unterschied zum Deutschen muss nach porque nicht generell das Verb an das Satzende wandern.",
     "quiz": {
      "question": "Wie lautet „weil“?",
      "choices": [
       "porque",
       "por qué",
       "pero"
      ],
      "correct": 0,
      "explanation": "Im Spanischen folgt nach porque gewöhnlich eine normale Verbfolge."
     },
     "production": {
      "prompt": "Ich bin zu Hause, weil ich müde bin.",
      "answers": [
       "Estoy en casa porque estoy cansado.",
       "Estoy en casa porque estoy cansada."
      ]
     },
     "builder": {
      "prompt": "Ich bin zu Hause, weil ich müde bin (männlicher Sprecher).",
      "tokens": [
       "Estoy",
       "en",
       "casa",
       "porque",
       "estoy",
       "cansado."
      ]
     },
     "number": 2
    },
    {
     "id": "a1-16-3",
     "title": "Ein Satz beschreibt ein Nomen",
     "bridge": "Deutsch: Das ist das Buch, das ich lese. Spanisch: Es el libro que leo.",
     "example": "Es el libro que leo.",
     "translation": "Das ist das Buch, das ich lese.",
     "rule": "Que kann einen einfachen Relativsatz einleiten und sich auf ein zuvor genanntes Nomen beziehen. Das ist eine neue Funktion desselben Wortbilds.",
     "watch": "Relativ-que trägt hier keinen Akzent; das Fragewort qué schon.",
     "quiz": {
      "question": "Welches Wort leitet hier den Relativsatz ein?",
      "choices": [
       "quién",
       "que",
       "qué"
      ],
      "correct": 1,
      "explanation": "Damit lassen sich Personen und Dinge näher beschreiben."
     },
     "production": {
      "prompt": "Das ist das Buch, das ich lese.",
      "answers": [
       "Es el libro que leo."
      ]
     },
     "builder": {
      "prompt": "Das ist das Buch, das ich lese.",
      "tokens": [
       "Es",
       "el",
       "libro",
       "que",
       "leo."
      ]
     },
     "number": 3
    }
   ]
  }
 ]
};
