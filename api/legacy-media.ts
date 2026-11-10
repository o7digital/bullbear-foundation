import mappings from '../src/data/legacy-media.json' with {type:'json'};
interface Request {url?:string;method?:string}
interface Response {statusCode:number;setHeader:(name:string,value:string)=>void;end:(body?:string)=>void}
export default function handler(request:Request,response:Response){
 if(request.method&& !['GET','HEAD'].includes(request.method)){response.statusCode=405;response.setHeader('Allow','GET, HEAD');response.end();return;}
 const url=new URL(request.url||'/','https://placeholder.invalid');
 const suffix=url.searchParams.get('path')||'';
 const key='/wp-content/uploads/'+suffix.replace(/^\/+/, '');
 const destination=(mappings as Record<string,string>)[key];
 if(!destination){response.statusCode=404;response.end('Archivo no encontrado');return;}
 response.statusCode=301;response.setHeader('Location',destination);response.setHeader('Cache-Control','public, max-age=86400');response.end();
}
