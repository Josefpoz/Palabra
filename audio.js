/* Palabra 0.7a.7 – Full recorded pronunciation corpus.
   4.648 pre-recorded MP3s; stable card IDs; exact surface forms and accents.
   No cloud API requests; no speechSynthesis fallback; no changes to SRS/localStorage. */
window.PalabraAudio = (() => {
  'use strict';
  const clips = Array.isArray(window.PALABRA_AUDIO_CLIPS) ? window.PALABRA_AUDIO_CLIPS : [];
  const byId = new Map();
  const byClipId = new Map();
  const byExactText = new Map();
  const byText = new Map();
  const byForm = new Map();
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function wordText(value) {
    return String(value || '').trim().split(/\s+\/\s+/)[0].trim().slice(0, 160);
  }
  function key(value) {
    // Safe reuse for the same Spanish form across Learn, lexicon and stories.
    // Preserve diacritics; strip only enclosing question/exclamation and end punctuation.
    return wordText(value).normalize('NFC').toLocaleLowerCase('es')
      .replace(/^[\s¿¡“”«».,;:!?]+|[\s¿¡“”«».,;:!?]+$/g,'').replace(/\s+/g,' ').trim();
  }
  const exactKey = value => String(value ?? '').trim().normalize('NFC').toLocaleLowerCase('es');
  for (const item of clips) {
    if (!item || !item.src || !item.text || !item.id) continue;
    byClipId.set(item.id, item);
    if (item.cardId) byId.set(item.cardId, item); // compatible with pilot manifest
    const exact = exactKey(item.text);
    if (exact && !byExactText.has(exact)) byExactText.set(exact, item);
    const k = key(item.text);
    if (k && !byText.has(k)) byText.set(k, item);
  }
  const cardToClip = window.PALABRA_AUDIO_CARD_TO_CLIP || {};
  const formToClip = window.PALABRA_AUDIO_FORM_TO_CLIP || {};
  for (const [cardId, clipId] of Object.entries(cardToClip)) {
    const item = byClipId.get(clipId);
    if (item) byId.set(cardId, item);
  }
  for (const [form, clipId] of Object.entries(formToClip)) {
    const item = byClipId.get(clipId);
    if (item) byForm.set(key(form), item);
  }
  let activeAudio = null;
  let activeButton = null;
  function getClip(value,cardId='') {
    // Learn cards (including templates like "tengo … años") need their own clip;
    // their recorded speech can differ from the text shown on the card.
    if (cardId && byId.has(cardId)) return byId.get(cardId);
    const exact = byExactText.get(exactKey(value));
    if (exact) return exact;
    const k = key(value);
    return byForm.get(k) || byText.get(k) || null;
  }
  function notify(message) {
    let el=document.getElementById('palabra-audio-notice');
    if (!el) {
      el=document.createElement('div'); el.id='palabra-audio-notice';
      el.className='palabra-audio-notice';el.setAttribute('role','status');
      document.body.appendChild(el);
    }
    el.textContent=message; el.hidden=false;
    window.clearTimeout(notify.timer);
    notify.timer=window.setTimeout(()=>{el.hidden=true;},4500);
  }
  function stop() {
    if (activeButton) activeButton.classList.remove('audio-playing');
    activeButton=null;
    if (activeAudio) { try { activeAudio.pause(); activeAudio.currentTime=0; } catch (_) {} }
    activeAudio=null;
  }
  function speak(value, slow=false, button=null, cardId='') {
    const clip=getClip(value,cardId);
    if (!clip) { notify('Für dieses Wort gibt es noch keine geprüfte Aufnahme.'); return false; }
    stop();
    // Construct/play directly in the click handler to retain iOS user activation.
    const audio=new Audio(clip.src);
    audio.preload='auto';
    audio.playbackRate=slow?0.8:1;
    audio.preservesPitch=true;
    activeAudio=audio;
    activeButton=button;
    if (button) button.classList.add('audio-playing');
    const clear=()=>{if(activeAudio!==audio)return;
      if(activeButton)activeButton.classList.remove('audio-playing');
      activeButton=null;activeAudio=null;
    };
    audio.addEventListener('ended',clear,{once:true});
    audio.addEventListener('error',()=>{notify('Die Aufnahme konnte nicht geladen werden. Bitte prüfe deine Internetverbindung.');clear();},{once:true});
    try {
      const promise=audio.play();
      if (promise && typeof promise.catch==='function') promise.catch(()=>{
        if(activeAudio===audio) {notify('Audio konnte nicht abgespielt werden. Tippe erneut oder prüfe deine Browser-Einstellungen.');clear();}
      });
      return true;
    } catch(_) {notify('Audio konnte nicht abgespielt werden.');clear();return false;}
  }
  function buttons(value, {compact=false,label='Wort',cardId=''}={}) {
    const clip=getClip(value,cardId);
    if (!clip) return '';
    const attr=esc(wordText(value)), lbl=esc(label), id=cardId?` data-palabra-card-id="${esc(cardId)}"`:'';
    const example=key(value)!==key(clip.text);
    const spoken=esc(clip.text);
    const what=example?`Beispielaussprache: ${spoken}`:`${lbl}: ${attr}`;
    const hint=example?`Beispielaussprache: ${spoken}`:'Natürliche spanische Aufnahme anhören';
    return `<span class="palabra-audio-controls${compact?' audio-compact':''}" role="group" aria-label="${lbl} anhören">
      <button type="button" class="palabra-audio-button" data-palabra-say="${attr}"${id} aria-label="${what} anhören" title="${hint}">🔊 <span>Anhören</span></button>
      <button type="button" class="palabra-audio-button audio-slow" data-palabra-say="${attr}"${id} data-palabra-slow="true" aria-label="${what} langsam anhören" title="${hint} mit 0,8× abspielen">0,8×</button>
    </span>`;
  }
  document.addEventListener('click', event=>{
    const button=event.target.closest?.('button[data-palabra-say]');
    if(!button)return;
    event.preventDefault();
    speak(button.dataset.palabraSay,button.dataset.palabraSlow==='true',button,button.dataset.palabraCardId||'');
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  return {buttons,speak,stop,hasRecording:(value,cardId='')=>!!getClip(value,cardId),isAvailable:()=>clips.length>0,availableCount:clips.length};
})();
