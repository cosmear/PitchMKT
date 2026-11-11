import { PROBLEM as P } from "../content.js";
import { chain, fracAtX } from "../thread.js";
import { OUT, header, enterHeader, rise } from "./shared.js";

const Y = 960;
// Una señal débil y después plano: la línea intenta avanzar y se detiene.
const base = chain([0, Y], [270, Y], [290, Y - 34], [306, Y + 24], [322, Y - 12], [336, Y], [1920, Y]);
const STALL = fracAtX(base, 640);
const max = Math.max(...P.saturation.bars.map((b) => b.value));

export default {
  shapes: { base },
  html: `
    ${header({ n: "02", kicker: P.title, title: P.subtitle, hook: P.hook })}
    <section class="blk abs c2-col c2-a" style="left:120px">
      <p class="mono">${P.invisibility.label}</p>
      <p class="big">${P.invisibility.big}</p>
      <p class="c2-cap">${P.invisibility.bigCaption}</p>
      <ul class="c2-list">${P.invisibility.items.map((t) => `<li>${t}</li>`).join("")}</ul>
      <div class="c2-notes">${P.invisibility.notes.map((t) => `<p class="small">${t}</p>`).join("")}</div>
    </section>
    <section class="blk abs c2-col c2-b" style="left:710px">
      <p class="mono">${P.saturation.label}</p>
      <p class="big">${P.saturation.big}</p>
      <p class="c2-cap">${P.saturation.bigCaption}</p>
      <div class="c2-bars">${P.saturation.bars.map((b) => `<div class="c2-bar"><span class="mono">${b.year}</span><span class="c2-fill" style="--v:${b.value / max}"><b>${b.text}</b></span></div>`).join("")}</div>
      <p class="small" style="margin-top:22px">${P.saturation.note}</p>
    </section>
    <section class="blk abs c2-col c2-c" style="left:1300px">
      <p class="mono">${P.finance.label}</p>
      <p class="big">${P.finance.big}</p>
      <p class="c2-cap">${P.finance.bigCaption}</p>
      <dl class="c2-rows">${P.finance.rows.map((r, i) => `<div><dt>${r.k}</dt><dd class="${i ? "is-loss" : ""}">${r.v}</dd></div>`).join("")}</dl>
    </section>`,
  steps: [
    { name: "ENTER", thread: { p: STALL, duration: 1.6, ease: "power3.out" }, build: (tl) => enterHeader(tl) },
    {
      name: "INVISIBILIDAD",
      build(tl) {
        // El cero entra grande y se asienta: la ausencia es el dato.
        tl.from(".c2-a .mono", { ...OUT, y: 16, duration: 0.5 }, 0)
          .from(".c2-a .big", { ...OUT, scale: 1.6, transformOrigin: "0 100%", duration: 1, ease: "expo.out" }, 0.1);
        rise(tl, ".c2-a .c2-cap", 0.45);
        rise(tl, ".c2-a .c2-list li", 0.6, { x: -12, y: 0, stagger: 0.12 });
        rise(tl, ".c2-a .c2-notes p", 1.0, { stagger: 0.12 });
      },
    },
    {
      name: "SATURACION",
      build(tl) {
        tl.to(".c2-a", { opacity: 0.4, duration: 0.6 }, 0)
          .from(".c2-b .mono", { ...OUT, y: 16, duration: 0.5 }, 0.1)
          .from(".c2-b .big", { ...OUT, scale: 1.4, transformOrigin: "0 100%", duration: 1, ease: "expo.out" }, 0.15);
        rise(tl, ".c2-b .c2-cap", 0.5);
        // Barras con valor por variable --v (patrón de tablero-barras).
        tl.fromTo(".c2-b .c2-fill", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out", stagger: 0.12 }, 0.6);
        rise(tl, ".c2-b .small", 1.1);
      },
    },
    {
      name: "FALLA",
      build(tl) {
        tl.to(".c2-b", { opacity: 0.4, duration: 0.6 }, 0)
          .from(".c2-c .mono", { ...OUT, y: 16, duration: 0.5 }, 0.1)
          .from(".c2-c .big", { ...OUT, scale: 1.4, transformOrigin: "0 100%", duration: 1, ease: "expo.out" }, 0.15);
        rise(tl, ".c2-c .c2-cap", 0.5);
        rise(tl, ".c2-c .c2-rows > div", 0.7, { stagger: 0.18 });
      },
    },
    {
      name: "DIAGNOSTICO",
      // Cierre: los tres indicadores vuelven a la misma jerarquía y quedan quietos.
      build(tl) { tl.to([".c2-a", ".c2-b"], { opacity: 1, duration: 0.7, ease: "power2.out" }, 0); },
    },
  ],
};
