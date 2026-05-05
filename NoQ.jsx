import { useState, useEffect } from "react";

const SERVICES = [
  { id: "account", icon: "◈", label: "Account Opening", duration: "30 min", desc: "Savings, current & fixed deposits", color: "#7C9EFF" },
  { id: "loan", icon: "◆", label: "Loan Advisory", duration: "45 min", desc: "Home, auto & business financing", color: "#A78BFA" },
  { id: "card", icon: "▣", label: "Card Services", duration: "20 min", desc: "Issue, replace & manage cards", color: "#34D399" },
  { id: "forex", icon: "◉", label: "Foreign Exchange", duration: "25 min", desc: "Currency & wire transfers", color: "#F59E0B" },
  { id: "invest", icon: "▲", label: "Investment Advisory", duration: "40 min", desc: "Funds, bonds & portfolio", color: "#F472B6" },
  { id: "kyc", icon: "◎", label: "KYC Update", duration: "15 min", desc: "ID, address & nominee details", color: "#22D3EE" },
];

const BRANCHES = [
  { id: "motijheel", label: "Motijheel Main", address: "67 Motijheel C/A, Dhaka 1000", slots: 12, wait: "~5 min" },
  { id: "gulshan", label: "Gulshan Premium", address: "Plot 14, Road 17, Gulshan-1", slots: 8, wait: "~3 min" },
  { id: "dhanmondi", label: "Dhanmondi", address: "House 9, Road 7, Dhanmondi", slots: 10, wait: "~8 min" },
  { id: "uttara", label: "Uttara North", address: "Sector 7, Uttara, Dhaka 1230", slots: 6, wait: "~2 min" },
  { id: "ctg", label: "Agrabad, Chittagong", address: "Sheikh Mujib Road, Agrabad", slots: 9, wait: "~6 min" },
];

const TIMES = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM"];

function genSlots(date) {
  const seed = date ? date.split("-").reduce((a, b) => a + parseInt(b), 0) : 0;
  return TIMES.map((t, i) => ({ time: t, available: ((seed + i * 7) % 3) !== 0 }));
}

const today = new Date();
const fmt = d => d.toISOString().split("T")[0];
const dispDate = d => new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

const INIT_BOOKINGS = [
  { id: "BQ-7291", service: SERVICES[0], branch: BRANCHES[0], date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)), time: "10:00 AM", status: "upcoming", bookedAt: "Dec 15, 2024" },
  { id: "BQ-7284", service: SERVICES[4], branch: BRANCHES[1], date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)), time: "2:30 PM", status: "upcoming", bookedAt: "Dec 14, 2024" },
  { id: "BQ-6103", service: SERVICES[2], branch: BRANCHES[2], date: "2023-11-20", time: "11:00 AM", status: "completed", bookedAt: "Nov 15, 2023" },
  { id: "BQ-5821", service: SERVICES[3], branch: BRANCHES[0], date: "2023-10-05", time: "3:00 PM", status: "cancelled", bookedAt: "Oct 01, 2023" },
  { id: "BQ-4990", service: SERVICES[1], branch: BRANCHES[3], date: "2023-09-12", time: "9:30 AM", status: "completed", bookedAt: "Sep 08, 2023" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #FFFFFF;
  --surf: #F7F8FC;
  --surf2: #EEF2FF;
  --border: rgba(15,23,42,0.10);
  --border2: rgba(15,23,42,0.18);
  --gold: #D4AF5A;
  --gold2: #F0CF8A;
  --text: #111827;
  --text2: #4B5563;
  --text3: #6B7280;
  --r: 20px;
  --r2: 14px;
}
[data-theme='dark'] {
  --bg: #060912;
  --surf: #0D1220;
  --surf2: #111827;
  --border: rgba(255,255,255,0.06);
  --border2: rgba(255,255,255,0.12);
  --text: #F0EDE8;
  --text2: #8B92A5;
  --text3: #4A5168;
}
body { font-family: 'Manrope', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; letter-spacing: 0.1px; }
button { font-family: 'Manrope', sans-serif; cursor: pointer; border: none; background: none; }

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  padding: 0 40px; height: 68px;
  display: flex; align-items: center; justify-content: space-between;
  background: color-mix(in srgb, var(--bg) 72%, transparent); backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid var(--border);
}
.logo { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; letter-spacing: 2.5px; color: var(--gold); display: flex; align-items: center; gap: 10px; cursor: pointer; }
.logo-mark { width: 30px; height: 30px; border: 1.5px solid rgba(212,175,90,0.4); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--gold); }
.nav-links { display: flex; gap: 4px; }
.nav-link { padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 500; color: var(--text2); transition: all 0.2s; }
.nav-link:hover, .nav-link.active { color: var(--text); background: rgba(255,255,255,0.05); }
.nav-book { background: linear-gradient(135deg, #D4AF5A, #E8C877); color: #050810; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; padding: 10px 26px; border-radius: 100px; box-shadow: 0 0 28px rgba(212,175,90,0.28); transition: all 0.25s; text-transform: uppercase; }
.nav-book:hover { transform: translateY(-1px); box-shadow: 0 0 44px rgba(212,175,90,0.44); }
.nav-actions { display: flex; align-items: center; gap: 10px; }
.theme-switch-wrap { display: inline-flex; align-items: center; gap: 8px; }
.theme-switch-label { font-size: 10px; font-weight: 700; letter-spacing: 1.1px; color: var(--text2); text-transform: uppercase; }
.theme-switch {
  width: 52px;
  height: 30px;
  border-radius: 100px;
  border: 1px solid var(--border2);
  background: color-mix(in srgb, var(--surf) 78%, var(--bg));
  position: relative;
  transition: all 0.25s;
  padding: 0;
}
.theme-switch:hover { border-color: var(--gold); }
.theme-switch-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--text2);
  transition: all 0.25s;
}
.theme-switch.on { background: rgba(212,175,90,0.2); border-color: rgba(212,175,90,0.5); }
.theme-switch.on .theme-switch-knob { transform: translateX(22px); background: var(--gold); }

