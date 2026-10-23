from pathlib import Path
p=Path(__file__).resolve().parent.parent/'stories.js'
s=p.read_text(encoding='utf-8')
s=s.replace('/* Palabra Stories Reader 0.6a.2 – complete sentence grammar, curated offline format. */','/* Palabra Stories Reader 0.6a.4 – selective editorial grammar; 776 natural sentence translations. */')
s=s.replace("const ROLES={\n", "const ROLES={\n",1) # kept only for old data backward compatibility
s=s.replace("          if(seen.size!==all.length)throw Error('Grammatikblick unvollständig: '+s.id);", "          if(s.syntax.length&&seen.size!==all.length)throw Error('Grammatikblick unvollständig: '+s.id);\n          if(s.grammarFocus){\n            if(!s.grammarFocus.title||!s.grammarFocus.why||!Array.isArray(s.grammarFocus.spans))throw Error('Unvollständiger kuratierter Grammatikblick: '+s.id);\n            for(const span of s.grammarFocus.spans){if(!span.members?.length||span.members.some(id=>!valid.has(id)))throw Error('Ungültige Markierung im Grammatikblick: '+s.id);}\n          }")
s=s.replace("<p class=\"story-library-footnote\">Grammatikblick: Die vollständige technische Erfassung ist automatisiert. Die Satzgliedvorschläge werden in weiteren Redaktionstests geprüft.</p>","<p class=\"story-library-footnote\">💡 Nur ausgewählte Lernsätze haben einen Grammatikblick. 🌐 Alle Sätze haben eine natürliche deutsche Übersetzung.</p>")
a=s.index('  function sentenceTranslation(s){')
b=s.index('  function renderQuestions(ch){',a)
s=s[:a]+'''  function sentenceTranslation(s){
    return `<span>Natürliche Übersetzung</span><p>${esc(s.de)}</p>${s.literal&&s.literal!==s.de?`<button class="story-literal-btn" type="button" data-literal="${esc(s.id)}">${shownLiterals.has(s.id)?'Wörtliche Übersetzung ausblenden':'Wörtliche Übersetzung anzeigen'}</button>${shownLiterals.has(s.id)?`<p class="story-literal">${esc(s.literal)}</p>`:''}`:''}`;
  }
  function focusKind(s,id){for(const span of s.grammarFocus?.spans||[]){if(span.members.includes(id))return span.kind;}return ''}
  function renderFocus(s){
    if(!s.grammarFocus)return '';
    const f=s.grammarFocus;
    const items=f.spans.map(sp=>`<span class="story-focus-key" data-focus-kind="${esc(sp.kind)}">${esc(sp.label)}</span>`).join('');
    return `<div class="story-focus-explain" data-focus-explain="${esc(s.id)}" ${grammarSentences.has(s.id)?'':'hidden'}><div class="story-focus-heading">💡 ${esc(f.title)}</div><p>${esc(f.why)}</p><div class="story-focus-keys">${items}</div></div>`;
  }
  function sentenceHtml(s){
    const parts=s.tokens.flatMap(t=>(t.parts?.length?t.parts:[t]).map((p,i)=>({...p,before:i===0?t.before:''})));
    const html=parts.map(p=>esc(p.before)+`<button type="button" class="story-token" data-token="${esc(p.id)}" data-focus-kind="${esc(focusKind(s,p.id))}" aria-label="${esc(p.text)}, Erklärung anzeigen" aria-expanded="false">${esc(p.text)}</button>`).join('');
    const bulb=s.grammarFocus?`<button type="button" class="story-grammar-tiny ${grammarSentences.has(s.id)?'active':''}" data-grammar="${esc(s.id)}" aria-label="Lerntipp für diesen Satz ${grammarSentences.has(s.id)?'schließen':'öffnen'}" aria-pressed="${grammarSentences.has(s.id)}" title="Entdecke eine grammatische Besonderheit">💡</button>`:'';
    return `<div class="story-sentence-wrap" data-sentence-wrap="${esc(s.id)}"><div class="story-sentence" data-sentence-id="${esc(s.id)}">${html}${esc(s.trailing)} <span class="story-sentence-actions"><button type="button" class="story-translate-tiny" data-translate="${esc(s.id)}" aria-label="Satz übersetzen" aria-pressed="${shownTranslations.has(s.id)}" title="Natürliche deutsche Satzübersetzung anzeigen">🌐</button>${bulb}</span></div>${shownTranslations.has(s.id)?`<div class="story-translation" data-translation-for="${esc(s.id)}">${sentenceTranslation(s)}</div>`:''}${renderFocus(s)}</div>`;
  }
''' + s[b:]
a=s.index('  function legendHtml(){')
b=s.index('  function renderChapter(){',a)
s=s[:a]+'''  function legendHtml(){return `<div class="story-grammar-legend story-focus-legend" id="storyGrammarLegend" ${grammarSentences.size?'':'hidden'}><div class="story-legend-title">💡 Grammatik-Entdeckungen <small>Nur kuratierte Lernstellen werden markiert.</small></div><p>Markiert sind die Stellen, die für die Erklärung wichtig sind – nicht automatisch geschätzte Satzglieder. Du kannst mehrere Glühbirnen offen lassen.</p></div>`}
''' + s[b:]
s=s.replace('<span class="story-mode-advice">🌐 Übersetzen · 💡 Grammatik pro Satz</span>','<span class="story-mode-advice">🌐 Satzübersetzung · 💡 ausgewählte Entdeckungen</span>')
s=s.replace('<p class="story-reading-hint">Wörter unauffällig antippen · 💡 markiert auf Wunsch einen einzelnen Satz.</p>','<p class="story-reading-hint">Alle Wörter anklickbar · 🌐 natürliche Übersetzung zu jedem Satz · 💡 nur bei ausgewählten Lernstellen.</p>')
a=s.index('  function groupsFor(s,id){')
b=s.index('  function closePanel(){',a)
s=s[:a]+'''  function highlight(){const prose=$('storyProse');if(!prose)return;
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
''' + s[b:]
a=s.index('  function showPanel(){')
b=s.index("  document.addEventListener('keydown'",a)
s=s[:a]+'''  function showPanel(){const panel=$('storyWordPanel');if(!panel||!selectedToken)return;const f=findToken(selectedToken);if(!f)return;
    const {token,sentence}=f;
    const focus=sentence.grammarFocus&&grammarSentences.has(sentence.id)?sentence.grammarFocus:null;
    const spans=focus?.spans.filter(sp=>sp.members.includes(token.id))||[];
    panel.hidden=false;
    panel.innerHTML=`<div class="story-panel-handle" aria-hidden="true"></div><div class="story-panel-header"><div><span class="story-panel-label">WORT ERKLÄRT</span><h3>${esc(token.text)}</h3></div><button type="button" class="story-panel-close" id="storyCloseWord" aria-label="Erklärung schließen">✕</button></div><div class="story-panel-meta"><span>${esc(LABELS[token.pos]||token.pos)}</span><span>${esc(token.form)}</span></div><div class="story-panel-details"><p><strong>Grundform</strong>${esc(token.lemma)}</p><p><strong>Bedeutung</strong>${esc(token.de)}</p>${meaningfulLiteral(token)?`<p class="story-literal-emphasis"><strong>Wörtlich</strong>${esc(token.literal)}</p>`:''}</div>${token.note?`<p class="story-panel-note">${esc(token.note)}</p>`:''}${spans.map(sp=>`<div class="story-panel-relation"><span>💡 AUSGEWÄHLTER LERNTIPP</span><strong>${esc(sp.label)}</strong><p>${esc(focus.why)}</p></div>`).join('')}<button type="button" class="story-panel-sentence" id="storyPanelTranslate">${activePopupSentence?'Satzübersetzung verbergen':'🌐 Ganzen Satz übersetzen'}</button>${activePopupSentence?`<div class="story-panel-fullsentence">${sentenceTranslation(sentence)}</div>`:''}`;
    $('storyCloseWord').onclick=closePanel;$('storyPanelTranslate').onclick=()=>{activePopupSentence=!activePopupSentence;showPanel()};
  }
''' +s[b:]
p.write_text(s,encoding='utf-8')
print('Patched',p)
