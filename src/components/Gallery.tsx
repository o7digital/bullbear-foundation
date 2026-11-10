import {useRef,useState} from 'react';
type Photo={src:string;alt:string;width:number;height:number};
export const galleryMessages={close:'Cerrar ×',closeLabel:'Cerrar fotografía',previous:'Fotografía anterior',next:'Fotografía siguiente'};
export default function Gallery({photos,messages=galleryMessages}:{photos:Photo[];messages?:typeof galleryMessages}){
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLAnchorElement|null>(null);const [index,setIndex]=useState(0);
 function open(i:number,button:HTMLAnchorElement){setIndex(i);trigger.current=button;dialog.current?.showModal();}
 function close(){dialog.current?.close();trigger.current?.focus();}
 function move(delta:number){setIndex(i=>(i+delta+photos.length)%photos.length);}
 return <><div className="photo-grid">{photos.map((p,i)=><figure key={p.src}><a href={p.src} target="_blank" rel="noopener noreferrer" onClick={e=>{e.preventDefault();open(i,e.currentTarget);}}><img src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy"/><span className="photo-expand" aria-hidden="true">↗</span></a><figcaption>{p.alt}</figcaption></figure>)}</div><dialog ref={dialog} className="lightbox" onClose={()=>trigger.current?.focus()} onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1);}}><button className="lightbox-close" onClick={close} aria-label={messages.closeLabel}>{messages.close}</button>{photos[index]&&<img src={photos[index].src} alt={photos[index].alt} width={photos[index].width} height={photos[index].height}/>}<div className="lightbox-controls"><button onClick={()=>move(-1)} aria-label={messages.previous}>←</button><p aria-live="polite">{index+1} / {photos.length}</p><button onClick={()=>move(1)} aria-label={messages.next}>→</button></div></dialog></>;
}
