/* Palabra Stories Reader 0.6a.5 – ruhiger Buchsatz und dezente Fußnoten-Zeichen. */
window.PalabraStories=(()=>{'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const LABELS={noun:'Substantiv',verb:'Verb',name:'Eigenname',adjective:'Adjektiv',adverb:'Adverb',pronoun:'Pronomen',determiner:'Begleiter',conjunction:'Konjunktion',preposition:'Präposition',particle:'Partikel',numeral:'Zahlwort',interjection:'Ausruf / Lautmalerei'};
  const ROLES={
    subject:{title:'Subjekt',hint:'Wer oder was ist am Geschehen beteiligt?'},
    predicate:{title:'Prädikat · Verbgruppe',hint:'Was geschieht oder in welchem Zustand befindet sich jemand?'},
    direct:{title:'Direktes Objekt',hint:'Wen oder was betrifft die Handlung?'},
    indirect:{title:'Indirektes Objekt',hint:'Wem gilt die Handlung oder wer erhält etwas?'},
    adjunct:{title:'Umstandsangabe',hint:'Zusätzliche Information, etwa zu Zeit, Ort oder Art und Weise.'},
    attribute:{title:'Ergänzung · Eigenschaft',hint:'Beschreibt einen Zustand oder eine Eigenschaft.'},
    connector:{title:'Verbindung · Satzanschluss',hint:'Verknüpft Satzteile oder Teilsätze miteinander.'},
    negation:{title:'Verneinung',hint:'Verneint die Aussage oder einen Teil davon.'}
  };
  let catalog=[],dataRef,saveFn;
  const chosenLevels=new Map();
  let selectedStory=null,chapterIndex=0,selectedToken=null,selectedSentence=null;
  let shownTranslations=new Set(),shownLiterals=new Set(),grammarSentences=new Set(),answers=new Map(),checked=new Set();
  let showQuestions=false,activePopupSentence=false,storyError='';
  function flat(s){return s.tokens.flatMap(t=>t.parts?.length?t.parts:[t]);}
  function validFormat(input){
    if(!input||input.format!=='palabra-story-v1'||input.formatVersion!==2||!Array.isArray(input.stories))throw Error('Unbekannte Story-Formatversion (benötigt Version 2).');
    const ids=new Set();
    for(const st of input.stories){
      if(!st.id||ids.has(st.id)||!Array.isArray(st.chapters))throw Error('Ungültige Story-ID oder Kapitel.');ids.add(st.id);
      for(const ch of st.chapters){
        if(typeof ch.title!=='string'||!Array.isArray(ch.sentences)||!Array.isArray(ch.questions))throw Error('Ungültiges Kapitel.');
        for(const s of ch.sentences){
          if(!Array.isArray(s.tokens)||!Array.isArray(s.groups)||!Array.isArray(s.syntax)||typeof s.trailing!=='string'||typeof s.de!=='string'||!s.de.trim())throw Error('Unvollständiger Storysatz oder fehlende natürliche Satzübersetzung.');
          if(s.tokens.map(t=>t.before+t.text).join('')+s.trailing!==s.es)throw Error('Storysatz ist nicht korrekt annotiert.');
          if(s.tokens.some(t=>t.parts?.length&&t.parts.map(p=>p.text).join('')!==t.text))throw Error('Ungültige Wortteil-Zerlegung.');
          const all=flat(s).map(t=>t.id),valid=new Set(all),seen=new Set();
          if(all.length!==valid.size)throw Error('Doppelte Wort-IDs.');
          for(const unit of s.syntax){
            if(!ROLES[unit.role]||!unit.members?.length)throw Error('Ungültige Satzglied-Funktion.');
            for(const id of unit.members){if(!valid.has(id)||seen.has(id))throw Error('Doppelte oder unbekannte Satzglied-ID: '+id);seen.add(id);}
          }
          if(s.syntax.length&&seen.size!==all.length)throw Error('Grammatikblick unvollständig: '+s.id);
          if(s.grammarFocus){
            if(!s.grammarFocus.title||!s.grammarFocus.why||!Array.isArray(s.grammarFocus.spans))throw Error('Unvollständiger kuratierter Grammatikblick: '+s.id);
            for(const span of s.grammarFocus.spans){if(!span.members?.length||span.members.some(id=>!valid.has(id)))throw Error('Ungültige Markierung im Grammatikblick: '+s.id);}
          }
          for(const g of s.groups){if(!g.members?.length||g.members.some(id=>!valid.has(id)))throw Error('Ungültige grammatische Verknüpfung.');}
        }
        for(const q of ch.questions){if(!Array.isArray(q.choices)||q.correct<0||q.correct>=q.choices.length)throw Error('Ungültige Verständnisfrage.');}
      }
    }return input.stories;
  }
  try{catalog=validFormat(window.PALABRA_STORY_CATALOG)}catch(e){storyError=e.message;console.error('Palabra Stories:',e)}
  function chapter(){return selectedStory?.chapters[chapterIndex]}
  function progress(st){return dataRef.stories?.[st.id]||{}}
  function doneCount(st){return st.chapters.filter(ch=>progress(st)[ch.id]?.completed).length}
  function resetView(){selectedToken=null;selectedSentence=null;shownTranslations=new Set();shownLiterals=new Set();grammarSentences=new Set();answers=new Map();checked=new Set();showQuestions=false;activePopupSentence=false}
  function render(data,save){dataRef=data;saveFn=save;if(!selectedStory)renderLibrary();else renderChapter()}
  function scrollUp(){window.scrollTo({top:0,behavior:'instant'})}
  function renderLibrary(){selectedStory=null;selectedToken=null;const area=$('storiesArea');if(!area)return;
    if(storyError){area.innerHTML=`<div class="panel"><h2>Storydaten konnten nicht geladen werden</h2><p>${esc(storyError)}</p></div>`;return}
    const works=new Map();for(const st of catalog){const key=st.workId||st.id;if(!works.has(key))works.set(key,[]);works.get(key).push(st)}
    const cards=[...works.entries()].map(([key,editions],i)=>{
      const chosen=editions.find(st=>st.id===chosenLevels.get(key))||editions[0];
      const total=chosen.chapters.length,complete=doneCount(chosen);
      return `<article class="story-shelf-card"><div class="story-cover story-cover-${esc(key)}" aria-hidden="true"><span class="story-cover-ornament">${key==='coco'?'🐈':'✧'}</span><span>LIBRO<br>0${i+1}</span><span class="story-cover-small">palabra</span></div><div class="story-shelf-content"><span class="story-kicker">${esc(chosen.genre||'Kurzgeschichte')} · ${total} Kapitel</span><h2>${esc(chosen.title)}</h2><p>${esc(chosen.description)}</p><div class="story-level-picker" role="group" aria-label="Sprachniveau für ${esc(chosen.title)}">${editions.map(st=>`<button type="button" class="story-level-choice ${st.id===chosen.id?'selected':''}" data-level-choice="${esc(st.id)}" aria-pressed="${st.id===chosen.id}">${esc(st.level)}</button>`).join('')}</div><span class="story-progress-note">${complete} von ${total} Kapiteln gelesen · ${esc(chosen.level)}</span><div class="story-progress-track"><span style="width:${100*complete/Math.max(1,total)}%"></span></div><button type="button" class="primary story-open" data-open-story="${esc(chosen.id)}">${complete?'Weiterlesen':'Geschichte lesen'} <span aria-hidden="true">→</span></button></div></article>`;
    });
    area.innerHTML=`<div class="stories-shelf-intro"><span class="stories-mini-icon">✦</span><div><strong>Wähle deine Geschichte – und dein Niveau.</strong><p>Alle Geschichten und Kapitel sind sofort frei. Keine Freischaltungen und kein Einfluss auf dein Vokabel-SRS.</p></div></div>${cards.join('')}<p class="story-library-footnote">¹ Natürliche deutsche Übersetzung zu jedem Satz · ✦ Ausgewählte Grammatik-Entdeckungen.</p>`;
    area.querySelectorAll('[data-level-choice]').forEach(btn=>btn.onclick=()=>{const st=catalog.find(st=>st.id===btn.dataset.levelChoice);if(!st)return;chosenLevels.set(st.workId||st.id,st.id);renderLibrary()});
    area.querySelectorAll('[data-open-story]').forEach(b=>b.onclick=()=>{selectedStory=catalog.find(s=>s.id===b.dataset.openStory);chapterIndex=selectedStory.chapters.findIndex(c=>!progress(selectedStory)[c.id]?.completed);if(chapterIndex<0)chapterIndex=0;resetView();renderChapter();scrollUp()});
  }
  function renderToken(t){return `<button type="button" class="story-token" data-token="${esc(t.id)}" aria-label="${esc(t.text)}, Erklärung anzeigen" aria-expanded="false">${esc(t.text)}</button>`}
  function sentenceTranslation(s){
    return `<span>Natürliche Übersetzung</span><p>${esc(s.de)}</p>${s.literal&&s.literal!==s.de?`<button class="story-literal-btn" type="button" data-literal="${esc(s.id)}">${shownLiterals.has(s.id)?'Wörtliche Übersetzung ausblenden':'Wörtliche Übersetzung anzeigen'}</button>${shownLiterals.has(s.id)?`<p class="story-literal">${esc(s.literal)}</p>`:''}`:''}`;
  }
  function focusKind(s,id){for(const span of s.grammarFocus?.spans||[]){if(span.members.includes(id))return span.kind;}return ''}
  function renderFocus(s){
    if(!s.grammarFocus)return '';
    const f=s.grammarFocus;
    const items=f.spans.map(sp=>`<span class="story-focus-key" data-focus-kind="${esc(sp.kind)}">${esc(sp.label)}</span>`).join('');
    return `<div class="story-focus-explain" lang="de" data-focus-explain="${esc(s.id)}" ${grammarSentences.has(s.id)?'':'hidden'}><div class="story-focus-heading">💡 ${esc(f.title)}</div><p>${esc(f.why)}</p><div class="story-focus-keys">${items}</div></div>`;
  }
  function sentenceHtml(s){
    const parts=s.tokens.flatMap(t=>(t.parts?.length?t.parts:[t]).map((p,i)=>({...p,before:i===0?t.before:''})));
    // Das letzte Wort, die Interpunktion und die Fußnoten bleiben zusammen.
    // So stehen die Zeichen nicht allein am Anfang der nächsten Buchzeile.
    const html=parts.map((p,i)=>esc(p.before)+(i===parts.length-1?'<span class="story-sentence-tail">':'')+`<button type="button" class="story-token" data-token="${esc(p.id)}" data-focus-kind="${esc(focusKind(s,p.id))}" aria-label="${esc(p.text)}, Erklärung anzeigen" aria-expanded="false">${esc(p.text)}</button>`).join('');
    const bulb=s.grammarFocus?`<button type="button" class="story-grammar-tiny ${grammarSentences.has(s.id)?'active':''}" data-grammar="${esc(s.id)}" aria-label="Lerntipp für diesen Satz ${grammarSentences.has(s.id)?'schließen':'öffnen'}" aria-pressed="${grammarSentences.has(s.id)}" title="Grammatik-Entdeckung öffnen">✦</button>`:'';
    return `<div class="story-sentence-wrap" data-sentence-wrap="${esc(s.id)}"><div class="story-sentence" data-sentence-id="${esc(s.id)}">${html}${esc(s.trailing)}<span class="story-sentence-actions"><button type="button" class="story-translate-tiny" data-translate="${esc(s.id)}" aria-label="Satz übersetzen" aria-pressed="${shownTranslations.has(s.id)}" title="Natürliche deutsche Satzübersetzung anzeigen">¹</button>${bulb}</span></span></div>${shownTranslations.has(s.id)?`<div class="story-translation" lang="de" data-translation-for="${esc(s.id)}">${sentenceTranslation(s)}</div>`:''}${renderFocus(s)}</div>`;
  }
  function renderQuestions(ch){return `<section class="story-questions"><button class="story-questions-toggle secondary" type="button" id="storyQuestionsToggle" aria-expanded="${showQuestions}">📖 ${showQuestions?'Verständnisfragen ausblenden':'Verständnis prüfen (freiwillig)'} ${showQuestions?'▴':'▾'}</button>${showQuestions?`<div class="story-questions-header"><span class="eyebrow">LESEVERSTÄNDNIS</span><h3>Hast du die Geschichte verstanden?</h3><p>Freiwillig · keine Bewertung für dein Vokabel-SRS.</p></div>${ch.questions.map((q,i)=>`<div class="story-question"><div class="story-question-number">FRAGE ${i+1}</div><h4>${esc(q.question)}</h4>${q.choices.map((choice,j)=>`<button type="button" class="story-choice ${answers.get(i)===j?'selected':''} ${checked.has(i)&&j===q.correct?'correct':''}" data-story-answer="${i}:${j}" ${checked.has(i)?'disabled':''}>${esc(choice)}</button>`).join('')}${checked.has(i)?`<div class="story-question-feedback ${answers.get(i)===q.correct?'ok':'retry'}">${answers.get(i)===q.correct?'✓ Richtig!':'Noch nicht ganz.'} ${esc(q.why)}</div>`:`<button type="button" class="secondary story-check" data-story-check="${i}" ${answers.has(i)?'':'disabled'}>Antwort prüfen</button>`}</div>`).join('')}`:''}</section>`}
  function legendHtml(){return ''} // Erläuterungen stehen direkt am jeweiligen Satz.
  function renderChapter(){const ch=chapter(),area=$('storiesArea');if(!area||!ch){renderLibrary();return}
    const completed=!!progress(selectedStory)[ch.id]?.completed;
    area.innerHTML=`<div class="story-reader-top"><button class="text-btn" id="storyBack">← Alle Geschichten</button><span class="story-reader-indicator">${esc(selectedStory.level)} · Kapitel ${chapterIndex+1}/${selectedStory.chapters.length}</span></div><div class="story-reader-heading"><span class="eyebrow">PALABRA STORIES · ${esc(selectedStory.title)}</span><h2>${esc(ch.title)}</h2><p>Entspannt lesen – Worterklärungen und Grammatik bei Bedarf öffnen.</p></div><div class="story-chapter-strip" role="group" aria-label="Kapitel auswählen">${selectedStory.chapters.map((c,i)=>`<button type="button" data-story-chapter="${i}" class="story-chapter-tab ${i===chapterIndex?'selected':''}" aria-pressed="${i===chapterIndex}"><span>0${i+1}</span><small>${progress(selectedStory)[c.id]?.completed?'✓ Gelesen':i===chapterIndex?'Jetzt lesen':'Kapitel'}</small></button>`).join('')}</div><div class="story-reading-paper"><div class="story-reading-toolbar"><span>LESEMODUS</span><span class="story-mode-advice">¹ Übersetzung · ✦ Grammatik</span></div>${legendHtml()}<div class="story-prose" id="storyProse" lang="es">${ch.sentences.map((sent,i)=>(sent.paragraphStart||i===0?'<div class="story-paragraph">':'')+sentenceHtml(sent)+(i===ch.sentences.length-1||ch.sentences[i+1].paragraphStart?'</div>':'')).join('')}</div><div class="story-reading-end">✧</div><p class="story-reading-hint">Wörter antippen · ¹ Satzübersetzung · ✦ ausgewählte Grammatik-Entdeckungen</p></div>${renderQuestions(ch)}<div class="story-next-section"><span>${completed?'✓ Kapitel bereits gelesen':'Fragen sind optional. Du kannst direkt weiterlesen.'}</span><button type="button" class="primary" id="storyFinish">${chapterIndex<selectedStory.chapters.length-1?'Kapitel abschließen & weiterlesen →':'Geschichte abschließen ✓'}</button></div><div id="storyWordPanel" class="story-word-panel" hidden role="region" aria-label="Worterklärung"></div>`;
    $('storyBack').onclick=()=>{closePanel();renderLibrary();scrollUp()};
    area.querySelectorAll('[data-story-chapter]').forEach(b=>b.onclick=()=>{chapterIndex=Number(b.dataset.storyChapter);resetView();renderChapter();scrollUp()});
    area.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>selectToken(b.dataset.token));
    area.querySelectorAll('[data-grammar]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.grammar;grammarSentences.has(id)?grammarSentences.delete(id):grammarSentences.add(id);
      if(selectedToken){const found=findToken(selectedToken);if(found?.sentence.id===id)closePanel();}
      highlight();
    });
    area.querySelectorAll('[data-translate]').forEach(b=>b.onclick=()=>{let id=b.dataset.translate;shownTranslations.has(id)?shownTranslations.delete(id):shownTranslations.add(id);closePanel();renderChapter()});
    area.querySelectorAll('[data-literal]').forEach(b=>b.onclick=()=>{let id=b.dataset.literal;shownLiterals.has(id)?shownLiterals.delete(id):shownLiterals.add(id);renderChapter()});
    $('storyQuestionsToggle').onclick=()=>{showQuestions=!showQuestions;closePanel();renderChapter();if(showQuestions)document.getElementById('storyQuestionsToggle').scrollIntoView({block:'nearest'})};
    area.querySelectorAll('[data-story-answer]').forEach(b=>b.onclick=()=>{const[qi,ai]=b.dataset.storyAnswer.split(':').map(Number);if(checked.has(qi))return;answers.set(qi,ai);renderChapter()});
    area.querySelectorAll('[data-story-check]').forEach(b=>b.onclick=()=>{const qi=Number(b.dataset.storyCheck);if(!answers.has(qi))return;checked.add(qi);renderChapter()});
    $('storyFinish').onclick=()=>{
      if(!window.PalabraDev?.enabled()){
        if(!dataRef.stories||typeof dataRef.stories!=='object')dataRef.stories={};
        if(!dataRef.stories[selectedStory.id])dataRef.stories[selectedStory.id]={};
        dataRef.stories[selectedStory.id][ch.id]={completed:true,lastCompleted:new Date().toISOString()};saveFn();
      }
      if(chapterIndex<selectedStory.chapters.length-1){chapterIndex++;resetView();renderChapter();scrollUp()}else{resetView();renderLibrary();scrollUp()}
    };
    selectedToken=null;selectedSentence=null;highlight();
  }
  function findToken(id){for(const s of chapter().sentences){const t=flat(s).find(t=>t.id===id);if(t)return{token:t,sentence:s}}return null}
  function highlight(){const prose=$('storyProse');if(!prose)return;
    prose.querySelectorAll('[data-sentence-wrap]').forEach(w=>{
      const id=w.dataset.sentenceWrap,active=grammarSentences.has(id);
      w.classList.toggle('story-grammar-on',active);
      const b=w.querySelector('[data-grammar]');
      if(b){b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',`Lerntipp für diesen Satz ${active?'schließen':'öffnen'}`);}
      const f=w.querySelector('[data-focus-explain]');if(f)f.hidden=!active;
    });
    prose.querySelectorAll('[data-token]').forEach(b=>{const id=b.dataset.token;b.classList.toggle('story-selected',id===selectedToken);b.setAttribute('aria-expanded',String(id===selectedToken))});
    const legend=$('storyGrammarLegend');if(legend)legend.hidden=grammarSentences.size===0;
  }
  function closePanel(){selectedToken=null;selectedSentence=null;activePopupSentence=false;const p=$('storyWordPanel');if(p){p.hidden=true;p.innerHTML=''}highlight()}
  function selectToken(id){if(selectedToken===id){closePanel();return}
    const found=findToken(id);if(!found)return;selectedToken=id;selectedSentence=found.sentence;activePopupSentence=false;showPanel();highlight();
    requestAnimationFrame(()=>{const panel=$('storyWordPanel'),line=document.querySelector(`.story-sentence[data-sentence-id="${found.sentence.id}"]`);if(!panel||!line||panel.hidden)return;const r=line.getBoundingClientRect(),top=105,bottom=panel.getBoundingClientRect().top-14;if(r.bottom>bottom||r.top<top)window.scrollBy({top:r.top-top,behavior:'smooth'})});
  }
  function meaningfulLiteral(t){return typeof t.literal==='string'&&t.literal.trim()&&t.literal.trim().toLocaleLowerCase('de')!==String(t.de||'').trim().toLocaleLowerCase('de')}
  function showPanel(){const panel=$('storyWordPanel');if(!panel||!selectedToken)return;const f=findToken(selectedToken);if(!f)return;
    const {token,sentence}=f;
    const focus=sentence.grammarFocus&&grammarSentences.has(sentence.id)?sentence.grammarFocus:null;
    const spans=focus?.spans.filter(sp=>sp.members.includes(token.id))||[];
    panel.hidden=false;
    panel.innerHTML=`<div class="story-panel-handle" aria-hidden="true"></div><div class="story-panel-header"><div><span class="story-panel-label">WORT ERKLÄRT</span><h3>${esc(token.text)}</h3></div><button type="button" class="story-panel-close" id="storyCloseWord" aria-label="Erklärung schließen">✕</button></div><div class="story-panel-meta"><span>${esc(LABELS[token.pos]||token.pos)}</span><span>${esc(token.form)}</span></div><div class="story-panel-details"><p><strong>Grundform</strong>${esc(token.lemma)}</p><p><strong>Bedeutung</strong>${esc(token.de)}</p>${meaningfulLiteral(token)?`<p class="story-literal-emphasis"><strong>Wörtlich</strong>${esc(token.literal)}</p>`:''}</div>${token.note?`<p class="story-panel-note">${esc(token.note)}</p>`:''}${spans.map(sp=>`<div class="story-panel-relation"><span>💡 AUSGEWÄHLTER LERNTIPP</span><strong>${esc(sp.label)}</strong><p>${esc(focus.why)}</p></div>`).join('')}<button type="button" class="story-panel-sentence" id="storyPanelTranslate">${activePopupSentence?'Satzübersetzung verbergen':'🌐 Ganzen Satz übersetzen'}</button>${activePopupSentence?`<div class="story-panel-fullsentence">${sentenceTranslation(sentence)}</div>`:''}`;
    $('storyCloseWord').onclick=closePanel;$('storyPanelTranslate').onclick=()=>{activePopupSentence=!activePopupSentence;showPanel()};
  }
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&selectedToken)closePanel()});
  return {render,renderLibrary,formatVersion:2,validate:validFormat};
})();
