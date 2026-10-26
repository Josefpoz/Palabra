/* Palabra 0.7a.8-P4 – independent dialogue turns, gapless-safe sequential playback. */
window.PalabraGrammarAudio=(()=>{
 'use strict';
 const data=window.PALABRA_GRAMMAR_AUDIO||{singles:[],dialogues:{}};
 const turns=window.PALABRA_DIALOGUE_TURNS?.dialogues||{};
 const singles=new Map((data.singles||[]).map(x=>[key(x.text),x]));
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function key(s){return String(s??'').replace(/[⟦⟧]/g,'').trim().normalize('NFC').toLocaleLowerCase('es')}
 let current=null,button=null,mode=null,position=0,queue=[],pauseTimeout=null,epoch=0,paused=false,speed=1;
 function clearVisuals(){
  document.querySelectorAll('#dialogueArea .chat-line.is-speaking').forEach(x=>x.classList.remove('is-speaking'));
  document.querySelectorAll('[data-dialogue-play].audio-playing,[data-dialogue-line].audio-playing,[data-grammar-say].audio-playing').forEach(x=>{x.classList.remove('audio-playing');x.setAttribute('aria-pressed','false')});
  const p=document.querySelector('#dialogueArea [data-dialogue-progress]');if(p)p.textContent='';
  const control=document.querySelector('#dialogueArea [data-dialogue-pause]');if(control){control.disabled=true;control.textContent='⏸ Pause';control.setAttribute('aria-pressed','false')}
 }
 function highlight(idx,dialogueId){
  document.querySelectorAll('#dialogueArea .chat-line[data-dialogue-turn]').forEach(x=>x.classList.toggle('is-speaking',Number(x.dataset.dialogueTurn)===idx));
  const p=document.querySelector('#dialogueArea [data-dialogue-progress]');
  if(p && turns[dialogueId])p.textContent=`Sprechblase ${idx+1} von ${turns[dialogueId].clips.length}`;
  const control=document.querySelector('#dialogueArea [data-dialogue-pause]');if(control){control.disabled=false;control.textContent=paused?'▶ Fortsetzen':'⏸ Pause';control.setAttribute('aria-pressed',String(paused))}
 }
 function stop(){
  epoch++;if(pauseTimeout!==null){clearTimeout(pauseTimeout);pauseTimeout=null}
  if(current){try{current.pause();current.removeAttribute('src');current.load()}catch(_){}}
  current=null;button=null;mode=null;position=0;queue=[];paused=false;clearVisuals();
 }
 function alertProblem(message){const label=document.querySelector('#dialogueArea [data-dialogue-progress]');if(label)label.textContent=message;else console.warn(message)}
 function beginClip(src,b,slow=false){
  stop();window.PalabraAudio?.stop();
  const serial=epoch;mode='single';speed=slow?0.8:1;button=b||null;
  const player=new Audio();current=player;player.preload='auto';player.preservesPitch=true;player.playbackRate=speed;
  player.addEventListener('ended',()=>{if(current===player&&epoch===serial)stop()});
  player.addEventListener('error',()=>{if(current===player&&epoch===serial){stop();alertProblem('Die Audioaufnahme konnte nicht geladen werden.')}});
  if(b){b.classList.add('audio-playing');b.setAttribute('aria-pressed','true')}
  player.src=src;const result=player.play();result?.catch?.(()=>{if(current===player&&epoch===serial){stop();alertProblem('Die Wiedergabe wurde vom Browser blockiert. Bitte erneut tippen.')}});
  return true;
 }
 function runQueue(serial,dialogueId){
  if(serial!==epoch||mode!=='dialogue'||!current)return;
  if(position>=queue.length){stop();return}
  const idx=position;
  current.src=queue[idx];current.playbackRate=speed;paused=false;highlight(idx,dialogueId);
  const promise=current.play();promise?.catch?.(()=>{
   if(serial!==epoch||mode!=='dialogue'||!current||paused)return;
   const audio=current; if(audio.paused){paused=true;highlight(idx,dialogueId);alertProblem('Automatische Wiedergabe blockiert. Bitte auf „Fortsetzen“ tippen.')}
  });
 }
 function playDialogue(id,b,turn=null,slow=false,original=false){
  lastDialogue=id;
  const clipSet=turns[id]?.clips;
  if(original){const legacy=data.dialogues?.[id];if(!legacy?.src)return false;return beginClip(legacy.src,b,slow)}
  if(!clipSet?.length){const legacy=data.dialogues?.[id];if(!legacy?.src)return false;
    if(Number.isInteger(turn))return false; return beginClip(legacy.src,b,slow)
  }
  if(Number.isInteger(turn)){
   if(!clipSet[turn])return false;
   const ok=beginClip(clipSet[turn],b,slow);
   if(ok){mode='turn';highlight(turn,id)}return ok;
  }
  stop();window.PalabraAudio?.stop();
  const serial=epoch;mode='dialogue';button=b||null;queue=clipSet;position=0;speed=slow?.8:1;
  const player=new Audio();current=player;player.preload='auto';player.preservesPitch=true;player.playbackRate=speed;
  if(b){b.classList.add('audio-playing');b.setAttribute('aria-pressed','true')}
  player.addEventListener('ended',()=>{
   if(serial!==epoch||current!==player||mode!=='dialogue')return;
   position++;if(position>=queue.length){stop();return}
   // Short conversational gap. Same audio element is reused to preserve playback authorization on mobile.
   pauseTimeout=setTimeout(()=>{pauseTimeout=null;runQueue(serial,id)},180);
  });
  player.addEventListener('error',()=>{
   if(serial!==epoch||current!==player)return;
   const failed=position+1;stop();alertProblem(`Sprechblase ${failed} konnte nicht geladen werden. Bitte Verbindung prüfen.`)
  });
  runQueue(serial,id);return true;
 }
 function togglePause(){
  if(!current||mode!=='dialogue')return false;
  if(paused){paused=false;
    if(pauseTimeout!==null){clearTimeout(pauseTimeout);pauseTimeout=null;runQueue(epoch,currentDialogue());return true}
    const p=current.play();p?.catch?.(()=>{paused=true;highlight(position,currentDialogue());alertProblem('Tippe erneut auf „Fortsetzen“.')});
  }else{paused=true;current.pause()}
  highlight(position,currentDialogue());return true;
 }
 let lastDialogue=null;
 function currentDialogue(){return lastDialogue}
 function hasSingle(t){return singles.has(key(t))||!!window.PalabraAudio?.hasRecording(t)}
 function singlesButtons(t){const item=singles.get(key(t));return item?`<span class="palabra-grammar-audio-controls"><button type="button" class="palabra-audio-button" data-grammar-say="${esc(item.text)}" aria-label="${esc(item.text)} anhören">▶ Anhören</button><button type="button" class="palabra-audio-button audio-slow" data-grammar-say="${esc(item.text)}" data-grammar-slow="true" aria-label="${esc(item.text)} langsam anhören">0,8×</button></span>`:window.PalabraAudio?.buttons(t,{compact:true,label:'Aussprache'})||''}
 document.addEventListener('click',event=>{
  const b=event.target.closest?.('button[data-grammar-say],button[data-dialogue-play],button[data-dialogue-line],button[data-dialogue-pause]');if(!b)return;
  event.preventDefault();
  if(b.hasAttribute('data-dialogue-pause')){togglePause();return}
  if(b.classList.contains('audio-playing')){if(mode==='dialogue')togglePause();else stop();return}
  if(b.hasAttribute('data-grammar-say')){const item=singles.get(key(b.dataset.grammarSay));if(item)beginClip(item.src,b,b.dataset.grammarSlow==='true');return}
  const id=b.dataset.dialoguePlay||b.dataset.dialogueId;lastDialogue=id;
  const t=b.hasAttribute('data-dialogue-line')?Number(b.dataset.dialogueLine):null;
  playDialogue(id,b,t,b.dataset.dialogueSlow==='true',b.dataset.dialogueOriginal==='true');
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 window.addEventListener('pagehide',stop);
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-page],#backDialogues'))stop()});
 return {stop,hasSingle,singlesButtons,hasDialogue:id=>!!turns[id]?.clips?.length||!!data.dialogues?.[id],hasTurn:(id,n)=>!!turns[id]?.clips?.[n],needsReview:(id,n)=>(turns[id]?.qa||[]).includes(n),playDialogue,info:id=>({turns:turns[id],original:data.dialogues?.[id]})};
})();