/* HERO */
.hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 24px 80px; text-align: center; position: relative; overflow: hidden; }
.hero-bg-orb { position: absolute; border-radius: 50%; pointer-events: none; }
.hero-grid-lines { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px); background-size: 64px 64px; pointer-events: none; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%); }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 10px; background: rgba(212,175,90,0.08); border: 1px solid rgba(212,175,90,0.22); color: var(--gold); font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; padding: 10px 24px; border-radius: 100px; margin-bottom: 40px; animation: fadeUp 0.7s ease both; }
.eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.hero-h1 { font-family: 'Playfair Display', serif; font-size: clamp(50px, 8.5vw, 100px); font-weight: 500; line-height: 1.0; color: var(--text); margin-bottom: 4px; animation: fadeUp 0.7s 0.1s ease both; letter-spacing: -1px; }
.hero-h2 { font-family: 'Playfair Display', serif; font-size: clamp(24px, 4vw, 48px); font-weight: 400; color: var(--text2); margin-bottom: 30px; animation: fadeUp 0.7s 0.15s ease both; letter-spacing: 0px; }
.hero-h2 em { color: var(--gold); font-style: italic; }
.hero-desc { font-size: 15px; color: var(--text2); max-width: 460px; line-height: 1.8; margin-bottom: 52px; animation: fadeUp 0.7s 0.2s ease both; }
.hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.7s 0.25s ease both; }
.cta-gold { background: linear-gradient(135deg, #D4AF5A, #E8C877); color: #050810; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; padding: 15px 38px; border-radius: 100px; text-transform: uppercase; box-shadow: 0 0 36px rgba(212,175,90,0.32); transition: all 0.3s; }
.cta-gold:hover { transform: translateY(-2px); box-shadow: 0 0 56px rgba(212,175,90,0.48); }
.cta-ghost { color: var(--text2); font-size: 13px; font-weight: 500; padding: 15px 38px; border-radius: 100px; border: 1px solid var(--border2); transition: all 0.3s; }
.cta-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.24); background: rgba(255,255,255,0.04); }
.hero-stats-row { display: flex; margin-top: 80px; border: 1px solid var(--border2); border-radius: 22px; overflow: hidden; background: rgba(255,255,255,0.025); backdrop-filter: blur(12px); animation: fadeUp 0.7s 0.35s ease both; }
.hstat { padding: 28px 44px; position: relative; }
.hstat:not(:last-child)::after { content: ''; position: absolute; right: 0; top: 25%; bottom: 25%; width: 1px; background: var(--border2); }
.hstat-n { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 500; color: var(--gold); line-height: 1; }
.hstat-l { font-size: 11px; color: var(--text3); margin-top: 6px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; }

/* SERVICES GRID */
.sec { padding: 100px 40px; max-width: 1200px; margin: 0 auto; }
.sec-tag { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
.sec-title { font-family: 'Playfair Display', serif; font-size: clamp(34px, 5vw, 62px); font-weight: 500; color: var(--text); line-height: 1.08; margin-bottom: 60px; }
.sec-title em { color: var(--gold); font-style: italic; }
.svc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2px; background: var(--border); border: 1px solid var(--border); border-radius: 26px; overflow: hidden; }
.svc-card { background: var(--surf); padding: 36px 32px; cursor: pointer; position: relative; overflow: hidden; transition: background 0.3s; }
.svc-glow { position: absolute; width: 200px; height: 200px; border-radius: 50%; top: -60px; right: -60px; pointer-events: none; opacity: 0; transition: opacity 0.4s; }
.svc-card:hover .svc-glow, .svc-card.sel .svc-glow { opacity: 1; }
.svc-card:hover { background: rgba(255,255,255,0.03); }
.svc-card.sel { background: rgba(212,175,90,0.06); }
.svc-icon-wrap { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 22px; border: 1px solid; position: relative; z-index: 1; transition: transform 0.3s; }
.svc-card:hover .svc-icon-wrap { transform: scale(1.08); }
.svc-label { font-size: 17px; font-weight: 600; color: var(--text); margin-bottom: 8px; position: relative; z-index: 1; }
.svc-desc-text { font-size: 13px; color: var(--text2); line-height: 1.65; margin-bottom: 20px; position: relative; z-index: 1; }
.svc-dur-tag { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; display: inline-flex; align-items: center; gap: 8px; position: relative; z-index: 1; }
.svc-dur-tag::before { content: ''; width: 20px; height: 1px; background: currentColor; opacity: 0.45; }
.sel-check { position: absolute; top: 18px; right: 18px; width: 26px; height: 26px; border-radius: 50%; background: var(--gold); color: #050810; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; z-index: 2; }

/* FEATURES */
.feat-section { background: var(--surf); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.feat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1px; background: var(--border); max-width: 1200px; margin: 0 auto; }
.feat-card { background: var(--surf); padding: 44px 36px; position: relative; overflow: hidden; transition: background 0.3s; }
.feat-card:hover { background: rgba(255,255,255,0.02); }
.feat-bg-n { font-family: 'Playfair Display', serif; font-size: 100px; font-weight: 600; color: rgba(255,255,255,0.025); position: absolute; bottom: -10px; right: 16px; line-height: 1; pointer-events: none; }
.feat-ico { font-size: 26px; margin-bottom: 22px; display: block; }
.feat-name { font-size: 18px; font-weight: 600; color: var(--text); margin-bottom: 10px; }
.feat-body { font-size: 13px; color: var(--text2); line-height: 1.75; }

/* BOOKING FLOW */
.flow-wrap { max-width: 800px; margin: 0 auto; padding: 100px 28px 80px; }
.back-btn { display: inline-flex; align-items: center; gap: 10px; color: var(--text3); font-size: 13px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 44px; transition: color 0.2s; }
.back-btn:hover { color: var(--text2); }
.back-circle { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; }
.back-btn:hover .back-circle { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.04); }

