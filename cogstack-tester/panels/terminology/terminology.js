window.PanelRegistry=window.PanelRegistry||{};
window.PanelRegistry.terminology={
  init(){
    const t=document.getElementById('termLines');
    if(!t.value)t.value='hypertension\nmetformin\nasthma';
    document.getElementById('termRun').onclick=async()=>{
      const terms=t.value.split(/\n+/).map(x=>x.trim()).filter(Boolean);
      const rows=[]; let hit=0;
      for(const term of terms){
        const sent=`Synthetic test sentence includes ${term} in assessment.`;
        const r=await window.API.process(sent);
        const ents=window.Utils.extractEntities(r.data);
        const ok=ents.some(e=>(e.text||'').toLowerCase().includes(term.toLowerCase())||(e.name||'').toLowerCase().includes(term.toLowerCase()));
        if(ok) hit++;
        rows.push(`<tr><td>${term}</td><td><span class="tag ${ok?'ok':'err'}">${ok?'yes':'no'}</span></td><td>${ok?'recognized':'gap'}</td></tr>`);
      }
      document.getElementById('termBody').innerHTML=rows.join('');
      document.getElementById('termMetrics').innerHTML=`<span class="metric"><div class="label">coverage</div><div class="value">${hit}/${terms.length} (${window.Utils.pct(hit,terms.length)})</div></span>`;
      window.Store.markDone('terminology');
    };
  }
};
