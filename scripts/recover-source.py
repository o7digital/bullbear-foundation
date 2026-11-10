import urllib.request, urllib.error, json, pathlib, concurrent.futures, time
root=pathlib.Path('migration/raw');root.mkdir(parents=True,exist_ok=True)
base='https://www.bullandbear-foundation.com'
report=[]
def fetch(path,name):
 try:
  with urllib.request.urlopen(base+path,timeout=40) as r:
   data=r.read(); (root/name).write_bytes(data)
   report.append({'url':base+path,'file':str(root/name),'status':r.status,'bytes':len(data),'retrieved_at':'2026-11-10'})
   return data,dict(r.headers)
 except Exception as e:
  report.append({'url':base+path,'error':str(e)}); return None,{}
def collection(kind):
 all=[];page=1
 while True:
  existing=root/f'{kind}-{page}.json'
  data,headers=fetch(f'/wp-json/wp/v2/{kind}?per_page=100&page={page}',f'{kind}-{page}.json') if not (kind=='posts' and page==1 and existing.exists()) else (existing.read_bytes(),{})
  if not data:break
  try:items=json.loads(data)
  except:break
  if not isinstance(items,list):break
  all+=items
  if len(items)<100:break
  page+=1
 (root/f'{kind}.json').write_text(json.dumps(all,ensure_ascii=False,indent=2))
 print(kind,len(all),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 list(pool.map(collection,['pages','posts','categories']))
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 list(pool.map(lambda x:fetch(*x),[('/robots.txt','robots.txt'),('/wp-sitemap.xml','wp-sitemap.xml'),('/donar-ahora/','donar-ahora.html')]))
pathlib.Path('migration/reports/retrieval.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
