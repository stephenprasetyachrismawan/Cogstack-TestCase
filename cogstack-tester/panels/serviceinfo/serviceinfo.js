window.PanelRegistry=window.PanelRegistry||{}; window.PanelRegistry.serviceinfo={init(){
 const notes=document.getElementById('svcNotes'); notes.value=window.Store.get().notes.serviceinfo||''; notes.oninput=()=>window.Store.setNote('serviceinfo',notes.value);
 document.getElementById('svcLoad').onclick=async()=>{ const r=await window.API.info();
   document.getElementById('svcStatus').textContent=r.status; document.getElementById('svcMs').textContent=window.Utils.formatMs(r.ms);
   document.getElementById('svcKeys').textContent=typeof r.data==='object'?Object.keys(r.data).length:'n/a'; document.getElementById('svcRaw').textContent=window.Utils.safeStringify(r.data);
   if(r.status>=200&&r.status<300) window.Store.markDone('serviceinfo');
 };
}};