import {useEffect,useState} from 'react';
export default function Filters({years,categories}:{years:string[];categories:string[]}){
 const [year,setYear]=useState('all'),[category,setCategory]=useState('all'),[count,setCount]=useState<number|null>(null);
 useEffect(()=>{let total=0;document.querySelectorAll<HTMLElement>('.activity-card').forEach(card=>{const show=(year==='all'||card.dataset.year===year)&&(category==='all'||card.dataset.category===category);card.hidden=!show;if(show)total++;});setCount(total);},[year,category]);
 return <div className="filters"><div className="year-filters" aria-label="Filtrar por año">{['all',...years].map(y=><button key={y} aria-pressed={year===y} onClick={()=>setYear(y)}>{y==='all'?'Todas':y==='sin-fecha'?'Sin fecha':y}</button>)}</div><label className="category-filter"><span className="sr-only">Tipo de actividad</span><select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">Todos los temas</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label><span className="filter-count" role="status">{count===null?'':`${count} actividades`}</span></div>;
}
