import json,re,pathlib,subprocess,concurrent.futures,hashlib,html
root=pathlib.Path('src/assets/source');root.mkdir(parents=True,exist_ok=True)
inventory=json.load(open('migration/source/Bull_Bear_Astro_Dossier/03_INVENTAIRE.json'))
items={m['source_url']:{'source_url':m['source_url'],'found_on':m['found_on'],'role':m['role']} for m in inventory['media']}
for post in json.load(open('migration/raw/posts.json')):
 for url in re.findall(r'(?:src|href)=[\"\']([^\"\']+\.(?:jpg|jpeg|png|webp))',post['content']['rendered']):
  if '/wp-content/uploads/' in url: items.setdefault(html.unescape(url),{'source_url':html.unescape(url),'found_on':post['link'],'role':'activity photograph'})
home=html.unescape(open('migration/raw/home.html').read())
for url in re.findall(r'https://www.bullandbear-foundation.com/wp-content/uploads/[^\s\"<>\\]+\.(?:jpg|jpeg|png)',home):
 if 'Logo' in url or 'abuelitos' in url or 'Vision' in url:items.setdefault(url,{'source_url':url,'found_on':inventory['pages'][0]['source_url'],'role':'homepage media'})
def download(m):
 u=m['source_url'];name=hashlib.sha256(u.encode()).hexdigest()[:10]+'-'+u.rsplit('/',1)[1];target=root/name
 r=subprocess.run(['curl','-L','--max-time','25','-sS','-w','%{http_code}','-o',str(target),u],capture_output=True,text=True)
 m['http_status']=r.stdout;m['downloaded']=r.returncode==0 and r.stdout=='200'
 if m['downloaded']:
  m['local_file']=str(target);m['bytes']=target.stat().st_size
 else:target.unlink(missing_ok=True);m['error']=r.stderr or 'HTTP '+r.stdout
 return m
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 results=list(pool.map(download,items.values()))
pathlib.Path('migration/media-manifest.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print('media downloaded',sum(m['downloaded'] for m in results),'of',len(results))
