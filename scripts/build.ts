import { build } from 'esbuild';
import { mkdir,readFile,writeFile,copyFile } from 'node:fs/promises';
import { zlibSync } from 'fflate';
import { execFileSync } from 'node:child_process';
await mkdir('dist',{recursive:true});
let commit='uncommitted';try{commit=execFileSync('git',['rev-parse','--short','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{/* Initial build before first commit. */}
const buildId=`1.1.0 · ${commit} · ${new Date().toISOString().slice(0,16).replace('T',' ')} UTC`;
await build({entryPoints:['web/main.tsx'],bundle:true,format:'iife',outfile:'dist/widget.js',minify:true,define:{__BUILD__:JSON.stringify(buildId),__PWA__:'false'}});
const js=await readFile('dist/widget.js','utf8');const css=await readFile('dist/widget.css','utf8');
const html=`<!doctype html><html lang="en" data-theme="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="dark light"><title>Character Sheet Generator</title><style>${css}</style></head><body><div id="root"></div><script>${js.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
await writeFile('dist/index.html',html);await writeFile('dist/build.json',JSON.stringify({buildId,commit}));console.log(`Built ${buildId}`);
await mkdir('dist/pwa',{recursive:true});
await build({entryPoints:['web/main.tsx'],bundle:true,format:'iife',outfile:'dist/pwa/app.js',minify:true,define:{__BUILD__:JSON.stringify(buildId),__PWA__:'true'}});
const pwaJs=await readFile('dist/pwa/app.js','utf8');const pwaCss=await readFile('dist/pwa/app.css','utf8');
await writeFile('dist/pwa/index.html',`<!doctype html><html lang="en" data-theme="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#101212"><link rel="manifest" href="./manifest.webmanifest"><link rel="icon" href="./icon-192.png"><link rel="apple-touch-icon" href="./icon-192.png"><title>Character Sheet Generator</title><style>${pwaCss}</style></head><body><div id="root"></div><script>${pwaJs.replace(/<\/script/gi,'<\\/script')}</script></body></html>`);
await copyFile('public/manifest.webmanifest','dist/pwa/manifest.webmanifest');
await writeFile('dist/pwa/sw.js',(await readFile('public/sw.js','utf8')).replace('__REVISION__',`${commit}-${Date.now()}`));
await writeFile('dist/pwa/build.json',JSON.stringify({buildId,commit}));await writeFile('dist/pwa/.nojekyll','');
// Dependency-free PNG app icon: a mint reference-panel grid within the maskable safe area.
function png(size:number){
 const raw=new Uint8Array(size*(size*4+1));
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const inset=x>size*.24&&x<size*.76&&y>size*.24&&y<size*.76;const gx=(x-size*.24)%(size*.18);const gy=(y-size*.24)%(size*.18);const mint=inset&&gx<size*.13&&gy<size*.13;const offset=y*(size*4+1)+1+x*4;raw.set(mint?[188,223,207,255]:[16,18,18,255],offset);}
 function chunk(name:string,data:Uint8Array){const type=Buffer.from(name);const payload=Buffer.concat([type,data]);let crc=0xffffffff;for(const b of payload){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}const head=Buffer.alloc(4);head.writeUInt32BE(data.length);const tail=Buffer.alloc(4);tail.writeUInt32BE((crc^0xffffffff)>>>0);return Buffer.concat([head,payload,tail]);}
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlibSync(raw)),chunk('IEND',new Uint8Array())]);
}
for(const size of [192,512])await writeFile(`dist/pwa/icon-${size}.png`,png(size));
