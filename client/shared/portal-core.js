/* ============================================================
   portal-core.js - FLS Client Portal - Shared Core v1.0
   Portal landing page: hero, nav cards, project timeline.
   Requires: FLS_CONFIG loaded before this script.
   Password tier: PASS_SITE
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

  /* ── CSS ── */
  const _css = document.createElement('style');
  _css.textContent = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--yellow:#fec422;--dark:#111110;--ink:#1a1a18;--mid:#5c5c58;
  --serif:'Cormorant Garamond',Georgia,serif;--sans:'IBM Plex Sans',system-ui,sans-serif}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--dark);color:#fff;overflow-x:hidden;
  padding-top:64px;padding-bottom:56px}
a{text-decoration:none;color:inherit}
img{display:block;max-width:100%}
.fl-nav{position:fixed;top:0;left:0;right:0;z-index:1000;height:64px;
  background:rgba(26,26,24,0.96);backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;
  justify-content:space-between;padding:0 3rem}
.fl-nav-logo{text-decoration:none;display:flex;align-items:center}
.fl-nav-logo span{font-family:var(--serif);font-size:20px;font-weight:400;
  letter-spacing:0.06em;color:#fff;line-height:1}
.fl-nav-logo span em{font-style:normal;color:var(--yellow)}
.fl-nav-links{display:flex;gap:2.5rem;list-style:none;align-items:center}
.fl-nav-links a{font-size:11px;font-weight:500;text-transform:uppercase;
  letter-spacing:0.14em;color:rgba(255,255,255,0.65);transition:color 0.2s}
.fl-nav-links a:hover{color:#fff}
.hero{position:relative;height:70vh;min-height:480px;display:flex;
  align-items:flex-end;justify-content:center;overflow:hidden}
.hero-bg{position:absolute;inset:0;background-size:cover;background-position:center 40%}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,
  rgba(17,17,16,0.95) 0%,rgba(17,17,16,0.5) 45%,rgba(17,17,16,0.2) 100%)}
.hero-content{position:relative;z-index:2;text-align:center;padding:0 2rem 4rem;max-width:800px}
.hero-badge{display:inline-block;font-size:0.6rem;font-weight:600;text-transform:uppercase;
  letter-spacing:0.2em;color:var(--yellow);border:1px solid rgba(254,196,34,0.3);
  padding:0.35rem 1rem;margin-bottom:1.5rem}
.hero-title{font-family:var(--serif);font-size:clamp(36px,5vw,56px);font-weight:300;
  line-height:1.1;color:#fff;margin-bottom:0.75rem}
.hero-sub{font-size:0.85rem;font-weight:300;color:rgba(255,255,255,0.5);letter-spacing:0.04em}
.portal-intro{max-width:720px;margin:0 auto;padding:4rem 2rem 2rem;text-align:center}
.portal-intro h2{font-family:var(--serif);font-size:clamp(28px,3.5vw,40px);font-weight:300;
  color:#fff;margin-bottom:1rem}
.portal-intro p{font-size:0.9rem;font-weight:300;line-height:1.7;
  color:rgba(255,255,255,0.5);max-width:560px;margin:0 auto}
.cards-section{max-width:960px;margin:0 auto;padding:2rem 2rem 4rem}
.cards-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem;
  max-width:640px;margin:0 auto}
.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
  padding:2rem 1.5rem;text-align:center;transition:border-color 0.2s,background 0.2s,transform 0.2s;
  display:flex;flex-direction:column;align-items:center;gap:0.75rem}
.card:hover{border-color:rgba(254,196,34,0.3);background:rgba(255,255,255,0.06);transform:translateY(-2px)}
.card-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:var(--yellow)}
.card-icon svg{width:28px;height:28px;stroke:currentColor;fill:none;stroke-width:1.5;
  stroke-linecap:round;stroke-linejoin:round}
