export const site = {
 name: 'Bull & Bear Foundation', legalName: 'Fundación Bull&Bear A.C.',
 url: 'https://www.bullandbear-foundation.com',
 email: 'contacto@bullandbear-foundation.com', phone: '+52 55 3688 8077',
 address: 'Av. Insurgentes Sur 716, piso 8, ala poniente. Col. Del Valle, C.P. 03103, Benito Juárez, Ciudad de México.',
 giveUrl: import.meta.env.PUBLIC_GIVE_URL || 'https://www.bullandbear-foundation.com/donar-ahora/',
};
export const navigation = [
 {href:'/quienes-somos/',label:'La fundación'}, {href:'/programas/',label:'Nuestra labor'},
 {href:'/actividades-bb-foundation/',label:'Actividades'}, {href:'/transparencia/',label:'Transparencia'}, {href:'/contacto/',label:'Contacto'},
];
export const formatDate = (date: string) => new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date));