.prog { display: flex; align-items: center; margin-bottom: 52px; }
.prog-item { display: flex; align-items: center; gap: 10px; }
.prog-num { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--text3); transition: all 0.3s; flex-shrink: 0; }
.prog-num.p-done { background: rgba(212,175,90,0.2); color: var(--gold); border-color: rgba(212,175,90,0.4); }
.prog-num.p-active { background: rgba(212,175,90,0.12); color: var(--gold); border-color: rgba(212,175,90,0.35); box-shadow: 0 0 14px rgba(212,175,90,0.18); }
.prog-name { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); white-space: nowrap; }
.prog-name.p-active { color: var(--gold); }
.prog-line { flex: 1; height: 1px; background: var(--border); margin: 0 12px; transition: background 0.3s; min-width: 20px; }
.prog-line.p-done { background: rgba(212,175,90,0.3); }

.flow-h { font-family: 'Playfair Display', serif; font-size: clamp(30px, 5vw, 52px); font-weight: 500; color: var(--text); margin-bottom: 8px; }
.flow-sub { font-size: 14px; color: var(--text2); margin-bottom: 40px; }

.branch-list { display: flex; flex-direction: column; gap: 10px; }
.branch-c { background: var(--surf); border: 1px solid var(--border); border-radius: var(--r2); padding: 22px 26px; cursor: pointer; display: flex; align-items: center; gap: 20px; transition: all 0.25s; position: relative; overflow: hidden; }
.branch-c::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, var(--gold), var(--gold2)); transform: scaleY(0); transform-origin: bottom; transition: transform 0.3s; border-radius: 0 2px 2px 0; }
.branch-c:hover { border-color: var(--border2); transform: translateX(5px); }
.branch-c:hover::after, .branch-c.sel::after { transform: scaleY(1); }
.branch-c.sel { border-color: rgba(212,175,90,0.28); background: rgba(212,175,90,0.04); }
.b-ico { width: 48px; height: 48px; border-radius: 12px; background: rgba(212,175,90,0.08); border: 1px solid rgba(212,175,90,0.15); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 20px; color: var(--gold); flex-shrink: 0; font-weight: 500; }
.b-inf { flex: 1; }
.b-nm { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.b-ad { font-size: 12px; color: var(--text3); margin-bottom: 5px; }
.b-sl { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #34D399; }
.b-wt { font-size: 12px; color: var(--text3); margin-left: auto; white-space: nowrap; }
.b-arr { color: var(--text3); font-size: 20px; margin-left: 8px; transition: all 0.25s; }
.branch-c:hover .b-arr { color: var(--gold); transform: translateX(4px); }

.date-hd { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); margin-bottom: 16px; }
.date-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 36px; }
.date-c { aspect-ratio: 1; border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.22s; background: var(--surf); }
.date-c:hover:not(.date-off) { border-color: rgba(212,175,90,0.38); background: rgba(212,175,90,0.05); }
.date-c.date-sel { background: linear-gradient(135deg, #D4AF5A, #E8C877); border-color: transparent; box-shadow: 0 0 20px rgba(212,175,90,0.28); }
.date-c.date-off { opacity: 0.18; cursor: not-allowed; }
.d-wd { font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); margin-bottom: 5px; }
.d-n { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; color: var(--text); }
.date-c.date-sel .d-wd, .date-c.date-sel .d-n { color: #050810; }

.slot-hd { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); margin-bottom: 16px; }
.slot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(115px, 1fr)); gap: 10px; margin-bottom: 36px; }
.slot { padding: 13px 8px; text-align: center; border-radius: 10px; border: 1px solid var(--border); background: var(--surf); font-size: 13px; font-weight: 600; color: var(--text2); cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
.slot:hover:not(.slot-taken) { border-color: rgba(212,175,90,0.38); color: var(--gold); background: rgba(212,175,90,0.05); }
.slot.slot-sel { background: rgba(212,175,90,0.14); border-color: rgba(212,175,90,0.5); color: var(--gold); }
.slot.slot-taken { opacity: 0.22; cursor: not-allowed; text-decoration: line-through; }

.summary-panel { background: rgba(255,255,255,0.025); border: 1px solid var(--border2); border-radius: 26px; padding: 38px; margin-bottom: 28px; position: relative; overflow: hidden; }
.summary-panel::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px; background: linear-gradient(90deg, transparent, rgba(212,175,90,0.45), transparent); }
.summary-panel::after { content: ''; position: absolute; bottom: -80px; right: -80px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,90,0.06) 0%, transparent 70%); pointer-events: none; }
.sum-heading { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; color: var(--text); margin-bottom: 30px; display: flex; align-items: center; gap: 14px; }
.sum-heading::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.sum-row { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); }
.sum-row:last-child { border: none; padding-bottom: 0; }
.s-ico { font-size: 15px; color: var(--gold); width: 20px; flex-shrink: 0; margin-top: 3px; }
.s-k { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); margin-bottom: 5px; }
.s-v { font-size: 15px; font-weight: 500; color: var(--text); }
.s-v2 { font-size: 12px; color: var(--text3); margin-top: 3px; }

