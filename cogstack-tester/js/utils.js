window.Utils = {
  debounce(fn, wait=400){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait);};},
  escapeHtml(s=''){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); },
  formatMs(ms){ return `${Math.round(ms||0)} ms`; },
  safeStringify(v){ try{return JSON.stringify(v,null,2);}catch{return String(v);} },
  badgeClass(status){ if(status>=200&&status<300)return 'ok'; if(status>=400)return 'err'; return 'warn'; },
  extractEntities(data){
    const doc = data?.results?.[0] || data?.content?.[0] || data?.[0] || {};
    const ents = doc.entities || doc.annotations || doc.ents || [];
    if (Array.isArray(ents)) return ents.map((e,i)=>({ id:e.id||i, start:e.start||e.begin||0, end:e.end||e.finish||0, text:e.text||'', cui:e.cui||e.conceptId||'', type:e.type||e.tui||'', name:e.pretty_name||e.name||'', confidence:e.acc||e.confidence||'' }));
    return Object.values(ents).map((e,i)=>({ id:e.id||i, start:e.start||0, end:e.end||0, text:e.source_value||e.str||'', cui:e.cui||'', type:e.type_ids?.[0]||'', name:e.pretty_name||'', confidence:e.acc||'' }));
  },
  pct(n,d){ if(!d)return '0%'; return `${Math.round((n/d)*100)}%`; }
};
