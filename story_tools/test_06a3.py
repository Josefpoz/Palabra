import json,sys,re
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
data=json.loads((BASE/'stories/catalog.json').read_text())
assert len(data['stories'])==4
assert {st['id'] for st in data['stories']}=={'coco-a1','coco-a2','cine-a2','cine-b1'}
assert sum(len(st['chapters']) for st in data['stories'])==12
for st in data['stories']:
 assert len(st['chapters'])==3
 for ch in st['chapters']:
  assert len(ch['questions'])==2
  for sent in ch['sentences']:
   assert ''.join(t['before']+t['text'] for t in sent['tokens'])+sent['trailing']==sent['es']
   tokens=[p['id'] for t in sent['tokens'] for p in t.get('parts',[t])]
   assert sorted(tokens)==sorted(x for unit in sent['syntax'] for x in unit['members'])
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(390,844),(1280,900)]:
  page=browser.new_page(viewport={'width':w,'height':h})
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  html=(BASE/'index.html').read_text()
  html=re.sub(r'<script[^>]*src="[^"]+"[^>]*></script>','',html)
  html=re.sub(r'<link[^>]*rel="stylesheet"[^>]*>','',html)
  page.set_content(html,wait_until='domcontentloaded')
  page.evaluate('''() => {const data={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v),removeItem:k=>delete data[k]}})}''')
  page.add_style_tag(content=(BASE/'style.css').read_text())
  for f in ['words.js','dialogues.js','stories/catalog.js','stories.js','app.js']:
   page.add_script_tag(content=(BASE/f).read_text())
  print('PAGE',w,'title',page.title(),'errors',errors[:3])
  page.locator('[data-page="stories"]').click()
  assert page.locator('.story-shelf-card').count()==2
  assert page.locator('.story-level-choice').count()==4
  assert page.locator('.story-open').count()==2
  page.locator('.story-level-choice[data-level-choice="cine-b1"]').click()
  assert page.locator('.story-level-choice.selected').filter(has_text='B1').count()==1
  page.locator('[data-open-story="cine-b1"]').click()
  assert 'El edificio' in page.locator('.story-reader-heading').inner_text()
  count=page.locator('.story-sentence-wrap').count()
  assert count>85,count
  assert page.locator('.story-word-panel').is_hidden()
  assert page.locator('#storyGrammarLegend').is_hidden()
  page.locator('.story-grammar-tiny').first.click()
  assert page.locator('.story-grammar-on').count()==1
  assert page.locator('#storyGrammarLegend').is_visible()
  page.locator('.story-token').first.click()
  assert page.locator('#storyWordPanel').is_visible()
  assert 'Bedeutung' in page.locator('#storyWordPanel').inner_text()
  page.locator('#storyCloseWord').click()
  page.locator('.story-translate-tiny').first.click()
  assert page.locator('.story-translation').count()==1
  assert 'natürliche übersetzung' in page.locator('.story-translation').first.inner_text().lower()
  page.locator('[data-story-chapter="2"]').click()
  assert 'Cuando se encienden' in page.locator('.story-reader-heading').inner_text()
  page.locator('.story-translate-tiny').first.click()
  assert 'wort-für-wort' in page.locator('.story-translation').first.inner_text().lower()
  assert page.locator('.story-question').count()==0
  page.locator('#storyQuestionsToggle').click()
  assert page.locator('.story-question').count()==2
  page.locator('#storyQuestionsToggle').click()
  assert page.locator('.story-question').count()==0
  page.locator('#storyBack').click()
  page.locator('.story-level-choice[data-level-choice="coco-a1"]').click()
  page.locator('[data-open-story="coco-a1"]').click()
  assert 'La maleta azul' in page.locator('.story-reader-heading').inner_text()
  page.locator('#storyFinish').click()
  assert 'Kapitel 2' in page.locator('.story-reader-indicator').inner_text()
  page.locator('#storyFinish').click()
  page.locator('#storyFinish').click()
  assert '3 von 3' in page.locator('.story-progress-note').first.inner_text()
  assert len(errors)==0,errors
  # Capture safe desktop/mobile preview from reading.
  page.locator('[data-open-story="coco-a1"]').click()
  page.locator('[data-story-chapter="0"]').click()
  page.locator('.story-grammar-tiny').nth(2).click()
  page.screenshot(path=f'/mnt/data/Palabra_06a3_Stories_{w}.png',full_page=False)
  print('PASS',w,'B1 sentences',count,'horizontal overflow',page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth'))
 browser.close()
print('FULL PASS')
