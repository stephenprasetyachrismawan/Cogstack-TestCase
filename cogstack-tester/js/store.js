window.Store = (() => {
  const state = {
    apiBase: 'http://localhost:5000',
    progress: {},
    checklist: {},
    notes: {}
  };
  const subs = [];
  const notify = () => subs.forEach((fn)=>fn(state));
  return {
    get: ()=>state,
    setApiBase(v){ state.apiBase=v; notify(); },
    markDone(panel){ state.progress[panel]=true; notify(); },
    setChecklist(key,val){ state.checklist[key]=val; notify(); },
    setNote(key,val){ state.notes[key]=val; notify(); },
    subscribe(fn){ subs.push(fn); return ()=>subs.splice(subs.indexOf(fn),1); }
  };
})();
