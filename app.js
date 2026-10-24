(()=>{'use strict';
const KEY='palabra-foundation-05a2-v1';
const DEV_KEY='palabra-dev-mode-v1';
let devMode=false;try{devMode=localStorage.getItem(DEV_KEY)==='true'}catch(_){}
window.PalabraDev={enabled:()=>devMode};const DAY=86400000;const $=id=>document.getElementById(id);
const iso=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const addDays=(date,n)=>{const [y,m,d]=date.split('-').map(Number);const x=new Date(y,m-1,d+n);return iso(x)};
const daysBetween=(a,b)=>{const toUtc=s=>{const [y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d)};return Math.round((toUtc(b)-toUtc(a))/DAY)};
const intervals=[1,3,7,14,30,60,120,240];
const MASTERED_FREE=7; // Vorläufig: sieben erfolgreiche freie Abrufe in Folge mit langfristigen Intervallen.
const DECKS=["Erste Gespräche","Mein Alltag","Unterwegs & Reisen","Erlebnisse & Beziehungen","Freies Kommunizieren"];
const newProgress=()=>({discoveredOn:null,introducedOn:null,passive:{due:null,level:0,freeDates:[],freeStreak:0,reviews:0,last:null},active:{unlocked:false,due:null,level:0,freeDates:[],freeStreak:0,reviews:0,last:null}});
const seed=window.PALABRA_SEED||[];
const WORD_CLASSES={noun:'Substantiv',verb:'Verb',adjective:'Adjektiv',adverb:'Adverb',phrase:'Wendung',pronoun:'Pronomen',determiner:'Begleiter',quantifier:'Mengenwort',interrogative:'Fragewort',preposition:'Präposition',conjunction:'Konjunktion',numeral:'Zahlwort',interjection:'Ausruf',particle:'Partikel',other:'Sonstiges',name:'Eigenname'};
function initial(){return{version:1,created:iso(),settings:{dailyNew:20,extraDate:null,extraBlocks:0},words:seed.map(w=>({...w,progress:newProgress()})),history:[],collections:[],discovery:{packages:{}}}}
function validate(data){if(!data||data.version!==1||!Array.isArray(data.words)||!data.settings||!Array.isArray(data.history))throw Error('Ungültiges oder inkompatibles Palabra-Backup.');if(data.words.length>30000)throw Error('Zu viele Wörter im Backup.');for(const w of data.words){if(typeof w.es!=='string'||typeof w.de!=='string'||!w.progress||!w.progress.passive||!w.progress.active)throw Error('Beschädigte Vokabeleinträge.')}return data}
let data;try{const stored=localStorage.getItem(KEY);data=stored?validate(JSON.parse(stored)):initial()}catch(e){data=initial();alert('Gespeicherte Daten konnten nicht gelesen werden. Bitte stelle ggf. ein Backup wieder her.')} 
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch(e){alert('Speichern fehlgeschlagen! Bitte Speicherplatz prüfen und sofort ein Backup exportieren.');return false}}
// Collections are references to canonical word IDs, not copies of progress.
function normalizeCollections(){
 if(!Array.isArray(data.collections))data.collections=[];
 const validIds=new Set(data.words.map(w=>w.id));
 const seen=new Set();
 data.collections=data.collections.filter(c=>c&&typeof c.id==='string'&&typeof c.name==='string'&&Array.isArray(c.wordIds)&&!seen.has(c.id)&&seen.add(c.id)).slice(0,100).map(c=>({
  id:c.id.slice(0,80),name:c.name.trim().slice(0,64)||'Sammlung',createdAt:typeof c.createdAt==='string'?c.createdAt:iso(),
  wordIds:[...new Set(c.wordIds.filter(id=>typeof id==='string'&&validIds.has(id)))].slice(0,1000)
 }));
}
normalizeCollections();
// 0.7a.1: additive, version-1-compatible discovery journal. Existing SRS records
// stay authoritative; completed old packages do not need artificial migrations.
function normalizeDiscovery(){
 if(!data.discovery||typeof data.discovery!=='object'||Array.isArray(data.discovery))data.discovery={packages:{}};
 if(!data.discovery.packages||typeof data.discovery.packages!=='object'||Array.isArray(data.discovery.packages))data.discovery.packages={};
 for(const [key,record] of Object.entries(data.discovery.packages)){
  if(!/^palabra-basis-[1-5]:\d+$/.test(key)||!record||typeof record!=='object'){delete data.discovery.packages[key];continue}
  const known=new Set(data.words.filter(w=>`${w.deck_id}:${w.package}`===key).map(w=>w.id));
  record.seenIds=[...new Set((Array.isArray(record.seenIds)?record.seenIds:[]).filter(id=>typeof id==='string'&&known.has(id)))];
  record.lastIndex=Number.isInteger(record.lastIndex)&&record.lastIndex>=0?record.lastIndex:0;
 }
}
normalizeDiscovery();
if(!localStorage.getItem(KEY))save();

// 0.5b.5: migrate all 1,000 canonical cards in-place, retaining SRS only for
// identical Spanish entries at the same learning position. Never clear user data.
function syncCuratedDecks(){
 let changed=false;
 const lookup=new Map(data.words.map((w,i)=>[`${w.deck_id}:${w.learning_order}`,i]));
 for(const entry of seed){
  const key=`${entry.deck_id}:${entry.learning_order}`;
  const index=lookup.get(key);
  if(index===undefined){
   data.words.push({...entry,progress:newProgress()});
   lookup.set(key,data.words.length-1);changed=true;continue;
  }
  const old=data.words[index];
  const isSame=old.es.trim().toLocaleLowerCase('es')===entry.es.trim().toLocaleLowerCase('es');
  if(old.id!==entry.id||old.es!==entry.es||old.de!==entry.de||old.learning_goal!==entry.learning_goal||old.category!==entry.category){
    data.words[index]={...entry,progress:isSame?old.progress:newProgress()};changed=true;
  }
 }
 if(changed)save();
}
syncCuratedDecks();
normalizeCollections();
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
const introducedCount=()=>data.words.filter(w=>w.deck_id!=='palabra-story-lexicon'&&!!w.progress.passive.introducedOn).length;
const unlockedCount=()=>data.words.filter(eligibleForActive).length;
function streakInfo(){
 const dates=new Set(data.history.filter(h=>h&&typeof h.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(h.date)).map(h=>h.date));
 let day=iso(), count=0;
 if(!dates.has(day))day=addDays(day,-1);
 while(dates.has(day)){count++;day=addDays(day,-1)}
 return {count,learnedToday:dates.has(iso())};
}
function introducedToday(){return data.words.filter(w=>w.deck_id!=='palabra-story-lexicon'&&w.progress.passive.introducedOn===iso()&&w.progress.storyAddedOn!==iso()).length}
function extraBlocksToday(){return data.settings.extraDate===iso()?data.settings.extraBlocks:0}
function dailyAllowance(){return data.settings.dailyNew+20*extraBlocksToday()}
function remainingFresh(){return data.words.filter(w=>w.deck_id!=='palabra-story-lexicon'&&!w.progress.passive.introducedOn).length}
// Separate queues: passive introduces new cards; active practices already introduced words.
// The direction and category are only session filters, never separate word databases.
let wordsSubview='all', selectedCollectionId=null, collectionQuery='', pickerWordId=null;
let selectedDirection=data.settings.lastDirection==='active'?'active':'passive',selectedCategory='all',selectedDeck=data.settings.lastDeck||'palabra-basis-1',selectedPackage=data.settings.lastPackage||'next',statsDirection='passive';
const isReviewOnly=()=>selectedDeck==='all'||selectedPackage==='all';
const deckOf=w=>w.deck_id||'palabra-basis-1';
const deckFilter=w=>selectedDeck==='all'?DECKS.some((_,i)=>deckOf(w)===`palabra-basis-${i+1}`):deckOf(w)===selectedDeck;
const packFilter=w=>selectedPackage==='next'||selectedPackage==='all'||String(w.package)===selectedPackage;
const mastered=w=>Number(w.progress.passive.freeStreak||0)>=MASTERED_FREE&&Number(w.progress.passive.level||0)>=6;
function currentNextPackage(){const pool=data.words.filter(deckFilter).sort((a,b)=>(Number(a.learning_order)||0)-(Number(b.learning_order)||0));const first=pool.find(w=>!w.progress.passive.introducedOn);return first?first.package:null;}
function freshFilter(w){return selectedPackage==='next'?w.package===currentNextPackage():packFilter(w)}
function categories(){return [...new Set(data.words.map(w=>w.category||'Alltag'))].sort((a,b)=>a.localeCompare(b,'de'))}
function inCategory(w){return !isReviewOnly()||selectedCategory==='all'||(w.category||'Alltag')===selectedCategory}
function candidates(dir=selectedDirection){
 const now=iso(),due=[];
 for(const w of data.words){
  if(!deckFilter(w)||!inCategory(w)||!packFilter(w))continue;
  const p=w.progress.passive,a=w.progress.active;
  if(dir==='passive'&&p.introducedOn&&p.due&&p.due<=now)due.push({id:w.id,dir,due:p.due});
  if(dir==='active'&&eligibleForActive(w)&&a.due&&a.due<=now)due.push({id:w.id,dir,due:a.due});
 }
 due.sort((a,b)=>a.due.localeCompare(b.due));
 return due;
}
let learnScreen='overview',browseCards=[],browseIndex=0,browseRevealed=false,browseMode='browse',browseDeck='',browsePack='';
function packageWords(deck,pack){return data.words.filter(w=>deckOf(w)===deck&&String(w.package)===String(pack)).sort((a,b)=>Number(a.learning_order)-Number(b.learning_order))}
function discoveryKey(deck,pack){return `${deck}:${pack}`}
function discoveryRecord(deck,pack){return data.discovery.packages[discoveryKey(deck,pack)]||null}
function isPackageComplete(deck,pack){const cards=packageWords(deck,pack);return cards.length>0&&cards.every(w=>!!w.progress.passive.introducedOn)}
function packageSeenIds(deck,pack){
 const seen=new Set(discoveryRecord(deck,pack)?.seenIds||[]);
 for(const w of packageWords(deck,pack))if(w.progress.passive.introducedOn)seen.add(w.id);
 return seen;
}
function canBrowsePackage(deck,pack){
 if(!/^palabra-basis-[1-5]$/.test(deck)||!/^[0-9]+$/.test(String(pack)))return false;
 return packageWords(deck,pack).length>0&&(devMode||packageSeenIds(deck,pack).size>0);
}
function openPackageBrowse(){
 if(!canBrowsePackage(selectedDeck,selectedPackage))return;
 browseMode='browse';browseDeck=selectedDeck;browsePack=selectedPackage;
 browseCards=packageWords(browseDeck,browsePack);
 browseIndex=0;browseRevealed=false;showLearnScreen('browse');renderPackageBrowse();
}
function openDiscovery(deck=selectedDeck,pack=selectedPackage){
 if(!/^palabra-basis-[1-5]$/.test(deck)||!/^[0-9]+$/.test(String(pack)))return;
 selectedDeck=deck;selectedPackage=String(pack);
 if(isPackageComplete(deck,pack)){
  openPackageBrowse();return;
 }
 browseMode='discovery';browseDeck=deck;browsePack=String(pack);
 browseCards=packageWords(deck,pack);if(!browseCards.length)return;
 const existing=discoveryRecord(deck,pack);
 browseIndex=Math.min(browseCards.length-1,Math.max(0,existing?.lastIndex||0));
 browseRevealed=false;showLearnScreen('browse');renderPackageBrowse();
}
function revealBrowse(){
 browseRevealed=true;
 if(browseMode==='discovery'){
  const key=discoveryKey(browseDeck,browsePack),old=discoveryRecord(browseDeck,browsePack);
  const record=old||{seenIds:[],lastIndex:0};
  const w=browseCards[browseIndex];
  if(!record.seenIds.includes(w.id))record.seenIds.push(w.id);
  record.lastIndex=browseIndex;
  data.discovery.packages[key]=record;
  save(); // Discovery-only progress: does not touch words[].progress, SRS or history.
 }
 renderPackageBrowse();
}
function finishDiscovery(){
 if(browseMode!=='discovery'||!browseCards.length||browseCards.some(w=>!packageSeenIds(browseDeck,browsePack).has(w.id)))return;
 const before=browseCards.map(w=>JSON.stringify(w.progress));
 const record=discoveryRecord(browseDeck,browsePack),beforeCompleted=record?.completedOn;
 const today=iso();
 for(const w of browseCards){
  // Do not modify a previously introduced card, its level, due date or reviews.
  if(w.progress.passive.introducedOn)continue;
  w.progress.discoveredOn=w.progress.discoveredOn||today;
  w.progress.passive.introducedOn=today;
  w.progress.passive.due=w.progress.passive.due||addDays(today,1);
 }
 if(record)record.completedOn=today;
 if(!save()){
  browseCards.forEach((w,i)=>{w.progress=JSON.parse(before[i])});
  if(record)record.completedOn=beforeCompleted;
  return;
 }
 browseMode='finished';renderPackageBrowse();updateHome();
}
function renderPackageBrowse(){
 if(learnScreen!=='browse'||!browseCards.length)return;
 const discovery=browseMode==='discovery',finished=browseMode==='finished',w=browseCards[browseIndex];
 const seen=packageSeenIds(browseDeck,browsePack);
 $('browseEyebrow').textContent=discovery?'ENTDECKEN · OHNE SRS':finished?'PAKET ENTDECKT':'OHNE SRS · FREIES ANSEHEN';
 $('browseTitle').textContent=w.learning_goal||'Themenpaket';
 $('browseSubtitle').textContent=`${fullDeckName(browseDeck)} · Paket ${w.package_in_deck||''} · ${browseCards.length} Wörter`;
 if(finished){
  $('browseContent').innerHTML=`<div class="discovery-finish"><div class="big-emoji">✦</div><h2>Alle ${browseCards.length} Wörter entdeckt!</h2><p>Du hast dein Paket kennengelernt. Die neuen Wörter sind jetzt im Wiederholungspool und werden frühestens morgen fällig – ganz ohne heutige SRS-Bewertung.</p><button class="primary" type="button" id="discoveryExit">Zur Paketauswahl →</button><button class="secondary" type="button" id="discoveryReviewBrowse">Paket noch einmal ansehen</button></div>`;
  $('discoveryExit').onclick=()=>{selectedDeck=browseDeck;selectedPackage=browsePack;showLearnScreen('deck')};
  $('discoveryReviewBrowse').onclick=()=>{browseMode='browse';browseIndex=0;browseRevealed=false;renderPackageBrowse()};
  return;
 }
 const allSeen=browseCards.every(card=>seen.has(card.id));
 const last=browseIndex===browseCards.length-1;
 const nextLabel=discovery?(last?(allSeen?'Paket abschließen ✓':'Weitere Wörter ansehen →'):'Weiter →'):(last?'Fertig ✓':'Weiter →');
 $('browseContent').innerHTML=`<div class="browse-progress"><span>Wort ${browseIndex+1} von ${browseCards.length}</span><span>${discovery?`${seen.size}/${browseCards.length} angesehen`:escape(w.category||'')}</span></div>
  <div class="browse-word" lang="es">${escape(w.es)}</div>
  ${browseRevealed?`<div class="browse-answer"><small>DEUTSCH</small><strong lang="de">${escape(w.de)}</strong>${w.example?`<p lang="es">${escape(w.example)}</p>`:''}</div>`:'<button type="button" class="secondary" id="browseReveal">Bedeutung entdecken</button>'}
  <div class="browse-navigation"><button type="button" class="secondary" id="browsePrev" ${browseIndex===0?'disabled':''}>← Zurück</button><button type="button" class="primary" id="browseNext" ${discovery&&!browseRevealed&&!seen.has(w.id)?'disabled':''}>${nextLabel}</button></div>
  <p class="footnote">${discovery?'Ansehen ist keine Prüfung. Erst nach dem kompletten Paket kommen die Wörter in die SRS-Wiederholung.':'Freies Durchblättern verändert keinen Lernstand oder SRS-Termin.'}</p>`;
 const reveal=$('browseReveal');if(reveal)reveal.onclick=revealBrowse;
 $('browsePrev').onclick=()=>{if(browseIndex>0){browseIndex--;browseRevealed=false;renderPackageBrowse()}};
 $('browseNext').onclick=()=>{
  if(discovery&&last&&allSeen){finishDiscovery();return}
  if(last&&discovery){const idx=browseCards.findIndex(card=>!seen.has(card.id));browseIndex=idx>=0?idx:0}
  else if(last){selectedDeck=browseDeck;selectedPackage=browsePack;showLearnScreen('deck');return}
  else browseIndex++;
  browseRevealed=false;
  if(discovery){const record=discoveryRecord(browseDeck,browsePack);if(record){record.lastIndex=browseIndex;save()}}
  renderPackageBrowse();
 };
}

const DECK_ID=i=>`palabra-basis-${i+1}`;
const learnDeckName=id=>id==='all'?'Alle Basisdecks':`Basis ${Math.max(1,Number(String(id).split('-').pop())||1)}`;
const fullDeckName=id=>id==='all'?'Gesamtwiederholung':DECKS[Math.max(0,Number(String(id).split('-').pop())-1)]||DECKS[0];
function withSelection(deck,pack,direction,fn){
 const prev=[selectedDeck,selectedPackage,selectedDirection,selectedCategory];
 selectedDeck=deck;selectedPackage=pack;selectedDirection=direction;selectedCategory='all';
 try{return fn()}finally{[selectedDeck,selectedPackage,selectedDirection,selectedCategory]=prev}
}
function dailyDeckId(){
 const saved=data.settings.lastDeck;
 if(saved&&DECKS.some((_,i)=>saved===DECK_ID(i))&&data.words.some(w=>deckOf(w)===saved&&!w.progress.passive.introducedOn))return saved;
 for(let i=0;i<DECKS.length;i++)if(data.words.some(w=>deckOf(w)===DECK_ID(i)&&!w.progress.passive.introducedOn))return DECK_ID(i);
 return saved&&DECKS.some((_,i)=>saved===DECK_ID(i))?saved:DECK_ID(0);
}
function dailyRoute(){
 const deck=dailyDeckId();
 return withSelection(deck,'next','passive',()=>({deck,pack:currentNextPackage()}));
}
function showLearnScreen(screen){
 learnScreen=screen;
 $('learnOverview').hidden=screen!=='overview';
 $('learnDeckScreen').hidden=screen!=='deck';
 $('learnSetupScreen').hidden=screen!=='setup';
 $('learnBrowseScreen').hidden=screen!=='browse';
 updateHome();
 if($('learn-hub').classList.contains('active'))window.scrollTo(0,0);
}
function chooseLearnDeck(deck){
 selectedDeck=deck;selectedPackage='next';selectedCategory='all';
 data.settings.lastDeck=deck;data.settings.lastPackage='next';save();
 showLearnScreen('deck');
}
function chooseLearnPackage(pack){
 selectedPackage=String(pack);selectedCategory='all';
 data.settings.lastPackage=selectedPackage;save();
 showLearnScreen('setup');
}
function renderDeckTiles(){
 const root=$('deckTiles');
 root.innerHTML=DECKS.map((name,i)=>{
  const id=DECK_ID(i),ws=data.words.filter(w=>deckOf(w)===id);
  const intro=ws.filter(w=>w.progress.passive.introducedOn).length;
  const due=ws.filter(w=>w.progress.passive.introducedOn&&w.progress.passive.due&&w.progress.passive.due<=iso()).length;
  return `<button type="button" class="learn-deck-card" data-deck="${id}"><span class="learn-deck-number">${i+1}</span><span class="learn-item-content"><strong>Basis ${i+1} <span class="learn-deck-title">· ${escape(name)}</span></strong><small>${intro}/200 Wörter entdeckt · ${due} fällig</small><span class="learn-mini-progress"><span style="width:${Math.min(100,intro/2)}%"></span></span></span><span class="learn-item-arrow" aria-hidden="true">›</span></button>`;
 }).join('');
 root.querySelectorAll('[data-deck]').forEach(btn=>btn.onclick=()=>chooseLearnDeck(btn.dataset.deck));
}
function renderLearnPacks(){
 if(learnScreen!=='deck')return;
 $('learnDeckEyebrow').textContent=learnDeckName(selectedDeck).toUpperCase();
 $('learnDeckHeadline').textContent=fullDeckName(selectedDeck);
 $('learnDeckSubline').textContent='Entdecke neue Wörter frei und trainiere bereits bekannte Wörter mit SRS.';
 const ws=data.words.filter(deckFilter);
 const ids=[...new Set(ws.map(w=>w.package))].sort((a,b)=>a-b);
 const next=withSelection(selectedDeck,'next','passive',()=>currentNextPackage());
 const body=[
  `<button type="button" class="learn-pack-card learn-pack-featured" data-package="next"><span class="learn-pack-number">✦</span><span class="learn-item-content"><strong>Nächstes Entdeckerpaket</strong><small>${next===null?'Alle Wörter entdeckt – jetzt festigen':`Paket ${ws.find(w=>w.package===next)?.package_in_deck||''} · ${escape(ws.find(w=>w.package===next)?.learning_goal||'Entdecken')} · ohne SRS-Bewertung`}</small></span><span class="learn-item-arrow">›</span></button>`,
  `<button type="button" class="learn-pack-card" data-package="all"><span class="learn-pack-number">↻</span><span class="learn-item-content"><strong>Gesamtes Deck wiederholen</strong><small>Nur bereits eingeführte Wörter</small></span><span class="learn-item-arrow">›</span></button>`
 ];
 for(const id of ids){
  const part=ws.filter(w=>w.package===id);
  const w=part[0],n=w?.package_in_deck||id,intro=part.filter(w=>w.progress.passive.introducedOn).length;
  const seen=packageSeenIds(selectedDeck,id).size;
  body.push(`<button type="button" class="learn-pack-card" data-package="${id}"><span class="learn-pack-number">${n}</span><span class="learn-item-content"><strong>${escape(w?.learning_goal||'Themenpaket')}</strong><small>Paket ${n} von 10 · ${intro===part.length?'Entdeckt ✓':`${seen}/${part.length} angesehen`}</small><span class="learn-mini-progress"><span style="width:${part.length?100*seen/part.length:0}%"></span></span></span><span class="learn-item-arrow">›</span></button>`);
 }
 $('learnPackageList').innerHTML=body.join('');
 $('learnPackageList').querySelectorAll('[data-package]').forEach(btn=>btn.onclick=()=>{if(btn.dataset.package==='next'){const next=currentNextPackage();if(next!==null)openDiscovery(selectedDeck,next);else chooseLearnPackage('all')}else chooseLearnPackage(btn.dataset.package)});
}
function renderLearnCategories(){
 const box=$('categoryWrap');box.hidden=!isReviewOnly();
 if(box.hidden)return;
 const available=[...new Set(data.words.filter(w=>deckFilter(w)&&(w.progress.discoveredOn||w.progress.passive.introducedOn)).map(w=>w.category||'Alltag'))].sort((a,b)=>a.localeCompare(b,'de'));
 if(!available.includes(selectedCategory))selectedCategory='all';
 $('categoryChoices').innerHTML=['all',...available].map(c=>`<button type="button" class="learn-category-chip ${selectedCategory===c?'chosen':''}" data-category="${escape(c)}" aria-pressed="${selectedCategory===c}">${c==='all'?'Alle Themen':escape(c)}</button>`).join('');
 $('categoryChoices').querySelectorAll('[data-category]').forEach(btn=>btn.onclick=()=>{selectedCategory=btn.dataset.category;updateHome()});
}
function updateSelectors(){
 if(learnScreen==='overview')renderDeckTiles();
 if(learnScreen==='deck')renderLearnPacks();
 if(learnScreen==='setup'){
  const deck=learnDeckName(selectedDeck);
  const wordsInDeck=data.words.filter(deckFilter);
  const chosen=wordsInDeck.find(w=>String(w.package)===String(selectedPackage));
  $('learnSetupEyebrow').textContent=deck.toUpperCase();
  $('learnSetupTitle').textContent=selectedDeck==='all'?'Alle Basisdecks wiederholen':selectedPackage==='next'?'Nächstes Lernpaket':selectedPackage==='all'?'Gesamtes Deck wiederholen':chosen?.learning_goal||'Dein Lernpaket';
  $('learnSetupSubtitle').textContent=selectedDeck==='all'?'Übergreifende Wiederholung':selectedPackage==='next'?'Nächstes unentdecktes Paket':selectedPackage==='all'?`${fullDeckName(selectedDeck)} · bereits entdeckte Wörter`:`${deck} · Paket ${chosen?.package_in_deck||''} von 10`;
  renderLearnCategories();
  const regular=/^\d+$/.test(String(selectedPackage));
  const canBrowse=canBrowsePackage(selectedDeck,selectedPackage);
  $('browseLaunch').hidden=!canBrowse;
  $('discoverLaunch').hidden=!regular||isPackageComplete(selectedDeck,selectedPackage);
  if(regular&&!isPackageComplete(selectedDeck,selectedPackage)){const seen=packageSeenIds(selectedDeck,selectedPackage).size;$('discoverLaunch').textContent=seen?`Entdecken fortsetzen · ${seen} Wörter angesehen →`:'Paket entdecken · ohne SRS →';}
  $('browseAvailability').hidden=!regular||canBrowse;
  $('browseAvailability').textContent='Nach dem ersten angesehenen Wort kannst du das Paket zusätzlich frei durchblättern. Entdecken bleibt davon getrennt.';
 }
 const dp=$('deckProgress');dp.innerHTML=DECKS.map((name,i)=>{const ws=data.words.filter(w=>w.deck_id===DECK_ID(i));const intro=ws.filter(w=>w.progress.passive.introducedOn).length,master=ws.filter(mastered).length,due=ws.filter(w=>w.progress.passive.introducedOn&&w.progress.passive.due&&w.progress.passive.due<=iso()).length;return `<div class="deck-progress"><b>Basis ${i+1} · ${escape(name)}</b><small>${intro}/200 entdeckt · ${master}/200 gemeistert · ${due} fällig</small><div class="mini-track"><span style="width:${intro/2}%"></span></div></div>`}).join('');
 $('passiveMode').classList.toggle('selected',selectedDirection==='passive');
 $('activeMode').classList.toggle('selected',selectedDirection==='active');
 $('passiveMode').setAttribute('aria-pressed',String(selectedDirection==='passive'));
 $('activeMode').setAttribute('aria-pressed',String(selectedDirection==='active'));
}
function updateHome(){
 updateSelectors();
 const streak=streakInfo();
 $('streakCount').textContent=streak.count;
 $('streakInfo').textContent=streak.learnedToday?'Heute wiederholt – weiter so!':streak.count?'Eine Wiederholungsrunde hält deine Serie am Laufen.':'Wiederhole ein paar Wörter und starte deine Serie.';
 const daily=dailyRoute();
 $('learnDailyDeck').textContent=learnDeckName(daily.deck)+' · '+fullDeckName(daily.deck);
 const example=daily.pack===null?null:data.words.find(w=>deckOf(w)===daily.deck&&w.package===daily.pack);
 $('learnDailyPack').textContent=example?`Paket ${example.package_in_deck||''} · ${example.learning_goal||''}`:'Alle 50 Basispakete entdeckt';
 const seen=daily.pack===null?0:packageSeenIds(daily.deck,daily.pack).size;
 $('todaySummary').textContent=daily.pack===null?'Deine Entdeckungsreise ist komplett. Du kannst jedes Paket weiterhin frei ansehen.':`${seen}/20 Wörter bereits angesehen · ohne SRS-Bewertung`;
 $('dailyProgress').textContent='Du bestimmst dein Tempo. Nach einem vollständigen Durchgang werden neue Wörter zur Wiederholung eingeplant.';
 $('dailyQuickStart').disabled=daily.pack===null;
 $('dailyQuickStart').innerHTML=daily.pack===null?'Alle Pakete entdeckt ✓':seen?'Entdeckung fortsetzen <span aria-hidden="true">→</span>':'Paket entdecken <span aria-hidden="true">→</span>';
 const allDue=withSelection('all','all','passive',()=>candidates('passive'));
 const allActive=withSelection('all','all','active',()=>candidates('active'));
 $('dailyReviewSummary').textContent=`${allDue.length} passive Karten fällig · ${allActive.length} aktive Karten fällig. Bis zu 20 je Runde.`;
 $('dailyReviewBtn').disabled=!allDue.length;
 $('dailyReviewBtn').textContent=allDue.length?'Fällige Wörter wiederholen →':'Derzeit nichts fällig ✓';
 const list=candidates(),due=list.length;
 const regular=/^[0-9]+$/.test(String(selectedPackage));
 const needsDiscovery=regular&&!isPackageComplete(selectedDeck,selectedPackage);
 $('learnSetupSummary').textContent=due?`${selectedDirection==='passive'?'Passiv (ES → DE)':'Aktiv (DE → ES)'}: ${due} fällige SRS-Karten. Maximal 20 pro Runde.`:needsDiscovery?'Dieses Paket ist noch in der Entdeckungsphase. Du kannst es oben ohne Bewertung kennenlernen.':`Für diese Auswahl sind aktuell keine ${selectedDirection==='passive'?'passiven':'aktiven'} Wiederholungen fällig.`;
 $('startBtn').disabled=!due;
 $('startBtn').innerHTML=due?'SRS-Wiederholung starten <span aria-hidden="true">→</span>':'Keine Wiederholungen fällig';
}
function startDailySession(){
 const daily=dailyRoute();
 if(daily.pack!==null)openDiscovery(daily.deck,daily.pack);
}
function startDailyReview(){
 selectedDeck='all';selectedPackage='all';selectedCategory='all';selectedDirection='passive';
 startSession(candidates('passive'));
}
let sessionCollectionId=null;
let queue=[],current=null,phase='question',mcOptions=[],selected=-1,mcCorrect=-1,sessionCompleted=0,sessionTotal=0,retries={},seenInSession=new Set(),sessionGrades={free:0,mc:0,unknown:0},sessionUnique=new Set(),sessionNew=0;
function startSession(items=null,collectionId=null){
 // Only arrays are accepted as an explicit queue. A click event must never become a card list.
 const selectedItems=Array.isArray(items)?items:candidates(selectedDirection);
 sessionCollectionId=collectionId;queue=selectedItems.slice(0,20);sessionCompleted=0;sessionTotal=queue.length;sessionGrades={free:0,mc:0,unknown:0};sessionUnique=new Set();sessionNew=0;retries={};seenInSession=new Set();current=null;nextCard();navigate('learn')}
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
function renderStudy(){const area=$('studyArea');$('sessionProgress').textContent=`${sessionCompleted} geschafft · ${queue.length+(current?1:0)} offen`;$('progressFill').style.width=`${Math.min(100,100*sessionCompleted/Math.max(1,sessionTotal))}%`;if(!current){const avail=sessionCollectionId?collectionDueCards(getCollection(sessionCollectionId),selectedDirection):candidates(selectedDirection);const more=avail.length>0;const total=sessionGrades.free+sessionGrades.mc+sessionGrades.unknown;const percent=total?Math.round(100*sessionGrades.free/total):0;area.innerHTML=`<div class="empty finish"><div class="big-emoji">🎉</div><h2>${sessionCollectionId?'Sammlungsrunde geschafft!':'¡Muy bien! Wiederholung geschafft!'}</h2><p>${sessionCollectionId?'Deine fälligen Sammlungswörter wurden im normalen SRS bewertet.':'Stark gemacht! Jeder freie Abruf bringt dich weiter.'}</p><div class="session-stats"><div><strong>${sessionUnique.size}</strong><small>Verschiedene Wörter</small></div><div><strong>${percent} %</strong><small>Frei gewusst</small></div><div><strong>${sessionGrades.free}</strong><small>Frei richtig</small></div><div><strong>${sessionGrades.mc}</strong><small>Mit Auswahl</small></div><div><strong>${sessionGrades.unknown}</strong><small>Noch üben</small></div></div><p class="footnote">${total} Antworten inklusive Wiederholungsversuchen. Die Wiederholungstermine bleiben gespeichert.</p>${more?'<button class="primary" id="continueBtn">Weiterlernen →</button>':sessionCollectionId?'<div class="done-note">In dieser Sammlung sind derzeit keine weiteren Karten fällig.</div>':'<div class="done-note">Für dieses Deck sind aktuell keine weiteren Karten fällig. ¡Hasta pronto!</div>'}<button class="secondary" id="finishBtn">${sessionCollectionId?'Zur Sammlung':'Zur Übersicht'}</button></div>`;$('finishBtn').onclick=()=>{if(sessionCollectionId){wordsSubview='collections';selectedCollectionId=sessionCollectionId;navigate('words')}else navigate('learn-hub')};if(more)$('continueBtn').onclick=()=>sessionCollectionId?startCollectionReview(sessionCollectionId,selectedDirection):startSession();return}
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
 const note=$('devWordsNotice');if(note)note.hidden=!devMode;
 const q=$('wordSearch').value.trim().toLocaleLowerCase(),status=$('wordStatus').value,level=$('wordLevel').value;
 const filtered=data.words.filter(w=>(devMode||isDiscovered(w))&&`${w.es} ${w.de} ${w.category} ${w.part_of_speech||''}`.toLocaleLowerCase().includes(q)&&
 (status==='all'||status==='due'&&isDue(w)||status==='unlocked'&&eligibleForActive(w)||status==='mastered'&&mastered(w)||status==='building'&&!mastered(w))&&
 (level==='all'||masteryBucket(w,statsDirection)===level));
 const groups=new Map();for(const w of filtered){const key=w.category||'Alltag';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(w)}
 const sorted=[...groups].sort(([a],[b])=>a.localeCompare(b,'de'));
 $('wordList').innerHTML=sorted.map(([cat,words])=>`<details class="word-group" ${q?'open':''}><summary><span>${escape(cat)}</span><span class="group-count">${words.length} Wörter <span aria-hidden="true">⌄</span></span></summary><div class="group-words">${words.map(w=>`<div class="word-row"><div class="word-row-top"><b>${escape(w.es)}</b>${(devMode||isDiscovered(w))?`<button type="button" class="word-add-button" data-add-word="${escape(w.id)}" aria-label="${escape(w.es)} zu Sammlung hinzufügen" title="Zu Sammlung hinzufügen">＋</button>`:''}</div><span>${escape(w.de)}</span><small>${mastered(w)?'Gemeistert':eligibleForActive(w)?'Aktiv freigeschaltet':'Im Aufbau'} · ${w.deck_id==='palabra-story-lexicon'?escape(w.source||'Story-Wort'):`Basis ${escape((w.deck_id||'').slice(-1))} / Paket ${escape(w.package_in_deck)}`} · ${escape(WORD_CLASSES[w.part_of_speech]||'Wort')}</small></div>`).join('')}</div></details>`).join('')||`<div class="empty-words"><div>📖</div><h2>${data.words.some(isDiscovered)?'Keine passenden Wörter':'Deine Sammlung wartet auf dich!'}</h2><p>${data.words.some(isDiscovered)?'Versuche einen anderen Suchbegriff oder Filter.':'Entdecke zuerst ein Themenpaket. Danach findest du seine Wörter hier und im SRS.'}</p></div>`;
 renderWordsSubview();
}

// 0.5c: personal collections of already-discovered canonical words (shared SRS).
function getCollection(id){return (data.collections||[]).find(c=>c.id===id)||null}

// PLF 1.0 – scoped, additive Story→Learn pilot. Keep old IDs and SRS state.
const plf=window.PALABRA_LEXICON||{entries:{},tokens:{}};
function pilotWord(tokenId){
 const t=plf.tokens?.[tokenId],entry=t&&plf.entries?.[t.lexeme_id];
 if(!entry)return null;
 // One lexeme may have several explicitly curated semantic identities.
 // For older 0.6a.8 data the s1 entry itself remains the canonical sense.
 const sense=t.sense_id===entry.sense_id?entry:plf.senses?.[t.sense_id];
 return sense&&sense.lexeme_id===entry.lexeme_id?{...t,entry,sense}:null;
}
function storyCollections(){return data.collections.map(c=>({id:c.id,name:c.name}));}
function pilotCard(tokenId){
 const info=pilotWord(tokenId);if(!info)return null;
 return data.words.find(w=>w.id===info.sense.card_id)||null;
}
function previewPilotToken(tokenId){
 const info=pilotWord(tokenId);if(!info)return null;
 const word=pilotCard(tokenId),other=[];
 const selected=info.sense,base=info.entry;
 if(base.sense_id!==selected.sense_id)other.push({label:'Grundbedeutung',german:base.german});
 for(const s of Object.values(plf.senses||{})){
  if(s.lexeme_id===base.lexeme_id&&s.sense_id!==selected.sense_id)other.push({label:s.label||'Weitere Bedeutung',german:s.german});
 }
 return {lemma:base.lemma,part_of_speech:base.part_of_speech,meaning:info.meaning,
  editionId:info.edition_id||'cine-b1',level:info.level||'B1',storyTitle:info.story_title||'Cine Luna',
  german:word?.de||selected.german,cardId:selected.card_id,senseId:selected.sense_id,
  isExistingBase:!!selected.existing_card_id,reviewed:selected.status==='pilot-reviewed',
  alternatives:other,inCollections:data.collections.filter(c=>c.wordIds.includes(selected.card_id)).map(c=>c.id)};
}
function registerPilotCard(info){
 const e=info.entry,sense=info.sense;
 let w=data.words.find(word=>word.id===sense.card_id);
 if(w)return w;
 if(!sense.card_id.startsWith('storylex-'))throw Error('Unbekannte Karten-ID.');
 if(data.words.length>=30000)throw Error('Maximale Kartenzahl erreicht.');
 w={id:sense.card_id,es:e.lemma,de:sense.german,part_of_speech:e.part_of_speech,
  category:'Story · '+(info.story_title||'Geschichte'),level:info.level||'B1',deck_id:'palabra-story-lexicon',
  lexeme_id:e.lexeme_id,sense_id:sense.sense_id,sense_label:sense.label||'',
  source:`${info.story_title||'Geschichte'} · ${info.level||'B1'} · Kapitel ${info.chapter_number||String(info.chapter_id||'ch-1').split('-').pop()}`,
  example:info.example_es,example_de:info.example_de,learning_order:0,package:0,
  progress:newProgress()};
 data.words.push(w);
 return w;
}
function addPilotToCollection(tokenId,collectionId){
 const info=pilotWord(tokenId),c=getCollection(collectionId);
 if(!info||!c)return {ok:false,message:'Wort oder Sammlung nicht gefunden.'};
 const oldWord=data.words.find(w=>w.id===info.sense.card_id);
 const w=registerPilotCard(info),had=c.wordIds.includes(w.id);
 if(!had){
  // A word intentionally added from reading becomes immediately due in the collection.
  // Do not reset existing SRS intervals or reviews.
  if(!w.progress.passive.introducedOn){
   w.progress.discoveredOn=w.progress.discoveredOn||iso();
   w.progress.passive.introducedOn=iso();
   w.progress.storyAddedOn=iso();
   w.progress.passive.due=w.progress.passive.due||iso();
  }
  c.wordIds.push(w.id);
 }
 if(!save()){
  if(!had)c.wordIds=c.wordIds.filter(id=>id!==w.id);
  if(!oldWord)data.words=data.words.filter(x=>x!==w);
  return {ok:false,message:'Speichern fehlgeschlagen. Bitte Backup prüfen.'};
 }
 return {ok:true,already:had,wordId:w.id,word:w.es,collection:c.name};
}
function createPilotCollection(name){
 const clean=String(name||'').trim().replace(/\s+/g,' ').slice(0,64);
 if(!clean)return {ok:false,message:'Bitte einen Namen angeben.'};
 if(data.collections.length>=100)return {ok:false,message:'Maximal 100 Sammlungen.'};
 const id='col-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
 data.collections.push({id,name:clean,wordIds:[],createdAt:iso()});
 if(!save()){data.collections=data.collections.filter(c=>c.id!==id);return {ok:false,message:'Speichern fehlgeschlagen.'}}
 return {ok:true,id};
}
window.PalabraBridge={pilotInfo:previewPilotToken,collections:storyCollections,
 addStoryWord:addPilotToCollection,createCollection:createPilotCollection};

function collectionWords(c){const ids=new Set(c?.wordIds||[]);return data.words.filter(w=>ids.has(w.id)&&(devMode||isDiscovered(w)))}
function collectionDueCards(c,dir='passive'){
 if(!c)return[];
 return collectionWords(c).filter(w=>{
  const p=w.progress[dir];
  return (dir==='passive'||eligibleForActive(w))&&!!p.due&&p.due<=iso()&&
   (dir==='passive'?!!w.progress.passive.introducedOn:true);
 }).sort((a,b)=>a.progress[dir].due.localeCompare(b.progress[dir].due)).map(w=>({id:w.id,dir,due:w.progress[dir].due}));
}
function startCollectionReview(id,dir){
 const c=getCollection(id);if(!c)return;
 const cards=collectionDueCards(c,dir);
 if(!cards.length){renderCollections();return;}
 selectedDirection=dir;startSession(cards,id);
}
function createCollection(){
 const name=prompt('Wie soll deine Sammlung heißen? (max. 64 Zeichen)');
 if(name===null)return;
 const cleaned=name.trim().replace(/\s+/g,' ').slice(0,64);
 if(!cleaned){alert('Bitte gib einen Sammlungsnamen ein.');return;}
 if(data.collections.length>=100){alert('Maximal 100 Sammlungen möglich.');return;}
 const id='col-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
 data.collections.push({id,name:cleaned,wordIds:[],createdAt:iso()});
 selectedCollectionId=id;collectionQuery='';pickerWordId=null;save();renderWords();
}
function renameCollection(id){
 const c=getCollection(id);if(!c)return;
 const name=prompt('Neuer Name für die Sammlung:',c.name);
 if(name===null)return;
 const cleaned=name.trim().replace(/\s+/g,' ').slice(0,64);
 if(!cleaned){alert('Bitte gib einen Namen ein.');return;}
 c.name=cleaned;save();renderCollections();
}
function deleteCollection(id){
 const c=getCollection(id);if(!c)return;
 if(!confirm('Sammlung „'+c.name+'“ löschen? Deine Wörter und SRS-Fortschritte bleiben erhalten.'))return;
 data.collections=data.collections.filter(x=>x.id!==id);
 if(selectedCollectionId===id)selectedCollectionId=null;
 save();renderWords();
}
function setCollectionMember(id,wordId,shouldAdd){
 const c=getCollection(id),w=data.words.find(w=>w.id===wordId);
 if(!c||!w||(!devMode&&!isDiscovered(w)))return;
 if(shouldAdd&&!c.wordIds.includes(wordId))c.wordIds.push(wordId);
 if(!shouldAdd)c.wordIds=c.wordIds.filter(x=>x!==wordId);
 save();renderCollections();
}
function renderWordsSubview(){
 const all=$('allWordsTab'),coll=$('collectionsTab');
 all.hidden=wordsSubview!=='all';coll.hidden=wordsSubview!=='collections';
 $('wordsAllTabButton').setAttribute('aria-selected',String(wordsSubview==='all'));
 $('wordsCollectionsTabButton').setAttribute('aria-selected',String(wordsSubview==='collections'));
 $('wordsAllTabButton').classList.toggle('selected',wordsSubview==='all');
 $('wordsCollectionsTabButton').classList.toggle('selected',wordsSubview==='collections');
 if(wordsSubview==='collections')renderCollections();
}
function renderCollections(){
 const area=$('collectionsArea');if(!area)return;
 const c=getCollection(selectedCollectionId);
 if(selectedCollectionId&&!c)selectedCollectionId=null;
 const collectionCount=data.collections.length;
 if(!c){
  area.innerHTML=`<div class="collections-intro"><div><strong>Deine eigenen Wortlisten</strong><p class="muted">Ordne Wörter nach deinen Themen. Im normalen Modus stehen dir bereits entdeckte Wörter zur Verfügung. Jedes Wort behält seinen Lernstand.</p></div><button class="primary collection-create" data-col-action="create">＋ Neue Sammlung</button></div>`+
  (collectionCount?`<div class="collection-list">${data.collections.map(col=>{
    const count=collectionWords(col).length;
    const due=collectionDueCards(col).length;
    return `<button type="button" class="collection-tile" data-col-action="open" data-col-id="${escape(col.id)}"><span class="collection-tile-icon">▤</span><span class="collection-tile-info"><strong>${escape(col.name)}</strong><small>${count} ${count===1?'Wort':'Wörter'} · ${due} passiv fällig</small></span><span class="collection-tile-arrow">›</span></button>`;
   }).join('')}</div>`:`<div class="collection-empty"><div>📂</div><h3>Platz für deine Lieblingswörter</h3><p>Erstelle deine erste Sammlung. Anschließend kannst du bereits entdeckte Wörter hinzufügen – aus deinem Wortschatz oder direkt hier.</p></div>`);
 }else{
  const words=collectionWords(c), ids=new Set(c.wordIds);
  const passive=collectionDueCards(c,'passive').length,active=collectionDueCards(c,'active').length;
  const q=collectionQuery.toLocaleLowerCase('de');
  const matches=data.words.filter(w=>(devMode||isDiscovered(w))&&!ids.has(w.id)&&`${w.es} ${w.de} ${w.category}`.toLocaleLowerCase('de').includes(q)).slice(0,35);
  area.innerHTML=`<button class="text-btn collection-back" data-col-action="back">← Alle Sammlungen</button>
    <div class="panel collection-detail"><div class="collection-detail-heading"><div><div class="eyebrow">MEINE SAMMLUNG</div><h2>${escape(c.name)}</h2><p class="muted">${words.length} ${words.length===1?'Wort':'Wörter'} · ${passive} passiv fällig · ${active} aktiv fällig</p></div><button class="collection-icon-action" data-col-action="rename" aria-label="Sammlung umbenennen" title="Umbenennen">✎</button></div>
    <div class="collection-review-actions"><button class="primary" data-col-action="review-passive" ${passive?'':'disabled'}>Passiv wiederholen (${passive})</button><button class="secondary" data-col-action="review-active" ${active?'':'disabled'}>Aktiv wiederholen (${active})</button></div>
    <p class="footnote">Hier übst du nur fällige Karten. Die Bewertungen fließen in denselben SRS-Fortschritt wie beim normalen Lernen.</p>
    <div class="collection-word-list">${words.length?words.map(w=>`<div class="collection-word-row"><div><strong>${escape(w.es)}</strong><span>${escape(w.de)}</span></div><button class="collection-icon-action" data-col-action="remove" data-word-id="${escape(w.id)}" aria-label="${escape(w.es)} entfernen" title="Aus Sammlung entfernen">×</button></div>`).join(''):'<p class="muted">Noch keine Wörter in dieser Sammlung.</p>'}</div>
    <div class="collection-add-section"><h3>Wörter hinzufügen</h3><p class="muted">${devMode?'🧪 Entwicklermodus: Du kannst hier auch noch ungesehene Wörter testweise zuordnen. Sie werden ohne SRS-Änderung gespeichert.':'Zur Auswahl stehen nur Wörter, die du bereits entdeckt hast.'}</p><input type="search" id="collectionSearch" placeholder="Spanisches oder deutsches Wort suchen …" value="${escape(collectionQuery)}" aria-label="Entdeckte Wörter für Sammlung suchen"><div id="collectionSearchResults" class="collection-search-results">${matches.map(w=>`<button class="collection-search-row" data-col-action="add" data-word-id="${escape(w.id)}"><span><strong>${escape(w.es)}</strong><small>${escape(w.de)}</small></span><b>＋</b></button>`).join('')||'<p class="muted">Keine weiteren passenden entdeckten Wörter.</p>'}</div></div>
    <button class="ghost collection-delete" data-col-action="delete">Sammlung löschen</button></div>`;
  const search=$('collectionSearch');if(search){search.oninput=e=>{
    collectionQuery=e.target.value;
    const query=collectionQuery.toLocaleLowerCase('de');
    const items=data.words.filter(w=>(devMode||isDiscovered(w))&&!ids.has(w.id)&&`${w.es} ${w.de} ${w.category}`.toLocaleLowerCase('de').includes(query)).slice(0,35);
    $('collectionSearchResults').innerHTML=items.map(w=>`<button class="collection-search-row" data-col-action="add" data-word-id="${escape(w.id)}"><span><strong>${escape(w.es)}</strong><small>${escape(w.de)}</small></span><b>＋</b></button>`).join('')||'<p class="muted">Keine weiteren passenden entdeckten Wörter.</p>';
   }}
 }
 if(pickerWordId)renderCollectionPicker();
}
function openCollectionPicker(wordId){
 if(!data.words.some(w=>w.id===wordId&&(devMode||isDiscovered(w))))return;
 pickerWordId=wordId;renderCollectionPicker();
}
function renderCollectionPicker(){
 const overlay=$('collectionPicker');if(!overlay)return;
 const w=data.words.find(w=>w.id===pickerWordId);
 if(!w){overlay.hidden=true;pickerWordId=null;return;}
 overlay.hidden=false;
 overlay.innerHTML=`<div class="collection-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="pickerTitle"><div class="picker-heading"><div><div class="eyebrow">WORT ZUORDNEN</div><h2 id="pickerTitle">${escape(w.es)}</h2><p class="muted">${escape(w.de)}</p></div><button class="collection-icon-action" data-picker-close aria-label="Schließen">×</button></div><div class="picker-list">${data.collections.map(c=>`<button class="picker-choice ${c.wordIds.includes(w.id)?'in-collection':''}" data-picker-collection="${escape(c.id)}"><span>${escape(c.name)}</span><strong>${c.wordIds.includes(w.id)?'✓ Hinzugefügt':'＋ Hinzufügen'}</strong></button>`).join('')||'<p class="muted">Du hast noch keine Sammlung. Lege zuerst eine an.</p>'}</div><button class="secondary" data-picker-create>＋ Neue Sammlung anlegen</button></div>`;
 const close=()=>{pickerWordId=null;overlay.hidden=true;overlay.innerHTML='';};
 overlay.onclick=e=>{
  if(e.target===overlay||e.target.closest('[data-picker-close]')){close();return;}
  if(e.target.closest('[data-picker-create]')){const idBefore=pickerWordId;close();wordsSubview='collections';createCollection();if(selectedCollectionId)setCollectionMember(selectedCollectionId,idBefore,true);return;}
  const btn=e.target.closest('[data-picker-collection]');if(!btn)return;
  const c=getCollection(btn.dataset.pickerCollection);if(!c)return;
  setCollectionMember(c.id,w.id,!c.wordIds.includes(w.id));
  // Keep the picker open to allow one word in multiple collections.
  renderCollectionPicker();
 };
}
$('wordsAllTabButton').onclick=()=>{wordsSubview='all';pickerWordId=null;$('collectionPicker').hidden=true;renderWordsSubview()};
$('wordsCollectionsTabButton').onclick=()=>{wordsSubview='collections';pickerWordId=null;$('collectionPicker').hidden=true;renderWordsSubview()};
$('wordList').addEventListener('click',e=>{const add=e.target.closest('[data-add-word]');if(add)openCollectionPicker(add.dataset.addWord)});
$('collectionsArea').addEventListener('click',e=>{
 const btn=e.target.closest('[data-col-action]');if(!btn)return;
 const action=btn.dataset.colAction,id=btn.dataset.colId||selectedCollectionId;
 if(action==='create')createCollection();
 if(action==='open'){selectedCollectionId=id;collectionQuery='';renderCollections();}
 if(action==='back'){selectedCollectionId=null;collectionQuery='';renderCollections();}
 if(action==='rename')renameCollection(id);
 if(action==='delete')deleteCollection(id);
 if(action==='remove')setCollectionMember(id,btn.dataset.wordId,false);
 if(action==='add')setCollectionMember(id,btn.dataset.wordId,true);
 if(action==='review-passive')startCollectionReview(id,'passive');
 if(action==='review-active')startCollectionReview(id,'active');
});
function renderDevPreview(){
 const wrap=$('devPreview');if(!wrap)return;
 wrap.hidden=!devMode;
 const select=$('devPackageSelect');
 if(!devMode)return;
 if(!select.options.length){
  const packages=[...new Map(data.words.filter(w=>w.deck_id!=='palabra-story-lexicon').map(w=>[w.package, w])).values()].sort((a,b)=>a.package-b.package);
  select.innerHTML=packages.map(w=>`<option value="${escape(w.package)}">Basis ${escape((w.deck_id||'').slice(-1))} · Paket ${escape(w.package_in_deck)} · ${escape(w.learning_goal||'')}</option>`).join('');
 }
 const n=Number(select.value),words=data.words.filter(w=>w.package===n);
 $('devPreviewList').innerHTML=words.map((w,i)=>`<div class="dev-word"><span class="dev-word-num">${i+1}</span><div><strong>${escape(w.es)}</strong><span>${escape(w.de)}</span></div></div>`).join('');
 $('devPreviewCount').textContent=`${words.length} Karten · nur Vorschau, kein SRS`;
}
function renderDevControls(){
 const checkbox=$('devModeToggle');if(!checkbox)return;
 checkbox.checked=devMode;
 $('devModeStatus').textContent=devMode?'Entwicklermodus aktiv: alle Dialoge und Wörter sind sichtbar.':'Entwicklermodus aus: normale Freischaltregeln gelten.';
 renderDevPreview();
}
function navigate(name){
 // The review screen is internal to Learn, not a navigation destination.
 if(name==='learn-hub' && current && queue.length) { /* Switching views preserves an unfinished session. */ }
if(name==='grammar' && window.PalabraGrammar)PalabraGrammar.render();if(name==='dialogues')PalabraDialogues.render(data,save,navigate);if(name==='stories')PalabraStories.render(data,save,navigate);document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===name));document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===(name==='learn'||name==='dialogues'?'learn-hub':name)));if(name==='learn-hub'){showLearnScreen('overview');PalabraDialogues.renderHome(data,navigate)}if(name==='words')renderWords();if(name==='settings')renderDevControls();if(name==='learn'&&!current&&queue.length===0)renderStudy();window.scrollTo(0,0)}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
$('homeToLearn').onclick=()=>navigate('learn-hub');
$('homeToStories').onclick=()=>navigate('stories');
$('homeToGrammar').onclick=()=>navigate('grammar');
if(window.PalabraGrammar)PalabraGrammar.init();
// Explicit callbacks: passing startSession as a DOM event handler caused the 0.6a.5 crash.
$('startBtn').onclick=()=>startSession();
$('dailyQuickStart').onclick=()=>startDailySession();
$('learnAllReview').onclick=()=>{selectedDeck='all';selectedPackage='all';selectedCategory='all';showLearnScreen('setup')};
$('learnBackOverview').onclick=()=>showLearnScreen('overview');
$('learnBackDeck').onclick=()=>showLearnScreen(selectedDeck==='all'?'overview':'deck');
$('browseBack').onclick=()=>showLearnScreen('deck');
$('browseLaunch').onclick=openPackageBrowse;
$('discoverLaunch').onclick=()=>openDiscovery();
$('dailyReviewBtn').onclick=startDailyReview;
$('openDialogues').onclick=()=>navigate('dialogues');
$('devModeToggle').onchange=e=>{devMode=e.target.checked;try{localStorage.setItem(DEV_KEY,String(devMode))}catch(_){}renderDevControls();PalabraDialogues.renderHome(data,navigate);};$('devPackageSelect').onchange=renderDevPreview;
$('passiveMode').onclick=()=>{selectedDirection='passive';data.settings.lastDirection='passive';save();updateHome()};$('activeMode').onclick=()=>{selectedDirection='active';data.settings.lastDirection='active';save();updateHome()};
$('exitLearn').onclick=()=>navigate('learn-hub');$('wordSearch').oninput=renderWords;$('wordStatus').onchange=renderWords;$('wordLevel').onchange=renderWords;$('statsPassive').onclick=()=>{statsDirection='passive';renderWords()};$('statsActive').onclick=()=>{statsDirection='active';renderWords()};
function download(content,name,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
$('exportBtn').onclick=()=>{download(JSON.stringify({...data,grammarA1:window.PalabraGrammarA1?.progress()||undefined,exportedAt:new Date().toISOString()},null,2),`Palabra-Backup-${iso()}.json`,'application/json');$('backupMessage').textContent='Backup erstellt. Bitte in „Dateien“ sicher aufbewahren.'};
$('importBackup').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;const el=$('backupMessage');try{const parsed=validate(JSON.parse(await f.text()));if(!confirm(`Backup mit ${parsed.words.length} Wörtern laden? Dein aktueller lokaler Lernstand wird dadurch ersetzt.`))return;data=parsed;normalizeCollections();normalizeDiscovery();selectedCollectionId=null;collectionQuery='';pickerWordId=null;if(data.settings.dailyNew===10)data.settings.dailyNew=20;syncCuratedDecks();if(!Number.isFinite(data.settings.extraBlocks))data.settings.extraBlocks=0;reconcileUnlocks();normalizeCollections();save();if(parsed.grammarA1&&window.PalabraGrammarA1)window.PalabraGrammarA1.restore(parsed.grammarA1);el.className='notice';el.textContent='Backup erfolgreich wiederhergestellt.';updateHome()}catch(err){el.className='notice error';el.textContent='Import fehlgeschlagen: '+err.message}finally{e.target.value=''}};
function parseCSV(text){const out=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))out.push(row);row=[];cell=''}else cell+=c}row.push(cell);if(row.some(x=>x.trim()))out.push(row);return out}
$('importCsv').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;const el=$('csvMessage');try{const rows=parseCSV((await f.text()).replace(/^\uFEFF/,''));const headers=rows.shift().map(s=>s.trim().toLowerCase());const find=(...keys)=>headers.findIndex(x=>keys.includes(x));const es=find('spanisch','es'),de=find('deutsch','de'),ex=find('beispiel_es','beispiel'),cat=find('kategorie','category');if(es<0||de<0)throw Error('Spalten „Spanisch“ und „Deutsch“ fehlen.');let added=0;const existing=new Set(data.words.map(w=>w.es.trim().toLocaleLowerCase()));for(const r of rows){const spanish=(r[es]||'').trim(),german=(r[de]||'').trim();if(!spanish||!german||existing.has(spanish.toLocaleLowerCase()))continue;data.words.push({id:'w-'+Date.now().toString(36)+'-'+added,es:spanish,de:german,example:ex>=0?(r[ex]||'').trim():'',category:cat>=0?(r[cat]||'Alltag').trim():'Alltag',progress:newProgress()});existing.add(spanish.toLocaleLowerCase());added++}save();el.className='notice';el.textContent=`${added} neue Wörter importiert.`;updateHome()}catch(err){el.className='notice error';el.textContent='CSV-Import fehlgeschlagen: '+err.message}finally{e.target.value=''}};
function refreshClock(){ $('todayDate').textContent=new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'short'}).format(new Date());if(document.getElementById('home').classList.contains('active'))updateHome()}
PalabraDialogues.renderHome(data,navigate);updateHome();refreshClock();document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshClock()});window.addEventListener('focus',refreshClock);
})();
