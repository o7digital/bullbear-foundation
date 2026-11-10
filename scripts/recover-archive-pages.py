import json,pathlib,subprocess,concurrent.futures,urllib.parse
pages=json.load(open('migration/extracted-pages.json'));todo=set()
for p in pages:
 for link in p['links']:
  u=urllib.parse.urlparse(link.get('href') or '')
  if u.hostname in ('bullandbear-foundation.com','www.bullandbear-foundation.com'):
   slug=u.path.strip('/')
   if p['slug'].startswith('resumen-de-actividades') and slug and '/' not in slug and not pathlib.Path('migration/raw/'+slug+'.html').exists():todo.add(slug)
def get(slug):
 p=pathlib.Path('migration/raw/'+slug+'.html');r=subprocess.run(['curl','-L','--max-time','30','-sS','-w','%{http_code}','-o',str(p),'https://www.bullandbear-foundation.com/'+slug+'/'],capture_output=True,text=True)
 return {'slug':slug,'status':r.stdout,'bytes':p.stat().st_size if p.exists() else 0}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:report=list(pool.map(get,sorted(todo)))
pathlib.Path('migration/reports/archive-linked-pages.json').write_text(json.dumps(report,indent=2));print(report)
