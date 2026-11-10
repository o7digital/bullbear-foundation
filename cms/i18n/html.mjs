import {load} from 'cheerio';
import {languages,localizedPath} from '../studio/locales.mjs';
import {passthrough} from '../studio/translations.mjs';
export const normalize=text=>String(text||'').replace(/\s+/gu,' ').trim();
const attributes=['alt','aria-label','placeholder','title'];
const metadata='meta[name="description"],meta[name="twitter:title"],meta[name="twitter:description"],meta[property="og:title"],meta[property="og:description"]';
function headingUnits($){return $('h1,h2,h3').filter((_,el)=>$(el).find('br,em,strong').length>0&&!$(el).find('a').length);}
function headingSource($,el){const copy=$(el).clone();copy.find('br').replaceWith(' ');return normalize(copy.text());}
function protectedNode($,node){return $(node).parents('script,style,[data-language-link],[data-language-code]').length>0;}
function stringsInSchema(value,fn){if(Array.isArray(value))return value.map(v=>stringsInSchema(v,fn));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,typeof v==='string'&&['name','headline','description','articleBody','caption','text'].includes(k)?fn(v):stringsInSchema(v,fn)]));return value;}
function islandStrings(props,fn){for(const key of['messages','categoryLabels']){const values=props[key]?.[1];if(values&&typeof values==='object')for(const value of Object.values(values))if(Array.isArray(value)&&value[0]===0&&typeof value[1]==='string')value[1]=fn(value[1]);}const photos=props.photos?.[1];if(Array.isArray(photos))for(const photo of photos){const alt=photo?.[1]?.alt;if(Array.isArray(alt)&&typeof alt[1]==='string')alt[1]=fn(alt[1]);}return props;}
export function extractSources(html,route){const $=load(html,{scriptingEnabled:false}),sources=new Map();const headings=headingUnits($);const headingNodes=new Set(headings.toArray());function collect(raw,context=''){const text=normalize(raw);if(text&&!passthrough(text))sources.set(text,{text,context:normalize(context).slice(0,1000)});return raw;}
 $('*').contents().each((_,node)=>{if(node.type==='text'&&!protectedNode($,node)&&!$(node).parents().toArray().some(el=>headingNodes.has(el)))collect(node.data,$(node).parent().text());});
 headings.each((_,el)=>{collect(headingSource($,el),route);$(el).find('em,strong').each((_,part)=>collect($(part).text(),headingSource($,el)));});
 for(const attr of attributes)$('['+attr+']').each((_,el)=>{if(!$(el).is('[data-language-link]'))collect($(el).attr(attr),$(el).text()||route);});
 $(metadata).each((_,el)=>collect($(el).attr('content'),route));
 $('script[type="application/ld+json"]').each((_,el)=>stringsInSchema(JSON.parse($(el).html()),value=>collect(value,route)));
 $('astro-island[props]').each((_,el)=>islandStrings(JSON.parse($(el).attr('props')),value=>collect(value,route)));
 return [...sources.values()];}
export function createTranslator(dictionary,locale){return raw=>{const source=normalize(raw);if(!source||passthrough(source))return raw;const target=dictionary[source]?.[locale];if(typeof target!=='string'||!target.trim())throw Error('Missing '+locale+' translation: '+source.slice(0,120));const leading=String(raw).match(/^\s*/u)[0],trailing=String(raw).match(/\s*$/u)[0];return leading+target.trim()+trailing;};}
export function localizeHtml(html,{route,locale,dictionary,routes,origin='https://www.bullandbear-foundation.com'}){
 const $=load(html,{scriptingEnabled:false}),t=locale==='es'?v=>v:createTranslator(dictionary,locale);
 if(locale!=='es'){
  const headings=headingUnits($),headingNodes=new Set(headings.toArray());
  $('*').contents().each((_,node)=>{if(node.type==='text'&&!protectedNode($,node)&&!$(node).parents().toArray().some(el=>headingNodes.has(el)))node.data=t(node.data);});
  headings.each((_,el)=>{const heading=$(el),source=headingSource($,el),translated=t(source);let output=$('<span>').text(translated).html();heading.find('em,strong').each((_,part)=>{const text=normalize($(part).text());if(!text)return;const phrase=t(text).trim().replace(/[.!?。！？]+$/u,''),escaped=$('<span>').text(phrase).html();if(phrase&&translated.includes(phrase))output=output.replace(escaped,'<'+part.tagName+'>'+escaped+'</'+part.tagName+'>');});heading.html(output);});
  for(const attr of attributes)$('['+attr+']').each((_,el)=>{if(!$(el).is('[data-language-link]'))$(el).attr(attr,t($(el).attr(attr)));});
  $(metadata).each((_,el)=>$(el).attr('content',t($(el).attr('content'))));
  $('script[type="application/ld+json"]').each((_,el)=>{const data=stringsInSchema(JSON.parse($(el).html()),t);const visit=value=>{if(Array.isArray(value))return value.map(visit);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,['mainEntityOfPage','item'].includes(k)&&typeof v==='string'&&v.startsWith(origin)?origin+localizedPath(new URL(v).pathname,locale):visit(v)]));return value;};$(el).text(JSON.stringify(visit(data)).replaceAll('<','\\u003c'));});
  $('astro-island[props]').each((_,el)=>{const props=islandStrings(JSON.parse($(el).attr('props')),t);if(props.locale)props.locale=[0,locale];$(el).attr('props',JSON.stringify(props));});
  $('a[href]').each((_,el)=>{const link=$(el),href=link.attr('href');if(link.is('[data-language-link]')||!href.startsWith('/')||href.startsWith('//'))return;const u=new URL(href,origin);const normalized=u.pathname.endsWith('/')?u.pathname:u.pathname+'/';if(routes.has(normalized))link.attr('href',localizedPath(normalized,locale)+u.search+u.hash);});
 }
 const canonical=origin+localizedPath(route,locale);$('html').attr('lang',languages[locale].tag);$('meta[property="og:locale"]').attr('content',languages[locale].og);$('link[rel="canonical"]').attr('href',canonical);$('meta[property="og:url"]').attr('content',canonical);$('link[rel="alternate"][hreflang]').remove();
 for(const[id,language]of Object.entries(languages))$('<link>').attr({rel:'alternate',hreflang:language.tag,href:origin+localizedPath(route,id)}).appendTo('head');$('<link>').attr({rel:'alternate',hreflang:'x-default',href:origin+route}).appendTo('head');
 $('[data-language-code]').text(locale.toUpperCase());$('[data-language-link]').each((_,el)=>{const link=$(el),id=link.attr('data-language-link');link.attr('href',localizedPath(route,id));if(id===locale)link.attr('aria-current','true');else link.removeAttr('aria-current');link.find('span').text(id===locale?'✓':'');});
 return $.html();
}
export function batchSources(sources,{maxCharacters=5500,maxFields=30}={}){const batches=[];let batch=[],characters=0;for(const source of sources){if(source.text.length>7000)throw Error('A source paragraph is too long to translate safely.');if(batch.length&&(batch.length>=maxFields||characters+source.text.length>maxCharacters)){batches.push(batch);batch=[];characters=0;}batch.push(source);characters+=source.text.length;}if(batch.length)batches.push(batch);return batches;}
export const locales=Object.keys(languages);
