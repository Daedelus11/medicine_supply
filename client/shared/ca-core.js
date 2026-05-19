/* ============================================================
   ca-core.js - FLS Client Portal - Shared Core v1.0
   Construction Administration hub page.
   Requires: FLS_CONFIG loaded before this script.
   Password tier: PASS_CA (session key: SESS_CA)
   ============================================================ */
(function () {
  'use strict';
  const C = FLS_CONFIG;
  const S = C.CLIENT_SLUG;
  const PG = {
    portal:     S + '-portal.html',
    contacts:   S + '-contacts.html',
    documents:  S + '-documents.html',
    contracts:  S + '-contracts.html',
    ca:         S + '-ca.html',
    photos:     S + '-photos.html',
    reports:    S + '-reports.html',
    submittals: S + '-submittals.html',
    rfi:        S + '-rfi.html',
  };

  if (!document.querySelector('link[data-fls-fonts]')) {
    const lp1=document.createElement('link');lp1.rel='preconnect';lp1.href='https://fonts.googleapis.com';
    const lp2=document.createElement('link');lp2.rel='preconnect';lp2.href='https://fonts.gstatic.com';lp2.crossOrigin='';
    const lf=document.createElement('link');lf.rel='stylesheet';lf.setAttribute('data-fls-fonts','');
    lf.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap';
    document.head.appendChild(lp1);document.head.appendChild(lp2);document.head.appendChild(lf);
  }

  const _css = document.createElement('style');
  _css.textContent = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--yellow:#fec422;--dark:#111110;--ink:#1a1a18;--mid:#5c5c58;
  --serif:'Cormorant Garamond',Georgia,serif;--sans:'IBM Plex Sans',system-ui,sans-serif}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--dark);color:#fff;overflow-x:hidden;padding-top:64px;padding-bottom:56px}
