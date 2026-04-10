window.PanelRegistry=window.PanelRegistry||{}; window.PanelRegistry.negative={init(){
 const p=document.getElementById('negPreset'); p.innerHTML=Object.keys(window.APP_DATA.negativePayloads).map(k=>`<option>${k}</option>`).join('');
 const b=document.getElementById('negBody'); b.value=window.APP_DATA.negativePayloads.empty;
 p.onchange=()=>b.value=window.APP_DATA.negativePayloads[p.value];
 document.querySelectorAll('[data-rate]').forEach(x=>x.onclick=()=>document.getElementById('negRate').textContent=`rated: ${x.dataset.rate}`);
 document.getElementById('negSend').onclick=async()=>{
  const endpoint=document.getElementById('negEndpoint').value; const method=document.getElementById('negMethod').value; const r=await window.API.callRaw(endpoint,method,b.value);
  const badge=document.getElementById('negHttp'); badge.className=`tag http-badge ${window.Utils.badgeClass(r.status)}`; badge.textContent=`HTTP ${r.status||0}`;
  document.getElementById('negRaw').textContent=window.Utils.safeStringify(r.data); window.Store.markDone('negative');
 };
}};