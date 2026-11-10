import {useEffect,useState} from 'react';
import {activityCount} from '../i18n/counts';
export const filterMessages={all:'Todas',undated:'Sin fecha',yearLabel:'Filtrar por año',categoryLabel:'Tipo de actividad',allTopics:'Todos los temas',activities:'actividades'};
export default function Filters({years,categories,messages=filterMessages,categoryLabels={},locale='es'}:{years:string[];categories:string[];messages?:typeof filterMessages;categoryLabels?:Record<string,string>;locale?:string}){
 const [year,setYear]=useState('all'),[category,setCategory]=useState('all'),[count,setCount]=useState<number|null>(null);
 useEffect(()=>{let total=0;document.querySelectorAll<HTMLElement>('.activity-card').forEach(card=>{const show=(year==='all'||card.dataset.year===year)&&(category==='all'||card.dataset.category===category);card.hidden=!show;if(show)total++;});setCount(total);},[year,category]);
 return <div className="filters"><div className="year-filters" aria-label={messages.yearLabel}>{['all',...years].map(y=><button key={y} aria-pressed={year===y} onClick={()=>setYear(y)}>{y==='all'?messages.all:y==='sin-fecha'?messages.undated:y}</button>)}</div><label className="category-filter"><span className="sr-only">{messages.categoryLabel}</span><select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">{messages.allTopics}</option>{categories.map(c=><option key={c} value={c}>{categoryLabels[c]||c}</option>)}</select></label><span className="filter-count" role="status">{count===null?'':activityCount(count,locale)}</span></div>;
}
