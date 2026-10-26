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
  let showQuestions=false,activePopupSentence=false,storyError='',pilotPickerOpen=false,pilotNotice='';
  // Story word preparations are curated reading aids, not SRS sessions.
  const vocabulary=window.PALABRA_STORY_VOCABULARY?.decks||{};
  let activeVocabulary=null,vocabIndex=0,vocabRevealed=false,vocabExample=false,vocabPicker=false,vocabNotice='';
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
  function resetView(){pilotPickerOpen=false;pilotNotice='';selectedToken=null;selectedSentence=null;shownTranslations=new Set();shownLiterals=new Set();grammarSentences=new Set();answers=new Map();checked=new Set();showQuestions=false;activePopupSentence=false}
  function render(data,save){dataRef=data;saveFn=save;if(activeVocabulary)renderVocabulary();else if(!selectedStory)renderLibrary();else renderChapter()}
  function scrollUp(){window.scrollTo({top:0,behavior:'instant'})}
  function renderLibrary(){activeVocabulary=null;selectedStory=null;selectedToken=null;const area=$('storiesArea');if(!area)return;
    if(storyError){area.innerHTML=`<div class="panel"><h2>Storydaten konnten nicht geladen werden</h2><p>${esc(storyError)}</p></div>`;return}
    const works=new Map();for(const st of catalog){const key=st.workId||st.id;if(!works.has(key))works.set(key,[]);works.get(key).push(st)}
    const cards=[...works.entries()].map(([key,editions],i)=>{
      const chosen=editions.find(st=>st.id===chosenLevels.get(key))||editions[0];
      const total=chosen.chapters.length,complete=doneCount(chosen);
      return `<article class="story-shelf-card"><div class="story-cover story-cover-${esc(key)}" aria-hidden="true">${chosen.cover?`<img src="${esc(chosen.cover)}" alt="" loading="lazy" decoding="async">`:`<span class="story-cover-ornament">✧</span>`}</div><div class="story-shelf-content"><span class="story-kicker">${esc(chosen.genre||'Kurzgeschichte')} · ${total} Kapitel</span><h2>${esc(chosen.title)}</h2><p>${esc(chosen.description)}</p><div class="story-level-picker" role="group" aria-label="Sprachniveau für ${esc(chosen.title)}">${editions.map(st=>`<button type="button" class="story-level-choice ${st.id===chosen.id?'selected':''}" data-level-choice="${esc(st.id)}" aria-pressed="${st.id===chosen.id}">${esc(st.level)}</button>`).join('')}</div><span class="story-progress-note">${complete} von ${total} Kapiteln gelesen · ${esc(chosen.level)}</span><div class="story-progress-track"><span style="width:${100*complete/Math.max(1,total)}%"></span></div><div class="story-shelf-actions"><button type="button" class="primary story-open" data-open-story="${esc(chosen.id)}">${complete?'Weiterlesen':'Geschichte lesen'} <span aria-hidden="true">→</span></button><button type="button" class="secondary story-vocab-open" data-open-vocab="${esc(chosen.id)}">✧ Wortschatz zur Geschichte <small>20 Wörter · frei ansehen</small></button></div></div></article>`;
    });
    area.innerHTML=`<div class="stories-shelf-intro"><span class="stories-mini-icon">✦</span><div><strong>Wähle deine Geschichte – und dein Niveau.</strong><p>Alle Geschichten und Kapitel sind sofort frei. Keine Freischaltungen und kein Einfluss auf dein Vokabel-SRS.</p></div></div>${cards.join('')}<p class="story-library-footnote">¹ Natürliche deutsche Übersetzung zu jedem Satz · ✦ Ausgewählte Grammatik-Entdeckungen.</p>`;
    area.querySelectorAll('[data-level-choice]').forEach(btn=>btn.onclick=()=>{const st=catalog.find(st=>st.id===btn.dataset.levelChoice);if(!st)return;chosenLevels.set(st.workId||st.id,st.id);renderLibrary()});
    area.querySelectorAll('[data-open-story]').forEach(b=>b.onclick=()=>openStoryEdition(b.dataset.openStory));
    area.querySelectorAll('[data-open-vocab]').forEach(b=>b.onclick=()=>openVocabulary(b.dataset.openVocab));
  }
  function openStoryEdition(editionId){
    const st=catalog.find(x=>x.id===editionId);if(!st)return;
    activeVocabulary=null;selectedStory=st;
    chapterIndex=st.chapters.findIndex(c=>!progress(st)[c.id]?.completed);
    if(chapterIndex<0)chapterIndex=0;
    resetView();renderChapter();scrollUp();
  }
  function openVocabulary(editionId){
    if(!vocabulary[editionId]||!catalog.some(st=>st.id===editionId))return;
    selectedStory=null;activeVocabulary=editionId;vocabIndex=0;vocabRevealed=false;vocabExample=false;vocabPicker=false;vocabNotice='';
    renderVocabulary();scrollUp();
  }
  function vocabMove(delta){
    const cards=vocabulary[activeVocabulary]?.cards||[];
    const index=vocabIndex+delta;
    if(index<0||index>=cards.length)return;
    vocabIndex=index;vocabRevealed=false;vocabExample=false;vocabPicker=false;vocabNotice='';renderVocabulary();
  }
  function vocabCardValid(item){
    const t=window.PALABRA_LEXICON?.tokens?.[item.tokenId];
    return t&&t.edition_id===activeVocabulary&&t.sense_id===item.senseId&&!!window.PalabraBridge?.pilotInfo(item.tokenId);
  }
  function renderVocabulary(){
    const area=$('storiesArea'),st=catalog.find(x=>x.id===activeVocabulary),deck=vocabulary[activeVocabulary];
    if(!area||!deck||!st){renderLibrary();return}
    const cards=deck.cards||[];if(!cards.length){renderLibrary();return}
    const item=cards[vocabIndex],t=window.PALABRA_LEXICON?.tokens?.[item.tokenId];
    const valid=vocabCardValid(item),api=window.PalabraBridge;
    const collections=valid?api.collections():[];
    const inCollections=valid?api.pilotInfo(item.tokenId)?.inCollections||[]:[];
    area.innerHTML=`<div class="story-reader-top"><button type="button" class="text-btn" id="vocabBack">← Alle Geschichten</button><span class="story-reader-indicator">${esc(st.level)} · Wortschatz</span></div>
      <div class="story-vocab-intro"><span class="eyebrow">PALABRA STORIES · LESEVORBEREITUNG</span><h2>Wortschatz zur Geschichte</h2><p><strong>${esc(st.title)}</strong> · ${esc(st.level)}</p><p>20 ausgewählte Wörter, die dir das Lesen erleichtern können. Ganz freiwillig und ohne Einfluss auf dein Spaced Repetition System.</p></div>
      <div class="story-vocab-count"><span>Wort ${vocabIndex+1} von ${cards.length}</span><span>Nur anschauen · kein SRS</span></div>
      <div class="story-vocab-track"><span style="width:${100*(vocabIndex+1)/cards.length}%"></span></div>
      <section class="story-vocab-paper" aria-label="Wortschatzkarte ${vocabIndex+1} von ${cards.length}">
        <div class="story-vocab-kicker">ESPAÑOL</div>
        <h3 lang="es">${esc(item.es)}</h3>
        ${window.PalabraAudio?.buttons(item.es,{label:"Story-Wortschatz"})||""}
        ${vocabRevealed?`<div class="story-vocab-answer"><span>DEUTSCH · IM KONTEXT</span><strong lang="de">${esc(item.de)}</strong></div>
         ${t?`<button type="button" class="story-vocab-example-trigger" id="vocabExample" aria-expanded="${vocabExample}">${vocabExample?'Beispielsatz ausblenden':'Beispielsatz aus der Geschichte anzeigen'} ${vocabExample?'−':'+'}</button>${vocabExample?`<div class="story-vocab-example" lang="es"><p>${esc(t.example_es)}</p><p lang="de">${esc(t.example_de)}</p></div>`:''}`:''}`:
        '<p class="story-vocab-prompt">Kennst du die Bedeutung?</p><button type="button" id="vocabReveal" class="primary">Übersetzung zeigen</button>'}
      </section>
      <div class="story-vocab-controls"><button type="button" class="secondary" id="vocabPrev" ${vocabIndex===0?'disabled':''}>← Zurück</button><button type="button" class="primary" id="vocabNext">${vocabIndex===cards.length-1?'Zum Anfang ↺':'Weiter →'}</button></div>
      <details class="story-vocab-index"><summary>Alle 20 Wörter auswählen</summary><div class="story-vocab-index-grid">${cards.map((w,i)=>`<button type="button" data-vocab-jump="${i}" class="${vocabIndex===i?'active':''}" aria-current="${vocabIndex===i?'true':'false'}">${i+1}. ${esc(w.es)}</button>`).join('')}</div></details>
      <section class="story-vocab-transfer"><div class="story-vocab-transfer-head"><strong>Ein Wort gezielt lernen?</strong><p>Nur wenn du es selbst möchtest, kannst du es zu deiner privaten Learn-Sammlung hinzufügen. Erst dann entsteht bei Bedarf eine SRS-Karte.</p></div>
      ${valid?`<button type="button" class="secondary" id="vocabPickerToggle" aria-expanded="${vocabPicker}">${vocabPicker?'Auswahl schließen':'＋ Zu Learn hinzufügen'}</button>
      ${vocabPicker?`<div class="story-vocab-collections">${collections.map(c=>`<button type="button" data-vocab-collection="${esc(c.id)}"><span>${esc(c.name)}</span><span>${inCollections.includes(c.id)?'✓ Enthalten':'＋ Hinzufügen'}</span></button>`).join('')||'<p>Du hast noch keine private Sammlung angelegt.</p>'}<button type="button" id="vocabCreateCollection">＋ Neue Sammlung erstellen</button></div>`:''}`:
      '<p class="story-vocab-warning">Für dieses Wort fehlt eine gültige Lexikonreferenz. Die Lernübernahme ist daher deaktiviert.</p>'}
      <p class="story-vocab-feedback" role="status" aria-live="polite">${esc(vocabNotice)}</p></section>
      <button type="button" class="primary story-vocab-to-read" id="vocabStartReading">Geschichte lesen →</button>`;
    $('vocabBack').onclick=()=>{renderLibrary();scrollUp()};
    $('vocabStartReading').onclick=()=>openStoryEdition(st.id);
    $('vocabPrev').onclick=()=>vocabMove(-1);
    $('vocabNext').onclick=()=>{if(vocabIndex===cards.length-1){vocabIndex=0;vocabRevealed=false;vocabExample=false;vocabPicker=false;vocabNotice='';renderVocabulary()}else vocabMove(1)};
    const reveal=$('vocabReveal');if(reveal)reveal.onclick=()=>{vocabRevealed=true;renderVocabulary()};
    const example=$('vocabExample');if(example)example.onclick=()=>{vocabExample=!vocabExample;renderVocabulary()};
    area.querySelectorAll('[data-vocab-jump]').forEach(b=>b.onclick=()=>{vocabIndex=Number(b.dataset.vocabJump);vocabRevealed=false;vocabExample=false;vocabPicker=false;vocabNotice='';renderVocabulary()});
    const toggle=$('vocabPickerToggle');if(toggle)toggle.onclick=()=>{vocabPicker=!vocabPicker;vocabNotice='';renderVocabulary()};
    area.querySelectorAll('[data-vocab-collection]').forEach(b=>b.onclick=()=>{
      const r=api.addStoryWord(item.tokenId,b.dataset.vocabCollection);
      vocabNotice=r.ok?(r.already?'Dieses Wort ist bereits in deiner Sammlung.':`✓ In „${r.collection}“ gespeichert. Das Wort kann jetzt in Learn geübt werden.`):(r.message||'Übernahme fehlgeschlagen.');
      renderVocabulary();
    });
    const create=$('vocabCreateCollection');if(create)create.onclick=()=>{
      const name=prompt('Name deiner neuen privaten Sammlung:');if(name===null)return;
      const result=api.createCollection(name);
      if(!result.ok){vocabNotice=result.message;renderVocabulary();return}
      const added=api.addStoryWord(item.tokenId,result.id);
      vocabNotice=added.ok?`✓ In der neuen Sammlung „${result.id?name.trim():''}“ gespeichert.`:(added.message||'Übernahme fehlgeschlagen.');
      renderVocabulary();
    };
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
  function closePanel(){pilotPickerOpen=false;pilotNotice='';selectedToken=null;selectedSentence=null;activePopupSentence=false;const p=$('storyWordPanel');if(p){p.hidden=true;p.innerHTML=''}highlight()}
  function selectToken(id){if(selectedToken===id){closePanel();return}pilotPickerOpen=false;pilotNotice='';
    const found=findToken(id);if(!found)return;selectedToken=id;selectedSentence=found.sentence;activePopupSentence=false;showPanel();highlight();
    requestAnimationFrame(()=>{const panel=$('storyWordPanel'),line=document.querySelector(`.story-sentence[data-sentence-id="${found.sentence.id}"]`);if(!panel||!line||panel.hidden)return;const r=line.getBoundingClientRect(),top=105,bottom=panel.getBoundingClientRect().top-14;if(r.bottom>bottom||r.top<top)window.scrollBy({top:r.top-top,behavior:'smooth'})});
  }
  // Lexikon 2.0 · read-only, additive metadata; never alter SRS/word identity.
  function nounAndIpa(token){
    const lex=window.PALABRA_LEXICON;
    const ref=lex?.tokens?.[token.id];
    const entry=ref?lex?.entries?.[ref.lexeme_id]:null;
    const key=String(token.text||'').trim().toLocaleLowerCase('es');
    const lemma=String(token.lemma||'').trim().toLocaleLowerCase('es');
    const ipa=lex?.pronunciations?.form_ipa?.[key] || (key===lemma?entry?.ipa:'') || '';
    const isNoun=token.pos==='noun'&&entry?.part_of_speech==='noun';
    const gender=isNoun?entry?.gender:null;
    const numberPlural=!!gender && (/^(los|las|los\/las)\s/.test(entry?.display_with_article||'') || (key!==lemma && /s$/.test(key) && !/s$/.test(lemma)));
    const article=gender==='m/f'?(numberPlural?'los/las':'el/la'):
      gender==='m'?(numberPlural?'los':entry.article_singular):
      gender==='f'?(numberPlural?'las':entry.article_singular):'';
    const headword=article?article+' '+token.text:token.text;
    const gram=gender==='m'?'maskulin':gender==='f'?'feminin':gender==='m/f'?'maskulin / feminin':'';
    const articleLemma=gender?entry?.display_with_article:'';
    return {entry,ipa,gender,gram,headword,articleLemma,note:isNoun?entry?.gender_note:'',review:isNoun?entry?.gender_review:null};
  }
  function meaningfulLiteral(t){return typeof t.literal==='string'&&t.literal.trim()&&t.literal.trim().toLocaleLowerCase('de')!==String(t.de||'').trim().toLocaleLowerCase('de')}

  function pilotHtml(tokenId){
    const api=window.PalabraBridge,info=api?.pilotInfo(tokenId);
    if(!info)return '';
    const collections=api.collections();
    const alternatives=info.alternatives||[];
    return `<section class="story-lexicon-box"><div class="story-lexicon-title"><span>✧ PALABRA LEXIKON · ${esc(info.storyTitle||'STORY')} ${esc(info.level)}</span><strong>${esc(nounAndIpa(findToken(tokenId)?.token||{}).articleLemma || info.lemma)}</strong></div>
      <p>Im Satz: <b>${esc(info.meaning)}</b></p><p class="story-lexicon-card-meaning">Lernkarte: <b>${esc(info.german)}</b></p>
      ${alternatives.length?`<details class="story-lexicon-meanings"><summary>Weitere Bedeutungen (${alternatives.length})</summary><ul>${alternatives.map(a=>`<li><b>${esc(a.label)}</b>: ${esc(a.german)}</li>`).join('')}</ul><small>Verschiedene Bedeutungen können unterschiedliche Lernkarten haben.</small></details>`:''}
      ${!info.reviewed?'<small class="story-lexicon-caution">Grundbedeutung noch nicht abschließend redaktionell geprüft · Testkarte</small>':''}
      <button type="button" class="story-lexicon-toggle" id="pilotPickerToggle">${pilotPickerOpen?'Auswahl schließen':'＋ In meine Sammlung übernehmen'}</button>
      ${pilotPickerOpen?`<div class="story-lexicon-collections">${collections.map(c=>`<button type="button" class="story-lexicon-choice" data-pilot-col="${esc(c.id)}"><span>${esc(c.name)}</span><span>${info.inCollections.includes(c.id)?'✓ Enthalten':'＋ Hinzufügen'}</span></button>`).join('')||'<p>Du hast noch keine Sammlung angelegt.</p>'}<button type="button" class="story-lexicon-create" id="pilotCreateCollection">＋ Neue Sammlung erstellen</button></div>`:''}
      ${pilotNotice?`<p class="story-lexicon-feedback" role="status">${esc(pilotNotice)}</p>`:''}
    </section>`;
  }
  function setupPilotButtons(tokenId){
    const api=window.PalabraBridge,toggle=$('pilotPickerToggle');
    if(!api||!toggle)return;
    toggle.onclick=()=>{pilotPickerOpen=!pilotPickerOpen;pilotNotice='';showPanel()};
    document.querySelectorAll('[data-pilot-col]').forEach(btn=>btn.onclick=()=>{
      const result=api.addStoryWord(tokenId,btn.dataset.pilotCol);
      pilotNotice=result.ok?(result.already?'Wort ist bereits in dieser Sammlung.':`✓ In „${result.collection}“ gespeichert. Unter Meine Wörter → Meine Sammlungen kannst du es sofort üben.`):result.message;
      showPanel();
    });
    const create=$('pilotCreateCollection');if(create)create.onclick=()=>{
      const name=prompt('Wie soll deine neue Sammlung heißen?');if(name===null)return;
      const created=api.createCollection(name);
      if(!created.ok){pilotNotice=created.message;showPanel();return;}
      const added=api.addStoryWord(tokenId,created.id);
      pilotNotice=added.ok?`✓ Neue Sammlung „${added.collection}“ erstellt und Wort hinzugefügt.`:added.message;
      showPanel();
    };
  }
  function showPanel(){const panel=$('storyWordPanel');if(!panel||!selectedToken)return;const f=findToken(selectedToken);if(!f)return;
    const {token,sentence}=f;
    const focus=sentence.grammarFocus&&grammarSentences.has(sentence.id)?sentence.grammarFocus:null;
    const spans=focus?.spans.filter(sp=>sp.members.includes(token.id))||[];
    const linguistic=nounAndIpa(token);
    const nounDetail=linguistic.gender?`<p class="story-noun-article"><strong>Artikel · Grundform</strong><span lang="es">${esc(linguistic.articleLemma)}</span></p><p class="story-noun-gender"><strong>Genus</strong>${esc(linguistic.gram)}</p>`:'';
    const nounNote=linguistic.note?`<p class="story-panel-gender-note"><span>GUT ZU WISSEN</span>${esc(linguistic.note)}</p>`:'';
    const ipaHtml=linguistic.ipa?`<span class="story-headword-ipa" title="IPA · breite lateinamerikanische Aussprache, vorläufig regelbasiert">${esc(linguistic.ipa)}</span>`:'';

    panel.hidden=false;
    panel.innerHTML=`<div class="story-panel-handle" aria-hidden="true"></div><div class="story-panel-header"><div><span class="story-panel-label">WORT ERKLÄRT</span><div class="story-headword-line"><h3 lang="es">${esc(linguistic.headword)}</h3>${ipaHtml}</div></div><button type="button" class="story-panel-close" id="storyCloseWord" aria-label="Erklärung schließen">✕</button></div><div class="story-panel-audio">${window.PalabraAudio?.buttons(token.text,{label:"Wortform"})||""}${token.lemma&&token.lemma.toLocaleLowerCase("es")!==token.text.toLocaleLowerCase("es")?`<div class="story-lemma-audio"><span>Grundform: <em lang="es">${esc(token.lemma)}</em></span>${window.PalabraAudio?.buttons(token.lemma,{compact:true,label:"Grundform"})||""}</div>`:""}</div><div class="story-panel-meta"><span>${esc(LABELS[token.pos]||token.pos)}</span><span>${esc(token.form)}</span></div><div class="story-panel-details"><p><strong>Grundform</strong><span lang="es">${esc(linguistic.articleLemma||token.lemma)}</span></p><p><strong>Bedeutung</strong>${esc(token.de)}</p>${nounDetail}${meaningfulLiteral(token)?`<p class="story-literal-emphasis"><strong>Wörtlich</strong>${esc(token.literal)}</p>`:''}</div>${nounNote}${token.note?`<p class="story-panel-note">${esc(token.note)}</p>`:''}${spans.map(sp=>`<div class="story-panel-relation"><span>💡 AUSGEWÄHLTER LERNTIPP</span><strong>${esc(sp.label)}</strong><p>${esc(focus.why)}</p></div>`).join('')}${pilotHtml(token.id)}<button type="button" class="story-panel-sentence" id="storyPanelTranslate">${activePopupSentence?'Satzübersetzung verbergen':'🌐 Ganzen Satz übersetzen'}</button>${activePopupSentence?`<div class="story-panel-fullsentence">${sentenceTranslation(sentence)}</div>`:''}`;
    $('storyCloseWord').onclick=closePanel;setupPilotButtons(token.id);$('storyPanelTranslate').onclick=()=>{activePopupSentence=!activePopupSentence;showPanel()};
  }
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&selectedToken)closePanel()});
  return {render,renderLibrary,formatVersion:2,validate:validFormat};
})();
