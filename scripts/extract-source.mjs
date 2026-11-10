import fs from 'node:fs';import{load}from'cheerio';
const pages=[];
for(const file of fs.readdirSync('migration/raw').filter(f=>f.endsWith('.html'))){
 const raw=fs.readFileSync('migration/raw/'+file,'utf8'),$=load(raw);const main=$('article .elementor').first();main.find('script,style,iframe').remove();
 const blocks=main.find('.elementor-widget-heading,.elementor-widget-text-editor').map((_,el)=>({type:$(el).hasClass('elementor-widget-heading')?'heading':'text',text:$(el).text().replace(/\s+/g,' ').trim()})).get().filter(b=>b.text);
 const images=[...new Set([...main.find('img').map((_,el)=>$(el).attr('src')).get(),...main.find('[data-thumbnail]').map((_,el)=>$(el).attr('data-thumbnail')).get(),...main.find('a').map((_,el)=>$(el).attr('href')).get().filter(x=>/\.(jpg|jpeg|png|pdf)$/i.test(x||''))])].filter(x=>x&&x.includes('/wp-content/uploads/'));
 const links=main.find('a[href]').map((_,el)=>({text:$(el).text().trim(),href:$(el).attr('href')})).get();
 let schema=[];$('script[type="application/ld+json"]').each((_,el)=>{try{schema.push(JSON.parse($(el).text()))}catch{}});
 pages.push({slug:file.replace('.html',''),title:$('title').text(),blocks,images,links,schema});
}
fs.writeFileSync('migration/extracted-pages.json',JSON.stringify(pages,null,2));
for(const p of pages)console.log(p.slug,p.images.length,JSON.stringify(p.blocks).slice(0,1200));
