import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

// ─────────────────────────────────────────────────────────────
//  CSS — exact copy from HTML file, prefixed to avoid conflicts
// ─────────────────────────────────────────────────────────────
const LP_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.lp-root {
  --cream:#FAF8F2; --cream2:#F3EFE4; --cream3:#EAE3D0;
  --red:#f07911; --red-dim:rgba(200,57,28,0.1); --red-glow:rgba(200,57,28,0.28);
  --navy:#112060; --sand:#BF8E4A;
  --ink:#171512; --ink-60:rgba(23,21,18,0.6); --ink-35:rgba(23,21,18,0.35);
  --line:rgba(23,21,18,0.1);
}
.lp-root *,.lp-root *::before,.lp-root *::after{margin:0;padding:0;box-sizing:border-box}
.lp-root{background:var(--cream);color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden;cursor:none;min-height:100vh}

/* ── CURSOR ── */
.lp-c-dot{position:fixed;width:8px;height:8px;background:var(--red);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .08s}
.lp-c-ring{position:fixed;width:30px;height:30px;border:1px solid var(--navy);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .25s,height .25s,opacity .25s,transform .18s ease}

/* ── NAV ── */
.lp-nav{position:fixed;top:0;width:100%;z-index:1000;padding:0 6%;display:flex;align-items:center;justify-content:space-between;height:76px;transition:background .4s,border .4s}
.lp-nav.sc{background:rgba(250,248,242,.95);backdrop-filter:blur(24px);border-bottom:1px solid var(--line)}
.lp-logo{font-family:'Cormorant Garamond',serif;font-size:1.65rem;font-weight:700;color:var(--ink);text-decoration:none;letter-spacing:.3px;cursor:pointer}
.lp-logo em{color:var(--red);font-style:normal}
.lp-nav-ul{display:flex;gap:2.5rem;list-style:none;align-items:center}
.lp-nav-ul a{text-decoration:none;color:var(--ink-60);font-size:.87rem;font-weight:500;transition:color .25s;cursor:pointer}
.lp-nav-ul a:hover{color:var(--ink)}
.lp-nav-btn{background:var(--ink);color:var(--cream);padding:.58rem 1.6rem;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:.82rem;font-weight:600;border-radius:100px;transition:all .3s;letter-spacing:.2px}
.lp-nav-btn:hover{background:var(--red);box-shadow:0 8px 28px var(--red-glow);transform:translateY(-1px)}

/* ── HERO ── */
.lp-hero{min-height:100vh;position:relative;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr auto;align-items:center;overflow:hidden;padding:0 6%}
.lp-blob{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;animation:lpBfloat 9s ease-in-out infinite}
.lp-b1{width:650px;height:650px;background:rgba(200,57,28,.06);top:-220px;right:-120px}
.lp-b2{width:450px;height:450px;background:rgba(17,32,96,.05);bottom:-100px;left:-120px;animation-delay:-4s;animation-duration:12s}
.lp-b3{width:300px;height:300px;background:rgba(191,142,74,.07);top:38%;right:22%;animation-delay:-7s;animation-duration:14s}
@keyframes lpBfloat{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(28px,-18px) scale(1.04)}75%{transform:translate(-16px,12px) scale(.97)}}

.lp-hero-l{position:relative;z-index:2;padding-top:4rem}
.lp-h-badge{display:inline-flex;align-items:center;gap:.6rem;background:rgba(17,32,96,.07);border:1px solid rgba(17,32,96,.15);padding:.4rem 1rem;border-radius:100px;font-size:.72rem;font-weight:700;letter-spacing:.8px;color:var(--navy);text-transform:uppercase;margin-bottom:2rem;opacity:0;animation:lpFup .8s .3s forwards}
.lp-badge-dot{width:6px;height:6px;background:var(--red);border-radius:50%;animation:lpPing 2s ease-in-out infinite}
@keyframes lpPing{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.4}}
.lp-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(3.4rem,5.8vw,7rem);font-weight:700;line-height:.98;letter-spacing:-2.5px;margin-bottom:1.6rem;opacity:0;animation:lpFup .85s .5s forwards}
.lp-h1 .ac{color:var(--red)}
.lp-h1 .it{font-style:italic;font-weight:300;display:block}
.lp-h-sub{font-size:1.05rem;line-height:1.82;color:var(--ink-60);max-width:460px;margin-bottom:2.6rem;opacity:0;animation:lpFup .85s .7s forwards}
.lp-h-btns{display:flex;gap:1rem;align-items:center;opacity:0;animation:lpFup .85s .9s forwards}
.lp-btn-p{background:var(--red);color:#fff;padding:.92rem 2.3rem;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:.88rem;font-weight:600;border-radius:100px;position:relative;overflow:hidden;transition:all .3s}
.lp-btn-p::after{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.15),transparent 70%);transform:translateX(-100%);transition:transform .5s}
.lp-btn-p:hover{transform:translateY(-2px);box-shadow:0 14px 36px var(--red-glow)}
.lp-btn-p:hover::after{transform:translateX(100%)}
.lp-btn-s{background:transparent;color:var(--ink);padding:.92rem 2rem;border:1.5px solid var(--line);cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:.88rem;font-weight:600;border-radius:100px;transition:all .3s;display:flex;align-items:center;gap:.5rem}
.lp-btn-s svg{width:17px;height:17px;stroke:var(--red);fill:none;stroke-width:2}
.lp-btn-s:hover{border-color:var(--ink);transform:translateY(-2px)}
@keyframes lpFup{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}

