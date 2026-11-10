import type { ImageMetadata } from 'astro';
const all = import.meta.glob<{default: ImageMetadata}>('../assets/source/*', {eager:true});
export function media(file:string):ImageMetadata {
 const asset = all[`../assets/source/${file}`];
 if(!asset) throw new Error(`Missing local media: ${file}`);
 return asset.default;
}
export const logo = 'b5ffcf99e4-cropped-BB-Fundation-Logotipo-1.png';
export const hero = '051df6da2a-02e1dd0d-c484-471d-b8fb-ea701160719c-2.jpg';
export const community = '2d66b247a1-IMG_7729-2-scaled.jpg';
