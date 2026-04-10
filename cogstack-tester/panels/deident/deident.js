window.PanelRegistry=window.PanelRegistry||{};
window.PanelRegistry.deident={
  init(){
    const t=document.getElementById('deiText');
    const p=document.getElementById('deiPresets');
    p.innerHTML=window.APP_DATA.deidentSamples.map((_,i)=>`<button class="preset-chip">sample ${i+1}</button>`).join('');
    [...p.children].forEach((c,i)=>c.onclick=()=>t.value=window.APP_DATA.deidentSamples[i]);
    if(!t.value)t.value=window.APP_DATA.deidentSamples[0];

    document.getElementById('deiRun').onclick=()=>{
      const mode=document.getElementById('deiMode').value;
      const src=t.value;
      let out=src;
      const patterns=[
        ['NAME',/\b([A-Z][a-z]+\s[A-Z][a-z]+)\b/g],
        ['AGE',/\bage\s\d+\b/gi],
        ['PHONE',/\b\d{3}-\d{3}-\d{4}\b/g],
        ['ADDR',/\b\d+\s+[A-Za-z]+\s(?:Street|Ave)\b/g],
        ['RECORD',/\bRN-\d+\b/g]
      ];
      const finds=[];
      patterns.forEach(([k,r])=>{
        src.match(r)?.forEach(v=>finds.push([k,v]));
        out=out.replace(r,(m)=>mode==='redact'?`[${k}]`:mode==='replace'?`<${k}>`:`<mark>${m}</mark>`);
      });
      document.getElementById('deiOrig').textContent=src;
      document.getElementById('deiMasked').innerHTML=window.Utils.escapeHtml(out).replace(/&lt;mark&gt;(.*?)&lt;\/mark&gt;/g,'<mark>$1</mark>');
      document.getElementById('deiFind').innerHTML=finds.map(f=>`<tr><td>${f[0]}</td><td>${window.Utils.escapeHtml(f[1])}</td></tr>`).join('')||'<tr><td colspan="2">No PII detected.</td></tr>';
      window.Store.markDone('deident');
    };
  }
};