.lp-hero-r{position:relative;z-index:2;height:100vh;display:flex;align-items:center;justify-content:center}
.lp-net-canvas{width:100%;height:520px;display:block}
.lp-fl-card{position:absolute;background:rgba(250,248,242,.96);backdrop-filter:blur(20px);border:1px solid var(--line);border-radius:18px;padding:1rem 1.4rem;box-shadow:0 20px 60px rgba(23,21,18,.09);opacity:0;animation:lpFup .9s forwards}
.lp-fc1{bottom:18%;left:2%;animation-delay:1.2s}
.lp-fc2{top:22%;right:2%;animation-delay:1.4s}
.lp-fl-label{font-size:.65rem;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink-35);margin-bottom:.25rem}
.lp-fl-val{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:var(--ink);line-height:1}
.lp-fl-val em{font-size:1rem;color:var(--red);font-style:normal;margin-left:2px}

.lp-h-stats{position:relative;left:0;right:0;padding:3rem 6% 4rem;display:flex;gap:3rem;align-items:center;flex-wrap:wrap;z-index:3;opacity:0;animation:lpFup .9s 1.4s forwards;grid-column:1/-1;background:linear-gradient(to top,rgba(250,248,242,.85) 0%,transparent 100%);margin-top:auto}
.lp-hs{display:flex;flex-direction:column}
.lp-hs-n{font-family:'JetBrains Mono',monospace;font-size:2rem;font-weight:500;color:var(--ink);line-height:1}
.lp-hs-n sup{font-size:.9rem;color:var(--red)}
.lp-hs-l{font-size:.7rem;color:var(--ink-35);margin-top:.2rem;letter-spacing:.4px}
.lp-hs-div{width:1px;height:44px;background:var(--line)}

/* ── SECTION COMMON ── */
.lp-root section{position:relative;overflow:hidden}
.lp-sw{padding:8rem 6%}
.lp-ey{font-size:.7rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--red);display:flex;align-items:center;gap:.8rem;margin-bottom:1.2rem}
.lp-ey::before{content:'';width:26px;height:1.5px;background:var(--red)}
.lp-st{font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,3.8vw,4.2rem);font-weight:700;line-height:1.02;letter-spacing:-1.2px;margin-bottom:1rem}
.lp-st em{color:var(--red);font-style:italic}
.lp-ss{font-size:1rem;color:var(--ink-60);line-height:1.82;max-width:500px}

/* Reveal */
.lp-rv{opacity:0;transform:translateY(44px);transition:opacity .9s ease,transform .9s ease}
.lp-rv.on{opacity:1;transform:translateY(0)}
.lp-rvl{opacity:0;transform:translateX(-44px);transition:opacity .9s ease,transform .9s ease}
.lp-rvl.on{opacity:1;transform:translateX(0)}
.lp-rvr{opacity:0;transform:translateX(44px);transition:opacity .9s ease,transform .9s ease}
.lp-rvr.on{opacity:1;transform:translateX(0)}

