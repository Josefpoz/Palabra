/* Palabra Grammar · Satzwerkstatt 0.6a.8g1 – read-only prototype, no SRS mutations. */
window.PalabraGrammar = (() => {
 'use strict';
 let active = null, workshopOpen=false;
 const root = () => document.getElementById('grammarArea');
 const lessons = [
  {id:'wortarten',number:'01',title:'Wörter haben Aufgaben',meta:'Nomen, Verben, Adjektive und Artikel',time:'5 Minuten'},
  {id:'satzrollen',number:'02',title:'Wer macht was – und wem?',meta:'Subjekt, Prädikat und Objekte',time:'6 Minuten'},
  {id:'bausteine',number:'03',title:'Die Satzmaschine',meta:'Bausteine zusammensetzen und Rollen tauschen',time:'7 Minuten'}
 ];
 let wordSelection=null,wordAnswer=null,rolesSelection=null,rolesAnswer=null;
 let rolesVisible=false, builderRoles=true,swapped=false, giverSwapped=false, built=[], builderFeedback='';
 const wordItems=[
   {text:'Die',type:'Artikel',detail:'Ein Artikel begleitet hier das Nomen „Katze“. Er zeigt unter anderem Genus, Numerus und Kasus an.'},
   {text:'neugierige',type:'Adjektiv',detail:'Ein Adjektiv beschreibt eine Eigenschaft: Was für eine Katze? Eine neugierige.'},
   {text:'Katze',type:'Nomen',detail:'Ein Nomen bezeichnet hier ein Lebewesen. Im Satz ist die Wortgruppe „Die neugierige Katze“ das Subjekt.'},
   {text:'liest',type:'Verb',detail:'Ein Verb drückt hier eine Tätigkeit aus. „liest“ ist die konjugierte Form von „lesen“.'},
   {text:'ein',type:'Artikel',detail:'Auch „ein“ ist hier ein Artikel. Zusammen mit „Buch“ bildet es eine Wortgruppe.'},
   {text:'Buch',type:'Nomen',detail:'„Buch“ ist ein Nomen. Die Wortgruppe „ein Buch“ ist in diesem Satz das direkte Objekt.'}
 ];
 const roleItems=[
  {text:'Die Frau',type:'Subjekt',question:'Wer schenkt?',detail:'Die Frau führt die Handlung aus. Diese Wortgruppe ist das Subjekt und steht hier im Nominativ.',color:'subject'},
  {text:'schenkt',type:'Prädikat',question:'Was tut sie?',detail:'„schenkt“ ist das finite Verb und bildet in diesem einfachen Satz das Prädikat.',color:'predicate'},
  {text:'dem Mann',type:'Indirektes Objekt',question:'Wem schenkt sie etwas?',detail:'Der Mann bekommt etwas. Die Wortgruppe „dem Mann“ ist hier das indirekte Objekt im Dativ.',color:'indirect'},
  {text:'ein Buch.',type:'Direktes Objekt',question:'Was schenkt sie?',detail:'Ein Buch ist das Geschenk. Diese Wortgruppe ist das direkte Objekt im Akkusativ.',color:'direct'}
 ];
 const safe = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(){if(!root())return; if(window.PalabraPronunciation?.isActive()){window.PalabraPronunciation.render();return} if(window.PalabraGrammarA1?.isActive()){window.PalabraGrammarA1.render();return} active?renderLesson():workshopOpen?renderWorkshop():renderIndex()}
 function resetLesson(id){active=id;wordSelection=null;wordAnswer=null;rolesSelection=null;rolesAnswer=null;rolesVisible=false;builderRoles=true;swapped=false;giverSwapped=false;built=[];builderFeedback='';render();}
 function renderIndex(){
  root().innerHTML=`<div class="gram-hero"><span class="eyebrow">PALABRA GRAMMAR</span><h1>Sprache verbindet.</h1><p>Entdecke die Bausteine hinter deinen Sätzen.</p></div>
  <div class="gram-unit-heading"><h2>Dein Einstieg</h2></div>
  <button type="button" class="gram-a1-launch" data-gram-workshop><span class="gram-a1-mark">◈</span><span><strong>Satzwerkstatt</strong><small>Deutsch und Spanisch gemeinsam verstehen</small><em>Entdecken →</em></span></button>
  <div class="gram-unit-heading gram-collections-heading"><h2>Weiterlernen</h2></div>
  <button type="button" class="gram-a1-launch" data-gram-a1><span class="gram-a1-mark">A1</span><span><strong>Spanisch A1</strong><small>Klanglabor und Grammatik Schritt für Schritt</small><em>Zum Kurs →</em></span></button>`;
 }
 function renderWorkshop(){root().innerHTML=`<button class="gram-back" type="button" data-gram-workshop-back>← Zur Grammar-Übersicht</button><div class="gram-hero"><span class="eyebrow">SATZWERKSTATT</span><h1>Grammatik verbindet Sprachen.</h1><p>Was funktioniert in beiden Sprachen ähnlich – und wo gibt es Unterschiede?</p></div>
  <div class="gram-bridge-card"><div class="gram-bridge-heading"><span class="eyebrow">EINE IDEE · ZWEI SPRACHEN</span><button type="button" class="palabra-context-help" data-help-toggle="gramBridgeHelp" aria-expanded="false" aria-label="Was bedeuten die Farben?">?</button></div>
   <div class="gram-bridge-language"><span>DEUTSCH</span><div class="gram-bridge-words"><button data-bridge-role="subject" type="button" class="role-subject">Der Junge</button><button data-bridge-role="predicate" type="button" class="role-predicate">liest</button><button data-bridge-role="direct" type="button" class="role-direct">ein Buch.</button></div></div>
   <div class="gram-bridge-language"><span>ESPAÑOL</span><div class="gram-bridge-words"><button data-bridge-role="subject" type="button" class="role-subject" lang="es">El niño</button><button data-bridge-role="predicate" type="button" class="role-predicate" lang="es">lee</button><button data-bridge-role="direct" type="button" class="role-direct" lang="es">un libro.</button></div></div>
   <p class="gram-bridge-discovery" id="gramBridgeDiscovery" role="status">Tippe auf einen farbigen Baustein – in beiden Sprachen!</p>
   <div id="gramBridgeHelp" class="palabra-help-content" hidden>Die Farben zeigen echte Satzrollen: Subjekt, Prädikat und direktes Objekt. Gleiche Bedeutung heißt nicht immer gleiche Satzstruktur – wir vergleichen sorgfältig.</div>
  </div>
  <div class="gram-unit-heading"><h2>Die drei Experimente</h2><span class="gram-subtle">In deinem Tempo</span></div><div class="gram-lesson-list">${lessons.map(l=>`<button type="button" class="gram-lesson-card" data-gram-open="${l.id}"><span class="gram-lesson-no">${l.number}</span><span class="gram-lesson-desc"><strong>${l.title}</strong><small>${l.meta}</small></span><span class="gram-chevron" aria-hidden="true">›</span></button>`).join('')}</div>`;}
 function renderLesson(){const l=lessons.find(x=>x.id===active);if(!l){active=null;return renderIndex()}
  root().innerHTML=`<button class="gram-back" type="button" id="gramBack">← Zur Satzwerkstatt</button><div class="gram-lesson-title"><span class="eyebrow">SATZWERKSTATT · LEKTION ${l.number} / 03</span><h1>${l.title}</h1><p>${l.meta}</p></div>
  <div class="gram-mini-track" role="img" aria-label="Lektion ${Number(l.number)} von drei">${lessons.map((x,i)=>`<span class="${i<=lessons.indexOf(l)?'is-current':''}"></span>`).join('')}</div>
  ${active==='wortarten'?lessonWords():active==='satzrollen'?lessonRoles():lessonBuilder()}
  <div class="gram-next-row"><button class="secondary" type="button" id="gramPrevious">${l.id==='wortarten'?'Zur Übersicht':'← Vorherige Lektion'}</button><button class="primary" type="button" id="gramNext">${l.id==='bausteine'?'Zur Übersicht':'Nächste Lektion →'}</button></div>`;
 }
 function info(label,body){return `<div class="gram-explanation"><span class="gram-lightbulb" aria-hidden="true">✧</span><div><strong>${label}</strong><p>${body}</p></div></div>`}
 function lessonWords(){const selected=wordSelection===null?null:wordItems[wordSelection];return `
  <div class="gram-prose"><p><strong>Wörter können ganz verschiedene Aufgaben haben.</strong> Manche benennen Dinge, andere beschreiben Eigenschaften oder sagen, was geschieht.</p><p>Tippe auf ein Wort und entdecke seine <strong>Wortart</strong>.</p></div>
  <div class="gram-lab"><span class="gram-lab-kicker">EXPERIMENT 01 · WÖRTER ENTDECKEN</span><div class="gram-tokenline" aria-label="Die neugierige Katze liest ein Buch">${wordItems.map((w,i)=>`<button type="button" data-gram-word="${i}" class="gram-token ${wordSelection===i?'chosen':''}" aria-pressed="${wordSelection===i}">${safe(w.text)}</button>`).join('')}<span class="gram-punctuation">.</span></div>
  <div class="gram-inspection" aria-live="polite">${selected?`<span class="gram-kicker">${selected.type}</span><strong>${safe(selected.text)}</strong><p>${selected.detail}</p>`:'<p>Wähle einen Baustein, um seine Wortart kennenzulernen.</p>'}</div></div>
  ${info('Eine wichtige Entdeckung','Die <strong>Wortart</strong> gehört zum einzelnen Wort. Die <strong>Satzfunktion</strong> beschreibt dagegen, welche Aufgabe eine Wortgruppe im Satz übernimmt. Ein Nomen ist also nicht automatisch das Subjekt.')}
  <div class="gram-task"><span class="gram-lab-kicker">KURZER SELBSTTEST</span><h3>Welches der Wörter ist ein Verb?</h3><div class="gram-choice-grid">${['Katze','liest','neugierige'].map(x=>`<button type="button" data-gram-word-answer="${x}" class="gram-choice ${wordAnswer===x?'selected':''}" aria-pressed="${wordAnswer===x}">${x}</button>`).join('')}</div>${wordAnswer?`<p class="gram-feedback ${wordAnswer==='liest'?'right':'try'}" role="status">${wordAnswer==='liest'?'✓ Genau! „liest“ beschreibt die Tätigkeit und ist das Verb.':'Noch nicht: „Katze“ bezeichnet ein Lebewesen, „neugierige“ beschreibt es. Welche Form drückt die Tätigkeit aus?'}</p>`:''}</div>
  <div class="gram-spanish-link"><span>BRÜCKE ZUM SPANISCHEN</span><p>Auch in <em>La gata curiosa lee un libro.</em> können wir Nomen, Adjektiv und Verb unterscheiden. Das Muster ist vertraut – die konkreten Sprachregeln lernen wir später.</p></div>`;}
 function lessonRoles(){const selected=rolesSelection===null?null:roleItems[rolesSelection];return `
  <div class="gram-prose"><p>Jetzt schauen wir nicht mehr auf einzelne Wortarten, sondern darauf, <strong>welche Rolle ein ganzer Satzteil spielt</strong>.</p><p>Wer handelt? Was geschieht? Wer erhält etwas? Und was wird verschenkt?</p></div>
  <div class="gram-lab"><span class="gram-lab-kicker">EXPERIMENT 02 · SATZROLLEN</span><div class="gram-role-line" aria-label="Die Frau schenkt dem Mann ein Buch">${roleItems.map((w,i)=>`<button type="button" data-gram-role="${i}" class="gram-role-token role-${w.color} ${rolesSelection===i?'chosen':''}" aria-pressed="${rolesSelection===i}"><span>${w.text}</span>${rolesVisible?`<small>${w.type}</small>`:''}</button>`).join('')}</div><button type="button" id="gramToggleRoles" class="gram-minor-action" aria-pressed="${rolesVisible}">${rolesVisible?'Rollen ausblenden':'Alle Rollen anzeigen'} ↔</button>
  <div class="gram-inspection" aria-live="polite">${selected?`<span class="gram-kicker">${selected.type}</span><strong>${selected.question}</strong><p>${selected.detail}</p>`:'<p>Tippe auf einen Satzbaustein, um seine Rolle zu verstehen.</p>'}</div></div>
  ${info('Wortart ≠ Satzfunktion','„Frau“, „Mann“ und „Buch“ sind alles <strong>Nomen</strong>. Ihre Wortgruppen haben hier aber unterschiedliche Funktionen: Subjekt, indirektes Objekt und direktes Objekt. Das Verb „schenkt“ bildet hier allein das Prädikat.')}
  <div class="gram-task"><span class="gram-lab-kicker">KURZER SELBSTTEST</span><h3>Wer ist hier das indirekte Objekt?</h3><p>Frage dich: <strong>Wem</strong> schenkt die Frau etwas?</p><div class="gram-choice-grid">${['Die Frau','dem Mann','ein Buch'].map(x=>`<button type="button" data-gram-role-answer="${x}" class="gram-choice ${rolesAnswer===x?'selected':''}" aria-pressed="${rolesAnswer===x}">${x}</button>`).join('')}</div>${rolesAnswer?`<p class="gram-feedback ${rolesAnswer==='dem Mann'?'right':'try'}" role="status">${rolesAnswer==='dem Mann'?'✓ Genau! Der Mann erhält das Buch; „dem Mann“ ist das indirekte Objekt.':'Versuch es noch einmal: Wer bekommt das Buch? Beachte die Frage „wem?“.'}</p>`:''}</div>
  <div class="gram-spanish-link"><span>BRÜCKE ZUM SPANISCHEN</span><p><em>La mujer le regala un libro al hombre.</em> – Das spanische <em>le</em> verweist hier ebenfalls auf den Empfänger. Wenn man die Satzrollen versteht, sind solche Pronomen später viel leichter zu durchschauen.</p></div>`;}
 function activeWords(){return swapped?['Der Kater','sieht','den Hund']:['Der Hund','sieht','den Kater']}
 function renderBuildParts(){return built.map((index,i)=>`<button type="button" class="gram-built role-${['subject','predicate','direct'][index]}" data-gram-remove="${i}" title="Baustein zurücklegen">${safe(activeWords()[index])} <span aria-hidden="true">×</span>${builderRoles?`<small>${['Subjekt · Nominativ','Prädikat','Direktes Objekt · Akkusativ'][index]}</small>`:''}</button>`).join('')}
 function lessonBuilder(){const w=activeWords();const man=giverSwapped?'Der Mann':'Die Frau',recipient=giverSwapped?'der Frau':'dem Mann';return `
  <div class="gram-prose"><p>Jetzt wird Grammatik zu einem Baukasten. Wir ordnen die Satzteile zu einem einfachen Aussagesatz und tauschen danach ihre Rollen.</p><p>Wichtig: In der deutschen Sprache sind auch <strong>andere Satzstellungen möglich</strong>. Wir üben hier bewusst zuerst die Reihenfolge <em>Wer? – tut was? – wen?</em></p></div>
  <div class="gram-lab"><span class="gram-lab-kicker">EXPERIMENT 03 · BAUE EINEN SATZ</span><h3>Setze die Bausteine zusammen</h3><p class="gram-hint">Tippe in dieser Reihenfolge: <strong>Wer?</strong> → <strong>macht was?</strong> → <strong>wen?</strong></p>
  <div class="gram-build-zone" aria-label="Zusammengesetzter Satz">${built.length?renderBuildParts():'<span class="gram-empty-slot">Dein Satz entsteht hier …</span>'}</div>
  <div class="gram-wordbank" aria-label="Bausteine auswählen">${[2,0,1].filter(i=>!built.includes(i)).map(i=>`<button type="button" data-gram-add="${i}" class="gram-bank-chip role-${['subject','predicate','direct'][i]}">${safe(w[i])}</button>`).join('')||'<span class="gram-all-used">✓ Alle drei Bausteine eingesetzt</span>'}</div>
  ${built.length===3?`<p class="gram-feedback ${built.join(',')==='0,1,2'?'right':'try'}" role="status">${built.join(',')==='0,1,2'?'✓ Dein Satz ist fertig! Wer handelt, steht hier im Nominativ; wen es betrifft, im Akkusativ.':'Die Wörter bilden noch nicht die geübte Grundreihenfolge. Das heißt nicht automatisch, dass jede andere deutsche Wortstellung falsch ist.'}</p>`:''}
  <div class="gram-toolbar"><button type="button" id="gramSwap" class="gram-compact-action">⇄ Rollen tauschen</button><button type="button" id="gramResetBuild" class="gram-compact-action quiet">↺ Zurücksetzen</button></div>
  <label class="gram-role-switch"><input type="checkbox" id="gramBuilderRoles" ${builderRoles?'checked':''}/> Rollen auf Bausteinen anzeigen</label>
  ${info('Beobachte die Artikel',`<strong>${swapped?'Der Kater sieht den Hund.':'Der Hund sieht den Kater.'}</strong> Wenn wir Täter und Betroffenen tauschen, ändern sich im Deutschen auch die Artikel: <em>der</em> (Nominativ) und <em>den</em> (Akkusativ). Der Baukasten setzt die Formen passend ein.`)}
  </div>
  <div class="gram-task gram-give-task"><span class="gram-lab-kicker">EXPERIMENT 04 · EINE WEITERE ROLLE</span><h3>Wer gibt wem etwas?</h3><div class="gram-give-line"><span class="gram-built role-subject">${man}${builderRoles?'<small>Subjekt</small>':''}</span><span class="gram-built role-predicate">gibt${builderRoles?'<small>Prädikat</small>':''}</span><span class="gram-built role-indirect">${recipient}${builderRoles?'<small>Indirektes Objekt · Dativ</small>':''}</span><span class="gram-built role-direct">ein Buch.${builderRoles?'<small>Direktes Objekt</small>':''}</span></div><button type="button" id="gramGiveSwap" class="secondary">⇄ Geber und Empfänger tauschen</button><p class="gram-hint">Beim Tauschen werden <strong>die Frau → der Frau</strong> und <strong>dem Mann → der Mann</strong>. Das Buch bleibt das direkte Objekt.</p></div>
  <div class="gram-spanish-link"><span>UND SPÄTER AUF SPANISCH?</span><p><em>La mujer le da un libro al hombre.</em> Hier steckt dieselbe Idee dahinter: Eine Person gibt etwas an eine andere. Das spanische <em>le</em> hilft uns, den Empfänger wiederzuerkennen.</p></div>`;}
 function onClick(e){
  const btn=e.target.closest('button'); if(!btn||!root().contains(btn))return;
  if(btn.hasAttribute('data-gram-workshop')){workshopOpen=true;active=null;render();return}
  if(btn.hasAttribute('data-gram-workshop-back')){workshopOpen=false;active=null;render();return}
  if(btn.hasAttribute('data-gram-pronounce')){active=null;window.PalabraGrammarA1?.exit();window.PalabraPronunciation?.open();return}
  if(btn.hasAttribute('data-bridge-role')){const role=btn.dataset.bridgeRole,terms={subject:'SUBJEKT · Der Junge / El niño: Wer liest? Das Subjekt nennt hier die handelnde Person. Im Deutschen steht es im Nominativ.',predicate:'PRÄDIKAT · liest / lee: Was tut der Junge? Das konjugierte Verb bildet hier das Prädikat.',direct:'DIREKTES OBJEKT · ein Buch / un libro: Was liest er? Beide Wortgruppen sind das direkte Objekt; im Deutschen steht es hier im Akkusativ.'};root().querySelectorAll('[data-bridge-role]').forEach(el=>{const selected=el.dataset.bridgeRole===role;el.classList.toggle('is-emphasized',selected);el.setAttribute('aria-pressed',String(selected))});root().querySelector('#gramBridgeDiscovery').textContent=terms[role]||'';return}
  if(btn.hasAttribute('data-gram-a1')){active=null;window.PalabraGrammarA1.open();return}
  const open=btn.getAttribute('data-gram-open');if(open){resetLesson(open);return}
  if(btn.id==='gramBack'){active=null;workshopOpen=true;render();return}
  if(btn.id==='gramPrevious'){const i=lessons.findIndex(x=>x.id===active);i>0?resetLesson(lessons[i-1].id):(active=null,workshopOpen=true,render());return}
  if(btn.id==='gramNext'){const i=lessons.findIndex(x=>x.id===active);i<lessons.length-1?resetLesson(lessons[i+1].id):(active=null,workshopOpen=true,render());return}
  if(btn.hasAttribute('data-gram-word')){wordSelection=Number(btn.getAttribute('data-gram-word'));render();return}
  if(btn.hasAttribute('data-gram-word-answer')){wordAnswer=btn.getAttribute('data-gram-word-answer');render();return}
  if(btn.hasAttribute('data-gram-role')){rolesSelection=Number(btn.getAttribute('data-gram-role'));render();return}
  if(btn.hasAttribute('data-gram-role-answer')){rolesAnswer=btn.getAttribute('data-gram-role-answer');render();return}
  if(btn.id==='gramToggleRoles'){rolesVisible=!rolesVisible;render();return}
  if(btn.hasAttribute('data-gram-add')){const i=Number(btn.getAttribute('data-gram-add'));if(!built.includes(i)&&built.length<3)built.push(i);render();return}
  if(btn.hasAttribute('data-gram-remove')){built.splice(Number(btn.getAttribute('data-gram-remove')),1);render();return}
  if(btn.id==='gramResetBuild'){built=[];render();return}
  if(btn.id==='gramSwap'){swapped=!swapped;built=[];render();return}
  if(btn.id==='gramGiveSwap'){giverSwapped=!giverSwapped;render();return}
 }
 function onChange(e){if(e.target.id==='gramBuilderRoles'){builderRoles=e.target.checked;render()}}
 function init(){root().addEventListener('click',onClick);root().addEventListener('change',onChange);window.PalabraGrammarA1?.init()}
 return {init,render,lessons};
})();
