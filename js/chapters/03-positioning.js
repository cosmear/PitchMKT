import { POSITIONING as P } from "../content.js";
import { chain, cubic, fracAtX } from "../thread.js";
import { OUT, header, enterHeader, rise, sink } from "./shared.js";

// La línea recupera dirección: sube desde el piso del diagnóstico y se vuelve un eje de precios.
const AX = { y: 640, x0: 200, x1: 1700, max: 70 };
const px = (usd) => AX.x0 + (usd / AX.max) * (AX.x1 - AX.x0);
const base = chain(
  cubic([0, 336], [80, 336], [30, AX.y], [110, AX.y]),
  [AX.x1, AX.y],
  cubic([AX.x1, AX.y], [1810, AX.y], [1830, 600], [1920, 600]),
);

const [complex, madison, sh2] = P.competitors;
// Etiquetas sobre el eje: altura de cada tallo y alineación para que no se pisen.
const MARKS = [
  { ...complex, top: 420, align: "left" },
  { ...P.footage, top: 520, align: "left", footage: true },
  { ...madison, top: 450, align: "left" },
  { ...sh2, top: 420, align: "right" },
];
const ticks = [0, 10, 20, 30, 40, 50, 60, 70];

export default {
  shapes: { base },
  html: `
    ${header({ n: "03", kicker: "Propuesta de reposicionamiento", title: P.title, hook: P.hook })}
    <div class="blk abs c3-block c3-mission"><p class="mono">Misión de marca</p><p class="lead">${P.mission}</p></div>
    <div class="blk abs c3-block c3-vision"><p class="mono">Visión estratégica</p><p class="lead">${P.vision}</p></div>
    <div class="blk abs c3-reason"><p class="mono mono--rec">Reason why de mercado</p><p class="quote">${P.reason}</p></div>

    <svg class="blk art c3-axis" viewBox="0 0 1920 1080" aria-hidden="true">
      ${ticks.map((t) => `<g><line x1="${px(t)}" x2="${px(t)}" y1="${AX.y - 8}" y2="${AX.y + 8}"/><text x="${px(t)}" y="${AX.y + 32}" text-anchor="middle">${t === 0 ? "USD 0" : t}</text></g>`).join("")}
    </svg>
    <svg class="blk art c3-stems" viewBox="0 0 1920 1080" aria-hidden="true">
      ${MARKS.map((m) => `<g class="c3-stem"><line class="${m.footage ? "is-footage" : ""}" x1="${px(m.price)}" x2="${px(m.price)}" y1="${AX.y}" y2="${m.top + 4}"/><circle class="${m.footage ? "is-footage" : ""}" cx="${px(m.price)}" cy="${AX.y}" r="${m.footage ? 9 : 7}"/></g>`).join("")}
    </svg>
    ${MARKS.map((m) => `
      <div class="blk abs c3-mk ${m.footage ? "c3-mk--footage" : ""} ${m.align === "right" ? "c3-mk--right" : ""}"
        style="top:${m.top - (m.footage ? 72 : 60)}px; left:${m.align === "right" ? px(m.price) - 520 : px(m.price) + 14}px">
        <h4>${m.name}</h4><p>${m.priceText}</p>
      </div>`).join("")}
    ${[complex, madison, sh2].map((c, i) => `
      <div class="blk abs c3-diff" style="left:${[120, 710, 1300][i]}px"><p class="mono">Frente a ${c.name}</p><p class="small">${c.text}</p></div>`).join("")}
  `,
  steps: [
    { name: "ENTER", thread: { p: fracAtX(base, AX.x0), duration: 1.2 }, build: (tl) => enterHeader(tl) },
    { name: "MISION", thread: { p: fracAtX(base, 900) }, build: (tl) => rise(tl, ".c3-mission > *", 0) },
    { name: "VISION", thread: { p: fracAtX(base, AX.x1) }, build: (tl) => rise(tl, ".c3-vision > *", 0) },
    { name: "REASON", build: (tl) => rise(tl, ".c3-reason > *", 0, { stagger: 0.15 }) },
    {
      name: "BENCHMARK",
      build(tl) {
        // La identidad deja lugar al territorio: el divisor se revela como eje de precios.
        sink(tl, [".c3-mission", ".c3-vision", ".c3-reason"], 0);
        tl.from(".c3-axis g", { ...OUT, y: 10, duration: 0.4, stagger: 0.05 }, 0.4)
          .from(".c3-stem line", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.7, ease: "power3.out", stagger: 0.15 }, 0.8)
          .from(".c3-stem circle", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2)", stagger: 0.15 }, 0.75);
        rise(tl, ".c3-mk", 1.0, { stagger: 0.15 });
      },
    },
    {
      name: "DIFERENCIAL",
      build(tl) { rise(tl, ".c3-diff", 0, { stagger: 0.14 }); },
    },
  ],
};