/* ── SERVICES ── */
.lp-services{background:var(--cream2)}
.lp-services::before{content:'';position:absolute;top:0;left:0;right:0;height:90px;background:var(--cream);clip-path:ellipse(58% 100% at 50% 0%)}
.lp-sv-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:4rem;flex-wrap:wrap;gap:2rem}
.lp-sv-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.6rem}
.lp-sv-card{background:var(--cream);border:1px solid var(--line);border-radius:22px;padding:2.6rem;position:relative;overflow:hidden;cursor:pointer;transition:transform .4s,box-shadow .4s,border-color .3s}
.lp-sv-card:hover{transform:translateY(-7px);box-shadow:0 28px 64px rgba(23,21,18,.1);border-color:rgba(200,57,28,.22)}
.lp-sv-card.feat{grid-column:span 2;background:var(--navy);border-color:transparent;color:#fff}
.lp-sv-card.feat:hover{box-shadow:0 28px 64px rgba(17,32,96,.3)}
.lp-sv-bg-pat{position:absolute;right:-20px;bottom:-20px;width:220px;height:220px;opacity:.06}
.lp-sv-ico{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:1.8rem}
.lp-sv-ico.lt{background:var(--red-dim)}
.lp-sv-ico.dk{background:rgba(255,255,255,.12)}
.lp-sv-ico svg{width:24px;height:24px;fill:none;stroke-width:1.5}
.lp-sv-ico.lt svg{stroke:var(--red)}
.lp-sv-ico.dk svg{stroke:rgba(255,255,255,.9)}
.lp-sv-n{position:absolute;top:1.8rem;right:2rem;font-family:'JetBrains Mono',monospace;font-size:.65rem;color:rgba(23,21,18,.18)}
.lp-sv-card.feat .lp-sv-n{color:rgba(255,255,255,.18)}
.lp-sv-title{font-family:'Cormorant Garamond',serif;font-size:1.55rem;font-weight:700;margin-bottom:.75rem;line-height:1.15}
.lp-sv-card.feat .lp-sv-title{color:#fff}
.lp-sv-txt{font-size:.91rem;color:var(--ink-60);line-height:1.78}
.lp-sv-card.feat .lp-sv-txt{color:rgba(255,255,255,.58)}
.lp-sv-link{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.5rem;font-size:.84rem;font-weight:600;color:var(--red);text-decoration:none;transition:gap .3s;cursor:pointer}
.lp-sv-card.feat .lp-sv-link{color:rgba(255,255,255,.8)}
.lp-sv-link:hover{gap:.9rem}
.lp-sv-link svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2}

/* ── STATS ── */
.lp-stats-sec{background:var(--ink);padding:6rem 6%;position:relative;overflow:hidden}
.lp-stats-sec::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 80% at 15% 50%,rgba(200,57,28,.18) 0%,transparent 60%),radial-gradient(ellipse 45% 70% at 85% 50%,rgba(17,32,96,.25) 0%,transparent 60%)}
.lp-st-grid{display:grid;grid-template-columns:repeat(4,1fr);position:relative;z-index:1}
.lp-st-col{padding:3.5rem 2.5rem;border-right:1px solid rgba(255,255,255,.08);text-align:center}
.lp-st-col:last-child{border-right:none}
.lp-st-n{font-family:'Cormorant Garamond',serif;font-size:5.5rem;font-weight:700;color:#fff;line-height:1;display:inline-block}
.lp-st-n sup{font-size:2.2rem;color:var(--red);vertical-align:middle}
.lp-st-l{font-size:.68rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:.6rem}

/* ── ABOUT ── */
.lp-about-sec{background:var(--cream)}
.lp-ab-inner{display:grid;grid-template-columns:1fr 1fr;gap:7rem;align-items:center}
.lp-ab-frame{position:relative;height:580px;border-radius:26px;overflow:hidden;background:var(--cream2);border:1px solid var(--line)}
.lp-ab-center{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.lp-rings-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.lp-ring-a{position:absolute;border-radius:50%;border:1px solid rgba(200,57,28,.14);transform:translate(-50%,-50%);top:0;left:0;animation:lpRex 3.2s ease-out infinite}
.lp-ring-a:nth-child(1){width:130px;height:130px;animation-delay:0s}
.lp-ring-a:nth-child(2){width:240px;height:240px;animation-delay:.9s}
.lp-ring-a:nth-child(3){width:350px;height:350px;animation-delay:1.8s}
.lp-ring-a:nth-child(4){width:460px;height:460px;animation-delay:2.7s}
@keyframes lpRex{0%{opacity:0;transform:translate(-50%,-50%) scale(.45)}55%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.15)}}
.lp-core-orb{width:82px;height:82px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;position:relative;z-index:2;box-shadow:0 0 60px rgba(200,57,28,.45);animation:lpCOp 3s ease-in-out infinite}
@keyframes lpCOp{0%,100%{box-shadow:0 0 40px rgba(200,57,28,.3);transform:scale(1)}50%{box-shadow:0 0 90px rgba(200,57,28,.55);transform:scale(1.06)}}
.lp-core-orb svg{width:36px;height:36px;stroke:#fff;fill:none;stroke-width:1.5}
.lp-d-tags{position:absolute;inset:0;z-index:3;pointer-events:none}
.lp-dtag{background:rgba(250,248,242,.96);backdrop-filter:blur(12px);border:1px solid var(--line);border-radius:14px;padding:.75rem 1.15rem;position:absolute;box-shadow:0 10px 30px rgba(23,21,18,.08)}
.lp-dtag .dl{font-size:.62rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink-35);margin-bottom:.15rem}
.lp-dtag .dv{font-family:'JetBrains Mono',monospace;font-size:.95rem;font-weight:500;color:var(--ink)}
.lp-dt1{top:12%;left:-24px}
.lp-dt2{bottom:18%;right:-24px}
.lp-dt3{top:52%;left:-30px}
.lp-ab-feats{display:flex;flex-direction:column;gap:1.1rem;margin-top:2.5rem}
.lp-feat{display:flex;gap:1.1rem;align-items:flex-start;padding:1.3rem 1.4rem;border:1px solid var(--line);border-radius:18px;background:var(--cream);transition:all .3s;cursor:default}
.lp-feat:hover{border-color:rgba(200,57,28,.22);background:rgba(200,57,28,.02);transform:translateX(5px)}
.lp-feat-i{width:40px;height:40px;flex-shrink:0;border-radius:10px;background:var(--red-dim);display:flex;align-items:center;justify-content:center}
.lp-feat-i svg{width:20px;height:20px;stroke:var(--red);fill:none;stroke-width:1.5}
.lp-feat-t{font-weight:600;font-size:.91rem;margin-bottom:.28rem}
.lp-feat-d{font-size:.86rem;color:var(--ink-60);line-height:1.68}

