import { build } from 'esbuild';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
await mkdir('dist',{recursive:true});
let commit='uncommitted';try{commit=execFileSync('git',['rev-parse','--short','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{/* Initial build before first commit. */}
const buildId=`1.0.0 · ${commit} · ${new Date().toISOString().slice(0,16).replace('T',' ')} UTC`;
await build({entryPoints:['web/main.tsx'],bundle:true,format:'iife',outfile:'dist/widget.js',minify:true,define:{__BUILD__:JSON.stringify(buildId)}});
const js=await readFile('dist/widget.js','utf8');const css=await readFile('dist/widget.css','utf8');
const html=`<!doctype html><html lang="en" data-theme="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="dark light"><title>Character Sheet Generator</title><style>${css}</style></head><body><div id="root"></div><script>${js.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
await writeFile('dist/index.html',html);await writeFile('dist/build.json',JSON.stringify({buildId,commit}));console.log(`Built ${buildId}`);
