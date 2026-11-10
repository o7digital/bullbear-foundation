import {defineCollection} from 'astro:content';
import {z} from 'astro/zod';
import {file} from 'astro/loaders';
const provenance={sourceUrl:z.url(),secondarySource:z.url().optional(),publishedAt:z.string().nullable(),modifiedAt:z.string().nullable(),validation:z.enum(['verified-source','partial'])};
const activities=defineCollection({loader:file('src/content/activities.json'),schema:z.object({id:z.string(),title:z.string(),...provenance,date:z.string().nullable(),dateLabel:z.string(),year:z.string(),category:z.string(),summary:z.string(),paragraphs:z.array(z.string()),images:z.array(z.string()),alt:z.string(),impact:z.object({count:z.number(),label:z.string(),period:z.string()}).optional()})});
const programs=defineCollection({loader:file('src/content/programs.json'),schema:z.object({id:z.string(),title:z.string(),...provenance,summary:z.string(),body:z.string(),image:z.string(),number:z.string()})});
const documents=defineCollection({loader:file('src/content/documents.json'),schema:z.object({id:z.string(),title:z.string(),...provenance,file:z.string(),dateLabel:z.string(),description:z.string()})});
const albums=defineCollection({loader:file('src/content/albums.json'),schema:z.object({id:z.string(),title:z.string(),...provenance,activityId:z.string(),images:z.array(z.string())})});
export const collections={activities,programs,documents,albums};
