import { openDB } from 'idb';
import { strToU8,zipSync } from 'fflate';
import { parseProject,type CharacterSheetProject } from '../shared/model';
import { exportManifest } from '../shared/export';
import { buildSpecification } from '../shared/characterSheetPromptBuilder';
export interface ProjectStore {save(p:CharacterSheetProject):Promise<void>;load(id:string):Promise<CharacterSheetProject|undefined>;list():Promise<CharacterSheetProject[]>;delete(id:string):Promise<void>;}
export interface CharacterAssetStore {saveProjectAssets(id:string,assets:Map<string,Blob>):Promise<void>;loadProjectAssets(id:string):Promise<Map<string,Blob>>;}
const db=()=>openDB('character-sheet-generator',1,{upgrade(db){db.createObjectStore('projects',{keyPath:'id'});db.createObjectStore('assets');db.createObjectStore('templates',{keyPath:'id'});}});
export class LocalProjectStore implements ProjectStore,CharacterAssetStore {
 async save(p:CharacterSheetProject){await (await db()).put('projects',parseProject(p));}
 async load(id:string){const p=await (await db()).get('projects',id);return p?parseProject(p):undefined;}
 async list(){return ((await (await db()).getAll('projects')) as unknown[]).map(parseProject).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));}
 async delete(id:string){const d=await db();const tx=d.transaction(['projects','assets'],'readwrite');await tx.objectStore('projects').delete(id);await tx.objectStore('assets').delete(id);await tx.done;}
 async saveProjectAssets(id:string,assets:Map<string,Blob>){await (await db()).put('assets',assets,id);}
 async loadProjectAssets(id:string){return (await (await db()).get('assets',id) as Map<string,Blob>|undefined)??new Map();}
 async saveDraft(p:CharacterSheetProject,assets:Map<string,Blob>){const validated=parseProject(p);for(const r of p.references)if(!assets.has(r.id))throw Error('A photograph is missing. Re-add it before saving.');const d=await db();const tx=d.transaction(['projects','assets'],'readwrite');await tx.objectStore('projects').put(validated);await tx.objectStore('assets').put(new Map(p.references.map(r=>[r.id,assets.get(r.id)!])),p.id);await tx.done;}
 async saveTemplate(p:CharacterSheetProject,name:string){await(await db()).put('templates',{id:crypto.randomUUID(),name,settings:{preset:p.preset,orientation:p.orientation,background:p.background,lighting:p.lighting,detailOptions:p.detailOptions,labels:p.labels,customDetail:p.customDetail,negativeConstraints:p.negativeConstraints}});}
 async templates():Promise<{id:string;name:string;settings:Partial<CharacterSheetProject>}[]>{return(await db()).getAll('templates');}
}
export const store=new LocalProjectStore();
export function download(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
export async function exportCafe(p:CharacterSheetProject,assets:Map<string,Blob>){const manifest=exportManifest(p);const root=`characters/${manifest.id}/`;const files:Record<string,Uint8Array>={[`${root}manifest.json`]:strToU8(JSON.stringify(manifest,null,2)),[`${root}prompt.txt`]:strToU8(buildSpecification(p).prompt),[`${root}project.json`]:strToU8(JSON.stringify(p,null,2))};for(const r of manifest.references){const blob=assets.get(r.id);if(!blob)throw Error(`Missing source photograph: ${r.originalFilename}`);files[root+r.path]=new Uint8Array(await blob.arrayBuffer());}const data=zipSync(files,{level:0});download(new Blob([data as BlobPart],{type:'application/zip'}),`${manifest.id}-cafe-export.zip`);}
