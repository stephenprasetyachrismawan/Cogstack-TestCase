window.PanelRegistry=window.PanelRegistry||{}; window.PanelRegistry.latency={init(){
 document.getElementById('latRun').onclick=async()=>{
  const c=+document.getElementById('latCount').value||1; const m=document.getElementById('latMode').value; const sz=document.getElementById('latSize').value;
  const txt=window.APP_DATA.latencyTexts[sz]; const times=[]; const logs=[];
  async function runSingle(){ for(let i=0;i<c;i++){ const r=await window.API.process(txt); times.push(r.ms); logs.push(`single#${i+1} ${r.status} ${window.Utils.formatMs(r.ms)}`);} }
  async function runBulk(){ for(let i=0;i<c;i++){ const r=await window.API.processBulk([txt,txt]); times.push(r.ms); logs.push(`bulk#${i+1} ${r.status} ${window.Utils.formatMs(r.ms)}`);} }
  if(m==='single') await runSingle(); else if(m==='bulk') await runBulk(); else { await runSingle(); await runBulk(); }
  const max=Math.max(...times,1), min=Math.min(...times), avg=times.reduce((a,b)=>a+b,0)/times.length;
  document.getElementById('latAvg').textContent=window.Utils.formatMs(avg); document.getElementById('latMin').textContent=window.Utils.formatMs(min); document.getElementById('latMax').textContent=window.Utils.formatMs(max);
  document.getElementById('latBars').innerHTML=times.map((t,i)=>`<div><div class="bar" style="height:${Math.round(t/max*84)+4}px"></div><div class="bar-label">${i+1}</div></div>`).join('');
  document.getElementById('latLog').textContent=logs.join('\n'); window.Store.markDone('latency');
 };
}};