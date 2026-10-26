/* Palabra 0.7a.8-P4 – Klanglabor 2.0: genuine homophones and meaningful pronunciation contrasts.
   Mexican-oriented broad transcription, educational and manually prepared; no fabricated audio.
   Homophones intentionally reuse ONE recording when possible, so no synthesizer variation implies a difference. */
window.PalabraPronunciation=(()=>{
 'use strict';
 const root=()=>document.getElementById('grammarArea');
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let active=false,current=null,chosen=null,returnTo='grammar';
 const topics=[
  {id:'bv',name:'B und V: Gleicher Klang',tag:'baca / vaca',type:'same',lead:'Ein b und ein v können genau gleich klingen. Im Spanischen gibt es keinen Gegensatz wie deutsches b gegenüber w. Entscheidend sind Schreibweise und Zusammenhang.',pairs:[
   {words:['baca','vaca'],means:['Dachgepäckträger','Kuh'],ipa:'/ˈbaka/',note:'Das perfekte B/V-Beispiel: andere Schreibweise, gleiche Aussprache.'},
   {words:['tubo','tuvo'],means:['Rohr','er/sie hatte'],ipa:'/ˈtubo/',note:'„Tuvo“ ist die Vergangenheitsform von tener.'},
   {words:['botar','votar'],means:['wegwerfen / hüpfen','wählen / abstimmen'],ipa:'/boˈtaɾ/',note:'Einen Ball botar, bei einer Wahl votar.'},
   {words:['bello','vello'],means:['schön','Körperbehaarung'],ipa:'/ˈbeʝo/',note:'Beide Wörter haben dieselbe Aussprache; ihre Bedeutungen sind ganz verschieden.'}
  ],tip:'B und V unterscheiden im Standardspanischen keine Wörter durch ihren Laut. Nach einer Pause klingt der Laut meist [b], zwischen Vokalen häufig weicher [β̞] – unabhängig vom Buchstaben.',question:'Welche Wörter sprechen wir im mexikanisch orientierten Spanisch gleich aus?',choices:['baca und vaca','pero und perro','papa und papá'],correct:0},
  {id:'h',name:'Das stumme H',tag:'hola / ola',type:'same',lead:'Das spanische h wird in diesen Wörtern nicht gesprochen. Zwei Schreibweisen können deshalb dasselbe gesprochene Wort ergeben.',pairs:[
   {words:['hola','ola'],means:['Hallo','Welle'],ipa:'/ˈola/',note:'Der Gruß und die Meereswelle klingen genau gleich.'},
   {words:['hecho','echo'],means:['gemacht / Tatsache','ich werfe / gebe'],ipa:'/ˈetʃo/',note:'Hecho gehört zu hacer, echo zu echar.'},
   {words:['hasta','asta'],means:['bis','Stange / Fahnenmast'],ipa:'/ˈasta/',note:'Ein Laut, zwei ganz verschiedene Bedeutungen.'},
   {words:['hojear','ojear'],means:['durchblättern','einen Blick darauf werfen'],ipa:'/oxeˈaɾ/',note:'In vielen Zusammenhängen ähnlich, aber nicht dasselbe Verb.'}
  ],tip:'H ist im spanischen Schriftbild häufig wichtig, aber hier akustisch nicht zu hören.',question:'Welche Schreibweise bedeutet „Welle“?',choices:['hola','ola','hoja'],correct:1},
  {id:'ll',name:'LL und Y: Yeísmo',tag:'calló / cayó',type:'same',lead:'Bei der in Mexiko sehr verbreiteten Aussprache (Yeísmo) werden „ll“ und konsonantisches „y“ gleich ausgesprochen.',pairs:[
   {words:['calló','cayó'],means:['er/sie verstummte','er/sie fiel'],ipa:'/kaˈʝo/',note:'Die Bedeutung erschließt sich aus dem Kontext.'},
   {words:['halla','haya'],means:['er/sie findet','Form von haber / Buchenbaum'],ipa:'/ˈaʝa/',note:'Halla kommt von hallar, haya kann eine Verbform sein.'},
   {words:['valla','vaya'],means:['Zaun / Absperrung','Form von ir'],ipa:'/ˈbaʝa/',note:'Ein Zaun ist eine valla. „Espero que vaya“ verwendet das Verb ir.'}
  ],tip:'Diese Wortpaare sind im Yeísmo homophon. In manchen anderen spanischen Varietäten wird ll von y unterschieden.',question:'Was ist beim verbreiteten mexikanischen Yeísmo richtig?',choices:['ll und y können gleich klingen','ll ist immer wie deutsches l','ñ und n sind derselbe Laut'],correct:0},
  {id:'seseo',name:'C, Z und S: Seseo',tag:'casa / caza',type:'same',lead:'Unsere mexikanisch orientierte Aussprache verwendet Seseo: s, z und c vor e/i können denselben /s/-Laut bezeichnen.',pairs:[
   {words:['casa','caza'],means:['Haus','Jagd'],ipa:'/ˈkasa/',note:'In Spanien mit Unterscheidung von /s/ und /θ/ klingen diese Wörter anders.'},
   {words:['coser','cocer'],means:['nähen','kochen / garen'],ipa:'/koˈseɾ/',note:'Ein besonders praktisches Beispiel für den Alltag.'},
   {words:['tasa','taza'],means:['Gebühr / Satz','Tasse'],ipa:'/ˈtasa/',note:'Die Schreibweise entscheidet über die Bedeutung.'},
   {words:['sima','cima'],means:['Abgrund / tiefer Schacht','Gipfel'],ipa:'/ˈsima/',note:'Gleicher Klang im Seseo.'}
  ],tip:'Seseo ist keine fehlerhafte Aussprache, sondern ein verbreitetes regionales Merkmal. In Teilen Spaniens gibt es stattdessen den zusätzlichen Laut /θ/.',question:'In welcher Aussprache klingen casa und caza gleich?',choices:['Beim Seseo','Nur beim gerollten R','Nur bei besonders schnellem Sprechen'],correct:0},
  {id:'r',name:'R und RR: Hörbarer Unterschied',tag:'pero / perro',type:'different',lead:'Anders als B/V sind einfaches r und rr zwischen Vokalen zwei unterschiedliche Laute: der kurze Schlaglaut /ɾ/ und der gerollte Laut /r/.',pairs:[
   {words:['pero','perro'],means:['aber','Hund'],ipa:['/ˈpeɾo/','/ˈpero/'],note:'Ein kurzer Zungenschlag gegenüber einem gerollten R.'},
   {words:['caro','carro'],means:['teuer','Auto / Wagen'],ipa:['/ˈkaɾo/','/ˈkaro/'],note:'Der R-Laut allein verändert die Bedeutung.'},
   {words:['coro','corro'],means:['Chor','ich renne'],ipa:['/ˈkoɾo/','/ˈkoro/'],note:'Achte auf den gerollten Laut in corro.'}
  ],tip:'Hier ist das Geräusch wirklich anders. Ein kleines r zwischen Vokalen ist ein Tap /ɾ/, rr ein Trill /r/.',question:'Welches Wort bedeutet „Hund“?',choices:['pero','perro','coro'],correct:1},
  {id:'stress',name:'Betonung verändert Bedeutung',tag:'hablo / habló',type:'different',lead:'Manchmal bleiben die Buchstaben fast gleich, aber eine andere Betonung ergibt eine andere Verbform oder Wortbedeutung.',pairs:[
   {words:['hablo','habló'],means:['ich spreche','er/sie sprach'],ipa:['/ˈablo/','/aˈblo/'],note:'Gegenwart oder abgeschlossene Vergangenheit.'},
   {words:['canto','cantó'],means:['ich singe / Gesang','er/sie sang'],ipa:['/ˈkanto/','/kanˈto/'],note:'Achte auf die letzte betonte Silbe.'},
   {words:['camino','caminó'],means:['Weg / ich gehe','er/sie ging'],ipa:['/kaˈmino/','/kamiˈno/'],note:'Die Akzentmarkierung hilft bei der Betonung.'},
   {words:['papa','papá'],means:['Kartoffel (regional)','Papa / Vater'],ipa:['/ˈpapa/','/paˈpa/'],note:'In verschiedenen Regionen kann papa auch andere Bedeutungen haben.'}
  ],tip:'Das Zeichen ´ auf dem Vokal gibt die betonte Silbe vor. Die Betonung ist hier hörbar bedeutungsunterscheidend.',question:'Welche Form bedeutet „er/sie sprach“?',choices:['hablo','habló','hablar'],correct:1},
  {id:'accent',name:'Gleichlaut trotz Akzentzeichen',tag:'tú / tu',type:'same',lead:'Nicht jedes Akzentzeichen markiert einen hörbaren Unterschied. Der sogenannte diakritische Akzent unterscheidet oft Wortfunktionen.',pairs:[
   {words:['tú','tu'],means:['du','dein / deine'],ipa:'/tu/',note:'Pronomen und Possessivbegleiter.'},
   {words:['él','el'],means:['er','der (Artikel)'],ipa:'/el/',note:'Die Sätze zeigen, welche Bedeutung gemeint ist.'},
   {words:['sí','si'],means:['ja','wenn / falls'],ipa:'/si/',note:'Ja sagen oder eine Bedingung einleiten.'}
  ],tip:'Hier ändert sich die Schreibweise wegen der grammatischen Funktion. Der isolierte Wortlaut bleibt phonemisch gleich.',question:'Welche Schreibweise bedeutet „du“?',choices:['tu','tú','él'],correct:1},
  {id:'vowels',name:'Fünf klare Vokale',tag:'a · e · i · o · u',type:'examples',lead:'Spanisch verwendet fünf grundlegende Vokalphoneme /a e i o u/. Sie bleiben auch in unbetonten Silben relativ klar.',examples:[['casa','Haus','/ˈkasa/'],['mesa','Tisch','/ˈmesa/'],['sí','ja','/si/'],['poco','wenig','/ˈpoko/'],['luna','Mond','/ˈluna/']],tip:'Vermeide das typisch deutsche starke Abschwächen unbetonter Vokale.',question:'Wie viele grundlegende Vokalphoneme hat das Spanische?',choices:['Fünf','Sieben','Drei'],correct:0},
  {id:'g',name:'G und J vor Vokalen',tag:'gato / gente',type:'examples',lead:'G vor a/o/u wird anders gesprochen als vor e/i. G vor e/i klingt wie spanisches j. Die genaue Reibung variiert regional.',examples:[['gato','Katze','/ˈgato/'],['gente','Leute','/ˈxente/'],['girar','drehen','/xiˈɾaɾ/'],['rojo','rot','/ˈroxo/'],['jugar','spielen','/xuˈgaɾ/']],tip:'„Gente“ spricht man nicht mit demselben Anfangslaut wie „gato“.',question:'Welches Wort hat das j-artige g?',choices:['gente','gato','guante'],correct:0},
  {id:'gu',name:'GU, GÜ und QU',tag:'guitarra / pingüino',type:'examples',lead:'In gue/gui und que/qui wird u normalerweise nicht ausgesprochen. Die Punkte bei güe/güi zeigen ein hörbares u an.',examples:[['guitarra','Gitarre','/giˈtara/'],['queso','Käse','/ˈkeso/'],['pingüino','Pinguin','/piŋˈgwino/'],['vergüenza','Scham','/beɾˈgwensa/']],tip:'Das ü ist hier keine Betonungsmarke: Es zeigt an, dass das u hörbar ist.',question:'In welcher Schreibweise spricht man das u ausdrücklich mit?',choices:['gui','que','güi'],correct:2},
  {id:'x',name:'X: ein Buchstabe, mehrere Laute',tag:'taxi / México',type:'examples',lead:'X hat je nach Wort mehrere Aussprachen, etwa /ks/ in taxi und einen j-artigen Reibelaut in México.',examples:[['taxi','Taxi','/ˈtaksi/'],['explicar','erklären','/ekspliˈkaɾ/'],['México','Mexiko','/ˈmexiko/']],tip:'Bei einem x lohnt sich der Blick auf das konkrete Wort.',question:'Wie wird x im Wort México ungefähr gesprochen?',choices:['Wie spanisches j','Wie deutsches x in Xylophon','Immer stumm'],correct:0}
 ];
 const hasAudio=x=>window.PalabraGrammarAudio?.hasSingle(x)||window.PalabraAudio?.hasRecording(x);
 function audioButtons(x){if(window.PalabraGrammarAudio?.hasSingle(x) && window.PALABRA_GRAMMAR_AUDIO?.singles?.some(s=>String(s.text).toLowerCase()===x.toLowerCase()))return window.PalabraGrammarAudio.singlesButtons(x);
  return window.PalabraAudio?.buttons(x,{compact:true,label:'Vergleich'})||'';
 }
 function samePair(p){const audio=[...p.words].find(hasAudio);return `<article class="pron-pair"><div class="pron-pair-words">${p.words.map((w,i)=>`<div class="pron-pair-word"><strong lang="es">${esc(w)}</strong><span>${esc(p.means[i])}</span></div>`).join('<span class="pron-pair-equals" aria-label="gleich gesprochen">=</span>')}</div><div class="pron-pair-ipa">${esc(p.ipa)} <small>ein Klang für beide</small></div>${audio?`<div class="pron-pair-audio"><span class="pron-audio-intro">Eine Aufnahme für beide Wörter</span>${audioButtons(audio)}</div>`:`<div class="pron-audio-missing">Aufnahme für dieses Wortpaar folgt</div>`}<p>${esc(p.note)}</p></article>`}
 function differentPair(p){return `<article class="pron-pair pron-pair-different"><div class="pron-pair-words">${p.words.map((w,i)=>`<div class="pron-pair-word"><strong lang="es">${esc(w)}</strong><span>${esc(p.means[i])}</span><span class="pron-pair-individual-ipa">${esc(p.ipa[i])}</span>${audioButtons(w)||'<small class="pron-audio-missing">Aufnahme folgt</small>'}</div>`).join('<span class="pron-pair-equals" aria-label="anders gesprochen">≠</span>')}</div><p>${esc(p.note)}</p></article>`}
 function example(x){return `<article class="pron-example"><div><strong lang="es">${esc(x[0])}</strong><span>${esc(x[1])}</span><small>${esc(x[2])}</small></div>${audioButtons(x[0])||'<small class="pron-audio-missing">Aufnahme folgt</small>'}</article>`}
 function isActive(){return active}
 function open(from='grammar'){returnTo=from;active=true;current=null;chosen=null;render();window.scrollTo(0,0)}
 function close(){active=false;current=null;chosen=null;window.PalabraGrammarAudio?.stop();if(returnTo==='a1')window.PalabraGrammarA1?.render();else window.PalabraGrammar?.render();window.scrollTo(0,0)}
 function render(){if(!active||!root())return;root().innerHTML=current===null?renderIndex():renderTopic(topics[current])}
 function renderIndex(){return `<button class="gram-back" type="button" data-pron-back>← Zu Grammar</button><div class="gram-hero"><span class="eyebrow">AUSSPRACHE · KLANGLABOR 2.0</span><h1>Hör hin. Entdecke Spanisch.</h1><p>Warum klingen verschiedene Wörter gleich? Und wann ändert ein einziger Laut die Bedeutung?</p></div><div class="pron-begin-note">Mexikanisch orientierte Aussprache · /IPA/ zeigt die Laute, nicht die Schreibweise.</div><div class="pron-topic-list">${topics.map((t,i)=>`<button type="button" class="pron-topic-card" data-pron-open="${i}"><span class="pron-topic-number">${String(i+1).padStart(2,'0')}</span><span class="pron-topic-text"><strong>${esc(t.name)}</strong><small>${esc(t.tag)}</small></span><span aria-hidden="true">›</span></button>`).join('')}</div>`}
 function renderTopic(t){const i=current;return `<button class="gram-back" type="button" data-pron-index>← Alle Klangthemen</button><div class="gram-lesson-title"><span class="eyebrow">KLANGLABOR 2.0 · ${i+1} / ${topics.length}</span><h1>${esc(t.name)}</h1><p>${esc(t.tag)}</p></div><div class="pron-explanation"><p>${esc(t.lead)}</p></div><div class="pron-compare-intro"><strong>${t.type==='same'?'Anders geschrieben – gleich gesprochen':t.type==='different'?'Ein anderer Laut – eine andere Bedeutung':'Laute und Schreibweisen entdecken'}</strong><p>${t.type==='same'?'Bei echten Homophonen zeigt die gemeinsame IPA-Lautschrift, dass beide Wörter gleich klingen.':'Vergleiche die Lautschrift und höre die Aufnahmen.'}</p></div><div class="pron-pair-list">${t.type==='examples'?t.examples.map(example).join(''):t.pairs.map(t.type==='same'?samePair:differentPair).join('')}</div><div class="pron-takeaway"><strong>Gut zu merken</strong><p>${esc(t.tip)}</p></div><div class="gram-task pron-task"><span class="gram-lab-kicker">KURZER SELBSTTEST</span><h3>${esc(t.question)}</h3><div class="pron-answers">${t.choices.map((v,j)=>`<button type="button" data-pron-choice="${j}" class="${chosen===j?(j===t.correct?'is-correct':'is-wrong'):''}" ${chosen!==null?'disabled':''}>${esc(v)}</button>`).join('')}</div>${chosen!==null?`<p class="gram-feedback ${chosen===t.correct?'right':'try'}" role="status">${chosen===t.correct?'Richtig!':'Nicht ganz.'} ${esc(t.tip)}</p>`:''}</div><div class="gram-next-row"><button type="button" class="secondary" data-pron-prev>${i===0?'Alle Themen':'← Zurück'}</button><button type="button" class="primary" data-pron-next>${i===topics.length-1?'Alle Themen':'Nächstes Thema →'}</button></div>`}
 function onClick(event){if(!active)return;const b=event.target.closest('button');if(!b||!root()?.contains(b))return;
  if(b.hasAttribute('data-pron-back')){close();return}
  if(b.hasAttribute('data-pron-index')){window.PalabraGrammarAudio?.stop();window.PalabraAudio?.stop();current=null;chosen=null;render();return}
  if(b.hasAttribute('data-pron-open')){window.PalabraGrammarAudio?.stop();window.PalabraAudio?.stop();current=Number(b.dataset.pronOpen);chosen=null;render();return}
  if(b.hasAttribute('data-pron-choice')){if(chosen===null){chosen=Number(b.dataset.pronChoice);render()}return}
  if(b.hasAttribute('data-pron-prev')){window.PalabraGrammarAudio?.stop();window.PalabraAudio?.stop();current=current===0?null:current-1;chosen=null;render();return}
  if(b.hasAttribute('data-pron-next')){window.PalabraGrammarAudio?.stop();window.PalabraAudio?.stop();current=current===topics.length-1?null:current+1;chosen=null;render();return}
 }
 document.addEventListener('click',onClick);
 return {open,close,isActive,render,topics};
})();
