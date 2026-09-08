import type { CharacterSheetProject } from './model';
export const presetComponents:Record<Exclude<CharacterSheetProject['preset'],'Custom'>,CharacterSheetProject['detailOptions']>={
 'Standard Character Sheet':['Full Body Front','Full Body Side','Full Body Back','Full Body 3/4','Eyes','Upper Face','Lower Face','Mouth','Skin','Hair','Clothing','Identifying Detail'],
 'Portrait Identity Sheet':['Portrait Front','Portrait Left 3/4','Portrait Right 3/4','Left Profile','Right Profile','Neutral Expression','Smile','Eyes','Nose','Mouth','Hairline','Skin'],
 'Full Production Sheet':['Full Body Front','Full Body Side','Full Body Back','Full Body 3/4','Portrait Front','Portrait Left 3/4','Portrait Right 3/4','Left Profile','Right Profile','Eyes','Nose','Mouth','Skin','Hair','Hands','Footwear','Clothing','Accessory','Identifying Detail'],
 'Café Staff Character Sheet':['Full Body Front','Full Body Side','Full Body Back','Full Body 3/4','Eyes','Upper Face','Lower Face','Hair','Skin','Clothing','Badge']
};
export function sheetComponents(p:CharacterSheetProject){return p.preset==='Custom'?p.detailOptions:presetComponents[p.preset];}
export function labelFor(c:string,p:CharacterSheetProject){const names:Record<string,string>={'Full Body Front':'FRONT','Full Body Side':'SIDE','Full Body Back':'BACK','Full Body 3/4':'3/4 VIEW','Mouth':'LIPS / MOUTH','Hair':'HAIR DETAIL','Skin':'SKIN DETAIL','Clothing':p.preset==='Café Staff Character Sheet'?'UNIFORM DETAIL':'CLOTHING DETAIL','Badge':'STAFF IDENTIFIER (IF SUPPLIED)'};return names[c]??c.toUpperCase();}
