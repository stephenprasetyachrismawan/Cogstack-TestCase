window.PanelRegistry = window.PanelRegistry || {}; window.PanelRegistry.annotate={
init(){
 const t=document.getElementById('annText'); const presets=document.getElementById('annPresets');
 presets.innerHTML=window.APP_DATA.syntheticSamples.map(s=>`<button class="preset-chip">${window.Utils.escapeHtml(s.slice(0,40))}...</button>`).join('');
 [...presets.children].forEach((c,i)=>c.onclick=()=>t.value=window.APP_DATA.syntheticSamples[i]);
 if(!t.value) t.value=window.APP_DATA.syntheticSamples[0];
 document.getElementById('annRun').onclick=async()=>{
   const res=await window.API.process(t.value);
   document.getElementById('annRaw').textContent=window.Utils.safeStringify(res);
   if(res.status<200||res.status>=300){ document.getElementById('annInline').innerHTML=`<span class="tag err">Request failed</span>`; return; }
   const ents=window.Utils.extractEntities(res.data);
   const inline=renderInline(t.value,ents); document.getElementById('annInline').innerHTML=inline;
   document.getElementById('annTable').innerHTML=ents.length?ents.map(e=>`<tr><td>${window.Utils.escapeHtml(e.text)}</td><td>${window.Utils.escapeHtml(e.name)}</td><td>${e.cui}</td><td>${e.type}</td><td>${e.confidence||'-'}</td><td>${e.start}-${e.end}</td></tr>`).join(''):'<tr><td colspan="6">No entities detected.</td></tr>';
   window.Store.markDone('annotate');
 };
 function renderInline(text,ents){
  if(!ents.length) return window.Utils.escapeHtml(text);
  const sorted=[...ents].sort((a,b)=>a.start-b.start); let out='',i=0;
  sorted.forEach(e=>{ out += window.Utils.escapeHtml(text.slice(i,e.start)); const seg=text.slice(e.start,e.end)||e.text; out += `<span class="entity" data-tip="${window.Utils.escapeHtml((e.name||'Entity')+' | '+(e.cui||''))}">${window.Utils.escapeHtml(seg)}</span>`; i=e.end; });
  out += window.Utils.escapeHtml(text.slice(i)); return out;
 }
}
};