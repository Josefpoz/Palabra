import json,re
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
d=json.loads((BASE/'stories/catalog.json').read_text())
assert len(d['stories'])==4
assert sum(len(st['chapters']) for st in d['stories'])==12
all_s=[s for st in d['stories'] for c in st['chapters'] for s in c['sentences']]
assert len(all_s)==776 and all(s['de'].strip() for s in all_s)
assert sum(bool(s.get('grammarFocus')) for s in all_s)==81
assert sum(len(s['syntax']) for s in all_s)==0
assert sum(len(s['groups']) for s in all_s)==0
for sent in all_s:
 assert ''.join(t['before']+t['text'] for t in sent['tokens'])+sent['trailing']==sent['es'],sent['id']
 valid={part['id'] for tok in sent['tokens'] for part in tok.get('parts',[tok])}
 if 'grammarFocus' in sent:
  assert all(set(sp['members'])<=valid for sp in sent['grammarFocus']['spans'])
print('Content checks PASS, 776 translations, 81 learning moments, no automatic grammar role guesses')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(390,844),(1280,900)]:
  page=browser.new_page(viewport={'width':w,'height':h})
  errors=[]
  page.on('pageerror',lambda e: errors.append(str(e)))
  html=(BASE/'index.html').read_text()
  html=re.sub(r'<script[^>]*src="[^"]+"[^>]*></script>','',html)
  html=re.sub(r'<link[^>]*rel="stylesheet"[^>]*>','',html)
  page.set_content(html,wait_until='domcontentloaded')
  page.evaluate('''() => {const data={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v),removeItem:k=>delete data[k]}})}''')
  page.add_style_tag(content=(BASE/'style.css').read_text())
  for f in ['words.js','dialogues.js','stories/catalog.js','stories.js','app.js']:
   page.add_script_tag(content=(BASE/f).read_text())
  assert not errors,errors
  page.locator('[data-page="stories"]').click()
  assert page.locator('.story-shelf-card').count()==2
  for eid in ('coco-a1','coco-a2','cine-a2','cine-b1'):
   page.locator(f'[data-level-choice="{eid}"]').click()
   page.locator(f'[data-open-story="{eid}"]').click()
   info=next(e for e in d['stories'] if e['id']==eid)
   for ci,ch in enumerate(info['chapters']):
    page.locator(f'[data-story-chapter="{ci}"]').click()
    assert page.locator('.story-sentence-wrap').count()==len(ch['sentences'])
    assert page.locator('.story-translate-tiny').count()==len(ch['sentences'])
    assert page.locator('.story-grammar-tiny').count()==sum(bool(x.get('grammarFocus')) for x in ch['sentences'])
    page.locator('.story-translate-tiny').first.click()
    assert page.locator('.story-translation').count()==1
    assert ch['sentences'][0]['de'] in page.locator('.story-translation').first.inner_text()
    page.locator('.story-translate-tiny').first.click()
    if page.locator('.story-grammar-tiny').count():
     page.locator('.story-grammar-tiny').first.click()
     assert page.locator('.story-grammar-on').count()==1
     assert page.locator('.story-focus-explain').filter(visible=True).count()==1
     assert page.locator('#storyGrammarLegend').is_visible()
     assert page.locator('.story-grammar-on .story-token[data-focus-kind]:not([data-focus-kind=""])').count()>0
     page.locator('.story-grammar-tiny').first.click()
     assert page.locator('.story-focus-explain').filter(visible=True).count()==0
   page.locator('[data-story-chapter="0"]').click()
   page.locator('.story-token').first.click()
   assert page.locator('#storyWordPanel').is_visible()
   page.locator('#storyPanelTranslate').click()
   assert next(e for e in d['stories'] if e['id']==eid)['chapters'][0]['sentences'][0]['de'] in page.locator('.story-panel-fullsentence').inner_text()
   page.locator('#storyCloseWord').click()
   page.locator('#storyQuestionsToggle').click()
   assert page.locator('.story-question').count()==2
   page.locator('#storyQuestionsToggle').click()
   page.locator('#storyBack').click()
  assert len(errors)==0,errors
  # proof screenshots of B1 reader and A1 reader
  page.locator('[data-level-choice="cine-b1"]').click()
  page.locator('[data-open-story="cine-b1"]').click()
  page.locator('.story-grammar-tiny').first.click()
  page.screenshot(path=f'/mnt/data/Palabra_06a4_B1_{w}.png',full_page=False)
  overflow=page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth')
  print('BROWSER',w,'PASS','overflow',overflow,'errors',errors)
  assert not overflow
  page.close()
 browser.close()
print('ALL PASSED')
