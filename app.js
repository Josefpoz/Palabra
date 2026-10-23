(()=>{'use strict';
const KEY='palabra-foundation-05a2-v1';const DAY=86400000;const $=id=>document.getElementById(id);
const iso=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const addDays=(date,n)=>{const [y,m,d]=date.split('-').map(Number);const x=new Date(y,m-1,d+n);return iso(x)};
const daysBetween=(a,b)=>{const toUtc=s=>{const [y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d)};return Math.round((toUtc(b)-toUtc(a))/DAY)};
const intervals=[1,3,7,14,30,60,120,240];
const MASTERED_FREE=7; // Vorläufig: sieben erfolgreiche freie Abrufe in Folge mit langfristigen Intervallen.
const DECKS=["Erste Gespräche","Mein Alltag","Unterwegs & Kommunizieren","Erlebnisse & Gefühle","Alltag vertiefen"];
const newProgress=()=>({discoveredOn:null,introducedOn:null,passive:{due:null,level:0,freeDates:[],freeStreak:0,reviews:0,last:null},active:{unlocked:false,due:null,level:0,freeDates:[],freeStreak:0,reviews:0,last:null}});
const seed=window.PALABRA_SEED||[];
const WORD_CLASSES={noun:'Substantiv',verb:'Verb',adjective:'Adjektiv',adverb:'Adverb',phrase:'Wendung',pronoun:'Pronomen',determiner:'Begleiter',quantifier:'Mengenwort',interrogative:'Fragewort',preposition:'Präposition',conjunction:'Konjunktion',numeral:'Zahlwort',interjection:'Ausruf',particle:'Partikel',other:'Sonstiges'};
function initial(){return{version:1,created:iso(),settings:{dailyNew:20,extraDate:null,extraBlocks:0},words:seed.map(w=>({...w,progress:newProgress()})),history:[]}}
function validate(data){if(!data||data.version!==1||!Array.isArray(data.words)||!data.settings||!Array.isArray(data.history))throw Error('Ungültiges oder inkompatibles Palabra-Backup.');if(data.words.length>30000)throw Error('Zu viele Wörter im Backup.');for(const w of data.words){if(typeof w.es!=='string'||typeof w.de!=='string'||!w.progress||!w.progress.passive||!w.progress.active)throw Error('Beschädigte Vokabeleinträge.')}return data}
let data;try{const stored=localStorage.getItem(KEY);data=stored?validate(JSON.parse(stored)):initial()}catch(e){data=initial();alert('Gespeicherte Daten konnten nicht gelesen werden. Bitte stelle ggf. ein Backup wieder her.')} 
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch(e){alert('Speichern fehlgeschlagen! Bitte Speicherplatz prüfen und sofort ein Backup exportieren.');return false}}
if(!localStorage.getItem(KEY))save();

if(!Number.isFinite(data.settings.extraBlocks))data.settings.extraBlocks=0;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Unlock only after three distinct calendar days of successful unaided passive recall,
// with at least seven days between the first and third success.
function eligibleForActive(w){
 const dates=[...new Set((w.progress.passive.freeDates||[]).filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)))].sort();
 return dates.length>=3 && daysBetween(dates[0],dates[dates.length-1])>=7;
}
function reconcileUnlocks(){
 let changed=false;
 for(const w of data.words){
  const eligible=eligibleForActive(w), a=w.progress.active;
  if(a.unlocked!==eligible){a.unlocked=eligible;changed=true}
  if(eligible && !a.due){a.due=iso();changed=true}
 }
 if(changed)save();
}
reconcileUnlocks();
const introducedCount=()=>data.words.filter(w=>!!w.progress.passive.introducedOn).length;
const unlockedCount=()=>data.words.filter(eligibleForActive).length;
function streakInfo(){
 const dates=new Set(data.history.filter(h=>h&&typeof h.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(h.date)).map(h=>h.date));
 let day=iso(), count=0;
 if(!dates.has(day))day=addDays(day,-1);
 while(dates.has(day)){count++;day=addDays(day,-1)}
 return {count,learnedToday:dates.has(iso())};
}
function introducedToday(){return data.words.filter(w=>w.progress.passive.introducedOn===iso()).length}
function extraBlocksToday(){return data.settings.extraDate===iso()?data.settings.extraBlocks:0}
function dailyAllowance(){return data.settings.dailyNew+20*extraBlocksToday()}
function remainingFresh(){return data.words.filter(w=>!w.progress.passive.introducedOn).length}
// Separate queues: passive introduces new cards; active practices already introduced words.
// The direction and category are only session filters, never separate word databases.
let selectedDirection='passive',selectedCategory='all',selectedDeck=data.settings.lastDeck||'palabra-basis-1',selectedPackage=data.settings.lastPackage||'next',statsDirection='passive';
const isReviewOnly=()=>selectedDeck==='all'||selectedPackage==='all';
const deckOf=w=>w.deck_id||'palabra-basis-1';
const deckFilter=w=>selectedDeck==='all'||deckOf(w)===selectedDeck;
const packFilter=w=>selectedPackage==='next'||selectedPackage==='all'||String(w.package)===selectedPackage;
const mastered=w=>Number(w.progress.passive.freeStreak||0)>=MASTERED_FREE&&Number(w.progress.passive.level||0)>=6;
function currentNextPackage(){const pool=data.words.filter(deckFilter);const first=pool.find(w=>!w.progress.passive.introducedOn);return first?first.package:null;}
function freshFilter(w){return selectedPackage==='next'?w.package===currentNextPackage():packFilter(w)}
function categories(){return [...new Set(data.words.map(w=>w.category||'Alltag'))].sort((a,b)=>a.localeCompare(b,'de'))}
function inCategory(w){return !isReviewOnly()||selectedCategory==='all'||(w.category||'Alltag')===selectedCategory}
function candidates(dir=selectedDirection){
 const now=iso(),due=[],fresh=[];
 for(const w of data.words){if(!deckFilter(w)||!inCategory(w))continue;
  const p=w.progress.passive,a=w.progress.active;
  if(dir==='passive'){
   if(p.introducedOn){if(packFilter(w)&&p.due&&p.due<=now)due.push({id:w.id,dir,due:p.due})}
   else if(!isReviewOnly()&&freshFilter(w))fresh.push({id:w.id,dir,due:now,new:true});
  }else if(packFilter(w)&&eligibleForActive(w)){
   // Active is available only after three spaced free-recall successes.
   if(a.reviews===0)fresh.push({id:w.id,dir,due:now,new:true});
   else if(a.due&&a.due<=now)due.push({id:w.id,dir,due:a.due});
  }
 }
 due.sort((a,b)=>a.due.localeCompare(b.due));fresh.sort((a,b)=>wordFor(a).learning_order-wordFor(b).learning_order);
 return dir==='passive'?[...due,...fresh.slice(0,Math.max(0,dailyAllowance()-introducedToday()))]:[...due,...fresh];
}
function updateSelectors(){
 const tiles=$('deckTiles');
 const tileData=DECKS.map((name,i)=>{const id=`palabra-basis-${i+1}`;const ws=data.words.filter(w=>deckOf(w)===id);const intro=ws.filter(w=>w.progress.passive.introducedOn).length;const due=ws.filter(w=>w.progress.passive.introducedOn&&w.progress.passive.due&&w.progress.passive.due<=iso()).length;return {id,name,i,intro,due}});
 tiles.innerHTML=tileData.map(d=>`<button type="button" class="deck-tile ${selectedDeck===d.id?'is-selected':''}" data-deck="${d.id}" aria-pressed="${selectedDeck===d.id}"><span class="deck-tile-head"><span class="deck-chip">Basis ${d.i+1}</span><span class="deck-check">${selectedDeck===d.id?'✓':''}</span></span><strong>${escape(d.name)}</strong><small>${d.intro}/200 eingeführt · ${d.due} fällig</small><span class="mini-track"><span style="width:${d.intro/2}%"></span></span></button>`).join('')+`<button type="button" class="deck-tile all-tile ${selectedDeck==='all'?'is-selected':''}" data-deck="all" aria-pressed="${selectedDeck==='all'}"><span class="deck-tile-head"><span class="deck-chip">Gesamt</span><span class="deck-check">${selectedDeck==='all'?'✓':''}</span></span><strong>Alle Basisdecks</strong><small>Gemeinsam wiederholen</small></button>`;
 tiles.querySelectorAll('[data-deck]').forEach(btn=>btn.onclick=()=>{selectedDeck=btn.dataset.deck;selectedPackage=selectedDeck==='all'?'all':'next';selectedCategory='all';data.settings.lastDeck=selectedDeck;data.settings.lastPackage=selectedPackage;save();updateHome()});
 const pack=$('packageSelect');let opts='<option value="next">Empfohlenes nächstes Paket + Wiederholungen</option><option value="all">Gesamtes Deck wiederholen (nur bekannte Wörter)</option>';
 const ids=[...new Set(data.words.filter(deckFilter).map(w=>w.package))].sort((a,b)=>a-b);
 for(const id of ids){const first=data.words.find(w=>w.package===id);const n=first.package_in_deck;const introduced=data.words.filter(w=>w.package===id&&w.progress.passive.introducedOn).length;opts+=`<option value="${id}">Paket ${n}: ${escape(first.learning_goal)} (${introduced}/20)</option>`}
 pack.innerHTML=opts;if(selectedPackage!=='next'&&selectedPackage!=='all'&&!ids.some(x=>String(x)===selectedPackage))selectedPackage='next';pack.value=selectedPackage;
 const dp=$('deckProgress');dp.innerHTML=DECKS.map((name,i)=>{const ws=data.words.filter(w=>w.deck_id===`palabra-basis-${i+1}`);const intro=ws.filter(w=>w.progress.passive.introducedOn).length,master=ws.filter(mastered).length,due=ws.filter(w=>w.progress.passive.introducedOn&&w.progress.passive.due&&w.progress.passive.due<=iso()).length;return `<div class="deck-progress"><b>Basis ${i+1} · ${escape(name)}</b><small>${intro}/200 eingeführt · ${master}/200 gemeistert · ${due} fällig</small><div class="mini-track"><span style="width:${intro/2}%"></span></div></div>`}).join('');
 $('categoryWrap').hidden=!isReviewOnly();
 const el=$('categorySelect'),available=[...new Set(data.words.filter(w=>deckFilter(w)&&(w.progress.discoveredOn||w.progress.passive.introducedOn)).map(w=>w.category||'Alltag'))].sort((a,b)=>a.localeCompare(b,'de')),previous=selectedCategory;
 el.innerHTML='<option value="all">Alle Kategorien</option>'+available.map(c=>`<option value="${escape(c)}">${escape(c)}</option>`).join('');
 if(previous!=='all'&&!available.includes(previous))selectedCategory='all';el.value=selectedCategory;
 $('passiveMode').classList.toggle('selected',selectedDirection==='passive');
 $('activeMode').classList.toggle('selected',selectedDirection==='active');
 $('passiveMode').setAttribute('aria-pressed',String(selectedDirection==='passive'));
 $('activeMode').setAttribute('aria-pressed',String(selectedDirection==='active'));
}
function updateHome(){
 updateSelectors();
 const streak=streakInfo();
 $('streakCount').textContent=streak.count;
 $('streakInfo').textContent=streak.learnedToday?'Heute gelernt – weiter so!':streak.count?'Heute noch eine Karte lernen, um deine Serie fortzusetzen.':'Lerne heute mindestens eine Karte und starte deine Serie.';
 const list=candidates(),due=list.filter(x=>!x.new).length,available=list.filter(x=>x.new).length;
 const dirName=selectedDirection==='passive'?'Passiv (ES → DE)':'Aktiv (DE → ES)';
 $('todaySummary').textContent=list.length?`${dirName}: ${due} fällige Wiederholungen · ${available} neue Karten verfügbar. Pro Runde maximal 20.`:`${dirName}: Für diese Kategorie sind derzeit keine Karten verfügbar.`;
 $('startBtn').textContent=list.length?(introducedToday()<20&&!isReviewOnly()?'Empfohlenes Tagespaket starten →':'Weiterlernen →'):'Für heute alles geschafft ✓';$('startBtn').disabled=!list.length;
 $('dailyProgress').textContent=`${introducedToday()} von ${dailyAllowance()} neuen Wörtern heute eingeführt (passiv, alle Kategorien)`;
 const extra=$('extraBlockBtn');extra.hidden=isReviewOnly()||selectedDirection!=='passive'||remainingFresh()===0||introducedToday()<dailyAllowance()||!data.words.some(w=>deckFilter(w)&&inCategory(w)&&!w.progress.passive.introducedOn&&freshFilter(w));
 $('extraInfo').textContent=selectedDirection==='active'?'Aktiv sind Wörter nach 3 freien passiven Abrufen an unterschiedlichen Tagen und mindestens 7 Tagen Abstand verfügbar. Beide Richtungen haben getrennte Wiederholungen.':remainingFresh()===0?'Alle Basiswörter wurden eingeführt.':`Noch ${remainingFresh()} neue Wörter im Vorrat. Weitere 20er-Blöcke jederzeit möglich.`;
}
let queue=[],current=null,phase='question',mcOptions=[],selected=-1,mcCorrect=-1,sessionCompleted=0,sessionTotal=0,retries={},seenInSession=new Set(),sessionGrades={free:0,mc:0,unknown:0},sessionUnique=new Set(),sessionNew=0;
function startSession(){queue=candidates(selectedDirection).slice(0,20);sessionCompleted=0;sessionTotal=queue.length;sessionGrades={free:0,mc:0,unknown:0};sessionUnique=new Set();sessionNew=0;retries={};seenInSession=new Set();current=null;nextCard();navigate('learn')}
function nextCard(){if(queue.length===0){current=null;renderStudy();return}current=queue.shift();const w=wordFor(current);if(w&&!w.progress.discoveredOn){w.progress.discoveredOn=iso();save()}phase='question';selected=-1;mcOptions=[];mcCorrect=-1;renderStudy()}
function wordFor(item){return data.words.find(w=>w.id===item.id)}
// MC uses the exact PDS word class in BOTH directions. Never use a different class
// to fill missing distractors. Duplicate answer strings are removed.
function optionPool(w,dir){
 const target=dir==='passive'?'de':'es',correct=w[target];
 const candidates=data.words.filter(x=>x.id!==w.id&&x.part_of_speech===w.part_of_speech&&x[target]!==correct&&x.es!==w.es&&x.de!==w.de);
 const unique=new Map();for(const x of candidates){const value=x[target];if(!unique.has(value))unique.set(value,x)}
 const same=[...unique.values()].filter(x=>x.category===w.category);
 const rest=[...unique.values()].filter(x=>x.category!==w.category);
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 shuffle(same);shuffle(rest);
 return [...same,...rest];
}
function makeOptions(w,dir){
 const target=dir==='passive'?'de':'es',correct=w[target],pool=optionPool(w,dir);
 if(pool.length<3)return null;
 const arr=[correct,...pool.slice(0,3).map(x=>x[target])];
 for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr;
}
function cardTop(w){return `<div class="flashcard"><div class="direction">${current.dir==='passive'?'ESPAÑOL → DEUTSCH':'DEUTSCH → ESPAÑOL'}</div><h2>${escape(current.dir==='passive'?w.es:w.de)}</h2><div class="category">${escape(w.category||'Vokabel')} · ${escape(WORD_CLASSES[w.part_of_speech]||'Wort')}</div></div>`}
function renderStudy(){const area=$('studyArea');$('sessionProgress').textContent=`${sessionCompleted} geschafft · ${queue.length+(current?1:0)} offen`;$('progressFill').style.width=`${Math.min(100,100*sessionCompleted/Math.max(1,sessionTotal))}%`;if(!current){const avail=candidates(selectedDirection);const more=avail.length>0;const canBonus=!isReviewOnly()&&selectedDirection==='passive'&&remainingFresh()>0&&introducedToday()>=dailyAllowance()&&data.words.some(w=>deckFilter(w)&&inCategory(w)&&!w.progress.passive.introducedOn&&freshFilter(w));const todayDone=introducedToday()>=20;const total=sessionGrades.free+sessionGrades.mc+sessionGrades.unknown;const percent=total?Math.round(100*sessionGrades.free/total):0;area.innerHTML=`<div class="empty finish"><div class="big-emoji">🎉</div><h2>${todayDone?'Tagesziel geschafft!':'¡Muy bien! Runde geschafft!'}</h2><p>${todayDone?'Dein empfohlenes Tagespaket ist erledigt. Du kannst stolz auf dich sein!':'Stark gemacht! Jeder freie Abruf bringt dich weiter.'}</p><div class="session-stats"><div><strong>${sessionUnique.size}</strong><small>Verschiedene Wörter</small></div><div><strong>${sessionNew}</strong><small>Neue Wörter</small></div><div><strong>${percent} %</strong><small>Frei gewusst</small></div><div><strong>${sessionGrades.free}</strong><small>Frei richtig</small></div><div><strong>${sessionGrades.mc}</strong><small>Mit Auswahl</small></div><div><strong>${sessionGrades.unknown}</strong><small>Noch üben</small></div></div><p class="footnote">${total} Antworten inklusive Wiederholungsversuchen. Die Wiederholungstermine bleiben gespeichert.</p>${more?'<button class="primary" id="continueBtn">Weiterlernen →</button>':canBonus?'<button class="primary" id="bonusFinishBtn">Bonusrunde starten · +20 Wörter →</button>':'<div class="done-note">Für dieses Deck sind aktuell keine weiteren Karten fällig. ¡Hasta pronto!</div>'}<button class="secondary" id="finishBtn">Zur Übersicht</button></div>`;$('finishBtn').onclick=()=>navigate('home');if(more)$('continueBtn').onclick=startSession;if(canBonus&&!more)$('bonusFinishBtn').onclick=grantBonus;return}
const w=wordFor(current);let html=cardTop(w);
if(phase==='question'){const mcAvailable=optionPool(w,current.dir).length>=3;html+=`<p class="prompt">Überlege dir die Übersetzung. Du musst nichts eintippen.</p><div class="actions"><button class="primary" id="knowBtn">Weiß ich → Lösung zeigen</button><button class="secondary" id="mcBtn" ${mcAvailable?'':'disabled title="Nicht genügend Antworten derselben Wortart"'}>Multiple Choice</button><button class="ghost" id="unknownBtn">Weiß nicht → Lösung</button></div>${mcAvailable?'':'<p class="prompt">Für diese Wortart gibt es noch nicht genügend unterschiedliche MC-Antworten.</p>'}` }
if(phase==='reveal'){html+=`<div class="answer-box"><div class="label">DIE LÖSUNG</div><strong>${escape(current.dir==='passive'?w.de:w.es)}</strong><em>${escape(w.example)}</em></div><p class="prompt">Hattest du die Übersetzung wirklich richtig im Kopf?</p><div class="actions"><button class="primary" id="yesBtn">Ja, frei gewusst ✓</button><button class="secondary" id="noBtn">Nein, nicht gewusst</button></div>`}
if(phase==='mc'){html+=`<p class="prompt">Welche Übersetzung passt? Die Lösung wird erst nach deiner Auswahl gezeigt.</p><div class="actions">${mcOptions.map((x,i)=>`<button class="mc-option" data-choice="${i}"><span class="mc-letter">${'ABCD'[i]}</span>${escape(x)}</button>`).join('')}</div><div style="height:12px"></div><button class="ghost" id="mcSkip">Auch nicht gewusst</button>`}
if(phase==='graded'){const grade=current.grade;html+=`<div class="result"><span class="done-icon">${grade==='free'?'✓':grade==='mc'?'◉':'↻'}</span><div><b>${grade==='free'?'Frei gewusst':grade==='mc'?'Mit Auswahl erkannt':'Noch nicht gewusst'}</b><small>${grade==='free'?'Längeres Wiederholungsintervall':grade==='mc'?'Morgen wiederholen':'Heute noch einmal und morgen'}</small></div></div><div class="answer-box"><div class="label">LÖSUNG</div><strong>${escape(current.dir==='passive'?w.de:w.es)}</strong><em>${escape(w.example)}</em></div><button class="primary" id="nextBtn">Nächste Karte →</button>`}
area.innerHTML=html;
if(phase==='question'){$('knowBtn').onclick=()=>{phase='reveal';renderStudy()};$('mcBtn').onclick=()=>{const opts=makeOptions(w,current.dir);if(!opts)return;mcOptions=opts;phase='mc';renderStudy()};$('unknownBtn').onclick=()=>gradeCard('unknown')}
if(phase==='reveal'){$('yesBtn').onclick=()=>gradeCard('free');$('noBtn').onclick=()=>gradeCard('unknown')}
if(phase==='mc'){area.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.choice);gradeCard(mcOptions[i]===(current.dir==='passive'?w.de:w.es)?'mc':'unknown')});$('mcSkip').onclick=()=>gradeCard('unknown')}
if(phase==='graded'){$('nextBtn').onclick=()=>{sessionCompleted++;nextCard()}}
}
function gradeCard(grade){const w=wordFor(current),now=iso(),p=w.progress[current.dir];sessionGrades[grade]++;sessionUnique.add(current.id);if(current.new)sessionNew++;if(current.dir==='passive'&&!w.progress.passive.introducedOn)w.progress.passive.introducedOn=now;p.reviews++;p.last=now;
if(grade==='free'){p.freeStreak=(p.freeStreak||0)+1;if(!p.freeDates.includes(now))p.freeDates.push(now);p.level=Math.min(intervals.length,p.level+1);p.due=addDays(now,intervals[Math.min(intervals.length-1,p.level-1)])}
else if(grade==='mc'){p.freeStreak=0;p.level=Math.max(0,p.level-1);p.due=addDays(now,1)}
else{p.freeStreak=0;p.level=0;p.due=addDays(now,1);const key=current.id+':'+current.dir;retries[key]=(retries[key]||0)+1;if(retries[key]<=1){const insertAt=Math.min(5,queue.length);queue.splice(insertAt,0,{id:current.id,dir:current.dir,retry:true});sessionTotal++}}
if(current.dir==='passive'&&eligibleForActive(w)&&!w.progress.active.unlocked){w.progress.active.unlocked=true;w.progress.active.due=addDays(now,1)}
data.history.push({id:current.id,dir:current.dir,grade,date:now,at:new Date().toISOString()});if(data.history.length>20000)data.history=data.history.slice(-20000);save();current.grade=grade;phase='graded';renderStudy()}
function masteryBucket(w,dir){
 const p=w.progress[dir];if(dir==='active'&&!eligibleForActive(w))return null;
 if(dir==='active'&&!p.reviews)return 'new';
 if(dir==='passive'&&!p.reviews)return 'new';
 if(p.freeStreak>=MASTERED_FREE&&p.level>=6)return 'mastered';
 if(p.level>=5&&p.freeStreak>=4)return 'solid';
 if(p.level>=3&&p.freeStreak>=2)return 'middle';
 return 'early';
}
function isDiscovered(w){return !!(w.progress.discoveredOn||w.progress.passive.introducedOn||w.progress.passive.reviews)}
function isDue(w){return ['passive','active'].some(dir=>{const p=w.progress[dir];return (dir==='passive'||eligibleForActive(w))&&p.due&&p.due<=iso()})}
function renderWordStats(){
 const discovered=data.words.filter(isDiscovered),unlocked=discovered.filter(eligibleForActive).length;
 $('discoveredCount').textContent=discovered.length;
 $('dueCount').textContent=discovered.filter(isDue).length;
 $('activeCount').textContent=unlocked;
 $('activePercent').textContent=discovered.length?Math.round(100*unlocked/discovered.length)+' %':'0 %';
 $('unlockRatio').textContent=`${unlocked} von ${discovered.length} entdeckten Wörtern aktiv freigeschaltet`;
 $('unlockFill').style.width=(discovered.length?100*unlocked/discovered.length:0)+'%';
 const levels=[['new','Neu entdeckt'],['early','Im Aufbau'],['middle','Wird sicherer'],['solid','Gut gefestigt'],['mastered','Gemeistert']];
 const eligible=discovered.filter(w=>statsDirection==='passive'||eligibleForActive(w));
 $('masteryChart').innerHTML=levels.map(([key,label])=>{const count=eligible.filter(w=>masteryBucket(w,statsDirection)===key).length;const width=eligible.length?Math.round(100*count/eligible.length):0;return `<div class="mastery-item"><div><span>${label}</span><strong>${count}</strong></div><div class="mastery-track"><span class="level-${key}" style="width:${width}%"></span></div></div>`}).join('')+`<p class="footnote">${eligible.length} Wörter in dieser Lernrichtung verfügbar.</p>`;
 for(const dir of ['passive','active']){$('stats'+(dir==='passive'?'Passive':'Active')).classList.toggle('selected',statsDirection===dir);$('stats'+(dir==='passive'?'Passive':'Active')).setAttribute('aria-pressed',String(statsDirection===dir))}
}
function renderWords(){
 renderWordStats();
 const q=$('wordSearch').value.trim().toLocaleLowerCase(),status=$('wordStatus').value,level=$('wordLevel').value;
 const filtered=data.words.filter(w=>isDiscovered(w)&&`${w.es} ${w.de} ${w.category} ${w.part_of_speech||''}`.toLocaleLowerCase().includes(q)&&
 (status==='all'||status==='due'&&isDue(w)||status==='unlocked'&&eligibleForActive(w)||status==='mastered'&&mastered(w)||status==='building'&&!mastered(w))&&
 (level==='all'||masteryBucket(w,statsDirection)===level));
 const groups=new Map();for(const w of filtered){const key=w.category||'Alltag';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(w)}
 const sorted=[...groups].sort(([a],[b])=>a.localeCompare(b,'de'));
 $('wordList').innerHTML=sorted.map(([cat,words])=>`<details class="word-group" ${q?'open':''}><summary><span>${escape(cat)}</span><span class="group-count">${words.length} Wörter <span aria-hidden="true">⌄</span></span></summary><div class="group-words">${words.map(w=>`<div class="word-row"><b>${escape(w.es)}</b><span>${escape(w.de)}</span><small>${mastered(w)?'Gemeistert':eligibleForActive(w)?'Aktiv freigeschaltet':'Im Aufbau'} · Basis ${escape((w.deck_id||'').slice(-1))} / Paket ${escape(w.package_in_deck)} · ${escape(WORD_CLASSES[w.part_of_speech]||'Wort')}</small></div>`).join('')}</div></details>`).join('')||`<div class="empty-words"><div>📖</div><h2>${data.words.some(isDiscovered)?'Keine passenden Wörter':'Deine Sammlung wartet auf dich!'}</h2><p>${data.words.some(isDiscovered)?'Versuche einen anderen Suchbegriff oder Filter.':'Starte Basis 1, Paket 1. Jedes Wort erscheint hier, sobald du seine Lernkarte gesehen hast.'}</p></div>`;
}