.btn-cnf { width: 100%; padding: 18px; border-radius: 14px; background: linear-gradient(135deg, #D4AF5A, #E8C877); color: #050810; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; box-shadow: 0 0 36px rgba(212,175,90,0.22); transition: all 0.3s; }
.btn-cnf:hover { transform: translateY(-2px); box-shadow: 0 0 54px rgba(212,175,90,0.38); }
.btn-cnf:disabled { opacity: 0.28; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-sec { width: 100%; padding: 17px; border-radius: 14px; border: 1px solid var(--border2); color: var(--text2); font-size: 13px; font-weight: 500; transition: all 0.25s; margin-top: 10px; }
.btn-sec:hover { border-color: rgba(255,255,255,0.24); color: var(--text); background: rgba(255,255,255,0.03); }

.loader-box { display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 60px; }
.loader-ring { width: 50px; height: 50px; border-radius: 50%; border: 2px solid rgba(212,175,90,0.12); border-top-color: var(--gold); animation: spin 0.85s linear infinite; }
.loader-txt { font-size: 12px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; font-weight: 600; }
@keyframes spin { to { transform: rotate(360deg); } }

/* MODAL */
.overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.78); backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.22s ease; }
.modal { background: var(--surf); border: 1px solid var(--border2); border-radius: 28px; padding: 48px 42px; max-width: 490px; width: 100%; box-shadow: 0 48px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,175,90,0.07); animation: slideUp 0.35s cubic-bezier(0.22,1,0.36,1); position: relative; overflow: hidden; }
.modal::before { content: ''; position: absolute; top: 0; left: 12%; right: 12%; height: 1px; background: linear-gradient(90deg, transparent, rgba(212,175,90,0.5), transparent); }
.modal-ring-ok { width: 78px; height: 78px; border-radius: 50%; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.28); display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; font-size: 30px; color: #34D399; box-shadow: 0 0 36px rgba(52,211,153,0.15); }
.modal-ring-warn { width: 78px; height: 78px; border-radius: 50%; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.22); display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; font-size: 30px; color: #F87171; }
.modal h2 { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 500; color: var(--text); text-align: center; margin-bottom: 10px; }
.modal-p { font-size: 14px; color: var(--text2); text-align: center; line-height: 1.75; margin-bottom: 28px; }
.modal-ref { text-align: center; font-size: 11px; font-weight: 700; letter-spacing: 3.5px; color: var(--gold); background: rgba(212,175,90,0.08); border: 1px solid rgba(212,175,90,0.2); padding: 11px 22px; border-radius: 100px; display: inline-block; margin: 0 auto 28px; }
.modal-ref-row { text-align: center; margin-bottom: 28px; }
.modal-det { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 28px; }
.det-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
.det-row:last-child { border: none; padding-bottom: 0; }
.det-k { color: var(--text3); font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }
.det-v { color: var(--text); font-weight: 600; }
.modal-btns { display: flex; gap: 10px; }
.mbtn-gold { flex: 1; padding: 14px; border-radius: 12px; background: linear-gradient(135deg, #D4AF5A, #E8C877); color: #050810; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; transition: opacity 0.2s; }
.mbtn-gold:hover { opacity: 0.9; }
.mbtn-out { flex: 1; padding: 14px; border-radius: 12px; border: 1px solid var(--border2); color: var(--text2); font-size: 13px; font-weight: 500; transition: all 0.2s; }
.mbtn-out:hover { border-color: rgba(255,255,255,0.24); color: var(--text); }
.mbtn-red { flex: 1; padding: 14px; border-radius: 12px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.22); color: #F87171; font-size: 13px; font-weight: 600; transition: all 0.2s; }
.mbtn-red:hover { background: rgba(239,68,68,0.18); }

/* DASHBOARD */
.dash-wrap { max-width: 1020px; margin: 0 auto; padding: 100px 40px 80px; }
.dash-top { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 52px; flex-wrap: wrap; gap: 20px; }
.d-greet { font-size: 12px; color: var(--text3); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 10px; }
.d-title { font-family: 'Playfair Display', serif; font-size: clamp(36px, 5vw, 54px); font-weight: 500; color: var(--text); line-height: 1; }
.d-title em { color: var(--gold); font-style: italic; }
.d-new-btn { background: linear-gradient(135deg, #D4AF5A, #E8C877); color: #050810; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 13px 28px; border-radius: 100px; box-shadow: 0 0 28px rgba(212,175,90,0.22); transition: all 0.25s; white-space: nowrap; }
.d-new-btn:hover { transform: translateY(-2px); box-shadow: 0 0 44px rgba(212,175,90,0.38); }

.stat-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 52px; }
.scard { background: var(--surf); border: 1px solid var(--border); border-radius: 20px; padding: 28px 26px; transition: all 0.25s; position: relative; overflow: hidden; }
.scard:hover { border-color: var(--border2); transform: translateY(-2px); }
.scard-gold { background: linear-gradient(135deg, rgba(212,175,90,0.14) 0%, rgba(212,175,90,0.04) 100%); border-color: rgba(212,175,90,0.18); }
.scard-shine { position: absolute; top: -50px; right: -50px; width: 120px; height: 120px; border-radius: 50%; pointer-events: none; }
.sc-num { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 500; color: var(--text); line-height: 1; margin-bottom: 8px; }
.scard-gold .sc-num { color: var(--gold); }
.sc-lbl { font-size: 11px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; }

.sec-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
.sec-bar-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 500; color: var(--text); }
.sec-bar-link { font-size: 11px; color: var(--gold); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
.sec-bar-link:hover { opacity: 0.65; }

.bk-card { background: var(--surf); border: 1px solid var(--border); border-radius: var(--r2); padding: 20px 24px; display: flex; align-items: center; gap: 20px; transition: all 0.25s; margin-bottom: 10px; position: relative; overflow: hidden; animation: fadeUp 0.42s ease both; }
.bk-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; transition: width 0.3s; }
.bk-card:hover { border-color: var(--border2); transform: translateX(4px); }
.bk-card:hover::before { width: 2px; background: linear-gradient(180deg, var(--gold), var(--gold2)); }
.bk-ico { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; flex-shrink: 0; }
.bk-main { flex: 1; min-width: 0; }
.bk-name { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 7px; }
.bk-meta { display: flex; gap: 18px; flex-wrap: wrap; }
.bk-m { font-size: 12px; color: var(--text3); display: flex; align-items: center; gap: 5px; }
.bk-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text3); }
.bk-right { display: flex; flex-direction: column; align-items: flex-end; gap: 9px; flex-shrink: 0; }
.bk-id { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: var(--text3); }
.badge { font-size: 10px; font-weight: 700; padding: 5px 14px; border-radius: 100px; letter-spacing: 1px; text-transform: uppercase; border: 1px solid; }
.badge-up { color: #7C9EFF; border-color: rgba(124,158,255,0.22); background: rgba(124,158,255,0.1); }
.badge-done { color: #34D399; border-color: rgba(52,211,153,0.2); background: rgba(52,211,153,0.08); }
.badge-can { color: #F87171; border-color: rgba(248,113,113,0.18); background: rgba(248,113,113,0.07); }
.can-btn { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #F87171; padding: 6px 14px; border-radius: 100px; border: 1px solid rgba(248,113,113,0.2); transition: all 0.2s; }
.can-btn:hover { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.35); }

/* HISTORY FILTERS */
.filt-row { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
.filt { padding: 9px 22px; border-radius: 100px; border: 1px solid var(--border); font-size: 11px; font-weight: 700; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; transition: all 0.2s; }
.filt:hover { border-color: var(--border2); color: var(--text2); }
.filt.filt-on { background: rgba(212,175,90,0.1); border-color: rgba(212,175,90,0.28); color: var(--gold); }

/* EMPTY */
.empty { text-align: center; padding: 80px 24px; }
.empty-sym { font-family: 'Playfair Display', serif; font-size: 72px; font-weight: 400; color: rgba(255,255,255,0.06); margin-bottom: 20px; }
.empty-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 500; color: var(--text); margin-bottom: 8px; }
.empty-sub { font-size: 14px; color: var(--text3); margin-bottom: 36px; }

/* DIVIDER + FOOTER */
.divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border2), transparent); margin: 0; }
.footer { background: var(--bg); border-top: 1px solid var(--border); padding: 44px 40px; text-align: center; }
.footer-logo { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 500; color: var(--gold); letter-spacing: 3px; margin-bottom: 14px; }
.footer-sub { font-size: 11px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(48px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 700px) {
  .nav { padding: 0 20px; }
  .nav-links { display: none; }
  .hero-h1 { font-size: 44px; letter-spacing: -1px; }
  .hero-stats-row { flex-direction: column; }
  .hstat::after { display: none !important; }
  .sec, .flow-wrap, .dash-wrap { padding-left: 20px; padding-right: 20px; }
  .date-grid { grid-template-columns: repeat(5,1fr); }
  .modal { padding: 30px 22px; }
  .modal-btns { flex-direction: column; }
  .stat-row { grid-template-columns: 1fr 1fr; }
  .svc-grid { grid-template-columns: 1fr; }
  .bk-card { flex-wrap: wrap; }
}
`;

function genRef() { return "BQ-" + String(Math.floor(Math.random() * 9000) + 1000); }

export default function App() {
  const [page, setPage] = useState("landing");
  const [bookings, setBookings] = useState(INIT_BOOKINGS);
  const [step, setStep] = useState(1);
  const [selSvc, setSelSvc] = useState(null);
  const [selBranch, setSelBranch] = useState(null);
  const [selDate, setSelDate] = useState(null);
  const [selTime, setSelTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [okModal, setOkModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(null);
  const [ref, setRef] = useState(null);
  const [histFilt, setHistFilt] = useState("all");
  const [theme, setTheme] = useState("light");

  const slots = selDate ? genSlots(selDate) : [];
  const upcoming = bookings.filter(b => b.status === "upcoming");

  const futureDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return { iso: fmt(d), wd: d.toLocaleDateString("en-US", { weekday: "short" }), day: d.getDate(), off: d.getDay() === 0 || d.getDay() === 6 };
  });

  function startBook() {
    setStep(1); setSelSvc(null); setSelBranch(null); setSelDate(null); setSelTime(null);
    setPage("booking"); window.scrollTo({ top: 0 });
  }

  function doConfirm() {
    setLoading(true);
    const r = genRef();
    setTimeout(() => {
      setBookings(prev => [{ id: r, service: selSvc, branch: selBranch, date: selDate, time: selTime, status: "upcoming", bookedAt: "Today" }, ...prev]);
      setRef(r); setLoading(false); setOkModal(true);
    }, 1800);
  }

  function doCancel(id) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    setCancelModal(null);
  }

  const histData = bookings.filter(b => histFilt === "all" || b.status === histFilt);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="logo" onClick={() => setPage("landing")}>
          <div className="logo-mark">◈</div>
          NoQ
        </div>
        <div className="nav-links">
          <button className={`nav-link ${page==="landing"?"active":""}`} onClick={() => setPage("landing")}>Home</button>
          <button className={`nav-link ${page==="dashboard"?"active":""}`} onClick={() => setPage("dashboard")}>Dashboard</button>
          <button className={`nav-link ${page==="history"?"active":""}`} onClick={() => setPage("history")}>History</button>
        </div>
        <div className="nav-actions">
          <div className="theme-switch-wrap">
            <span className="theme-switch-label">{theme === "light" ? "Light" : "Dark"}</span>
            <button
              className={`theme-switch ${theme === "dark" ? "on" : ""}`}
              onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
              aria-label="Toggle light and dark mode"
            >
              <span className="theme-switch-knob" />
            </button>
          </div>
          <button className="nav-book" onClick={startBook}>Book Now</button>
        </div>
      </nav>

      {page === "landing" && <Landing onBook={startBook} onDash={() => setPage("dashboard")} count={upcoming.length} />}
      {page === "booking" && <BookingFlow step={step} setStep={setStep} selSvc={selSvc} setSelSvc={setSelSvc} selBranch={selBranch} setSelBranch={setSelBranch} selDate={selDate} setSelDate={setSelDate} selTime={selTime} setSelTime={setSelTime} futureDates={futureDates} slots={slots} loading={loading} onConfirm={doConfirm} onBack={() => setPage("landing")} />}
      {page === "dashboard" && <Dashboard bookings={upcoming} allBookings={bookings} onBook={startBook} onCancel={id => setCancelModal(id)} onHistory={() => setPage("history")} />}
      {page === "history" && <HistoryPage bookings={histData} filt={histFilt} setFilt={setHistFilt} onCancel={id => setCancelModal(id)} onBack={() => setPage("dashboard")} />}

      {okModal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-ring-ok">✓</div>
            <h2>All Set!</h2>
            <p className="modal-p">Your appointment is confirmed. Show your booking ID at the reception desk when you arrive.</p>
            <div className="modal-ref-row"><div className="modal-ref">{ref}</div></div>
            <div className="modal-det">
              <div className="det-row"><span className="det-k">Service</span><span className="det-v">{selSvc?.label}</span></div>
              <div className="det-row"><span className="det-k">Branch</span><span className="det-v">{selBranch?.label}</span></div>
              <div className="det-row"><span className="det-k">Date</span><span className="det-v">{dispDate(selDate)}</span></div>
              <div className="det-row"><span className="det-k">Time</span><span className="det-v">{selTime}</span></div>
              <div className="det-row"><span className="det-k">Duration</span><span className="det-v">{selSvc?.duration}</span></div>
            </div>
            <div className="modal-btns">
              <button className="mbtn-gold" onClick={() => { setOkModal(false); setPage("dashboard"); }}>Dashboard</button>
              <button className="mbtn-out" onClick={() => { setOkModal(false); setPage("landing"); }}>Done</button>
            </div>
          </div>
        </div>
      )}

      {cancelModal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-ring-warn">!</div>
            <h2>Cancel Booking?</h2>
            <p className="modal-p">This is permanent. Your slot will be released and others may book it.</p>
            <div className="modal-btns">
              <button className="mbtn-red" onClick={() => doCancel(cancelModal)}>Yes, Cancel It</button>
              <button className="mbtn-out" onClick={() => setCancelModal(null)}>Keep It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Landing({ onBook, onDash, count }) {
  return (
    <div>
      <section className="hero">
        <div className="hero-bg-orb" style={{ width: 700, height: 700, background: "radial-gradient(circle, rgba(124,158,255,0.1) 0%, transparent 70%)", top: -250, left: -250 }} />
        <div className="hero-bg-orb" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(212,175,90,0.08) 0%, transparent 70%)", bottom: -100, right: -150 }} />
        <div className="hero-bg-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)", top: "45%", left: "55%", transform: "translate(-50%,-50%)" }} />
        <div className="hero-grid-lines" />
        <div className="hero-eyebrow"><span className="eyebrow-dot" />Bangladesh's Premier Banking Platform</div>
        <div className="hero-h1">Skip the Queue.</div>
        <div className="hero-h2">Bank on <em>Your Time.</em></div>
        <p className="hero-desc">Book any banking service at any branch in seconds. Walk straight in — no waiting, no wasted afternoons.</p>
        <div className="hero-btns">
          <button className="cta-gold" onClick={onBook}>Book an Appointment</button>
          <button className="cta-ghost" onClick={onDash}>{count > 0 ? `My Bookings (${count})` : "View Dashboard"}</button>
        </div>
        <div className="hero-stats-row">
          <div className="hstat"><div className="hstat-n">45+</div><div className="hstat-l">Branches</div></div>
          <div className="hstat"><div className="hstat-n">0 min</div><div className="hstat-l">Queue Time</div></div>
          <div className="hstat"><div className="hstat-n">6</div><div className="hstat-l">Services</div></div>
          <div className="hstat"><div className="hstat-n">24/7</div><div className="hstat-l">Available</div></div>
        </div>
      </section>

      <div className="sec">
        <p className="sec-tag">Our Services</p>
        <h2 className="sec-title">What Brings You to<br/>the <em>Bank Today?</em></h2>
        <div className="svc-grid">
          {SERVICES.map(s => (
            <div key={s.id} className="svc-card" onClick={onBook}>
              <div className="svc-glow" style={{ background: `radial-gradient(circle, ${s.color}18 0%, transparent 70%)` }} />
              <div className="svc-icon-wrap" style={{ color: s.color, borderColor: `${s.color}28`, background: `${s.color}0E` }}>{s.icon}</div>
              <div className="svc-label">{s.label}</div>
              <div className="svc-desc-text">{s.desc}</div>
              <div className="svc-dur-tag" style={{ color: s.color }}>{s.duration}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />
      <section className="feat-section">
        <div className="sec" style={{ paddingBottom: 0 }}>
          <p className="sec-tag">Why NoQ</p>
          <h2 className="sec-title">A New Standard in<br/><em>Banking Experience</em></h2>
        </div>
        <div className="feat-grid">
          {[
            { ico: "⚡", name: "60-Second Booking", body: "From open to confirmed in under a minute. No forms, no friction, no phone calls." },
            { ico: "◎", name: "Zero Queue Guarantee", body: "Your slot is reserved. Walk straight to the service desk when you arrive." },
            { ico: "◈", name: "All Branches, One App", body: "Access all 45+ branches across Bangladesh from one unified platform." },
            { ico: "▲", name: "Smart Reminders", body: "Timely notifications before your appointment so you never miss a slot." },
          ].map((f, i) => (
            <div key={f.name} className="feat-card">
              <div className="feat-bg-n">{String(i + 1).padStart(2, "0")}</div>
              <span className="feat-ico">{f.ico}</span>
              <div className="feat-name">{f.name}</div>
              <div className="feat-body">{f.body}</div>
            </div>
          ))}
        </div>
      </section>
      <div className="divider" />
      <footer className="footer">
        <div className="footer-logo">NoQ</div>
        <div className="footer-sub">© 2025 NoQ · Skip the Queue, Not the Experience</div>
      </footer>
    </div>
  );
}

function Progress({ step }) {
  const steps = ["Service", "Branch", "Date & Time", "Review"];
  return (
    <div className="prog">
      {steps.map((s, i) => (
        <div key={s} className="prog-item" style={{ flex: i < steps.length - 1 ? 1 : "0 0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div>
            <div className={`prog-name ${i + 1 === step ? "p-active" : ""}`}>{s}</div>
            <div className={`prog-num ${i + 1 < step ? "p-done" : ""} ${i + 1 === step ? "p-active" : ""}`}>{i + 1 < step ? "✓" : i + 1}</div>
          </div>
          {i < steps.length - 1 && <div className={`prog-line ${i + 1 < step ? "p-done" : ""}`} />}
        </div>
      ))}
    </div>
  );
}

function BookingFlow({ step, setStep, selSvc, setSelSvc, selBranch, setSelBranch, selDate, setSelDate, selTime, setSelTime, futureDates, slots, loading, onConfirm, onBack }) {
  const stepNames = ["Service", "Branch", "Date & Time", "Review"];
  return (
    <div className="flow-wrap">
      <button className="back-btn" onClick={step === 1 ? onBack : () => setStep(s => s - 1)}>
        <span className="back-circle">←</span>
        {step === 1 ? "Back to Home" : `Back to ${stepNames[step - 2]}`}
      </button>
      <Progress step={step} />

      {step === 1 && <>
        <div className="flow-h">Choose Your Service</div>
        <div className="flow-sub">Select the banking service you need an appointment for</div>
        <div className="svc-grid">
          {SERVICES.map(s => (
            <div key={s.id} className={`svc-card ${selSvc?.id === s.id ? "sel" : ""}`} onClick={() => { setSelSvc(s); setTimeout(() => setStep(2), 240); }}>
              <div className="svc-glow" style={{ background: `radial-gradient(circle, ${s.color}18 0%, transparent 70%)` }} />
              <div className="svc-icon-wrap" style={{ color: s.color, borderColor: `${s.color}28`, background: `${s.color}0E` }}>{s.icon}</div>
              <div className="svc-label">{s.label}</div>
              <div className="svc-desc-text">{s.desc}</div>
              <div className="svc-dur-tag" style={{ color: s.color }}>{s.duration}</div>
              {selSvc?.id === s.id && <div className="sel-check">✓</div>}
            </div>
          ))}
        </div>
      </>}

      {step === 2 && <>
        <div className="flow-h">Choose Your Branch</div>
        <div className="flow-sub">Select your preferred branch location</div>
        <div className="branch-list">
          {BRANCHES.map(b => (
            <div key={b.id} className={`branch-c ${selBranch?.id === b.id ? "sel" : ""}`} onClick={() => { setSelBranch(b); setTimeout(() => setStep(3), 240); }}>
              <div className="b-ico">B</div>
              <div className="b-inf">
                <div className="b-nm">{b.label}</div>
                <div className="b-ad">{b.address}</div>
                <div className="b-sl">● {b.slots} slots available</div>
              </div>
              <div className="b-wt">{b.wait} wait</div>
              <div className="b-arr">›</div>
            </div>
          ))}
        </div>
      </>}

      {step === 3 && <>
        <div className="flow-h">Date & Time</div>
        <div className="flow-sub">Pick your preferred appointment date and time</div>
        <div className="date-hd">Available Dates — Next 2 Weeks</div>
        <div className="date-grid">
          {futureDates.map(d => (
            <div key={d.iso} className={`date-c ${d.off ? "date-off" : ""} ${selDate === d.iso ? "date-sel" : ""}`}
              onClick={() => { if (!d.off) { setSelDate(d.iso); setSelTime(null); } }}>
              <span className="d-wd">{d.wd}</span>
              <span className="d-n">{d.day}</span>
            </div>
          ))}
        </div>
        {selDate && <>
          <div className="slot-hd">Slots for {new Date(selDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
          <div className="slot-grid">
            {slots.map(s => (
              <button key={s.time} className={`slot ${!s.available ? "slot-taken" : ""} ${selTime === s.time ? "slot-sel" : ""}`}
                onClick={() => s.available && setSelTime(s.time)}>
                {s.time}
              </button>
            ))}
          </div>
        </>}
        <button className="btn-cnf" disabled={!selDate || !selTime} onClick={() => setStep(4)}>Continue to Review →</button>
      </>}

      {step === 4 && <>
        <div className="flow-h">Review & Confirm</div>
        <div className="flow-sub">Please verify your appointment details before confirming</div>
        <div className="summary-panel">
          <div className="sum-heading">Appointment Summary</div>
          <div className="sum-row">
            <div className="s-ico" style={{ color: selSvc?.color }}>{selSvc?.icon}</div>
            <div><div className="s-k">Service</div><div className="s-v">{selSvc?.label}</div><div className="s-v2">{selSvc?.duration} appointment</div></div>
          </div>
          <div className="sum-row">
            <div className="s-ico">◈</div>
            <div><div className="s-k">Branch</div><div className="s-v">{selBranch?.label}</div><div className="s-v2">{selBranch?.address}</div></div>
          </div>
          <div className="sum-row">
            <div className="s-ico">◎</div>
            <div><div className="s-k">Date</div><div className="s-v">{dispDate(selDate)}</div></div>
          </div>
          <div className="sum-row">
            <div className="s-ico">▷</div>
            <div><div className="s-k">Time Slot</div><div className="s-v">{selTime}</div></div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", lineHeight: 1.85, marginBottom: 24, letterSpacing: "0.3px" }}>
          By confirming, you agree to arrive 5 minutes before your slot.<br />Cancellations must be made at least 2 hours in advance.
        </p>
        {loading ? (
          <div className="loader-box"><div className="loader-ring" /><div className="loader-txt">Securing your slot...</div></div>
        ) : (
          <button className="btn-cnf" onClick={onConfirm}>Confirm Appointment</button>
        )}
      </>}
    </div>
  );
}

function Dashboard({ bookings, allBookings, onBook, onCancel, onHistory }) {
  const comp = allBookings.filter(b => b.status === "completed").length;
  return (
    <div className="dash-wrap">
      <div className="dash-top">
        <div>
          <div className="d-greet">Welcome Back</div>
          <div className="d-title">My <em>Dashboard</em></div>
        </div>
        <button className="d-new-btn" onClick={onBook}>+ New Booking</button>
      </div>
      <div className="stat-row">
        <div className="scard scard-gold">
          <div className="scard-shine" style={{ background: "radial-gradient(circle, rgba(212,175,90,0.12) 0%, transparent 70%)" }} />
          <div className="sc-num">{bookings.length}</div>
          <div className="sc-lbl">Upcoming</div>
        </div>
        <div className="scard">
          <div className="scard-shine" style={{ background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)" }} />
          <div className="sc-num">{comp}</div>
          <div className="sc-lbl">Completed</div>
        </div>
        <div className="scard">
          <div className="scard-shine" style={{ background: "radial-gradient(circle, rgba(124,158,255,0.07) 0%, transparent 70%)" }} />
          <div className="sc-num">{allBookings.length}</div>
          <div className="sc-lbl">Total Bookings</div>
        </div>
        <div className="scard">
          <div className="sc-num">0 min</div>
          <div className="sc-lbl">Queue Time</div>
        </div>
      </div>
      <div className="sec-bar">
        <div className="sec-bar-title">Upcoming Appointments</div>
        <span className="sec-bar-link" onClick={onHistory}>History →</span>
      </div>
      {bookings.length === 0 ? (
        <div className="empty">
          <div className="empty-sym">◎</div>
          <div className="empty-title">No Upcoming Appointments</div>
          <div className="empty-sub">Book your first appointment to skip the queue</div>
          <button className="cta-gold" onClick={onBook}>Book Now</button>
        </div>
      ) : bookings.map((b, i) => <BkCard key={b.id} b={b} onCancel={onCancel} delay={i * 80} />)}
    </div>
  );
}

function HistoryPage({ bookings, filt, setFilt, onCancel, onBack }) {
  const filts = [{ id: "all", l: "All" }, { id: "upcoming", l: "Upcoming" }, { id: "completed", l: "Completed" }, { id: "cancelled", l: "Cancelled" }];
  return (
    <div className="dash-wrap">
      <button className="back-btn" onClick={onBack}><span className="back-circle">←</span> Back to Dashboard</button>
      <div className="d-title" style={{ marginBottom: 32 }}>Booking <em>History</em></div>
      <div className="filt-row">
        {filts.map(f => <button key={f.id} className={`filt ${filt === f.id ? "filt-on" : ""}`} onClick={() => setFilt(f.id)}>{f.l}</button>)}
      </div>
      {bookings.length === 0 ? (
        <div className="empty">
          <div className="empty-sym">◈</div>
          <div className="empty-title">No Records Found</div>
          <div className="empty-sub">No {filt !== "all" ? filt : ""} bookings to display</div>
        </div>
      ) : bookings.map((b, i) => <BkCard key={b.id} b={b} onCancel={onCancel} delay={i * 60} />)}
    </div>
  );
}

function BkCard({ b, onCancel, delay = 0 }) {
  return (
    <div className="bk-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="bk-ico" style={{ background: `${b.service.color}12`, color: b.service.color }}>{b.service.icon}</div>
      <div className="bk-main">
        <div className="bk-name">{b.service.label}</div>
        <div className="bk-meta">
          <span className="bk-m"><span className="bk-dot" />{b.branch.label}</span>
          <span className="bk-m"><span className="bk-dot" />{dispDate(b.date)}</span>
          <span className="bk-m"><span className="bk-dot" />{b.time}</span>
        </div>
      </div>
      <div className="bk-right">
        <div className="bk-id">{b.id}</div>
        <span className={`badge badge-${b.status === "upcoming" ? "up" : b.status === "completed" ? "done" : "can"}`}>{b.status}</span>
        {b.status === "upcoming" && <button className="can-btn" onClick={() => onCancel(b.id)}>Cancel</button>}
      </div>
    </div>
  );
}
