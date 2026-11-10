import subprocess,json,pathlib,concurrent.futures
inv=json.load(open('migration/source/Bull_Bear_Astro_Dossier/03_INVENTAIRE.json'));report=[]
blocked={'/donar-ahora/'}
paths=[p['source_url'] for p in inv['pages'] if '/pruebas/' not in p['source_url'] and pathlib.PurePosixPath(p['source_url']).name not in ('','haleria')]
def get(url):
 slug=url.rstrip('/').rsplit('/',1)[1];p=pathlib.Path('migration/raw/'+slug+'.html')
 if p.exists() or any(url.endswith(b) for b in blocked):return
 r=subprocess.run(['curl','-L','--max-time','30','-sS','-w','%{http_code}','-o',str(p),url],capture_output=True,text=True)
 return {'url':url,'file':str(p),'status':r.stdout,'bytes':p.stat().st_size if p.exists() else 0}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:report=[x for x in pool.map(get,paths) if x]
pathlib.Path('migration/reports/additional-pages.json').write_text(json.dumps(report,indent=2));print(report)
