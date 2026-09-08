import {useEffect,useState} from 'react';
interface InstallEvent extends Event {prompt():Promise<void>;userChoice:Promise<{outcome:string}>;}
export function Install(){
 const [offer,setOffer]=useState<InstallEvent>();const [update,setUpdate]=useState<ServiceWorker>();const [message,setMessage]=useState('On Android: open this site in Chrome, then ⋮ → Add to Home screen → Install.');const [installed,setInstalled]=useState(matchMedia('(display-mode: standalone)').matches);
 useEffect(()=>{
  const install=(event:Event)=>{event.preventDefault();setOffer(event as InstallEvent);};const done=()=>{setInstalled(true);setOffer(undefined);};
  window.addEventListener('beforeinstallprompt',install);window.addEventListener('appinstalled',done);
  let active=true;
  if('serviceWorker' in navigator)void navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{
   if(reg.waiting&&active)setUpdate(reg.waiting);
   reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(active&&worker.state==='installed'&&navigator.serviceWorker.controller)setUpdate(reg.waiting||worker);});});
   void reg.update().catch(()=>{});
  }).catch(()=>setMessage('Offline setup could not finish. Stay online and reopen the app to retry.'));
  return()=>{active=false;window.removeEventListener('beforeinstallprompt',install);window.removeEventListener('appinstalled',done);};
 },[]);
 return <section className="install-bar">{!installed&&<><p>{message}</p>{offer&&<button onClick={()=>void offer.prompt().then(()=>offer.userChoice).then(result=>{if(result.outcome==='accepted')setOffer(undefined);}).catch(()=>setMessage('Use Chrome’s menu to install this app.'))}>Install app</button>}</>}{update&&<><p>A new build is ready. Save your draft before updating.</p><button onClick={()=>{navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});update.postMessage('ACTIVATE_UPDATE');}}>Update app</button></>}</section>;
}
