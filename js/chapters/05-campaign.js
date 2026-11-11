import { CAMPAIGN as C } from "../content.js";
import { chain, cubic, fracAtX } from "../thread.js";
import { OUT, header, enterHeader, rise, sink } from "./shared.js";

// La línea es la cinta magnética: pasa por la ventana de cada cassette.
const Y = 800;
const TX = C.tapes.map((_, i) => 120 + i * 340); // borde izquierdo de cada cinta (300 px de ancho)
const center = (i) => TX[i] + 150;
const base = chain(cubic([0, 940], [70, 940], [40, Y], [110, Y]), [1920, Y]);
// Cierre: cintas e hilo suben juntos al centro del cuadro.
const LIFT = 190;
const close = chain(cubic([0, 940], [70, 940], [40, Y - LIFT], [110, Y - LIFT]), [1780, Y - LIFT], cubic([1780, Y - LIFT], [1880, Y - LIFT], [1860, Y], [1920, Y]));

// Cassette: cuerpo con una ventana recortada (evenodd) para que el hilo se vea pasar.
const tapeSvg = `
  <svg viewBox="0 0 300 140" aria-hidden="true">
    <path class="tape__body" fill-rule="evenodd" d="M10 0H290Q300 0 300 10V130Q300 140 290 140H10Q0 140 0 130V10Q0 0 10 0Z M48 44H252Q262 44 262 54V86Q262 96 252 96H48Q38 96 38 86V54Q38 44 48 44Z"/>
    <g class="tape__reel-g"><circle class="tape__reel" cx="80" cy="70" r="20"/><path class="tape__reel" d="M80 52V58M80 82V88M62 70H68M92 70H98"/></g>
    <g class="tape__reel-g"><circle class="tape__reel" cx="220" cy="70" r="20"/><path class="tape__reel" d="M220 52V58M220 82V88M202 70H208M232 70H238"/></g>
  </svg>`;

const detail = (t) => {
  let body = "";
  if (t.points) body = `<ul class="c5-points">${t.points.map((p) => `<li>${p}</li>`).join("")}</ul>`;
  if (t.creators) body = `<div><p class="small" style="color:var(--ink)">${t.lead}</p><ul class="c5-creators">${t.creators.map(([n, a]) => `<li>${n}<span>${a}</span></li>`).join("")}</ul></div>`;
  if (t.press) body = `<div><p class="small" style="color:var(--ink)">${t.lead}</p><ul class="c5-press">${t.press.map((n) => `<li>${n}</li>`).join("")}</ul></div>`;
  return `<div><p class="mono">${t.code}</p><h3>${t.name}</h3><p class="c5-kind">${t.kind}</p></div>${body}`;
};

const tapeStep = (i) => ({
  name: `CINTA_${i + 1}`,
  thread: { p: fracAtX(base, center(i)) },
  build(tl) {
    if (i) tl.to(`.c5-d${i - 1}`, { ...OUT, y: -18, duration: 0.4, ease: "power2.in" }, 0);
    tl.from(`.c5-tape-${i}`, { y: 40, ...OUT, duration: 0.7, ease: "power3.out" }, 0.1)
      .from(`.c5-d${i} > div:first-child > *`, { ...OUT, y: 26, duration: 0.6, stagger: 0.07, ease: "power3.out" }, 0.35)
      .from(`.c5-d${i} > :last-child`, { ...OUT, y: 26, duration: 0.7, ease: "power3.out" }, 0.55);
  },
});

export default {
  shapes: { base, close },
  html: `
    ${header({ n: "05", kicker: C.title, title: C.subtitle, hook: C.hook })}
    <div class="blk abs c5-panel">${C.tapes.map((t, i) => `<div class="c5-detail c5-d${i}">${detail(t)}</div>`).join("")}</div>
    <div class="blk abs c5-tapes" data-c5-tapes>
      ${C.tapes.map((t, i) => `
        <div class="c5-tape-${i}" data-ls-magnet style="left:${TX[i]}px">
          <button type="button" class="tape" data-ls-target data-step="${i + 1}" aria-pressed="false" aria-label="${t.code}: ${t.name}">
            ${tapeSvg}
            <span class="tape__label"><b>${t.code}</b></span>
            <span class="tape__name">${t.name}</span>
          </button>
        </div>`).join("")}
      <span class="c5-halo" data-ls-halo aria-hidden="true"></span>
    </div>`,
  steps: [
    { name: "ENTER", thread: { p: fracAtX(base, 110) }, build: (tl) => enterHeader(tl) },
    ...C.tapes.map((_, i) => tapeStep(i)),
    {
      name: "CANALES",
      // Cierre: la última ficha se guarda y quedan las cinco cintas unidas por el hilo.
      thread: { shape: "close", p: fracAtX(close, 1780), duration: 1.1 },
      build(tl) {
        sink(tl, `.c5-d${C.tapes.length - 1}`, 0);
        tl.to("[data-ls-magnet]", { y: -LIFT, duration: 1.1, ease: "power2.inOut", stagger: 0.04 }, 0);
      },
    },
  ],
  // Interacción: cada cinta se puede inspeccionar (salta a su paso). Imán de lusion/effects/cursor.
  mount(el, api) {
    const root = el.querySelector("[data-c5-tapes]");
    const magnet = window.LoopSmithMotion.cursor(root, { distance: 120, strength: 0.18, rotation: 4 });
    const buttons = [...root.querySelectorAll(".tape")];
    const onClick = (e) => {
      const b = e.target.closest(".tape");
      if (!b) return;
      api.goStep(Number(b.dataset.step));
      b.blur();
    };
    root.addEventListener("click", onClick);
    const off = api.onStep((step) => {
      buttons.forEach((b, i) => {
        const on = step >= i + 1;
        b.classList.toggle("is-on", on);
        b.classList.toggle("is-now", step === i + 1);
        b.setAttribute("aria-pressed", String(step === i + 1));
      });
    });
    return () => { root.removeEventListener("click", onClick); off(); magnet.destroy(); };
  },
};
