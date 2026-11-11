import { FINANCE as F } from "../content.js";
import { chain, cubic, fracAtX } from "../thread.js";
import { OUT, header, enterHeader, rise, sink } from "./shared.js";

// Escena A: la línea divide inversión (arriba) y economía unitaria (abajo).
const budget = chain(cubic([0, 480], [90, 480], [70, 740], [160, 740]), [1760, 740], cubic([1760, 740], [1870, 740], [1850, 420], [1920, 420]));

// Escena B: la línea ES el ingreso neto acumulado (USD 5,59 por copia).
// Escala: 0–1.500 copias → x 860–1760 · USD 0–9.000 → y 880–340.
const C = { x0: 860, y0: 880, sx: 0.6, sy: 0.06 };
const X = (copies) => C.x0 + copies * C.sx;
const Y = (usd) => C.y0 - usd * C.sy;
const END = 1500;
const chart = chain(
  cubic([0, 480], [80, 480], [30, 318], [110, 318]), [C.x0 - 40, 318],
  cubic([C.x0 - 40, 318], [C.x0 - 10, 318], [C.x0, 330], [C.x0, Y(9000)]),
  [C.x0, C.y0],
  [X(END), Y(END * F.net)],
  cubic([X(END), Y(END * F.net)], [1850, Y(END * F.net) - 40], [1880, 420], [1920, 420]),
);
const BE = { x: X(F.breakEven), y: Y(F.budget) };
const nqs = F.scenarios.nqs.copies;
const maxAlloc = Math.max(...F.allocation.map((a) => a.value));

// Contador sobre una cifra documentada (formato es-AR).
function count(tl, selector, to, at, { dec = 0, prefix = "", duration = 1.2 } = {}) {
  const o = { v: 0 };
  const fmt = (v) => prefix + v.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const write = (v) => document.querySelectorAll(selector).forEach((n) => { n.textContent = fmt(v); });
  tl.to(o, { v: to, duration, ease: "power2.out", onUpdate: () => write(o.v), onComplete: () => write(to), onReverseComplete: () => write(to) }, at);
}