/* ── MARQUEE ── */
.lp-mq{background:var(--cream3);padding:1.8rem 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden}
.lp-mq-tr{display:flex;white-space:nowrap;animation:lpMqgo 30s linear infinite}
.lp-mq-it{display:inline-flex;align-items:center;gap:1.2rem;padding:0 2.5rem;font-size:.78rem;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:rgba(23,21,18,.32)}
.lp-mq-sep{width:5px;height:5px;border-radius:50%;background:var(--sand);flex-shrink:0}
@keyframes lpMqgo{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* ── CONTACT ── */
.lp-contact-sec{background:var(--cream2)}
.lp-contact-sec::before{content:'';position:absolute;top:0;left:0;right:0;height:80px;background:var(--cream3);clip-path:ellipse(52% 100% at 50% 0%)}
.lp-ct-inner{display:grid;grid-template-columns:1fr 1.15fr;gap:6rem;align-items:start}
.lp-ci-list{display:flex;flex-direction:column;gap:1.1rem;margin-top:2.5rem}
.lp-ci-it{display:flex;gap:1rem;align-items:flex-start;padding:1.1rem 1.4rem;background:var(--cream);border:1px solid var(--line);border-radius:16px;transition:all .3s}
.lp-ci-it:hover{border-color:rgba(200,57,28,.2);transform:translateX(5px)}
.lp-ci-ic{width:42px;height:42px;flex-shrink:0;background:var(--red-dim);border-radius:10px;display:flex;align-items:center;justify-content:center}
.lp-ci-ic svg{width:20px;height:20px;stroke:var(--red);fill:none;stroke-width:1.5}
.lp-ci-lb{font-size:.65rem;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink-35)}
.lp-ci-v{font-size:.94rem;font-weight:500;color:var(--ink);margin-top:.15rem}
.lp-ci-v2{font-size:.82rem;color:var(--ink-60);margin-top:2px}
.lp-ct-form{background:var(--cream);border:1px solid var(--line);border-radius:26px;padding:2.6rem}
.lp-ct-form-title{font-family:'Cormorant Garamond',serif;font-size:1.9rem;font-weight:700;margin-bottom:1.8rem;letter-spacing:-.5px}
.lp-fg{display:flex;flex-direction:column;gap:.38rem;margin-bottom:1rem}
.lp-fgrow{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:0}
.lp-fg label{font-size:.67rem;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink-35)}
.lp-fg input,.lp-fg textarea{background:var(--cream2);border:1px solid var(--line);border-radius:10px;padding:.82rem 1rem;color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif;font-size:.92rem;outline:none;resize:none;transition:all .3s}
.lp-fg input::placeholder,.lp-fg textarea::placeholder{color:var(--ink-35)}
.lp-fg input:focus,.lp-fg textarea:focus{border-color:var(--red);background:rgba(200,57,28,.025);box-shadow:0 0 0 3px rgba(200,57,28,.08)}
.lp-fg textarea{height:118px}
.lp-ct-btn{width:100%;padding:1rem;background:var(--red);color:#fff;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:.93rem;font-weight:600;border-radius:12px;cursor:pointer;position:relative;overflow:hidden;transition:all .3s;margin-top:.6rem}
.lp-ct-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.14),transparent 70%);transform:translateX(-100%);transition:transform .5s}
.lp-ct-btn:hover{transform:translateY(-2px);box-shadow:0 14px 36px var(--red-glow)}
.lp-ct-btn:hover::after{transform:translateX(100%)}

