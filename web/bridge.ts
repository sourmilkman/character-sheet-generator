import { App } from '@modelcontextprotocol/ext-apps';
import { type CharacterSheetProject } from '../shared/model';
import { buildSpecification } from '../shared/characterSheetPromptBuilder';
import { validateProject } from '../shared/references';
export interface OpenAIHost {theme?:'dark'|'light';uploadFile?:(file:File)=>Promise<{fileId:string}>;setWidgetState?:(state:{modelContent:unknown;privateContent:unknown;imageIds:string[]})=>void;sendFollowUpMessage?:(args:{prompt:string;scrollToBottom?:boolean})=>Promise<void>;requestDisplayMode?:(args:{mode:'fullscreen'})=>Promise<unknown>;}
declare global {interface Window {openai?:OpenAIHost;}}
let bridge:App|undefined;
export async function connectHost(onStatus:(message:string)=>void){if(window.parent===window)return;const app=new App({name:'Character Sheet Generator',version:'1.0.0'},{});app.ontoolresult=()=>onStatus('Connected to ChatGPT. Your current edits are preserved.');app.onhostcontextchanged=context=>{if(context.theme)document.documentElement.dataset.theme=context.theme;};try{await app.connect();bridge=app;const theme=app.getHostContext()?.theme;if(theme)document.documentElement.dataset.theme=theme;onStatus('Connected to host.');}catch{onStatus('Host connection unavailable. Copy-prompt and export remain available.');}}
export interface GenerationProvider {prepareGeneration(p:CharacterSheetProject):ReturnType<typeof buildSpecification>;}
export class ChatGPTConversationProvider implements GenerationProvider {
 private uploaded=new Map<string,string>();
 prepareGeneration(p:CharacterSheetProject){const {errors}=validateProject(p);if(errors.length)throw Error(errors.join(' '));return buildSpecification(p);}
 async send(p:CharacterSheetProject,assets:Map<string,Blob>){const specification=this.prepareGeneration(p);const host=window.openai;
 if(!host?.uploadFile||!host.setWidgetState||(!bridge&&!host.sendFollowUpMessage))return {sent:false,message:'Manual handoff: export the selected photographs, attach them in a new ChatGPT conversation, then paste the copied prompt and ask ChatGPT to create the sheet.'};
 const imageIds:string[]=[];
 for(const ref of specification.identityReferences){const blob=assets.get(ref.id);if(!blob)throw Error(`Missing photograph: ${ref.filename}. Re-add it before generation.`);const key=p.references.find(r=>r.id===ref.id)!.hash;let fileId=this.uploaded.get(key);if(!fileId){const result=await host.uploadFile(new File([blob],ref.filename,{type:blob.type}));if(!result.fileId)throw Error('ChatGPT did not return an uploaded image ID.');fileId=result.fileId;this.uploaded.set(key,fileId);}imageIds.push(fileId);}
 if(bridge){const result=await bridge.callServerTool({name:'prepare_character_sheet',arguments:{project:p}});if(result.isError)throw Error('The MCP server could not prepare this project. Your photos remain available for retry.');}
 host.setWidgetState({modelContent:{...specification,request:'Create this sheet using only the selected imageIds. If image generation is unavailable, explain that limitation.'},privateContent:{projectId:p.id},imageIds});
 const prompt=`Create the character sheet now using ONLY the ${imageIds.length} selected subject photographs provided through this widget. Ignore any other conversation images. If these photographs are unavailable, ask me to attach them; do not generate from text alone.\n\n${specification.prompt}`;
 if(bridge){const result=await bridge.sendMessage({role:'user',content:[{type:'text',text:prompt}]});if(result.isError)throw Error('ChatGPT rejected the follow-up message. Retry or use manual handoff.');}else await host.sendFollowUpMessage!({prompt,scrollToBottom:true});
 return {sent:true,message:'Request sent to ChatGPT with selected image IDs. Check the conversation for generation or any further instructions.'};
 }
}
