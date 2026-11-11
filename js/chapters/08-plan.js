import { META, PLAN as P } from "../content.js";
import { chain, cubic, fracAtX } from "../thread.js";
import { OUT, header, enterHeader, rise, sink } from "./shared.js";

// El hilo se vuelve una línea de tiempo de cuatro semanas…
const Y = 420;
const WX = [300, 700, 1100, 1500];
const base = chain([0, Y], [1920, Y]);
// …y al final baja a subrayar FOOTAGE y se detiene dentro del cuadro: fin del recorrido.
const close = chain(cubic([0, Y], [210, Y], [170, 700], [380, 700]), [1540, 700]);

const net = (name, w) => `
  <section class="c8-net">
    <header><p class="mono">${name}</p><p class="mono c8-format">${w.format}</p></header>
    <h4>${w.axis}</h4>
    <div class="c8-goal"><p class="mono">Objetivo / KPI</p><p class="small">${w.goal}</p></div>
  </section>`;

const weekStep = (i) => ({
  name: `SEMANA_${i + 1}`,
  thread: { p: fracAtX(base, WX[i]), duration: 1 },
  build(tl) {
    if (i) tl.to(`.c8-w${i - 1}`, { ...OUT, y: -16, duration: 0.35, ease: "power2.in" }, 0);
    tl.from(`.c8-week-${i} circle`, { scale: 0.4, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2)" }, 0.6);
    rise(tl, `.c8-w${i} .c8-net`, 0.55, { stagger: 0.14 });
  },
});

export default {
  shapes: { base, close },
  html: `
    ${header({ n: "08", kicker: P.title, title: P.subtitle, hook: P.hook })}
    <svg class="blk art c8-timeline" viewBox="0 0 1920 1080" aria-hidden="true">
      ${WX.map((x, i) => `<g class="c8-week c8-week-${i}"><circle cx="${x}" cy="${Y}" r="12"/><text x="${x}" y="${Y - 30}">SEMANA ${i + 1}</text></g>`).join("")}
    </svg>
    ${P.weeks.map((w, i) => `<div class="blk abs c8-detail c8-w${i}">${net("Instagram", w.ig)}${net("TikTok", w.tt)}</div>`).join("")}
    <div class="blk abs c8-kpi">
      <div><p class="mono">${P.kpis.main.label}</p><h4>${P.kpis.main.value}</h4><p class="small">${P.kpis.main.note}</p></div>
      <div><p class="mono">${P.kpis.social.label}</p><p class="big">${P.kpis.social.value}</p><p class="small">${P.kpis.social.note}</p></div>
      <div><p class="mono">${P.kpis.support.label}</p><ul>${P.kpis.support.items.map((t) => `<li>${t}</li>`).join("")}</ul></div>
    </div>
    <div class="blk abs c8-ask">
      <p class="mono">Llamado a la acción · Pedido al estudio NQS</p>
      <ol>${P.ask.map((t, i) => `<li><b>0${i + 1}</b><span>${t}</span></li>`).join("")}</ol>
    </div>
    <h2 class="blk abs c8-end-title" data-end>${META.game}</h2>
    <p class="blk abs c8-end-tag">“${META.tagline}”</p>
    <p class="blk abs c8-end-pitch">${META.pitch}<br><span>Estudio NQS · ${META.date.split(" · ")[0]}</span></p>`,
  steps: [
    {
      name: "ENTER",
      thread: { p: fracAtX(base, 200), duration: 1 },
      build(tl) {
        enterHeader(tl);
        tl.from(".c8-week", { ...OUT, y: 10, duration: 0.5, stagger: 0.1 }, 0.5);
      },
    },
    ...P.weeks.map((_, i) => weekStep(i)),
    {
      name: "KPIS",
      thread: { p: fracAtX(base, 1800) },
      build(tl) {
        tl.to(`.c8-w${P.weeks.length - 1}`, { ...OUT, y: -16, duration: 0.35, ease: "power2.in" }, 0);
        rise(tl, ".c8-kpi > div", 0.35, { stagger: 0.15 });
      },
    },
    {
      name: "PEDIDO",
      build(tl) {
        sink(tl, ".c8-kpi", 0);
        tl.from(".c8-ask .mono", { ...OUT, y: 14, duration: 0.5 }, 0.4);
        rise(tl, ".c8-ask li", 0.5, { stagger: 0.18 });
      },
    },
    {
      name: "CIERRE",
      // Todo se retira; el hilo deja de ser calendario, subraya FOOTAGE y se detiene.
      thread: { shape: "close", p: 1, duration: 1.8, ease: "power3.inOut" },
      build(tl) {
        sink(tl, [".ch-head", ".ch-num", ".c8-timeline", ".c8-ask"], 0);
        tl.from(".c8-end-title", { ...OUT, yPercent: 35, duration: 1.3, ease: "expo.out" }, 1.0)
          .from(".c8-end-tag", { ...OUT, y: 20, duration: 0.9, ease: "power3.out" }, 1.6)
          .from(".c8-end-pitch", { ...OUT, duration: 0.9 }, 1.9);
      },
    },
  ],
  mount(el, api) {
    const weeks = [...el.querySelectorAll(".c8-week")];
    return api.onStep((step) => weeks.forEach((w, i) => {
      w.classList.toggle("is-on", step >= i + 1);
      w.classList.toggle("is-now", step === i + 1);
    }));
  },
};
