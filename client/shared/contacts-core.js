/* ============================================================
   contacts-core.js - FLS Client Portal - Shared Core v1.2
   Project contacts: D3 relationship map + card directory.
   Requires: FLS_CONFIG + D3 v7 loaded before this script.
   Colors: driven entirely by 'Code' column in sheet.
           No hardcoded category fallbacks. Gray (#555550) if unset.
   ============================================================ */
(function () {
  'use strict';
  const C = FLS_CONFIG;
  const S = C.CLIENT_SLUG;
  const PG = {
    portal:    S + '-portal.html',
    contacts:  S + '-contacts.html',
    documents: S + '-documents.html',
    contracts: S + '-contracts.html',
    ca:        S + '-ca.html',
  };

  const _css = document.createElement('style');
  _css.textContent = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--yellow:#fec422;--brown:#7d6b57;--ink:#1a1a18;--dark:#111110;--cream:#f7f5f1;--rule:#3a3a38;--mid:#9a9890;--serif:'Cormorant Garamond',Georgia,serif;--sans:'IBM Plex Sans',system-ui,sans-serif}html{scroll-behavior:smooth}body{font-family:var(--sans);background:var(--dark);color:#fff;min-height:100vh;padding-bottom:56px}a{text-decoration:none;color:inherit}img{display:block;max-width:100%}.fl-nav{position:fixed;top:0;left:0;right:0;z-index:1000;height:64px;background:rgba(26,26,24,0.96);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;padding:0 3rem}.fl-nav-logo span{font-family:var(--serif);font-size:20px;font-weight:400;letter-spacing:0.06em;color:#fff;line-height:1}.fl-nav-logo span em{font-style:normal;color:var(--yellow)}.sync-dot{width:7px;height:7px;border-radius:50%;background:#555;transition:background 0.3s;flex-shrink:0}.sync-dot.synced{background:#4caf50}.sync-dot.syncing{background:var(--yellow);animation:blink 1s infinite}.sync-dot.error{background:#e74c3c}@keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}.sync-label{font-family:var(--sans);font-size:0.58rem;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.28);white-space:nowrap}.page-header{background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.07);padding:5.5rem 3rem 2rem}.page-eyebrow{font-size:0.62rem;font-weight:500;text-transform:uppercase;letter-spacing:0.25em;color:var(--yellow);margin-bottom:0.75rem;display:flex;align-items:center;gap:0.75rem}.page-eyebrow::before{content:'';display:block;width:24px;height:1px;background:var(--yellow);opacity:0.6}.page-title{font-family:var(--serif);font-size:clamp(2rem,4vw,3rem);font-weight:300;color:#fff;line-height:1.1}.page-subtitle{font-size:0.8rem;font-weight:300;color:rgba(255,255,255,0.35);margin-top:0.5rem}.view-toggle-bar{background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.06);padding:0 3rem;display:flex;align-items:center}.view-btn{background:none;border:none;cursor:pointer;font-family:var(--sans);font-size:0.65rem;font-weight:500;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.3);padding:0.85rem 1.25rem 0.85rem 0;border-bottom:2px solid transparent;transition:color 0.2s,border-color 0.2s;display:flex;align-items:center;gap:0.5rem;margin-right:1.5rem}.view-btn:hover{color:rgba(255,255,255,0.6)}.view-btn.active{color:var(--yellow);border-bottom-color:var(--yellow)}.view-btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.5}#mm-canvas{position:relative;width:100%;height:640px;overflow:hidden;background:#0E0E0D}#mm-svg{display:block;width:100%;height:100%;cursor:grab}#mm-svg:active{cursor:grabbing}#mm-loader{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--sans);font-size:0.8rem;color:rgba(255,255,255,0.3);letter-spacing:0.1em;z-index:20;background:#0E0E0D;transition:opacity 0.4s}#mm-legend{position:absolute;bottom:12px;left:14px;display:flex;flex-wrap:wrap;gap:5px 14px;pointer-events:none;z-index:5}.mm-li{display:flex;align-items:center;gap:4px;font-family:var(--sans);font-size:0.62rem;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.35)}.mm-ld{width:7px;height:7px;border-radius:50%;flex-shrink:0}#mm-hint{position:absolute;top:12px;left:50%;transform:translateX(-50%);font-family:var(--sans);font-size:0.62rem;color:rgba(255,255,255,0.2);pointer-events:none;white-space:nowrap;letter-spacing:0.06em;z-index:5}#mm-panel{position:absolute;top:0;right:-355px;width:345px;height:100%;background:#1a1a18;border-left:1px solid rgba(255,255,255,0.1);overflow-y:auto;overflow-x:hidden;transition:right 0.3s ease;z-index:10}#mm-panel.open{right:0}.mp-photo-wrap{position:relative;height:160px;background:rgba(255,255,255,0.05);overflow:hidden}.mp-photo-wrap img{width:100%;height:100%;object-fit:cover;object-position:center 20%;display:block}.mp-photo-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center}.mp-photo-ph svg{width:48px;height:48px;color:rgba(255,255,255,0.12)}.mp-role-badge{position:absolute;bottom:0.75rem;left:0.75rem;background:rgba(17,17,16,0.88);color:rgba(255,255,255,0.65);font-size:0.58rem;font-weight:500;text-transform:uppercase;letter-spacing:0.14em;padding:0.3rem 0.65rem;backdrop-filter:blur(6px)}.mp-close{position:absolute;top:0.75rem;right:0.75rem;background:rgba(17,17,16,0.8);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;backdrop-filter:blur(6px);z-index:5}.mp-close:hover{color:#fff;border-color:rgba(255,255,255,0.35)}.mp-header{padding:1rem 1.25rem 0}.mp-firm-name{font-family:var(--serif);font-size:1.15rem;font-weight:400;color:#fff;line-height:1.2;margin-bottom:0.15rem}.mp-firm-org{font-size:0.62rem;font-weight:500;color:var(--yellow);text-transform:uppercase;letter-spacing:0.1em;opacity:0.8}.mp-count{font-size:0.58rem;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.22);margin-top:0.35rem}.mp-divider{border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0.85rem 1.25rem 0}.mp-persons{padding:0 1.25rem 1.25rem}.mp-person{padding:0.85rem 0;border-bottom:1px solid rgba(255,255,255,0.07)}.mp-person:last-child{border-bottom:none;padding-bottom:0}.mp-person-name{font-family:var(--serif);font-size:1.05rem;font-weight:400;color:#fff;line-height:1.2;margin-bottom:0.15rem}.mp-person-title{font-size:0.65rem;font-weight:300;color:rgba(255,255,255,0.38);margin-bottom:0.6rem}.mp-field{display:flex;align-items:flex-start;gap:0.6rem;margin-bottom:0.4rem;min-width:0}.mp-fi{flex-shrink:0;margin-top:1px;color:var(--yellow);opacity:0.5}.mp-field-text{font-size:0.75rem;font-weight:300;color:rgba(255,255,255,0.5);line-height:1.5;overflow-wrap:break-word;word-break:break-all;min-width:0;flex:1}.mp-copy{cursor:pointer}.filter-bar{background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.06);padding:0 3rem;display:flex;align-items:center;gap:1.5rem;overflow-x:auto}.filter-btn{background:none;border:none;cursor:pointer;font-family:var(--sans);font-size:0.65rem;font-weight:500;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.3);padding:0.85rem 0;border-bottom:2px solid transparent;transition:color 0.2s,border-color 0.2s;white-space:nowrap}.filter-btn:hover{color:rgba(255,255,255,0.6)}.filter-btn.active{color:var(--yellow);border-bottom-color:var(--yellow)}.search-wrap{background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.05);padding:1rem 3rem}.search-input{width:100%;max-width:420px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fff;font-family:var(--sans);font-size:0.8rem;font-weight:300;padding:0.6rem 1rem;outline:none;transition:border-color 0.2s}.search-input::placeholder{color:rgba(255,255,255,0.25)}.search-input:focus{border-color:var(--yellow)}.contacts-wrap{padding:2.5rem 3rem;max-width:1400px;margin:0 auto}.contacts-count{font-size:0.65rem;font-weight:500;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.3);margin-bottom:1.5rem}.contacts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem}.contact-card{background:#1c1c1a;border:1px solid rgba(255,255,255,0.08);overflow:hidden;transition:box-shadow 0.2s,border-color 0.2s,transform 0.2s;animation:fadeUp 0.4s ease both}.contact-card:hover{box-shadow:0 8px 32px rgba(0,0,0,0.4);border-color:rgba(254,196,34,0.2);transform:translateY(-2px)}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.card-photo-wrap{position:relative;height:200px;background:rgba(255,255,255,0.05);overflow:hidden}.card-photo-wrap img{width:100%;height:100%;object-fit:cover;object-position:center 25%}.card-photo-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.04)}.card-photo-placeholder svg{width:64px;height:64px;color:rgba(255,255,255,0.15)}.card-role-badge{position:absolute;bottom:0.75rem;left:0.75rem;background:rgba(17,17,16,0.85);color:rgba(255,255,255,0.7);font-size:0.58rem;font-weight:500;text-transform:uppercase;letter-spacing:0.14em;padding:0.3rem 0.65rem;backdrop-filter:blur(6px)}.card-body{padding:1.25rem 1.25rem 1rem}.card-name{font-family:var(--serif);font-size:1.3rem;font-weight:400;color:#fff;line-height:1.15;margin-bottom:0.2rem}.card-position{font-size:0.72rem;font-weight:500;color:var(--yellow);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.15rem;opacity:0.8}.card-org{font-size:0.75rem;font-weight:300;color:rgba(255,255,255,0.4);margin-bottom:1rem}.card-divider{border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 1rem}.card-fields{display:flex;flex-direction:column;gap:0.55rem}.card-field{display:flex;align-items:flex-start;gap:0.65rem}.fi{flex-shrink:0;margin-top:1px;width:14px;height:14px;color:var(--yellow);opacity:0.5}.field-text{font-size:0.78rem;font-weight:300;color:rgba(255,255,255,0.5);line-height:1.55}.field-text a{color:rgba(255,255,255,0.5);border-bottom:1px solid transparent;transition:color 0.15s,border-color 0.15s}.field-text a:hover{color:var(--yellow);border-bottom-color:rgba(254,196,34,0.3)}.empty-state{grid-column:1/-1;text-align:center;padding:4rem 2rem;color:rgba(255,255,255,0.3)}.empty-state p{font-size:0.85rem;font-weight:300}.portal-nav{position:fixed;bottom:0;left:0;right:0;z-index:999;background:rgba(17,17,16,0.97);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,0.07);display:flex;justify-content:center;align-items:stretch;height:56px}.portal-nav-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.2rem;padding:0 1.25rem;text-decoration:none;font-family:var(--sans);font-size:0.55rem;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);transition:color 0.2s;border-top:2px solid transparent;white-space:nowrap}.portal-nav-item svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.5}.portal-nav-item:hover{color:rgba(255,255,255,0.7)}.portal-nav-item.active{color:var(--yellow);border-top-color:var(--yellow)}.toast{position:fixed;bottom:5rem;left:50%;transform:translateX(-50%) translateY(80px);background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);color:#fff;font-size:0.75rem;padding:0.6rem 1.25rem;z-index:900;transition:transform 0.3s,opacity 0.3s;opacity:0;white-space:nowrap;border:1px solid rgba(255,255,255,0.1);pointer-events:none}.toast.show{transform:translateX(-50%) translateY(0);opacity:1}.gate-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}.gate-box{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);padding:3rem 2.5rem;max-width:420px;width:100%;text-align:center}.gate-label{font-family:var(--serif);font-size:1.6rem;font-weight:300;color:#fff;margin-bottom:0.5rem}.gate-sub{font-size:0.78rem;color:rgba(255,255,255,0.45);letter-spacing:0.08em;margin-bottom:2rem}.gate-input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;font-family:var(--sans);font-size:0.9rem;font-weight:300;padding:0.75rem 1rem;letter-spacing:0.08em;outline:none;margin-bottom:1rem;transition:border-color 0.2s}.gate-input:focus{border-color:rgba(254,196,34,0.5)}.gate-btn{width:100%;background:var(--yellow);color:var(--ink);font-family:var(--sans);font-weight:500;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.75rem 1.5rem;border:none;cursor:pointer;transition:background 0.2s}.gate-btn:hover{background:#e8b31e}.gate-error{color:#e05c5c;font-size:0.75rem;letter-spacing:0.06em;margin-top:0.5rem;display:none}@media(max-width:640px){.page-header{padding:5.5rem 1.5rem 2rem}.contacts-wrap{padding:1.5rem}.filter-bar,.view-toggle-bar{padding:0 1.5rem}.search-wrap{padding:1rem 1.5rem}.portal-nav-item{padding:0 0.85rem;font-size:0.52rem}}`;
  document.head.appendChild(_css);

  function isAuth() { return sessionStorage.getItem(C.SESS_SITE) === C.PASS_SITE; }

  function renderGate() {
    document.body.innerHTML = `<nav class="fl-nav"><a class="fl-nav-logo" href="https://fine-linestudio.com/"><span>FINE LINE <em>|</em> STUDIO</span></a></nav><div class="gate-wrap"><div class="gate-box"><div class="gate-label">${C.PROJECT_NAME}</div><div class="gate-sub">Enter your portal password to continue</div><form id="gateForm"><input class="gate-input" id="gateInput" type="password" placeholder="Password" autocomplete="current-password"/><button class="gate-btn" type="submit">Enter Portal</button><div class="gate-error" id="gateError">Incorrect password. Please try again.</div></form></div></div>`;
    document.getElementById('gateForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (document.getElementById('gateInput').value === C.PASS_SITE) { sessionStorage.setItem(C.SESS_SITE, C.PASS_SITE); renderPage(); }
      else { document.getElementById('gateError').style.display = 'block'; }
    });
  }

  function renderPage() {
    document.title = 'Project Contacts | Fine Line Studio';
    document.body.innerHTML = `<nav class="fl-nav"><a class="fl-nav-logo" href="https://fine-linestudio.com/"><span>FINE LINE <em>|</em> STUDIO</span></a></nav><header class="page-header"><div class="page-eyebrow">Project Directory</div><h1 class="page-title">Project Contacts</h1><p class="page-subtitle">${C.PROJECT_NAME} - ${C.PROJECT_LOCATION}</p></header><div class="view-toggle-bar"><button class="view-btn active" id="btnMap"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>Relationship Map</button><button class="view-btn" id="btnDir"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="3" rx="1"/><rect x="3" y="10.5" width="18" height="3" rx="1"/><rect x="3" y="17" width="18" height="3" rx="1"/></svg>Directory</button><div style="margin-left:auto;display:flex;align-items:center;gap:0.5rem;padding-right:0.25rem;"><div class="sync-dot" id="syncDot"></div><span class="sync-label" id="syncLabel"></span></div></div><div id="mapView"><div id="mm-canvas"><div id="mm-loader">Loading project contacts&hellip;</div><svg id="mm-svg"></svg><div id="mm-panel"><div class="mp-photo-wrap" id="mp-photo-wrap"><div class="mp-photo-ph" id="mp-photo-ph"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></div><div class="mp-role-badge" id="mp-role-badge"></div><button class="mp-close" id="mpClose">&times;</button></div><div class="mp-header"><div class="mp-firm-name" id="mp-firm-name"></div><div class="mp-firm-org" id="mp-firm-org"></div></div><hr class="mp-divider"><div class="mp-persons" id="mp-persons"></div></div><div id="mm-legend"></div><div id="mm-hint">scroll to zoom &middot; tap node for contacts</div></div></div><div id="dirView" style="display:none"><div class="filter-bar"><button class="filter-btn active" data-filter="all">All</button><button class="filter-btn" data-filter="Owner">Owner</button><button class="filter-btn" data-filter="Architecture">Architecture</button><button class="filter-btn" data-filter="Engineering">Engineering</button><button class="filter-btn" data-filter="Contractor">Contractor</button><button class="filter-btn" data-filter="Consultant">Consultant</button><button class="filter-btn" data-filter="Other">Other</button></div><div class="search-wrap"><input class="search-input" id="searchInput" type="text" placeholder="Search by name, organization, or role..."></div><div class="contacts-wrap"><div class="contacts-count" id="contactsCount"></div><div class="contacts-grid" id="contactsGrid"></div></div></div><div class="toast" id="toast"></div>`;
    wireUI(); load();
    window.FLS_buildPortalNav&&window.FLS_buildPortalNav();
  }

  let contacts = [], rawRows = [], activeFilter = 'all', mmBuilt = false;

  function parseCSVLine(line) {
    const fields = []; let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQ && line[i+1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
      else if (ch === ',' && !inQ) { fields.push(cur); cur = ''; }
      else cur += ch;
    }
    fields.push(cur); return fields;
  }

  function parseCSV(text) {
    const lines = text.trim().replace(/\r/g, '').split('\n');
    if (lines.length < 2) return [];
    const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/\s+/g, ''));
    return lines.slice(1).map(line => {
      const vals = parseCSVLine(line); const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
      return obj;
    }).filter(r => r.name || r.firstname || r.firm || r.org);
  }

  function csvRowToContact(row, idx) {
    const firstName = row.firstname || (row.name || '').split(' ')[0] || '';
    const lastName  = row.lastname  || (row.name || '').split(' ').slice(1).join(' ') || '';
    const role      = row.role || row.organization || 'Other';
    const org       = row.org  || row.firm || '';
    const position  = row.position || row.title || '';
    return { id:'csv-'+idx, firstName, lastName, role, org, position,
      phone:row.phone||'', email:row.email||'', address:row.address||'',
      photoUrl: row['contactimage']||row['contact image']||row['photourl']||row['photo']||row['image']||'' };
  }

  function syncDot(state) {
    document.getElementById('syncDot').className = 'sync-dot ' + state;
    const labels = {synced:'Up to date',syncing:'Syncing\u2026',error:'Sync error'};
    document.getElementById('syncLabel').textContent = labels[state] || '';
  }

  async function load() {
    syncDot('syncing');
    try {
      const res = await fetch(C.URL_CONTACTS + '&t=' + Date.now());
      const text = await res.text();
      rawRows = parseCSV(text);
      contacts = rawRows.map((row, i) => csvRowToContact(row, i));
      syncDot('synced'); renderCards(); buildMindMap(rawRows);
    } catch (e) {
      syncDot('error'); renderEmpty('Could not load contacts.');
      document.getElementById('mm-loader').textContent = 'Could not load contacts.';
    }
  }

  function esc(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function isHex(s) { return /^#[0-9a-fA-F]{3,8}$/.test((s||'').trim()); }
  function icoPhone(){return`<svg class="fi" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8a15.3 15.3 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.2c1.2.5 2.6.8 4 .8a1 1 0 011 1V17a1 1 0 01-1 1C10.1 18 5 12.9 5 6.6a1 1 0 011-1H8a1 1 0 011 1c0 1.4.3 2.8.8 4a1 1 0 01-.2 1.1L6.6 10.8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;}
  function icoEmail(){return`<svg class="fi" width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 9l9 6 9-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;}
  function icoPin(){return`<svg class="fi" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.7 2 6 4.7 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.3-2.7-6-6-6z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/></svg>`;}

  function buildCard(c, i) {
    const name = esc(c.firstName + ' ' + c.lastName);
    const ph = c.phone ? `<div class="card-field">${icoPhone()}<span class="field-text"><a href="tel:${esc(c.phone.replace(/\D/g,''))}">${esc(c.phone)}</a></span></div>` : '';
    const em = c.email ? `<div class="card-field">${icoEmail()}<span class="field-text">${esc(c.email)}</span></div>` : '';
    const ad = c.address ? `<div class="card-field">${icoPin()}<span class="field-text">${esc(c.address)}</span></div>` : '';
    const photo = c.photoUrl ? `<img src="${esc(c.photoUrl)}" alt="${name}" onerror="this.style.display='none'">` : '';
    return `<div class="contact-card" style="animation-delay:${Math.min(i*0.05,0.4)}s"><div class="card-photo-wrap">${photo}<div class="card-photo-placeholder"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div><div class="card-role-badge">${esc(c.role)}</div></div><div class="card-body"><div class="card-name">${name}</div>${c.position?`<div class="card-position">${esc(c.position)}</div>`:''}${c.org?`<div class="card-org">${esc(c.org)}</div>`:''}<hr class="card-divider"><div class="card-fields">${ph}${em}${ad}</div></div></div>`;
  }

  function renderCards() {
    const q = ((document.getElementById('searchInput')||{}).value||'').toLowerCase().trim();
    let list = activeFilter === 'all' ? contacts : contacts.filter(c => c.role === activeFilter);
    if (q) list = list.filter(c => [c.firstName,c.lastName,c.org,c.position,c.role].join(' ').toLowerCase().includes(q));
    const cc = document.getElementById('contactsCount');
    if (cc) cc.textContent = list.length === 1 ? '1 contact' : list.length + ' contacts';
    if (!list.length) { renderEmpty('No contacts match your filter.'); return; }
    const grid = document.getElementById('contactsGrid');
    if (grid) grid.innerHTML = list.map((c,i) => buildCard(c,i)).join('');
  }

  function renderEmpty(msg) {
    const grid = document.getElementById('contactsGrid');
    if (grid) grid.innerHTML = `<div class="empty-state"><p>${esc(msg)}</p></div>`;
    const cc = document.getElementById('contactsCount'); if (cc) cc.textContent = '0 contacts';
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function makeSVGIcon(type) {
    const svg = document.createElementNS(SVG_NS,'svg'); svg.setAttribute('width','14'); svg.setAttribute('height','14'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none'); svg.classList.add('mp-fi');
    if (type==='email'){const r=document.createElementNS(SVG_NS,'rect');r.setAttribute('x','3');r.setAttribute('y','5');r.setAttribute('width','18');r.setAttribute('height','14');r.setAttribute('rx','2');r.setAttribute('stroke','currentColor');r.setAttribute('stroke-width','1.5');const p=document.createElementNS(SVG_NS,'path');p.setAttribute('d','M3 9l9 6 9-6');p.setAttribute('stroke','currentColor');p.setAttribute('stroke-width','1.5');p.setAttribute('stroke-linecap','round');svg.appendChild(r);svg.appendChild(p);}
    else{const paths={phone:'M6.6 10.8a15.3 15.3 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.2c1.2.5 2.6.8 4 .8a1 1 0 011 1V17a1 1 0 01-1 1C10.1 18 5 12.9 5 6.6a1 1 0 011-1H8a1 1 0 011 1c0 1.4.3 2.8.8 4a1 1 0 01-.2 1.1L6.6 10.8z',pin:'M12 2C8.7 2 6 4.7 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.3-2.7-6-6-6z'};
    const pa=document.createElementNS(SVG_NS,'path');pa.setAttribute('d',paths[type]);pa.setAttribute('stroke','currentColor');pa.setAttribute('stroke-width','1.5');if(type==='phone')pa.setAttribute('stroke-linecap','round');svg.appendChild(pa);
    if(type==='pin'){const ci=document.createElementNS(SVG_NS,'circle');ci.setAttribute('cx','12');ci.setAttribute('cy','8');ci.setAttribute('r','2');ci.setAttribute('stroke','currentColor');ci.setAttribute('stroke-width','1.5');svg.appendChild(ci);}}
    return svg;
  }
  function makeField(type, value) {
    const div = document.createElement('div'); div.className = 'mp-field'; div.appendChild(makeSVGIcon(type));
    const span = document.createElement('span'); span.className = 'mp-field-text'; span.textContent = value; div.appendChild(span);
    if (type==='phone'){div.classList.add('mp-copy');div.style.cursor='pointer';div.addEventListener('click',e=>{e.stopPropagation();window.location.href='tel:'+value.replace(/\D/g,'');});}
    if (type==='email'){div.classList.add('mp-copy');div.style.cursor='pointer';div.addEventListener('click',e=>{e.stopPropagation();navigator.clipboard.writeText(value).then(()=>showToast('Email copied'));});}
    return div;
  }
  function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2000); }

  function openMMPanel(firm) {
    const pw=document.getElementById('mp-photo-wrap'),ph=document.getElementById('mp-photo-ph');
    pw.querySelectorAll('img').forEach(el=>el.remove());
    const fp=(firm.people||[]).find(p=>p.img);
    if(fp&&fp.img){const img=document.createElement('img');img.src=fp.img;img.alt=fp.name||'';img.style.cssText='width:100%;height:100%;object-fit:cover;object-position:center 20%;display:block;';img.onerror=()=>{img.style.display='none';ph.style.display='flex';};ph.style.display='none';pw.insertBefore(img,pw.firstChild);}else{ph.style.display='flex';}
    document.getElementById('mp-role-badge').textContent=firm.org||'';
    document.getElementById('mp-firm-name').textContent=firm.name;
    document.getElementById('mp-firm-org').textContent=firm.org||'';
    const people=(firm.people||[]).filter(p=>p.name||p.phone||p.email);
    const hdr=document.getElementById('mp-firm-org');const ex=hdr.nextElementSibling;if(ex&&ex.classList.contains('mp-count'))ex.remove();
    if(people.length>1){const cnt=document.createElement('div');cnt.className='mp-count';cnt.textContent=people.length+' contacts - scroll to see all';hdr.insertAdjacentElement('afterend',cnt);}
    const personsEl=document.getElementById('mp-persons');personsEl.innerHTML='';
    people.forEach(p=>{const div=document.createElement('div');div.className='mp-person';const nm=document.createElement('div');nm.className='mp-person-name';nm.textContent=p.name||'Contact';div.appendChild(nm);if(p.title){const t=document.createElement('div');t.className='mp-person-title';t.textContent=p.title;div.appendChild(t);}if(p.phone)div.appendChild(makeField('phone',p.phone));if(p.email&&!p.email.startsWith('http'))div.appendChild(makeField('email',p.email));if(p.address)div.appendChild(makeField('pin',p.address));personsEl.appendChild(div);});
    document.getElementById('mm-panel').classList.add('open');
  }
  function closeMMPanel() { document.getElementById('mm-panel').classList.remove('open'); }

  function buildMindMap(rows) {
    if (mmBuilt) return; mmBuilt = true;
    const mm=rows.filter(r=>(r.organization||r.role)&&(r.firm||r.org)).map(r=>({name:r.name||(((r.firstname||'')+' '+(r.lastname||'')).trim()),org:r.organization||r.role||'',firm:r.firm||r.org||'',title:r.title||r.position||'',hierarchy:r.hierarchy||'',address:r.address||'',phone:r.phone||'',email:r.email||'',img:r['contactimage']||r['contact image']||r['photourl']||r['photo']||r['image']||'',color:r.code||r.color||r['nodecolor']||r['node color']||''}));
    const FM=new Map();
    mm.forEach(c=>{if(!FM.has(c.firm))FM.set(c.firm,{id:c.firm,name:c.firm,org:c.org,hierarchy:c.hierarchy,people:[]});FM.get(c.firm).people.push(c);});
    FM.forEach(firm=>{const pc=firm.people.find(p=>isHex(p.color));firm.nodeColor=pc?pc.color.trim():'#555550';});
    const ahjF=[...FM.values()].filter(f=>f.org==='AHJ');
    const mainF=[...FM.values()].filter(f=>f.org!=='AHJ');
    const owner=mainF.find(f=>f.org==='Owner');
    if(!owner){document.getElementById('mm-loader').textContent='';switchView('dir');return;}
    function kids(pn){return mainF.filter(f=>f.hierarchy===pn).map(f=>({...f,children:kids(f.name)}));}
    const treeData={...owner,isHub:true,children:kids(owner.name)};
    document.getElementById('mm-loader').style.opacity='0';
    setTimeout(()=>{document.getElementById('mm-loader').style.display='none';},420);
    const svgEl=document.getElementById('mm-svg');
    const W=svgEl.parentElement.clientWidth||1200,H=640,cx=Math.floor(W/2),cy=295,R=210;
    const sv=d3.select('#mm-svg').attr('viewBox',`0 0 ${W} ${H}`).attr('preserveAspectRatio','xMidYMid meet');
    sv.append('rect').attr('width','100%').attr('height','100%').attr('fill','#0E0E0D');
    const g=sv.append('g');
    const zoom=d3.zoom().scaleExtent([0.3,3.5]).on('zoom',e=>g.attr('transform',e.transform));
    sv.call(zoom);
    const hier=d3.hierarchy(treeData);
    d3.tree().size([2*Math.PI,R]).separation((a,b)=>(a.parent===b.parent?1.2:2.2)/a.depth)(hier);
    const flsN=hier.descendants().find(d=>d.data.org==='Architecture');
    if(flsN){const rot=Math.PI-flsN.x;hier.each(d=>d.x+=rot);}
    hier.each(d=>{const a=d.x-Math.PI/2;d.px=cx+d.y*Math.cos(a);d.py=cy+d.y*Math.sin(a);});
    g.append('g').selectAll('path').data(hier.links()).enter().append('path').attr('fill','none').attr('stroke','rgba(247,245,241,0.12)').attr('stroke-width',1.2).attr('d',d=>d.source.depth===0?`M${d.source.px},${d.source.py}C${(d.source.px*2+cx)/3},${(d.source.py*2+cy)/3} ${(d.target.px+cx*2)/3},${(d.target.py+cy*2)/3} ${d.target.px},${d.target.py}`:`M${d.source.px},${d.source.py}L${d.target.px},${d.target.py}`);
    const ahCx=cx+230,ahCy=cy+195,ahR=75;let ahjOpen=false;const ahjItems=[];
    ahjF.forEach((f,i)=>{const a=(i/ahjF.length)*2*Math.PI-Math.PI/2;f._x=ahCx+ahR*Math.cos(a);f._y=ahCy+ahR*Math.sin(a);
      const lk=g.append('line').attr('fill','none').attr('stroke','rgba(247,245,241,0.18)').attr('stroke-width',0.8).attr('stroke-dasharray','3 4').attr('x1',ahCx).attr('y1',ahCy).attr('x2',ahCx).attr('y2',ahCy).style('opacity',0);
      const ng=g.append('g').style('cursor','pointer').attr('transform',`translate(${ahCx},${ahCy})`).style('opacity',0).on('click',e=>{e.stopPropagation();openMMPanel(f);});
      ng.append('circle').attr('r',9).attr('fill','#383836').attr('stroke','rgba(255,255,255,.18)').attr('stroke-width',1);
      const ca=Math.cos(a),sa=Math.sin(a),lo=14,anch=ca>0.3?'start':ca<-0.3?'end':'middle';
      ng.append('text').attr('font-size','11px').attr('fill','rgba(247,245,241,0.8)').attr('dominant-baseline','central').attr('x',lo*ca).attr('y',lo*sa).attr('text-anchor',anch).text(f.name.length>17?f.name.substring(0,15)+'\u2026':f.name);
      ahjItems.push({ng,lk,f});});
    const ahG=g.append('g').style('cursor','pointer').on('click',toggleAHJ);
    if(ahjF.length>0){ahG.append('circle').attr('cx',ahCx).attr('cy',ahCy).attr('r',36).attr('fill','none').attr('stroke','rgba(255,255,255,0.05)').attr('stroke-dasharray','2 5').attr('stroke-width',1);
    ahG.append('circle').attr('cx',ahCx).attr('cy',ahCy).attr('r',22).attr('fill','#232321').attr('stroke','rgba(255,255,255,0.22)').attr('stroke-width',1);
    ahG.append('text').attr('id','ahjlbl').attr('x',ahCx).attr('y',ahCy-5).attr('text-anchor','middle').attr('dominant-baseline','central').attr('font-size','11px').attr('font-weight','500').attr('font-family','IBM Plex Sans,sans-serif').attr('fill','rgba(255,255,255,0.72)').style('pointer-events','none').text('AHJ');
    ahG.append('text').attr('id','ahjsub').attr('x',ahCx).attr('y',ahCy+9).attr('text-anchor','middle').attr('dominant-baseline','central').attr('font-size','11px').attr('font-family','IBM Plex Sans,sans-serif').attr('fill','rgba(255,255,255,0.26)').style('pointer-events','none').text(ahjF.length+' agencies');}
    function toggleAHJ(e){e.stopPropagation();ahjOpen=!ahjOpen;d3.select('#ahjlbl').text(ahjOpen?'\u00d7':'AHJ');d3.select('#ahjsub').style('opacity',ahjOpen?0:1);ahjItems.forEach(({ng,lk,f},i)=>{const dl=ahjOpen?i*45:0;ng.transition().duration(ahjOpen?440:260).delay(dl).ease(ahjOpen?d3.easeBackOut.overshoot(1.4):d3.easeCubicIn).attr('transform',ahjOpen?`translate(${f._x},${f._y})`:`translate(${ahCx},${ahCy})`).style('opacity',ahjOpen?1:0);lk.transition().duration(ahjOpen?360:230).delay(ahjOpen?dl+55:0).attr('x2',ahjOpen?f._x:ahCx).attr('y2',ahjOpen?f._y:ahCy).style('opacity',ahjOpen?.4:0);});}
    function splitLabel(n){const w=n.split(' ');if(w.length<=1||n.length<=11)return[n,null];const m=Math.ceil(w.length/2);return[w.slice(0,m).join(' '),w.slice(m).join(' ')];}
    hier.descendants().forEach(d=>{
      const isHub=d.data.isHub,isFLS=d.data.org==='Architecture';
      const r=isHub?36:isFLS?22:d.depth===1?16:d.depth===2?13:10;
      const col=d.data.nodeColor||'#555550';
      const ang=Math.atan2(d.py-cy,d.px-cx);
      const ng=g.append('g').style('cursor','pointer').attr('transform',`translate(${d.px},${d.py})`).on('click',e=>{e.stopPropagation();openMMPanel(d.data);});
      if(isHub||isFLS){ng.append('circle').attr('r',r+10).attr('fill','none').attr('stroke',col).attr('stroke-width',1).attr('opacity',isHub?.2:.28);ng.append('circle').attr('r',r+20).attr('fill','none').attr('stroke',col).attr('stroke-width',.5).attr('opacity',.07);}
      ng.append('circle').attr('r',r).attr('fill',col).attr('stroke','rgba(0,0,0,.2)').attr('stroke-width',1.5);
      if(isHub){ng.append('text').attr('text-anchor','middle').attr('dominant-baseline','central').attr('y',-6).attr('font-size','11px').attr('font-weight','500').attr('font-family','IBM Plex Sans,sans-serif').attr('fill','rgba(255,255,255,0.9)').style('pointer-events','none').text('OWNER');ng.append('text').attr('text-anchor','middle').attr('dominant-baseline','central').attr('y',9).attr('font-size','11px').attr('font-family','IBM Plex Sans,sans-serif').attr('fill','rgba(255,255,255,0.35)').style('pointer-events','none').text(S);return;}
      const ca=Math.cos(ang),sa=Math.sin(ang),lo=r+12,anch=ca>0.28?'start':ca<-0.28?'end':'middle',fsz=d.depth===1?'12px':'11px';
      const[l1,l2]=splitLabel(d.data.name);
      if(l2){ng.append('text').attr('font-size',fsz).attr('fill','rgba(247,245,241,0.8)').attr('dominant-baseline','central').attr('x',lo*ca).attr('y',lo*sa-7).attr('text-anchor',anch).text(l1);ng.append('text').attr('font-size',fsz).attr('fill','rgba(247,245,241,0.8)').attr('dominant-baseline','central').attr('x',lo*ca).attr('y',lo*sa+7).attr('text-anchor',anch).text(l2);}
      else{ng.append('text').attr('font-size',fsz).attr('fill','rgba(247,245,241,0.8)').attr('dominant-baseline','central').attr('x',lo*ca).attr('y',lo*sa).attr('text-anchor',anch).text(l1);}
      const pc=(d.data.people||[]).length;
      if(pc>1){ng.append('circle').attr('cx',r*.62).attr('cy',-r*.62).attr('r',7).attr('fill','#0E0E0D').attr('stroke',col).attr('stroke-width',1);ng.append('text').attr('x',r*.62).attr('y',-r*.62).attr('text-anchor','middle').attr('dominant-baseline','central').attr('font-size','11px').attr('font-weight','500').attr('font-family','IBM Plex Sans,sans-serif').attr('fill','rgba(255,255,255,0.78)').style('pointer-events','none').text(pc);}
    });
    const orgs=[...new Set(mainF.map(f=>f.org))];
    const lgEl=document.getElementById('mm-legend');
    lgEl.innerHTML=orgs.map(o=>{const nc=mainF.find(f=>f.org===o)?.nodeColor||'#555550';return`<div class="mm-li"><div class="mm-ld" style="background:${nc}"></div>${o}</div>`;}).join('')+(ahjF.length?`<div class="mm-li"><div class="mm-ld" style="background:#555550"></div>AHJ</div>`:'');
    sv.on('click',closeMMPanel);
  }

  function wireUI() {
    document.getElementById('btnMap').addEventListener('click', () => switchView('map'));
    document.getElementById('btnDir').addEventListener('click', () => switchView('dir'));
    document.getElementById('mpClose').addEventListener('click', closeMMPanel);
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        activeFilter = this.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        this.classList.add('active'); renderCards();
      });
    });
    const si = document.getElementById('searchInput'); if (si) si.addEventListener('input', renderCards);
  }

  function switchView(v) {
    document.getElementById('mapView').style.display = v==='map' ? 'block' : 'none';
    document.getElementById('dirView').style.display = v==='dir' ? 'block' : 'none';
    document.getElementById('btnMap').classList.toggle('active', v==='map');
    document.getElementById('btnDir').classList.toggle('active', v==='dir');
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (!C.PASS_SITE || isAuth()) { renderPage(); } else { renderGate(); }
  });

})();
