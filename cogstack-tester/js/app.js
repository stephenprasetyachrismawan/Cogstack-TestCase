(function(){
  const loadedScripts = new Set();
  const main = document.getElementById('mainContent');
  const nav = document.getElementById('sidebarNav');
  const apiInput = document.getElementById('apiBase');
  const pingBtn = document.getElementById('pingBtn');
  const statusDot = document.getElementById('statusDot');
  const statusLabel = document.getElementById('statusLabel');
  const progressPill = document.getElementById('progressPill');

  function panelCount(){ return window.APP_DATA.panels.reduce((a,g)=>a+g.items.length,0); }
  function updateProgress(){
    const done = Object.values(window.Store.get().progress).filter(Boolean).length;
    progressPill.textContent = `Progress ${done}/${panelCount()} (${window.Utils.pct(done,panelCount())})`;
  }
  window.Store.subscribe(updateProgress);

  function renderNav(){
    nav.innerHTML = window.APP_DATA.panels.map(g=>`<div class="sidebar-group"><h4>${g.group}</h4>${g.items.map(i=>`<button class="nav-item" data-panel="${i}">${i}</button>`).join('')}</div>`).join('');
    nav.addEventListener('click', (e)=>{
      const btn = e.target.closest('.nav-item'); if(!btn) return;
      location.hash = `#${btn.dataset.panel}`;
    });
  }

  async function loadPanel(id){
    [...document.querySelectorAll('.nav-item')].forEach(n=>n.classList.toggle('active', n.dataset.panel===id));
    try {
      const htmlRes = await fetch(`./panels/${id}/${id}.html`);
      if(!htmlRes.ok) throw new Error(`Panel HTML missing for ${id}`);
      main.innerHTML = await htmlRes.text();
      const jsPath = `./panels/${id}/${id}.js`;
      if(!loadedScripts.has(jsPath)){
        await new Promise((resolve,reject)=>{
          const s=document.createElement('script'); s.src=jsPath; s.onload=resolve; s.onerror=()=>reject(new Error(`Panel JS missing for ${id}`)); document.body.appendChild(s);
        });
        loadedScripts.add(jsPath);
      }
      if(window.PanelRegistry?.[id]?.init) window.PanelRegistry[id].init();
    } catch (err) {
      main.innerHTML = `<div class="card"><h3>Panel load error</h3><p>${window.Utils.escapeHtml(err.message)}</p></div>`;
    }
  }

  function syncHash(){
    const id = (location.hash||'#annotate').slice(1);
    loadPanel(id);
  }

  async function ping(){
    const res = await window.API.ping();
    const ok = res.status >= 200 && res.status < 300;
    statusDot.className = `status-dot ${ok ? 'ok':'err'}`;
    statusLabel.textContent = ok ? `online (${window.Utils.formatMs(res.ms)})` : `offline (${res.status||'network'})`;
  }

  pingBtn.addEventListener('click', ping);
  apiInput.value = window.Store.get().apiBase;
  apiInput.addEventListener('input', window.Utils.debounce((e)=>window.Store.setApiBase(e.target.value.trim()||'http://localhost:5000'), 500));
  window.addEventListener('hashchange', syncHash);
  window.PanelRegistry = window.PanelRegistry || {};
  renderNav();
  updateProgress();
  syncHash();
})();