a{text-decoration:none;color:inherit}
.fl-nav{position:fixed;top:0;left:0;right:0;z-index:1000;height:64px;background:rgba(26,26,24,0.96);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;padding:0 3rem}
.fl-nav-logo{text-decoration:none;display:flex;align-items:center}
.fl-nav-logo span{font-family:var(--serif);font-size:20px;font-weight:400;letter-spacing:0.06em;color:#fff;line-height:1}
.fl-nav-logo span em{font-style:normal;color:var(--yellow)}
.fl-nav-links{display:flex;gap:2.5rem;list-style:none;align-items:center}
.fl-nav-links a{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.65);transition:color 0.2s}
.fl-nav-links a:hover{color:#fff}
.ca-header{border-bottom:1px solid rgba(255,255,255,0.07);padding:3rem 3rem 2.5rem}
.ca-breadcrumb{font-size:0.62rem;font-weight:500;text-transform:uppercase;letter-spacing:0.18em;color:rgba(255,255,255,0.3);margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem}
.ca-breadcrumb a{color:rgba(255,255,255,0.3);transition:color 0.2s}
.ca-breadcrumb a:hover{color:var(--yellow)}
.ca-breadcrumb svg{width:10px;height:10px;stroke:currentColor;fill:none;stroke-width:2}
.ca-page-title{font-family:var(--serif);font-size:clamp(2rem,4vw,3rem);font-weight:300;color:#fff;line-height:1.1;margin-bottom:0.5rem}
.ca-page-meta{font-size:0.78rem;font-weight:300;color:rgba(255,255,255,0.35);margin-top:0.35rem}
.ca-nav-grid{max-width:900px;margin:0 auto;padding:3rem 3rem 6rem;display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
.ca-nav-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:2.5rem 2rem;display:flex;flex-direction:column;gap:1rem;transition:border-color 0.2s,background 0.2s,transform 0.2s}
.ca-nav-card:hover{border-color:rgba(254,196,34,0.3);background:rgba(255,255,255,0.06);transform:translateY(-2px)}
.ca-nav-card-icon{color:var(--yellow);width:40px;height:40px;display:flex;align-items:center;justify-content:center}
.ca-nav-card-icon svg{width:28px;height:28px;stroke:currentColor;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.ca-nav-card-title{font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#fff}
.ca-nav-card-desc{font-size:0.78rem;font-weight:300;line-height:1.55;color:rgba(255,255,255,0.4)}
.ca-nav-card-arrow{margin-top:auto;font-size:0.6rem;font-weight:500;text-transform:uppercase;letter-spacing:0.14em;color:var(--yellow);display:flex;align-items:center;gap:0.4rem}
.ca-nav-card-arrow svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}
.portal-nav{position:fixed;bottom:0;left:0;right:0;z-index:999;background:rgba(17,17,16,0.97);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,0.07);display:flex;justify-content:center;align-items:stretch;height:56px}
.portal-nav-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.2rem;padding:0 1.25rem;text-decoration:none;font-family:var(--sans);font-size:0.55rem;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);transition:color 0.2s;border-top:2px solid transparent;white-space:nowrap}
.portal-nav-item svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.5}
.portal-nav-item:hover{color:rgba(255,255,255,0.7)}
.portal-nav-item.active{color:var(--yellow);border-top-color:var(--yellow)}
.gate-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}
.gate-box{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);padding:3rem 2.5rem;max-width:420px;width:100%;text-align:center}
.gate-label{font-family:var(--serif);font-size:1.6rem;font-weight:300;color:#fff;margin-bottom:0.5rem}
.gate-sub{font-size:0.78rem;color:rgba(255,255,255,0.45);letter-spacing:0.08em;margin-bottom:2rem}
.gate-input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;font-family:var(--sans);font-size:0.9rem;font-weight:300;padding:0.75rem 1rem;letter-spacing:0.08em;outline:none;margin-bottom:1rem;transition:border-color 0.2s}
.gate-input:focus{border-color:rgba(254,196,34,0.5)}
.gate-btn{width:100%;background:var(--yellow);color:var(--ink);font-family:var(--sans);font-weight:500;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.75rem 1.5rem;border:none;cursor:pointer;transition:background 0.2s}
.gate-btn:hover{background:#e8b31e}
.gate-error{color:#e05c5c;font-size:0.75rem;letter-spacing:0.06em;margin-top:0.5rem;display:none}
@media(max-width:768px){.fl-nav{padding:0 1.5rem}.fl-nav-links{display:none}.ca-header{padding:2.5rem 1.5rem 2rem}.ca-nav-grid{padding:2rem 1.5rem 6rem;grid-template-columns:1fr}.portal-nav-item{padding:0 0.75rem;font-size:0.5rem}}`;
  document.head.appendChild(_css);

  function isAuth() { return sessionStorage.getItem(C.SESS_CA) === C.PASS_CA; }

  function renderGate() {
    document.body.innerHTML = `<nav class="fl-nav"><a class="fl-nav-logo" href="https://fine-linestudio.com/"><span>FINE LINE <em>|</em> STUDIO</span></a></nav><div class="gate-wrap"><div class="gate-box"><div class="gate-label">${C.PROJECT_NAME}</div><div class="gate-sub">Enter your CA access password</div><form id="gateForm"><input class="gate-input" id="gateInput" type="password" placeholder="Password" autocomplete="current-password"/><button class="gate-btn" type="submit">Access Construction Admin</button><div class="gate-error" id="gateError">Incorrect password. Please try again.</div></form></div></div>`;
    document.getElementById('gateForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (document.getElementById('gateInput').value === C.PASS_CA) { sessionStorage.setItem(C.SESS_CA, C.PASS_CA); renderPage(); }
      else { document.getElementById('gateError').style.display = 'block'; }
    });
  }

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function renderPage() {
    document.title = 'Construction Administration | ' + C.PROJECT_NAME;
    document.body.innerHTML = `<nav class="fl-nav"><a class="fl-nav-logo" href="https://fine-linestudio.com/"><span>FINE LINE <em>|</em> STUDIO</span></a><ul class="fl-nav-links"><li><a href="https://fine-linestudio.com/portfolio/">Portfolio</a></li><li><a href="https://fine-linestudio.com/services/">Services</a></li><li><a href="https://fine-linestudio.com/about/">About</a></li><li><a href="https://fine-linestudio.com/contact/">Contact</a></li></ul></nav><header class="ca-header"><div class="ca-breadcrumb"><a href="${PG.portal}">Portal</a><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>Construction Administration</div><h1 class="ca-page-title">Construction Administration</h1><div class="ca-page-meta">${esc(C.PROJECT_NAME)} &mdash; ${esc(C.PROJECT_LOCATION)}</div></header><div class="ca-nav-grid"><a href="${PG.reports}" class="ca-nav-card"><div class="ca-nav-card-icon"><svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg></div><div class="ca-nav-card-title">Observation Reports</div><div class="ca-nav-card-desc">Site visit documentation, field notes, and construction quality observations.</div><div class="ca-nav-card-arrow">View reports <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div></a><a href="${PG.photos}" class="ca-nav-card"><div class="ca-nav-card-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div><div class="ca-nav-card-title">Site Photos</div><div class="ca-nav-card-desc">Progress photography organized by site visit date with flag annotations.</div><div class="ca-nav-card-arrow">View photos <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div></a><a href="${PG.submittals}" class="ca-nav-card"><div class="ca-nav-card-icon"><svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div><div class="ca-nav-card-title">Submittal Log</div><div class="ca-nav-card-desc">Shop drawings, product data, and samples submitted for review and approval.</div><div class="ca-nav-card-arrow">View submittals <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div></a><a href="${PG.rfi}" class="ca-nav-card"><div class="ca-nav-card-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div class="ca-nav-card-title">RFI Log</div><div class="ca-nav-card-desc">Requests for information from the contractor and architect responses.</div><div class="ca-nav-card-arrow">View RFIs <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div></a></div><nav class="portal-nav"><a href="${PG.portal}" class="portal-nav-item"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Timeline</a><a href="${PG.contacts}" class="portal-nav-item"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>Contacts</a><a href="${PG.documents}" class="portal-nav-item"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>Documents</a><a href="${PG.contracts}" class="portal-nav-item"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Contracts</a><a href="${PG.ca}" class="portal-nav-item active"><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Const. Admin</a></nav>`;
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (!C.PASS_CA || isAuth()) { renderPage(); } else { renderGate(); }
  });

})();