/* ── FOOTER ── */
.lp-footer{background:var(--ink);padding:6rem 6% 3rem;position:relative;overflow:hidden}
.lp-footer::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 38% 60% at 8% 50%,rgba(200,57,28,.08) 0%,transparent 55%)}
.lp-ft-in{position:relative;z-index:1}
.lp-ft-top{display:grid;grid-template-columns:1.8fr 1fr 1fr 1fr;gap:4rem;padding-bottom:4rem;border-bottom:1px solid rgba(255,255,255,.08)}
.lp-ft-logo{font-family:'Cormorant Garamond',serif;font-size:1.9rem;font-weight:700;color:#fff;margin-bottom:1rem;display:block;text-decoration:none;cursor:pointer}
.lp-ft-logo em{color:var(--red);font-style:normal}
.lp-ft-desc{font-size:.87rem;color:rgba(255,255,255,.38);line-height:1.85}
.lp-ft-col h4{font-size:.67rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:1.5rem}
.lp-ft-ul{list-style:none;display:flex;flex-direction:column;gap:.8rem}
.lp-ft-ul a{text-decoration:none;color:rgba(255,255,255,.48);font-size:.88rem;transition:color .25s;cursor:pointer}
.lp-ft-ul a:hover{color:#fff}
.lp-ft-bot{display:flex;justify-content:space-between;align-items:center;padding-top:2.5rem;font-size:.78rem;color:rgba(255,255,255,.22)}
.lp-ft-bot-r{display:flex;gap:2rem}
.lp-ft-bot-r a{color:rgba(255,255,255,.28);text-decoration:none;transition:color .25s;cursor:pointer}
.lp-ft-bot-r a:hover{color:rgba(255,255,255,.65)}

/* ── WA FAB ── */
.lp-wa-fab{position:fixed;bottom:2rem;right:2rem;z-index:500;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(37,211,102,.4);cursor:pointer;transition:transform .3s,box-shadow .3s;text-decoration:none}
.lp-wa-fab:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 14px 40px rgba(37,211,102,.5)}
.lp-wa-fab svg{width:26px;height:26px;fill:#fff}

/* ── HAMBURGER ── */
.lp-ham{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;z-index:1001;background:none;border:none}
.lp-ham span{width:24px;height:2px;background:var(--ink);border-radius:2px;transition:all .35s}
.lp-ham.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.lp-ham.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.lp-ham.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.lp-mob-nav{display:none;position:fixed;inset:0;background:rgba(250,248,242,.97);backdrop-filter:blur(20px);z-index:999;flex-direction:column;align-items:center;justify-content:center;gap:2.5rem;opacity:0;pointer-events:none;transition:opacity .35s}
.lp-mob-nav.open{display:flex;opacity:1;pointer-events:auto}
.lp-mob-nav a,.lp-mob-nav button{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.6rem;font-weight:600;color:var(--ink);text-decoration:none;transition:color .25s;cursor:pointer;background:none;border:none}
.lp-mob-nav a:hover{color:var(--red)}
.lp-mob-nav .lp-nav-btn{font-size:1rem;padding:.75rem 2.2rem}

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .lp-hero{grid-template-columns:1fr;grid-template-rows:auto auto auto;padding:0 6%;min-height:100svh}
  .lp-hero-l{padding-top:7rem;padding-bottom:0;grid-row:1;text-align:center}
  .lp-h-sub{margin-left:auto;margin-right:auto}
  .lp-h-btns{justify-content:center}
  .lp-h-badge{margin-left:auto;margin-right:auto}
  .lp-hero-r{height:380px;grid-row:2}
  .lp-net-canvas{height:380px}
  .lp-h-stats{grid-row:3;grid-column:1;justify-content:center;gap:2rem;padding:2rem 6% 3rem}
  .lp-fc1{bottom:10%;left:4%}
  .lp-fc2{top:10%;right:4%}
  .lp-sv-grid{grid-template-columns:1fr 1fr}
  .lp-sv-card.feat{grid-column:span 2}
  .lp-ab-inner{grid-template-columns:1fr;gap:4rem}
  .lp-ab-frame{height:380px}
  .lp-dt1{left:10px}
  .lp-dt2{right:10px}
  .lp-dt3{left:10px}
  .lp-ct-inner{grid-template-columns:1fr;gap:3.5rem}
  .lp-ft-top{grid-template-columns:1fr 1fr;gap:3rem}
  .lp-ft-top > div:first-child{grid-column:span 2}
  .lp-st-grid{grid-template-columns:repeat(2,1fr)}
  .lp-st-col{border-right:none;border-bottom:1px solid rgba(255,255,255,.08)}
  .lp-st-col:nth-child(odd){border-right:1px solid rgba(255,255,255,.08)}
  .lp-st-col:last-child{border-bottom:none}
}
@media(max-width:768px){
  .lp-nav-ul{display:none}
  .lp-ham{display:flex}
  .lp-root{cursor:auto}
  .lp-c-dot,.lp-c-ring{display:none}
  .lp-nav{padding:0 5%}
  .lp-logo{font-size:1.4rem}
  .lp-hero{padding:0 5%;grid-template-rows:auto auto auto}
  .lp-hero-l{padding-top:6rem}
  .lp-h1{letter-spacing:-1.5px}
  .lp-h-sub{font-size:.95rem}
  .lp-btn-p,.lp-btn-s{font-size:.82rem;padding:.78rem 1.6rem}
  .lp-hero-r{height:300px}
  .lp-net-canvas{height:300px}
  .lp-fl-card{padding:.7rem 1rem}
  .lp-fl-val{font-size:1.6rem}
  .lp-h-stats{gap:1.4rem;padding:1.8rem 5% 2.5rem;flex-wrap:wrap;justify-content:center}
  .lp-hs-n{font-size:1.5rem}
  .lp-hs-div{height:32px}
  .lp-sw{padding:5rem 5%}
  .lp-sv-grid{grid-template-columns:1fr}
  .lp-sv-card.feat{grid-column:span 1}
  .lp-sv-head{gap:1.2rem}
  .lp-st-grid{grid-template-columns:1fr 1fr}
  .lp-st-n{font-size:3.8rem}
  .lp-st-col{padding:2.5rem 1.5rem}
  .lp-ab-frame{height:300px}
  .lp-ring-a:nth-child(4){display:none}
  .lp-dt1,.lp-dt3{left:8px}
  .lp-dt2{right:8px}
  .lp-fgrow{grid-template-columns:1fr}
  .lp-ft-top{grid-template-columns:1fr;gap:2.5rem}
  .lp-ft-top > div:first-child{grid-column:span 1}
  .lp-ft-bot{flex-direction:column;gap:1.2rem;text-align:center}
  .lp-ft-bot-r{justify-content:center}
  .lp-wa-fab{bottom:1.4rem;right:1.4rem;width:48px;height:48px}
}
@media(max-width:480px){
  .lp-h-stats{gap:1rem}
  .lp-hs-n{font-size:1.3rem}
  .lp-hs-div{display:none}
  .lp-hs{align-items:center;min-width:80px}
  .lp-h-btns{flex-direction:column;align-items:center}
  .lp-btn-s,.lp-btn-p{width:100%;justify-content:center}
  .lp-st-grid{grid-template-columns:1fr}
  .lp-st-col{border-right:none}
  .lp-st-col:nth-child(odd){border-right:none}
}
`;

// ── Marquee items ──
const MQ_ITEMS = [
  'High Speed Internet','Reliable IPTV','HD Cable TV',
  'IP Camera Security','24/7 Live Support','Local Experts',
  '5000+ Happy Clients',"Lodhran's Best Network",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const navRef   = useRef(null);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [formSent, setFormSent]     = useState(false);

  // scroll helper
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  useEffect(() => {
    // ── inject styles ──
    const style = document.createElement('style');
    style.innerHTML = LP_STYLES;
    document.head.appendChild(style);

    // ── cursor ──
    const dot  = dotRef.current;
    const ring = ringRef.current;
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my, rafC;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);
    (function animC() {
      if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
      rx += (mx - rx) * .13; ry += (my - ry) * .13;
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
      rafC = requestAnimationFrame(animC);
    })();
    // cursor expand on interactive elements
    document.querySelectorAll('a,button,.lp-sv-card,.lp-feat,.lp-ci-it').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (ring) { ring.style.width='52px'; ring.style.height='52px'; ring.style.opacity='.45'; }
        if (dot)  dot.style.transform = 'translate(-50%,-50%) scale(.35)';
      });
      el.addEventListener('mouseleave', () => {
        if (ring) { ring.style.width='30px'; ring.style.height='30px'; ring.style.opacity='1'; }
        if (dot)  dot.style.transform = 'translate(-50%,-50%) scale(1)';
      });
    });

    // ── navbar scroll ──
    const nav = navRef.current;
    const onScroll = () => nav?.classList.toggle('sc', scrollY > 55);
    window.addEventListener('scroll', onScroll);

    // ── network canvas ──
    const canvas = canvasRef.current;
    let animId;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let W, H, nodes = [];
      const resize = () => {
        const r = canvas.parentElement.getBoundingClientRect();
        W = canvas.width  = r.width;
        H = canvas.height = r.height;
      };
      resize();
      window.addEventListener('resize', resize);

      function Nd() {
        this.x  = Math.random() * W; this.y  = Math.random() * H;
        this.vx = (Math.random() - .5) * .55; this.vy = (Math.random() - .5) * .55;
        this.r   = Math.random() * 2.5 + 1.2;
        this.col = Math.random() > .5 ? [200,57,28] : [17,32,96];
      }
      for (let i = 0; i < 52; i++) nodes.push(new Nd());

      let mX = W / 2, mY = H / 2;
      canvas.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mX = e.clientX - r.left; mY = e.clientY - r.top;
      });

      (function draw() {
        ctx.clearRect(0, 0, W, H);
        nodes.forEach((a, i) => {
          nodes.forEach((b, j) => {
            if (j <= i) return;
            const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
            if (d < 135) {
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(191,142,74,${(1 - d/135) * .28})`;
              ctx.lineWidth = .8; ctx.stroke();
            }
          });
          const dx = a.x - mX, dy = a.y - mY, d = Math.hypot(dx, dy);
          if (d < 170) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mX, mY);
            ctx.strokeStyle = `rgba(200,57,28,${(1 - d/170) * .55})`;
            ctx.lineWidth = .8; ctx.stroke();
          }
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;
          ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${a.col[0]},${a.col[1]},${a.col[2]},.72)`; ctx.fill();
        });
        ctx.beginPath(); ctx.arc(mX, mY, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,57,28,.55)'; ctx.fill();
        animId = requestAnimationFrame(draw);
      })();
    }

    // ── scroll reveal ──
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target); }
      });
    }, { threshold: .09 });
    document.querySelectorAll('.lp-rv,.lp-rvl,.lp-rvr').forEach(el => ro.observe(el));

    // ── service card 3d tilt ──
    document.querySelectorAll('.lp-sv-card').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        c.style.transform = `perspective(900px) rotateY(${x*7}deg) rotateX(${-y*5}deg) translateY(-7px)`;
      });
      c.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafC);
      cancelAnimationFrame(animId);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  // ── form send handler ──
  const handleSend = () => {
    setFormSent(true);
    setTimeout(() => setFormSent(false), 3200);
  };

  // ─────────────────────────────────────────────
  //  JSX
  // ─────────────────────────────────────────────
  return (
    <div className="lp-root">
      {/* Cursor */}
      <div className="lp-c-dot"  ref={dotRef}  />
      <div className="lp-c-ring" ref={ringRef} />

      {/* ══ NAV ══ */}
      <nav className="lp-nav" ref={navRef}>
        <span className="lp-logo" onClick={() => scrollTo('lp-hero')}>
          Con<em>nect</em>
        </span>
        <ul className="lp-nav-ul">
          <li><a onClick={() => scrollTo('lp-services')}>Services</a></li>
          <li><a onClick={() => scrollTo('lp-about')}>About Us</a></li>
          <li><a onClick={() => scrollTo('lp-contact')}>Contact</a></li>
          <li><button className="lp-nav-btn" onClick={() => navigate('/login')}>Get Connected</button></li>
        </ul>
        <button className={`lp-ham${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile nav overlay */}
      <div className={`lp-mob-nav${menuOpen ? ' open' : ''}`}>
        <a onClick={() => scrollTo('lp-services')}>Services</a>
        <a onClick={() => scrollTo('lp-about')}>About Us</a>
        <a onClick={() => scrollTo('lp-contact')}>Contact</a>
        <button className="lp-nav-btn" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
          Get Connected
        </button>
      </div>

      {/* ══ HERO ══ */}
      <section className="lp-hero" id="lp-hero">
        <div className="lp-blob lp-b1" />
        <div className="lp-blob lp-b2" />
        <div className="lp-blob lp-b3" />

        <div className="lp-hero-l">
          <div className="lp-h-badge">
            <span className="lp-badge-dot" />
            Lodhran's Most Trusted Network
          </div>
          <h1 className="lp-h1">
            Building<br />
            <span className="ac">Faster</span><br />
            <span className="it">Connections.</span>
          </h1>
          <p className="lp-h-sub">
            Connect Communications delivers ultra-fast internet, crystal-clear IPTV, and intelligent
            IP cameras to homes and businesses across Lodhran, Pakistan.
          </p>
          <div className="lp-h-btns">
            <button className="lp-btn-p" onClick={() => scrollTo('lp-services')}>
              Explore Services
            </button>
            <button className="lp-btn-s" onClick={() => window.location.href = 'tel:+923005592282'}>
              <svg viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/>
              </svg>
              Call Now
            </button>
          </div>
        </div>

        <div className="lp-hero-r">
          <canvas className="lp-net-canvas" ref={canvasRef} />
          <div className="lp-fl-card lp-fc1">
            <div className="lp-fl-label">Avg Speed</div>
            <div className="lp-fl-val">100<em>Mbps</em></div>
          </div>
          <div className="lp-fl-card lp-fc2">
            <div className="lp-fl-label">Network Uptime</div>
            <div className="lp-fl-val">99.9<em>%</em></div>
          </div>
        </div>

        <div className="lp-h-stats">
          {[['5000','+','Subscribers'],['8','+','Years of Service'],['15','+','Areas Covered'],['24','/7','Support']].map(([n,s,l]) => (
            <div className="lp-hs" key={l}>
              <div className="lp-hs-n">{n}<sup>{s}</sup></div>
              <div className="lp-hs-l">{l}</div>
            </div>
          )).reduce((acc, el, i, arr) => {
            acc.push(el);
            if (i < arr.length - 1) acc.push(<div className="lp-hs-div" key={`d${i}`} />);
            return acc;
          }, [])}
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="lp-services" id="lp-services">
        <div className="lp-sw">
          <div className="lp-sv-head lp-rv">
            <div>
              <div className="lp-ey">What We Offer</div>
              <h2 className="lp-st">Services Built for<br /><em>Modern Living</em></h2>
            </div>
            <p className="lp-ss">
              From blazing-fast internet to smart security — we have everything your home or
              business needs to stay connected and protected.
            </p>
          </div>

          <div className="lp-sv-grid">
            {/* Featured */}
            <div className="lp-sv-card feat lp-rv" style={{transitionDelay:'.05s'}}>
              <svg className="lp-sv-bg-pat" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="92" stroke="white" strokeWidth=".6"/>
                <circle cx="100" cy="100" r="60" stroke="white" strokeWidth=".6"/>
                <circle cx="100" cy="100" r="30" stroke="white" strokeWidth=".6"/>
                <line x1="8" y1="100" x2="192" y2="100" stroke="white" strokeWidth=".6"/>
                <line x1="100" y1="8" x2="100" y2="192" stroke="white" strokeWidth=".6"/>
              </svg>
              <span className="lp-sv-n">01</span>
              <div className="lp-sv-ico dk">
                <svg viewBox="0 0 24 24"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"/></svg>
              </div>
              <div className="lp-sv-title">High Speed Internet<br />Connectivity</div>
              <div className="lp-sv-txt">Experience uninterrupted, ultra-fast internet powered by robust infrastructure. Designed for streaming, gaming, remote work, and everything in between — with no buffering, ever.</div>
              <span className="lp-sv-link">
                Learn More
                <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>

            {/* Card 2 */}
            <div className="lp-sv-card lp-rv" style={{transitionDelay:'.15s'}}>
              <span className="lp-sv-n">02</span>
              <div className="lp-sv-ico lt">
                <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>
              </div>
              <div className="lp-sv-title">TV Cable Services</div>
              <div className="lp-sv-txt">Hundreds of HD channels with crystal-clear, uninterrupted signal. Never miss sports, news, or entertainment.</div>
              <span className="lp-sv-link">Learn More <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
            </div>

            {/* Card 3 */}
            <div className="lp-sv-card lp-rv" style={{transitionDelay:'.25s'}}>
              <span className="lp-sv-n">03</span>
              <div className="lp-sv-ico lt">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              </div>
              <div className="lp-sv-title">IPTV Services</div>
              <div className="lp-sv-txt">Watch live TV, movies, and on-demand content from around the globe in stunning HD and 4K quality.</div>
              <span className="lp-sv-link">Learn More <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
            </div>

            {/* Card 4 */}
            <div className="lp-sv-card lp-rv" style={{transitionDelay:'.35s'}}>
              <span className="lp-sv-n">04</span>
              <div className="lp-sv-ico lt">
                <svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              </div>
              <div className="lp-sv-title">IP Camera Installation</div>
              <div className="lp-sv-txt">Professional-grade IP security cameras with 24/7 remote access, HD recording, and expert installation across Lodhran.</div>
              <span className="lp-sv-link">Learn More <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="lp-stats-sec">
        <div className="lp-st-grid lp-rv">
          {[
            ['+','5000','Satisfied Subscribers'],
            ['+','8','Years of Excellence'],
            ['+','15','Areas Covered'],
            ['','99.9','Network Uptime','%'],
          ].map(([pre, n, label, post]) => (
            <div className="lp-st-col" key={label}>
              <div className="lp-st-n">
                {pre && <sup>{pre}</sup>}{n}{post && <sup>{post}</sup>}
              </div>
              <div className="lp-st-l">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section className="lp-about-sec" id="lp-about">
        <div className="lp-sw">
          <div className="lp-ab-inner">
            {/* Left — animated frame */}
            <div className="lp-rvl">
              <div className="lp-ab-frame">
                <div className="lp-ab-center">
                  <div className="lp-rings-wrap">
                    <div className="lp-ring-a" /><div className="lp-ring-a" />
                    <div className="lp-ring-a" /><div className="lp-ring-a" />
                  </div>
                  <div className="lp-core-orb">
                    <svg viewBox="0 0 24 24"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"/></svg>
                  </div>
                </div>
                <div className="lp-d-tags">
                  <div className="lp-dtag lp-dt1">
                    <div className="dl">Signal Strength</div>
                    <div className="dv" style={{color:'var(--red)'}}>● Excellent</div>
                  </div>
                  <div className="lp-dtag lp-dt2">
                    <div className="dl">Network Status</div>
                    <div className="dv" style={{color:'#2d9e5c'}}>● All Systems Go</div>
                  </div>
                  <div className="lp-dtag lp-dt3">
                    <div className="dl">Coverage</div>
                    <div className="dv">Lodhran, PK</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — text */}
            <div className="lp-rvr">
              <div className="lp-ey">About Connect</div>
              <h2 className="lp-st">Lodhran's <em>Home-Grown</em><br />Network Provider</h2>
              <p className="lp-ss">
                Connect Communications was born in Lodhran with one mission — to bring world-class
                internet and entertainment to every home and business. We believe fast, reliable
                connectivity is not a luxury; it's a necessity.
              </p>
              <div className="lp-ab-feats">
                {[
                  {
                    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9z"/>,
                    title: 'Lightning Fast Speeds',
                    desc:  "Our robust backbone ensures consistent speeds whether you're streaming, gaming, or running a business from home.",
                  },
                  {
                    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
                    title: 'Reliable & Secure',
                    desc:  '99.9% uptime guarantee with enterprise-grade network security protecting your connection around the clock.',
                  },
                  {
                    icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
                    title: '24/7 Local Support',
                    desc:  'Real people, real help. Our Lodhran-based support team is always available when you need us most.',
                  },
                ].map(f => (
                  <div className="lp-feat" key={f.title}>
                    <div className="lp-feat-i">
                      <svg viewBox="0 0 24 24">{f.icon}</svg>
                    </div>
                    <div>
                      <div className="lp-feat-t">{f.title}</div>
                      <div className="lp-feat-d">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="lp-mq">
        <div className="lp-mq-tr">
          {[...MQ_ITEMS, ...MQ_ITEMS].map((item, i) => (
            <span className="lp-mq-it" key={i}>
              <span className="lp-mq-sep" />{item}
            </span>
          ))}
        </div>
      </div>

      {/* ══ CONTACT ══ */}
      <section className="lp-contact-sec" id="lp-contact">
        <div className="lp-sw">
          <div className="lp-ct-inner">
            {/* Left — info */}
            <div className="lp-rvl">
              <div className="lp-ey">Get In Touch</div>
              <h2 className="lp-st">Let's Get You<br /><em>Connected</em></h2>
              <p className="lp-ss">
                Whether you want to subscribe, upgrade your plan, or simply ask a question —
                we're here and happy to help, anytime.
              </p>
              <div className="lp-ci-list">
                {/* Phone */}
                <div className="lp-ci-it">
                  <div className="lp-ci-ic">
                    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/></svg>
                  </div>
                  <div>
                    <div className="lp-ci-lb">Phone</div>
                    <div className="lp-ci-v">+92 300 559 2282</div>
                    <div className="lp-ci-v">+92 300 559 2265</div>
                  </div>
                </div>
                {/* Address */}
                <div className="lp-ci-it">
                  <div className="lp-ci-ic">
                    <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div className="lp-ci-lb">Office Address</div>
                    <div className="lp-ci-v">Sony Cable Office</div>
                    <div className="lp-ci-v2">Chowk Rafique Shah Bukhari, Lodhran, Pakistan</div>
                  </div>
                </div>
                {/* Hours */}
                <div className="lp-ci-it">
                  <div className="lp-ci-ic">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <div className="lp-ci-lb">Support Hours</div>
                    <div className="lp-ci-v">24 Hours / 7 Days a Week</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="lp-rvr">
              <div className="lp-ct-form">
                <div className="lp-ct-form-title">Send a Message</div>
                <div className="lp-fgrow">
                  <div className="lp-fg"><label>Full Name</label><input type="text" placeholder="Your name" /></div>
                  <div className="lp-fg"><label>Email</label><input type="email" placeholder="you@example.com" /></div>
                </div>
                <div className="lp-fg" style={{marginTop:'1rem'}}>
                  <label>Phone Number</label><input type="tel" placeholder="+92 300 ..." />
                </div>
                <div className="lp-fg">
                  <label>Service Interest</label>
                  <input type="text" placeholder="e.g. High Speed Internet, IPTV..." />
                </div>
                <div className="lp-fg">
                  <label>Your Message</label>
                  <textarea placeholder="Tell us about your connectivity needs..." />
                </div>
                <button
                  className="lp-ct-btn"
                  onClick={handleSend}
                  style={formSent ? {background:'#2d6a4f'} : {}}
                >
                  {formSent ? '✓ Message Sent Successfully!' : 'Send Message →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="lp-footer">
        <div className="lp-ft-in">
          <div className="lp-ft-top">
            <div>
              <span className="lp-ft-logo" onClick={() => scrollTo('lp-hero')}>
                Con<em>nect</em>
              </span>
              <p className="lp-ft-desc">
                Connect Lodhran delivers the best, fastest and most reliable internet, IPTV and
                IP camera services in the region. Connecting Pakistan — one home at a time.
              </p>
            </div>
            <div>
              <h4>Services</h4>
              <ul className="lp-ft-ul">
                {['High Speed Internet','TV Cable Services','IPTV Services','IP Camera Setup'].map(s => (
                  <li key={s}><a onClick={() => scrollTo('lp-services')}>{s}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul className="lp-ft-ul">
                <li><a href="tel:+923005592282">+92 300 559 2282</a></li>
                <li><a href="tel:+923005592265">+92 300 559 2265</a></li>
                <li><a href="mailto:info@connectcomm.pk">info@connectcomm.pk</a></li>
              </ul>
            </div>
            <div>
              <h4>Location</h4>
              <ul className="lp-ft-ul">
                <li><a onClick={() => scrollTo('lp-contact')}>Sony Cable Office</a></li>
                <li><a onClick={() => scrollTo('lp-contact')}>Chowk Rafique Shah Bukhari</a></li>
                <li><a onClick={() => scrollTo('lp-contact')}>Lodhran, Pakistan</a></li>
              </ul>
            </div>
          </div>
          <div className="lp-ft-bot">
            <span>© 2026 Connect Communication Lodhran. All Rights Reserved.</span>
            <div className="lp-ft-bot-r">
              <a>Privacy Policy</a>
              <a>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/923005592282" className="lp-wa-fab" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}