function navigate(name){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===name));document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===name));if(name==='home')updateHome();if(name==='words')renderWords();if(name==='learn'&&!current&&queue.length===0)renderStudy();window.scrollTo(0,0)}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>b.dataset.page==='learn'?(current?navigate('learn'):startSession()):navigate(b.dataset.page));$('startBtn').onclick=startSession;
$('passiveMode').onclick=()=>{selectedDirection='passive';updateHome()};$('activeMode').onclick=()=>{selectedDirection='active';updateHome()};$('categorySelect').onchange=e=>{selectedCategory=e.target.value;updateHome()};

$('packageSelect').onchange=e=>{selectedPackage=e.target.value;selectedCategory='all';data.settings.lastPackage=selectedPackage;save();updateHome()};
function grantBonus(){if(!remainingFresh())return;const previous=extraBlocksToday();data.settings.extraDate=iso();data.settings.extraBlocks=previous+1;if(!save())return;updateHome();startSession()}$('extraBlockBtn').onclick=grantBonus;$('exitLearn').onclick=()=>navigate('home');$('wordSearch').oninput=renderWords;$('wordStatus').onchange=renderWords;$('wordLevel').onchange=renderWords;$('statsPassive').onclick=()=>{statsDirection='passive';renderWords()};$('statsActive').onclick=()=>{statsDirection='active';renderWords()};
function download(content,name,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
$('exportBtn').onclick=()=>{download(JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2),`Palabra-Backup-${iso()}.json`,'application/json');$('backupMessage').textContent='Backup erstellt. Bitte in „Dateien“ sicher aufbewahren.'};
$('importBackup').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;const el=$('backupMessage');try{const parsed=validate(JSON.parse(await f.text()));if(!confirm(`Backup mit ${parsed.words.length} Wörtern laden? Dein aktueller lokaler Lernstand wird dadurch ersetzt.`))return;data=parsed;if(data.settings.dailyNew===10)data.settings.dailyNew=20;if(!Number.isFinite(data.settings.extraBlocks))data.settings.extraBlocks=0;reconcileUnlocks();save();el.className='notice';el.textContent='Backup erfolgreich wiederhergestellt.';updateHome()}catch(err){el.className='notice error';el.textContent='Import fehlgeschlagen: '+err.message}finally{e.target.value=''}};
function parseCSV(text){const out=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))out.push(row);row=[];cell=''}else cell+=c}row.push(cell);if(row.some(x=>x.trim()))out.push(row);return out}
$('importCsv').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;const el=$('csvMessage');try{const rows=parseCSV((await f.text()).replace(/^\uFEFF/,''));const headers=rows.shift().map(s=>s.trim().toLowerCase());const find=(...keys)=>headers.findIndex(x=>keys.includes(x));const es=find('spanisch','es'),de=find('deutsch','de'),ex=find('beispiel_es','beispiel'),cat=find('kategorie','category');if(es<0||de<0)throw Error('Spalten „Spanisch“ und „Deutsch“ fehlen.');let added=0;const existing=new Set(data.words.map(w=>w.es.trim().toLocaleLowerCase()));for(const r of rows){const spanish=(r[es]||'').trim(),german=(r[de]||'').trim();if(!spanish||!german||existing.has(spanish.toLocaleLowerCase()))continue;data.words.push({id:'w-'+Date.now().toString(36)+'-'+added,es:spanish,de:german,example:ex>=0?(r[ex]||'').trim():'',category:cat>=0?(r[cat]||'Alltag').trim():'Alltag',progress:newProgress()});existing.add(spanish.toLocaleLowerCase());added++}save();el.className='notice';el.textContent=`${added} neue Wörter importiert.`;updateHome()}catch(err){el.className='notice error';el.textContent='CSV-Import fehlgeschlagen: '+err.message}finally{e.target.value=''}};
function refreshClock(){ $('todayDate').textContent=new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'short'}).format(new Date());if(document.getElementById('home').classList.contains('active'))updateHome()}
refreshClock();document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshClock()});window.addEventListener('focus',refreshClock);if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