.card-title{font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#fff}
.card-desc{font-size:0.78rem;font-weight:300;line-height:1.5;color:rgba(255,255,255,0.45)}
.card-locked{opacity:0.5}.card-locked:hover{border-color:rgba(255,255,255,0.08);
  background:rgba(255,255,255,0.04);transform:none}
.card-locked .card-title{color:rgba(255,255,255,0.5)}
.lock-label{font-size:0.55rem;font-weight:500;text-transform:uppercase;letter-spacing:0.12em;
  color:rgba(255,255,255,0.35);background:rgba(255,255,255,0.06);padding:0.2rem 0.6rem}
.timeline-section{border-top:1px solid rgba(255,255,255,0.06);padding:4rem 0 5rem}
.timeline-header{text-align:center;max-width:720px;margin:0 auto 3rem;padding:0 2rem}
.timeline-header h2{font-family:var(--serif);font-size:clamp(28px,3.5vw,40px);font-weight:300;
  color:#fff;margin-bottom:0.5rem}
.timeline-header p{font-size:0.82rem;font-weight:300;color:rgba(255,255,255,0.4)}
.tl-controls{display:flex;align-items:center;justify-content:center;gap:0.75rem;margin-bottom:2rem}
.tl-zoom-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
  color:rgba(255,255,255,0.6);font-family:var(--sans);font-size:0.75rem;font-weight:500;
  padding:0.4rem 0.9rem;cursor:pointer;transition:background 0.2s,color 0.2s}
.tl-zoom-btn:hover{background:rgba(255,255,255,0.12);color:#fff}
.tl-zoom-label{font-family:var(--sans);font-size:0.65rem;text-transform:uppercase;
  letter-spacing:0.12em;color:rgba(255,255,255,0.3);min-width:3rem;text-align:center}
.tl-hint{font-family:var(--sans);font-size:0.6rem;color:rgba(255,255,255,0.2);
  text-transform:uppercase;letter-spacing:0.1em}
.tl-refresh{background:none;border:none;cursor:pointer;padding:0.3rem;
  color:rgba(255,255,255,0.12);transition:color 0.3s;line-height:1}
.tl-refresh:hover{color:rgba(255,255,255,0.45)}
.tl-refresh svg{width:11px;height:11px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}
.tl-scroll{overflow-x:auto;overflow-y:visible;cursor:grab;user-select:none}
.tl-scroll:active{cursor:grabbing}
.tl-scroll::-webkit-scrollbar{height:4px}
.tl-scroll::-webkit-scrollbar-track{background:rgba(255,255,255,0.04)}
.tl-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px}
.tl-svg-wrap{display:block;min-height:580px;position:relative}
#tlSvg{min-height:580px}
.tl-loading{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  font-family:var(--sans);font-size:0.7rem;font-weight:300;text-transform:uppercase;
  letter-spacing:0.12em;color:rgba(255,255,255,0.25)}
.contact-strip{border-top:1px solid rgba(255,255,255,0.06);text-align:center;
  padding:4rem 2rem;max-width:720px;margin:0 auto}
.contact-strip h3{font-family:var(--serif);font-size:1.6rem;font-weight:300;color:#fff;margin-bottom:0.75rem}
.contact-strip p{font-size:0.85rem;font-weight:300;color:rgba(255,255,255,0.45);line-height:1.7}
.contact-strip a{color:var(--yellow);border-bottom:1px solid rgba(254,196,34,0.3);transition:border-color 0.2s}
.contact-strip a:hover{border-color:var(--yellow)}
.portal-footer{border-top:1px solid rgba(255,255,255,0.06);padding:2rem;text-align:center}
.portal-footer p{font-size:0.6rem;font-weight:300;color:rgba(255,255,255,0.2);letter-spacing:0.08em}
.portal-nav{position:fixed;bottom:0;left:0;right:0;z-index:999;
  background:rgba(17,17,16,0.97);backdrop-filter:blur(12px);
  border-top:1px solid rgba(255,255,255,0.07);display:flex;justify-content:center;
  align-items:stretch;height:56px}
.portal-nav-item{display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:0.2rem;padding:0 1.75rem;text-decoration:none;font-family:var(--sans);font-size:0.6rem;
  font-weight:500;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.35);
  transition:color 0.2s;border-top:2px solid transparent;white-space:nowrap}
.portal-nav-item svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.5}
.portal-nav-item:hover{color:rgba(255,255,255,0.7)}
.portal-nav-item.active{color:var(--yellow);border-top-color:var(--yellow)}
.gate-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}
.gate-box{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);
  padding:3rem 2.5rem;max-width:420px;width:100%;text-align:center}
.gate-label{font-family:var(--serif);font-size:1.6rem;font-weight:300;color:#fff;margin-bottom:0.5rem}
.gate-sub{font-size:0.78rem;color:rgba(255,255,255,0.45);letter-spacing:0.08em;margin-bottom:2rem}
.gate-input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);
  color:#fff;font-family:var(--sans);font-size:0.9rem;font-weight:300;padding:0.75rem 1rem;
  letter-spacing:0.08em;outline:none;margin-bottom:1rem;transition:border-color 0.2s}
