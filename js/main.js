// Navigation layer + motor de estados.
// Cada capítulo = lista de pasos (ENTER → … → cierre). Cada paso es un timeline GSAP
// pausado que se reproduce al avanzar y se invierte al retroceder. Entre capítulos:
// salida del contenido → el hilo completa su tramo → la cinta se desplaza → entrada.
import { CHAPTERS } from "./content.js";
import { createThread } from "./thread.js";
import c1 from "./chapters/01-intro.js";
import c2 from "./chapters/02-problem.js";
import c3 from "./chapters/03-positioning.js";
import c4 from "./chapters/04-market.js";
import c5 from "./chapters/05-campaign.js";
import c6 from "./chapters/06-funnel.js";
import c7 from "./chapters/07-finance.js";
import c8 from "./chapters/08-plan.js";

const { gsap, ScrollTrigger, LoopSmithMotion: LSM } = window;
gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
// Movimiento reducido: mismos estados y mismo orden, sin desplazamientos perceptibles.
if (reduced) gsap.globalTimeline.timeScale(40);

const DEFS = [c1, c2, c3, c4, c5, c6, c7, c8];
DEFS.forEach((d) => {
  let shape = "base", p = 0;
  d.states = d.steps.map((s) => {
    shape = s.thread?.shape ?? shape;
    p = s.thread?.p ?? p;
    return { shape, p, duration: s.thread?.duration ?? 0.9, ease: s.thread?.ease ?? "power2.inOut" };
  });
});

const $ = (s) => document.querySelector(s);
const stage = $(".stage");

// ---------- Escena 16:9 escalada ----------
const fit = () => document.documentElement.style.setProperty("--s", Math.min(innerWidth / 1920, innerHeight / 1080));
fit();
addEventListener("resize", fit);

// ---------- Capítulos ----------
const layer = $(".chapters");
const els = DEFS.map((d, i) => {
  const s = document.createElement("section");
  s.className = `ch ch${i + 1}`;
  s.setAttribute("aria-label", `${CHAPTERS[i].n} / 08 — ${CHAPTERS[i].label}`);
  s.innerHTML = d.html;
  s.inert = true;
  layer.append(s);
  return s;
});

const thread = createThread($(".thread"), DEFS.map((d) => d.shapes));

// ---------- Estado ----------
let ch = 0, step = 0, tls = [], ctx = null, fx = [], cleanup = null, running = [], transitioning = true;
const listeners = new Set();
const api = {
  goStep: (k) => goStep(k),
  onStep(cb) { listeners.add(cb); cb(step); return () => listeners.delete(cb); },
};

const run = (...anims) => { running = anims.filter(Boolean); };
const busy = () => running.some((a) => a.isActive());
const finish = () => running.forEach((a) => a.progress(a.reversed() ? 0 : 1));
const threadTo = (i, s, o) => thread.to(i, s, o ?? { duration: s.duration, ease: s.ease });

function mount(i, at) {
  const el = els[i], d = DEFS[i];
  el.classList.add("is-active");
  el.inert = false;
  ctx = gsap.context(() => {
    tls = d.steps.map((s) => {
      const tl = gsap.timeline({ paused: true });
      s.build?.(tl);
      return tl;
    });
  }, el);
  if (at === "enter") {
    step = 0;
    // Títulos: lusion/effects/type (máscara por palabra o carácter).
    fx = [...el.querySelectorAll("[data-type]")].map((t) => LSM.type(t, {
      mode: t.dataset.type, delay: Number(t.dataset.delay || 0.12),
      stagger: 0.06, duration: t.dataset.type === "chars" ? 1.1 : 0.8, distance: 110, scale: 0.96,
    }));
    run(tls[0].play(0), threadTo(i, d.states[0]));
  } else {
    step = at;
    tls.slice(0, at + 1).forEach((tl) => tl.progress(1));
    let fade;
    ctx.add(() => { fade = gsap.from(el, { opacity: 0, duration: 0.5, ease: "power1.out" }); });
    run(fade, threadTo(i, d.states[at], { duration: 0.6 }));
  }
  cleanup = d.mount?.(el, api);
  emit();
}

function unmount(i) {
  fx.forEach((f) => f.destroy());
  fx = [];
  cleanup?.();
  cleanup = null;
  ctx?.revert();
  ctx = null;
  tls = [];
  running = [];
  els[i].classList.remove("is-active");
  els[i].inert = true;
}

function goStep(k) {
  if (transitioning || k === step || k < 0 || k >= tls.length) return;
  finish();
  const d = DEFS[ch];
  if (k > step) {
    for (let j = step + 1; j < k; j += 1) tls[j].progress(1);
    step = k;
    run(tls[k].timeScale(1).play(0), threadTo(ch, d.states[k]));
  } else {
    for (let j = step; j > k + 1; j -= 1) tls[j].progress(0);
    const tl = tls[k + 1].timeScale(1.8).reverse();
    step = k;
    run(tl, threadTo(ch, d.states[k], { duration: 0.7 }));
  }
  emit();
}

function next(soft) {
  if (transitioning) return;
  if (busy()) { if (!soft) finish(); return; } // una pulsación durante una animación la completa, no salta
  if (step < tls.length - 1) goStep(step + 1);
  else go(ch + 1, "enter");
}

function prev(soft) {
  if (transitioning) return;
  if (busy()) { if (!soft) finish(); return; }
  if (step > 0) goStep(step - 1);
  else go(ch - 1, "end");
}

function jumpTo(i) {
  if (i === ch) goStep(0);
  else go(i, "enter");
}

