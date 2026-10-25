/* Palabra 0.7a.8-P2 – pre-recorded grammar and dialogues. */
window.PalabraGrammarAudio=(()=>{'use strict';
 const data=window.PALABRA_GRAMMAR_AUDIO||{singles:[],dialogues:{}};
 const singles=new Map(data.singles.map(x=>[String(x.text).normalize('NFC').trim().toLocaleLowerCase('es'),x]));
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let current=null,button=null,activeId=null;
 function stop(){if(current){try{current.pause();current.currentTime=0;}catch(_){}}current=null;activeId=null;
 if(button){button.classList.remove('audio-playing');button.setAttribute('aria-pressed','false');}button=null;
 document.querySelectorAll('.chat-line.is-speaking').forEach(x=>x.classList.remove('is-speaking'));
 document.querySelectorAll('[data-dialogue-play].audio-playing,[data-dialogue-line].audio-playing').forEach(x=>x.classList.remove('audio-playing'));
 }
 const key=t=>String(t??'').replace(/[⟦⟧]/g,'').trim().normalize('NFC').toLocaleLowerCase('es');
 function hasSingle(t){return singles.has(key(t))||!!window.PalabraAudio?.hasRecording(t)}
 function singlesButtons(t){const item=singles.get(key(t));return item?`<span class="palabra-grammar-audio-controls"><button type="button" class="palabra-audio-button" data-grammar-say="${esc(item.text)}" aria-label="${esc(item.text)} anhören">▶ Anhören</button><button type="button" class="palabra-audio-button audio-slow" data-grammar-say="${esc(item.text)}" data-grammar-slow="true" aria-label="${esc(item.text)} langsam anhören">0,8×</button></span>`:window.PalabraAudio?.buttons(t,{compact:true,label:'Satzbeispiel'})||''}
 function updateHighlight(id,position,segments){if(!id||!segments)return;
 const idx=segments.findIndex(([a,b])=>position>=a&&position<b);
 document.querySelectorAll('.chat-line[data-dialogue-turn]').forEach(el=>el.classList.toggle('is-speaking',Number(el.dataset.dialogueTurn)===idx));
 }
 function play(src,b,opts={}){
  stop();window.PalabraAudio?.stop();
  const a=new Audio(src);a.preload='auto';a.playbackRate=opts.slow?.8:1;a.preservesPitch=true;current=a;button=b||null;activeId=opts.id||null;
  if(button){button.classList.add('audio-playing');button.setAttribute('aria-pressed','true');}
  const start=Number(opts.start||0),end=Number(opts.end||0);
  let seeked=false;
  const seek=()=>{if(seeked||!start)return;try{a.currentTime=start;seeked=true;}catch(_){}};
  a.addEventListener('loadedmetadata',seek,{once:true});
  try{seek();}catch(_){ }
  a.addEventListener('timeupdate',()=>{
   if(current!==a)return;
   if(!seeked&&start&&a.readyState>=1)seek();
   if(end&&a.currentTime>=end){stop();return;}
   if(opts.segments)updateHighlight(activeId,a.currentTime,opts.segments);
  });
  a.addEventListener('ended',()=>{if(current===a)stop()},{once:true});
  a.addEventListener('error',()=>{if(current===a){stop();alert('Aufnahme konnte nicht geladen werden.')}},{once:true});
  try{const promise=a.play();if(promise?.catch)promise.catch(()=>{if(current===a)stop()});}catch(_){stop();}
 }
 function playDialogue(id,btn,turn=null,slow=false){const d=data.dialogues[id];if(!d)return false;
  const seg=Number.isInteger(turn)?d.turns[turn]:null;
  if(Number.isInteger(turn)&&!seg)return false;
  play(d.src,btn,{id,start:seg?.[0]||0,end:seg?.[1]||0,slow,segments:turn===null?d.turns:null});return true;
 }
 document.addEventListener('click',event=>{
  const b=event.target.closest('button[data-grammar-say],button[data-dialogue-play],button[data-dialogue-line]');if(!b)return;
  event.preventDefault();
  if(b.classList.contains('audio-playing')){stop();return;}
  if(b.hasAttribute('data-grammar-say')){const item=singles.get(key(b.dataset.grammarSay));if(item)play(item.src,b,{slow:b.dataset.grammarSlow==='true'});return;}
  if(b.hasAttribute('data-dialogue-play'))playDialogue(b.dataset.dialoguePlay,b,null,b.dataset.dialogueSlow==='true');
  else playDialogue(b.dataset.dialogueId,b,Number(b.dataset.dialogueLine),b.dataset.dialogueSlow==='true');
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 window.addEventListener('pagehide',stop);
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-page],#backDialogues'))stop()});
 return {stop,hasSingle,singlesButtons,hasDialogue:id=>!!data.dialogues[id],playDialogue,info:id=>data.dialogues[id]};
})();