.gate-input:focus{border-color:rgba(254,196,34,0.5)}
.gate-btn{width:100%;background:var(--yellow);color:var(--ink);font-family:var(--sans);
  font-weight:500;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;
  padding:0.75rem 1.5rem;border:none;cursor:pointer;transition:background 0.2s}
.gate-btn:hover{background:#e8b31e}
.gate-error{color:#e05c5c;font-size:0.75rem;letter-spacing:0.06em;margin-top:0.5rem;display:none}
@media(max-width:768px){
  .fl-nav{padding:0 1.5rem}.fl-nav-links{display:none}
  .cards-grid{grid-template-columns:1fr}
  .hero{height:50vh;min-height:360px}.hero-content{padding:0 1.5rem 3rem}
  .portal-nav-item{padding:0 0.85rem;font-size:0.52rem}
}`;
  document.head.appendChild(_css);

  /* ── AUTH ── */
  function isAuth() { return sessionStorage.getItem(C.SESS_SITE) === C.PASS_SITE; }

  function renderGate() {
    document.body.innerHTML = `
<nav class="fl-nav">
  <a class="fl-nav-logo" href="https://fine-linestudio.com/"><span>FINE LINE <em>|</em> STUDIO</span></a>
</nav>
<div class="gate-wrap"><div class="gate-box">
  <div class="gate-label">${C.PROJECT_NAME}</div>
  <div class="gate-sub">Enter your portal password to continue</div>
  <form id="gateForm">
    <input class="gate-input" id="gateInput" type="password" placeholder="Password" autocomplete="current-password" />
    <button class="gate-btn" type="submit">Enter Portal</button>
    <div class="gate-error" id="gateError">Incorrect password. Please try again.</div>
  </form>
</div></div>`;
    document.getElementById('gateForm').addEventListener('submit', function (e) {
      e.preventDefault();
      if (document.getElementById('gateInput').value === C.PASS_SITE) {
        sessionStorage.setItem(C.SESS_SITE, C.PASS_SITE);
        renderPage();
      } else {
        document.getElementById('gateError').style.display = 'block';
      }
    });
  }

  /* ── PAGE RENDER ── */
  function renderPage() {
    document.title = C.PROJECT_NAME + ' | Fine Line Studio';
    document.body.innerHTML = `
<nav class="fl-nav">
  <a class="fl-nav-logo" href="https://fine-linestudio.com/"><span>FINE LINE <em>|</em> STUDIO</span></a>
  <ul class="fl-nav-links">
    <li><a href="https://fine-linestudio.com/portfolio/">Portfolio</a></li>
    <li><a href="https://fine-linestudio.com/services/">Services</a></li>
    <li><a href="https://fine-linestudio.com/about/">About</a></li>
    <li><a href="https://fine-linestudio.com/contact/">Contact</a></li>
  </ul>
</nav>
<section class="hero">
  <div class="hero-bg" id="heroBg"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-badge">Project No. ${C.PROJECT_NUMBER}</div>
    <h1 class="hero-title">${C.PROJECT_NAME}</h1>
    <p class="hero-sub">${C.PROJECT_LOCATION} - Your Project Portal</p>
  </div>
</section>
<div class="portal-intro">
  <h2>Welcome to Your Project Portal</h2>
  <p>This is your central hub for the ${C.PROJECT_NAME} project. Access project documents, review the phase timeline, and connect with our team directly from this page.</p>
</div>
<div class="cards-section">
  <div class="cards-grid">
    <a href="${PG.documents}" class="card">
      <div class="card-icon"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
      <div class="card-title">Drawings &amp; Documents</div>
      <div class="card-desc">Presentations, drawings, and design documents</div>
    </a>
    <a href="#project-schedule" class="card">
      <div class="card-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
      <div class="card-title">Phase Timeline</div>
      <div class="card-desc">View the full project schedule and milestones</div>
    </a>
    <a href="${PG.contracts}" class="card card-locked">
      <div class="card-icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
      <div class="card-title">Contract Documents</div>
      <div class="card-desc">Fee proposal, agreements, and understanding</div>
      <div class="lock-label">Password Required</div>
    </a>
    <a href="${PG.contacts}" class="card">
      <div class="card-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
      <div class="card-title">Project Contacts</div>
      <div class="card-desc">Project team directory</div>
    </a>
    <a href="${PG.ca}" class="card" style="grid-column:1/-1;">
      <div class="card-icon"><svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg></div>
      <div class="card-title">Construction Administration</div>
      <div class="card-desc">Site observations, progress photos, RFI log, and submittal tracking</div>
    </a>
  </div>
</div>
<section class="timeline-section" id="project-schedule">
  <div class="timeline-header">
    <h2>Project Schedule</h2>
    <p>Key milestones for the ${C.PROJECT_NAME} project</p>
  </div>
  <div class="tl-controls">
    <button class="tl-zoom-btn" id="tlZoomOut">&#8722;</button>
    <span class="tl-zoom-label" id="tlZoomLabel">100%</span>
    <button class="tl-zoom-btn" id="tlZoomIn">&#43;</button>
    <span class="tl-hint">&#8592; scroll to explore &#8594;</span>
    <button class="tl-refresh" id="tlRefreshBtn" title="Refresh timeline">
      <svg viewBox="0 0 12 12"><path d="M10.5 6A4.5 4.5 0 1 1 9 2.5"/><polyline points="9 1 9 3.5 6.5 3.5"/></svg>
    </button>
  </div>
  <div class="tl-scroll" id="tlScroll">
    <div class="tl-svg-wrap" id="tlWrap">
      <div class="tl-loading" id="tlLoading">Loading schedule...</div>
      <svg id="tlSvg" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
  </div>
</section>
<div class="contact-strip">
  <h3>Questions?</h3>
  <p>Reach out to Mark Wagner at <a href="mailto:info@fine-linestudio.com">info@fine-linestudio.com</a><br>
  Mark Wagner, AIA, NCARB - Principal Architect</p>
</div>
<footer class="portal-footer"><p>&copy; 2026 Fine Line Studio. All rights reserved.</p></footer>
<nav class="portal-nav">
  <a href="${PG.portal}" class="portal-nav-item active">
    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    Phase Timeline
  </a>
  <a href="${PG.contacts}" class="portal-nav-item">
    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    Project Contacts
  </a>
  <a href="${PG.documents}" class="portal-nav-item">
    <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    Drawings &amp; Documents
  </a>
  <a href="${PG.contracts}" class="portal-nav-item">
    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    Contract Documents
  </a>
</nav>`;
    if (C.HERO_IMAGE_URL) {
      document.getElementById('heroBg').style.backgroundImage = "url('" + C.HERO_IMAGE_URL + "')";
    }
    initTimeline();
  }

  /* ── TIMELINE ── */
  const LINE_Y = 280, SVG_H = 580, PAD = 80, DOT_R = 5;
  let _milestones = [], _zoomIdx = 3;
  const ZOOM_STEPS = [0.4, 0.6, 0.8, 1.0, 1.3, 1.7, 2.2];

  function tlZoom(dir) {
    _zoomIdx = Math.max(0, Math.min(ZOOM_STEPS.length - 1, _zoomIdx + dir));
    document.getElementById('tlZoomLabel').textContent = Math.round(ZOOM_STEPS[_zoomIdx] * 100) + '%';
    renderSVG(_milestones);
  }

  function renderSVG(data) {
    const svg = document.getElementById('tlSvg');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (!data.length) return;
    const dated = data.filter(m => m.date && !m.today);
    if (!dated.length) return;
    const minMs = Math.min(...dated.map(m => m.date.getTime()));
    const maxMs = Math.max(...dated.map(m => m.date.getTime()));
    const spanDays = (maxMs - minMs) / 86400000;
    const containerW = document.getElementById('tlScroll').clientWidth || window.innerWidth;
    const zl = ZOOM_STEPS[_zoomIdx];
    const basePx = Math.max(1.2, (containerW - PAD * 2) / spanDays);
    const pxDay = basePx * zl;
    const W = PAD * 2 + Math.ceil(spanDays * pxDay);
    svg.setAttribute('width', W); svg.setAttribute('height', SVG_H);
    document.getElementById('tlWrap').style.width = W + 'px';
    const NS = 'http://www.w3.org/2000/svg';
    function e(tag, attrs, txt) {
      const el = document.createElementNS(NS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
      if (txt !== undefined) el.textContent = txt;
      return el;
    }
    svg.appendChild(e('line', {x1:PAD/2,y1:LINE_Y,x2:W-PAD/2,y2:LINE_Y,stroke:'#3a3a38','stroke-width':'2'}));
    let cursor = new Date(new Date(minMs).getFullYear(), new Date(minMs).getMonth(), 1), lastYX = -999;
    while (cursor.getTime() <= maxMs) {
      const x = PAD + (cursor.getTime() - minMs) / 86400000 * pxDay;
      svg.appendChild(e('line', {x1:x,y1:LINE_Y+8,x2:x,y2:LINE_Y+14,stroke:'rgba(255,255,255,0.12)','stroke-width':'1'}));
      svg.appendChild(e('text', {'font-family':"'IBM Plex Sans',sans-serif",'font-size':'9','text-anchor':'middle',fill:'rgba(255,255,255,0.22)',x,y:LINE_Y+27}, cursor.toLocaleDateString('en-US',{month:'short'})));
      if (cursor.getMonth() === 0 || x - lastYX > 120) {
        svg.appendChild(e('text', {'font-family':"'IBM Plex Sans',sans-serif",'font-size':'10','font-weight':'500','text-anchor':'middle',fill:'rgba(255,255,255,0.45)',x,y:LINE_Y+42}, cursor.getFullYear()));
        lastYX = x;
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }
    const today = new Date(); today.setHours(0,0,0,0);
    const positioned = data.map(m => {
      const t = m.today ? today.getTime() : m.date.getTime();
      return Object.assign({}, m, {x: PAD + Math.max(0, Math.min((t - minMs) / 86400000 * pxDay, W - PAD))});
    });
    const lfs = zl < 0.7 ? '9' : '11', cW = zl < 0.7 ? 5.0 : 5.8;
    const LANES = [{dir:-1,tick:140},{dir:1,tick:140},{dir:-1,tick:90},{dir:1,tick:90},{dir:-1,tick:50},{dir:1,tick:50},{dir:-1,tick:20},{dir:1,tick:20}];
    const MG = 72 * zl;
    let llX = [PAD-MG*2,PAD-MG*2,PAD-MG*2,PAD-MG*2], lr = 0;
    positioned.forEach(m => {
      let ch = -1;
      for (let i = 0; i < 4; i++) { const c = (lr+i)%4; if (m.x-llX[c] >= MG) { ch = c; break; } }
      if (ch === -1) { let b=0,bg=-Infinity; for (let k=0;k<4;k++){const g=m.x-llX[k];if(g>bg){bg=g;b=k;}} ch=b; }
      m.lane = ch; llX[ch] = m.x + Math.min(m.label.length*cW+20,200)/2; lr=(ch+1)%4;
    });
    positioned.forEach(m => {
      const x=m.x, lane=LANES[m.lane], dir=lane.dir, te=LINE_Y+dir*lane.tick, icon=m.icon;
      const connColor=icon===1?'#fec422':icon===3?'#fec422':'rgba(255,255,255,0.15)';
      svg.appendChild(e('line',{x1:x,y1:LINE_Y+(dir*DOT_R),x2:x,y2:te,stroke:connColor,'stroke-width':'1.5','stroke-dasharray':icon===2?'3,3':'none'}));
      if (icon===3){const s=7;svg.appendChild(e('polygon',{points:`${x},${LINE_Y-s} ${x+s},${LINE_Y} ${x},${LINE_Y+s} ${x-s},${LINE_Y}`,fill:'#fec422'}));}
      else if(icon===1){svg.appendChild(e('circle',{cx:x,cy:LINE_Y,r:DOT_R,fill:'#111110',stroke:'#fec422','stroke-width':'2'}));}
      else{svg.appendChild(e('circle',{cx:x,cy:LINE_Y,r:DOT_R,fill:'rgba(255,255,255,0.08)',stroke:'rgba(255,255,255,0.25)','stroke-width':'1.5'}));}
      const dateFill=icon===2?'rgba(255,255,255,0.22)':'#fec422';
      const shortDate=m.date?m.date.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'';
      if(shortDate)svg.appendChild(e('text',{'font-family':"'IBM Plex Sans',sans-serif",'font-size':'9','font-weight':'500','text-anchor':'middle',fill:dateFill,x,y:te+dir*12},shortDate));
      const lby=te+dir*26;
      if(icon===3){const bW=Math.min(m.label.length*cW+20,200),bH=22,bX=x-bW/2,bY=dir<0?lby-bH:lby;
        svg.appendChild(e('rect',{x:bX,y:bY,width:bW,height:bH,fill:'#fec422',rx:'2'}));
        svg.appendChild(e('text',{'font-family':"'IBM Plex Sans',sans-serif",'font-size':lfs,'font-weight':'700','text-anchor':'middle',fill:'#111110',x,y:bY+bH/2+4},m.label.length>28?m.label.substring(0,28)+'...':m.label));
      } else if(icon===1){const bW=Math.min(m.label.length*cW+20,200),bH=22,bX=x-bW/2,bY=dir<0?lby-bH:lby;
        svg.appendChild(e('rect',{x:bX,y:bY,width:bW,height:bH,fill:'rgba(254,196,34,0.08)',stroke:'#fec422','stroke-width':'1',rx:'2'}));
        svg.appendChild(e('text',{'font-family':"'IBM Plex Sans',sans-serif",'font-size':lfs,'font-weight':'600','text-anchor':'middle',fill:'#fec422',x,y:bY+bH/2+4},m.label.length>28?m.label.substring(0,28)+'...':m.label));
      } else {
        const words=m.label.split(' '),maxLW=Math.max(80,95*zl),lines2=[];let cur2='';
        words.forEach(w=>{const t=cur2?cur2+' '+w:w;if(t.length*(parseFloat(lfs)/1.9)>maxLW&&cur2){lines2.push(cur2);cur2=w;}else{cur2=t;}});
        if(cur2)lines2.push(cur2);
        const lh=13,sy=dir<0?lby-(lines2.length*lh)+lh:lby;
        lines2.forEach((ln,li)=>svg.appendChild(e('text',{'font-family':"'IBM Plex Sans',sans-serif",'font-size':lfs,'font-weight':'300','text-anchor':'middle',fill:'rgba(255,255,255,0.45)',x,y:sy+li*lh},ln)));
      }
    });
  }

  function parseLine(line) {
    const parts = []; let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; }
      else if (line[i] === ',' && !inQ) { parts.push(cur.trim()); cur = ''; }
      else { cur += line[i]; }
    }
    parts.push(cur.trim().replace(/\r/g, ''));
    return parts;
  }

  function loadTimeline() {
    fetch(C.URL_TIMELINE + '&t=' + Date.now())
      .then(r => r.text())
      .then(text => {
        _milestones = text.trim().split('\n').slice(1).map(line => {
          const p = parseLine(line);
          const label = (p[1] || '').trim();
          if (!label) return null;
          const iconVal = parseInt((p[2] || '2').trim()) || 2;
          const date = new Date((p[0] || '').trim().replace(/\r/g, ''));
          if (isNaN(date.getTime())) return null;
          return { label, date, today: false, icon: iconVal };
        }).filter(Boolean);
        renderSVG(_milestones);
        const ldr = document.getElementById('tlLoading');
        if (ldr) ldr.style.display = 'none';
      })
      .catch(() => { setTimeout(loadTimeline, 3000); });
  }

  function initTimeline() {
    const sc = document.getElementById('tlScroll');
    if (sc) {
      let down = false, startX, sl;
      sc.addEventListener('mousedown', e => { down=true; startX=e.pageX-sc.offsetLeft; sl=sc.scrollLeft; sc.style.cursor='grabbing'; });
      window.addEventListener('mouseup', () => { down=false; if(sc) sc.style.cursor='grab'; });
      sc.addEventListener('mousemove', e => { if(!down) return; e.preventDefault(); sc.scrollLeft=sl-(e.pageX-sc.offsetLeft-startX); });
      sc.addEventListener('wheel', e => { e.preventDefault(); sc.scrollLeft+=e.deltaY*1.5; }, {passive:false});
    }
    document.getElementById('tlZoomOut').addEventListener('click', () => tlZoom(-1));
    document.getElementById('tlZoomIn').addEventListener('click', () => tlZoom(1));
    document.getElementById('tlRefreshBtn').addEventListener('click', loadTimeline);
    window.addEventListener('resize', () => { if (_milestones.length) renderSVG(_milestones); });
    loadTimeline();
  }

  /* ── INIT ── */
  if (!C.PASS_SITE || isAuth()) { renderPage(); } else { renderGate(); }

})();