function go(target, land) {
  if (transitioning || target < 0 || target >= DEFS.length || target === ch) return;
  transitioning = true;
  finish();
  const from = ch, dir = Math.sign(target - from), el = els[from];
  const tl = gsap.timeline({ onComplete: () => { transitioning = false; } });

  // 1. El contenido del capítulo actual se retira, coordinado.
  ctx.add(() => {
    tl.to(el.querySelectorAll(".blk"), { opacity: 0, y: -26 * dir, duration: 0.42, ease: "power2.in", stagger: { amount: 0.18 } }, 0);
  });
  // 2. El hilo completa (o rebobina) su tramo.
  tl.add(thread.to(from, { p: dir > 0 ? 1 : 0 }, { duration: 0.55, ease: dir > 0 ? "power2.in" : "power2.inOut" }), 0.05);
  // 3. La cinta se desplaza hasta el tramo del capítulo destino.
  const PAN = 0.6, dur = Math.min(1.05 + 0.18 * (Math.abs(target - from) - 1), 1.7);
  tl.add(() => {
    for (let k = Math.min(from, target) + 1; k < Math.max(from, target); k += 1) thread.set(k, { shape: "base", p: dir > 0 ? 1 : 0 });
    const d = DEFS[target];
    thread.set(target, land === "end" ? { shape: d.states.at(-1).shape, p: 1 } : { shape: d.states[0].shape, p: 0 });
    thread.focus(target);
    hudChapter(target);
  }, PAN);
  tl.add(thread.pan(target, { duration: dur }), PAN);
  // 4. Entra el capítulo nuevo cuando la cinta casi llegó.
  tl.add(() => {
    unmount(from);
    ch = target;
    mount(target, land === "end" ? DEFS[target].steps.length - 1 : "enter");
  }, PAN + dur * 0.72);
}

// ---------- HUD ----------
const hud = {
  n: $(".hud-n"), label: $(".hud-label"), steps: $(".hud-steps"), hint: $(".hud-hint"),
  buttons: [...document.querySelectorAll(".hud-chapters button")],
};

function hudChapter(i) {
  gsap.to(hud.label, {
    opacity: 0, y: -8, duration: 0.2, overwrite: true,
    onComplete() {
      hud.n.textContent = CHAPTERS[i].n;
      hud.label.textContent = CHAPTERS[i].label;
      gsap.fromTo(hud.label, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 });
    },
  });
  hud.buttons.forEach((b, k) => {
    if (k === i) b.setAttribute("aria-current", "step");
    else b.removeAttribute("aria-current");
    b.classList.toggle("is-done", k < i);
  });
}

function emit() {
  listeners.forEach((cb) => cb(step));
  if (hud.steps.childElementCount !== tls.length) hud.steps.replaceChildren(...tls.map(() => document.createElement("i")));
  [...hud.steps.children].forEach((dot, k) => {
    dot.classList.toggle("is-on", k < step);
    dot.classList.toggle("is-now", k === step);
  });
  hud.steps.setAttribute("aria-label", `Paso ${step + 1} de ${tls.length}`);
  history.replaceState(null, "", `#${ch + 1}.${step + 1}`);
}

const hideHint = () => hud.hint.classList.add("is-gone");

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

// ---------- Entrada: teclado, rueda/trackpad/touch, HUD ----------
addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const k = e.key;
  const fwd = ["ArrowRight", "ArrowDown", "PageDown"].includes(k) || (k === " " && !e.shiftKey);
  const back = ["ArrowLeft", "ArrowUp", "PageUp"].includes(k) || (k === " " && e.shiftKey);
  if (fwd || back) {
    e.preventDefault();
    hideHint();
    if (!e.repeat) (fwd ? next : prev)();
  } else if (k === "Home") { e.preventDefault(); jumpTo(0); }
  else if (k === "End") { e.preventDefault(); jumpTo(DEFS.length - 1); }
  else if (/^[1-8]$/.test(k)) jumpTo(Number(k) - 1);
  else if (k === "f" || k === "F") toggleFullscreen();
});

// Un gesto = un paso: los eventos que llegan sin pausa (inercia del trackpad) se descartan.
let lastGesture = 0;
const gesture = (fn) => {
  const now = performance.now();
  const fresh = now - lastGesture > 280;
  lastGesture = now;
  if (fresh) { hideHint(); fn(true); }
};
ScrollTrigger.observe({
  target: window, type: "wheel,touch", wheelSpeed: -1, tolerance: 12, preventDefault: true,
  onUp: () => gesture(next), onDown: () => gesture(prev),
});

hud.buttons.forEach((b, i) => b.addEventListener("click", () => { jumpTo(i); b.blur(); }));
$(".hud-fs").addEventListener("click", (e) => { toggleFullscreen(); e.currentTarget.blur(); });

// ---------- Arranque ----------
const m = /^#(\d)(?:\.(\d+))?$/.exec(location.hash);
const start = { ch: m ? Math.min(Math.max(Number(m[1]) - 1, 0), 7) : 0, step: m && m[2] ? Number(m[2]) - 1 : 0 };
start.step = Math.min(Math.max(start.step, 0), DEFS[start.ch].steps.length - 1);
for (let k = 0; k < start.ch; k += 1) thread.set(k, { p: 1 });
thread.set(start.ch, { shape: DEFS[start.ch].states[start.step].shape, p: 0 });
thread.focus(start.ch);
thread.jump(start.ch);
ch = start.ch;
hudChapter(ch);

function begin() {
  mount(ch, start.step ? start.step : "enter");
  transitioning = false;
}

// Precarga: lusion/effects/loader (contador 000→100 y cortina).
const loader = LSM.loader($(".boot"), { duration: 1.3, exit: 0.7, color: "#0a0a09", ease: "power3.inOut" });
if (reduced) begin();
else {
  loader.replay();
  gsap.delayedCall(1.75, begin);
}
