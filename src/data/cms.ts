import snapshot from './cms.generated.json';
export interface StudioRecord {id:string;kind:string;section:string;title:string;body?:string;summary?:string;image?:string;alt?:string;position?:string;video?:string;url?:string;button_label?:string;button_url?:string;edited?:boolean;imported?:boolean;placement?:string;date?:string;images?:string[];}
export const studioRecords=snapshot.records as unknown as StudioRecord[];
export const studioRecord=(id:string)=>studioRecords.find(row=>row.id===id);
export const studioText=(id:string,fallback:string,field:'body'|'title'='body')=>studioRecord(id)?.[field]??fallback;
export const studioMedia=(section:string)=>studioRecords.filter(row=>row.section===section&&['photo','video'].includes(row.kind)&&!row.imported&&!row.placement);
export const studioMediaAlt=(file:string,fallback:string)=>(snapshot.mediaAlts as Record<string,string>)[file]||fallback;
