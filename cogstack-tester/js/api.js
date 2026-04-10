window.API = (() => {
  async function request(endpoint, method='GET', body, rawBody=false) {
    const start = performance.now();
    let status = 0;
    try {
      const base = window.Store.get().apiBase;
      const res = await fetch(`${base}${endpoint}`, {
        method,
        headers: rawBody ? {'Content-Type':'application/json'} : {'Content-Type':'application/json'},
        body: method === 'GET' ? undefined : (rawBody ? body : JSON.stringify(body))
      });
      status = res.status;
      const txt = await res.text();
      let data;
      try { data = JSON.parse(txt); } catch { data = txt; }
      return { status, data, ms: performance.now() - start };
    } catch (err) {
      return { status: status || 0, data: { error: err.message || 'Network failure' }, ms: performance.now() - start };
    }
  }
  return {
    ping: ()=>request('/api/info','GET'),
    info: ()=>request('/api/info','GET'),
    process: (text)=>request('/api/process','POST',{content:[{text}]}),
    processBulk: (texts)=>request('/api/process_bulk','POST',{content:texts.map((text)=>({text}))}),
    processRaw: (payload)=>request('/api/process','POST',payload,true),
    callRaw: (endpoint, method, body)=>request(endpoint, method, body, true)
  };
})();