export default {
  shapes: { base: budget, chart },
  html: `
    ${header({ n: "07", kicker: F.title, title: F.subtitle, hook: F.hook })}
    <div class="blk abs c7-budget">
      <p class="mono">Asignación presupuestaria de lanzamiento</p>
      <p class="big"><span class="c7-count-budget">${F.budgetText}</span></p>
    </div>
    <div class="blk abs c7-bars">
      ${F.allocation.map((a) => `
        <div class="c7-row" style="--v:${a.value / maxAlloc}">
          <div><h4>${a.label}</h4><small>${a.detail}</small></div>
          <div class="c7-track"><span></span></div>
          <b>${a.text}</b><em>${a.pct}</em>
        </div>`).join("")}
    </div>
    <div class="blk abs c7-unit">
      <div class="c7-term"><span class="mono">Precio de venta al público</span><b>${F.priceText}</b></div>
      <span class="op">−</span>
      <div class="c7-term c7-term--fee"><span class="mono">${F.feeLabel}</span><b>${F.feeText}</b></div>
      <span class="op">=</span>
      <div class="c7-term c7-term--net"><span class="mono">${F.netLabel}</span><b>${F.netText}</b></div>
    </div>

    <svg class="blk art c7-chart" viewBox="0 0 1920 1080" aria-hidden="true">
      <g class="c7-axes">
        <line class="c7-axis" x1="${C.x0}" x2="${X(END) + 20}" y1="${C.y0}" y2="${C.y0}"/>
        <line class="c7-axis" x1="${C.x0}" x2="${C.x0}" y1="${C.y0}" y2="${Y(9000)}"/>
        ${[500, 1000, 1500].map((c) => `<text x="${X(c)}" y="${C.y0 + 30}" text-anchor="middle">${c.toLocaleString("es-AR")}</text>`).join("")}
        <text x="${X(END) + 20}" y="${C.y0 + 56}" text-anchor="end">copias vendidas</text>
        <text x="${C.x0 + 14}" y="${Y(9000) + 6}">USD</text>
      </g>
      <g class="c7-target-g">
        <line class="c7-target" x1="${C.x0}" x2="${X(END) + 20}" y1="${BE.y}" y2="${BE.y}"/>
        <text class="c7-t-strong" x="${C.x0 + 10}" y="${BE.y - 14}">Inversión ${F.budgetText}</text>
      </g>
      <g class="c7-be-g">
        <line class="c7-cross" x1="${BE.x}" x2="${BE.x}" y1="${C.y0}" y2="${BE.y}"/>
        <circle class="c7-bepoint" cx="${BE.x}" cy="${BE.y}" r="9"/>
        <text class="c7-t-strong" x="${BE.x}" y="${C.y0 + 30}" text-anchor="middle" style="fill:var(--rec)">${F.breakEvenText}</text>
      </g>
      <g class="c7-nqs-g">
        <rect class="c7-band" x="${X(nqs[0])}" y="${Y(nqs[1] * F.net)}" width="${X(nqs[1]) - X(nqs[0])}" height="${C.y0 - Y(nqs[1] * F.net)}"/>
        <line class="c7-cross" x1="${X(nqs[1])}" x2="${X(nqs[1]) + 60}" y1="${Y(nqs[1] * F.net)}" y2="${Y(nqs[1] * F.net) - 150}"/>
      </g>
    </svg>
    <div class="blk abs c7-be">
      <p class="mono">Punto de equilibrio</p>
      <p class="big c7-count-be">${F.breakEvenText}</p>
      <p class="c7-be-unit">copias netas para cubrir la inversión</p>
      <p class="small">${F.breakEvenCalc}</p>
    </div>
    <div class="blk abs c7-pen">
      <p class="mono">Penetración de mercado requerida</p>
      <b>${F.penetration}</b>
      <p class="small">${F.penetrationCalc}</p>
    </div>
    <div class="blk abs c7-note c7-note--nqs">
      <span class="mono">${F.scenarios.nqs.label} · ${F.scenarios.nqs.copiesText}</span>
      Ingreso neto <b>${F.scenarios.nqs.income}</b> → <b style="color:var(--rec)">${F.scenarios.nqs.result}</b>
    </div>
    <div class="blk abs c7-note c7-note--goal">
      <span class="mono">${F.scenarios.goal.label} · ${F.scenarios.goal.copiesText}</span>
      ${F.scenarios.goal.result}
    </div>`,
  steps: [
    { name: "ENTER", thread: { p: fracAtX(budget, 160) }, build: (tl) => enterHeader(tl) },
    {
      name: "PRESUPUESTO",
      thread: { p: fracAtX(budget, 860) },
      build(tl) {
        rise(tl, ".c7-budget > *", 0, { stagger: 0.1 });
        count(tl, ".c7-count-budget", F.budget, 0.15, { prefix: "USD " });
        rise(tl, ".c7-row", 0.35, { stagger: 0.08, y: 14 });
        // Barras: crecen hasta --v (patrón de tablero-barras/dashboardDemo).
        tl.fromTo(".c7-track span", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out", stagger: 0.07 }, 0.5);
      },
    },
    {
      name: "UNITARIO",
      thread: { p: fracAtX(budget, 1760) },
      build(tl) { rise(tl, ".c7-unit > *", 0, { stagger: 0.14 }); },
    },
    {
      name: "EQUILIBRIO",
      // La divisoria se curva y se convierte en la recta de recuperación del capital.
      thread: { shape: "chart", p: fracAtX(chart, BE.x), duration: 1.6 },
      build(tl) {
        sink(tl, [".c7-budget", ".c7-bars", ".c7-unit"], 0);
        tl.from(".c7-axes", { ...OUT, duration: 0.6 }, 0.45)
          .from(".c7-target-g", { ...OUT, x: -20, duration: 0.6 }, 0.6)
          .from(".c7-be-g .c7-cross", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.5 }, 1.45)
          .from(".c7-bepoint", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2.4)" }, 1.55)
          .from(".c7-be-g text", { ...OUT, duration: 0.4 }, 1.6);
        rise(tl, ".c7-be > *", 0.9, { stagger: 0.1 });
        count(tl, ".c7-count-be", F.breakEven, 1.0, { duration: 1.4 });
      },
    },
    {
      name: "PENETRACION",
      build(tl) { rise(tl, ".c7-pen > *", 0, { stagger: 0.12 }); },
    },
    {
      name: "CONTRASTE",
      thread: { p: fracAtX(chart, X(END)) },
      build(tl) {
        tl.from(".c7-band", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "power3.out" }, 0)
          .from(".c7-nqs-g .c7-cross", { ...OUT, duration: 0.4 }, 0.4);
        rise(tl, ".c7-note--nqs", 0.45);
        rise(tl, ".c7-note--goal", 0.9);
      },
    },
  ],
};
