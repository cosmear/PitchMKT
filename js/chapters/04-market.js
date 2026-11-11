import { MARKET as M } from "../content.js";
import { chain, cubic, fracAtX } from "../thread.js";
import { OUT, header, enterHeader, rise, sink, stroke } from "./shared.js";

// Embudo de demanda: cada compuerta tiene una altura PROPORCIONAL a su valor
// (394 M = 440 px). La línea zigzaguea dentro de la envolvente, así que se
// estrecha exactamente como el mercado, hasta volverse otra vez un hilo.
const CY = 560, H0 = 400;
const GX = [300, 560, 820, 1080, 1340];
const half = M.stages.map((s) => (H0 / 2) * (s.value / M.stages[0].value));
const halfAt = (x) => {
  for (let i = 0; i < GX.length - 1; i += 1) {
    if (x <= GX[i + 1]) return half[i] + (half[i + 1] - half[i]) * ((x - GX[i]) / (GX[i + 1] - GX[i]));
  }
  return half[half.length - 1];
};
const zig = [];
for (let x = GX[0], k = 0; x <= GX[GX.length - 1]; x += 13, k += 1) zig.push([x, CY + (k % 2 ? 1 : -1) * halfAt(x)]);

const QX = 1500, EXIT = 940;
const funnel = chain(
  [0, 600], [150, 600], cubic([150, 600], [250, 600], [250, CY - half[0]], [GX[0], CY - half[0]]),
  zig, [GX[GX.length - 1], CY], [QX, CY],
  cubic([QX, CY], [1680, CY], [1760, EXIT], [1920, EXIT]),
);
// Del dato al perfil humano: el embudo se destrenza y baja a ser piso de la escena.
const persona = chain(cubic([0, 600], [90, 600], [30, EXIT], [110, EXIT]), [1920, EXIT]);

const envelope = (sign) => "M" + GX.map((x, i) => `${x} ${CY + sign * half[i]}`).join("L");
const gateSteps = M.stages.map((s, i) => ({
  name: `FILTRO_${i}`,
  thread: { p: fracAtX(funnel, GX[i] + (i ? 0 : 1)), duration: i ? 1.1 : 0.8 },
  build(tl) {
    tl.from(`.c4-gate-${i} line`, { scaleY: 0, transformOrigin: "50% 50%", duration: 0.7, ease: "power3.out" }, 0)
      .from(`.c4-gate-${i} circle`, { scale: 0, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(2)" }, 0.2);
    if (i) stroke(tl, `.c4-env .seg-${i}`, 0, { duration: 1.1 });
    rise(tl, `.c4-label-${i} > *`, 0.3, { stagger: 0.07 });
    // Conteo riguroso hasta el valor documentado.
    const el = `.c4-label-${i} b`;
    const val = { v: 0 };
    tl.to(val, {
      v: s.value, duration: 1, ease: "power2.out",
      onUpdate() { document.querySelectorAll(el).forEach((n) => { n.textContent = fmt(val.v, s.value) + " M"; }); },
      onReverseComplete() { document.querySelectorAll(el).forEach((n) => { n.textContent = s.text; }); },
      onComplete() { document.querySelectorAll(el).forEach((n) => { n.textContent = s.text; }); },
    }, 0.3);
  },
}));
// Formato es-AR con la misma cantidad de decimales que el documento.
function fmt(v, target) {
  const dec = target >= 100 ? 0 : target >= 10 ? 1 : 2;
  return v.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export default {
  shapes: { base: funnel, persona },
  html: `
    ${header({ n: "04", kicker: M.title, title: M.subtitle, hook: M.hook })}
    <svg class="blk art c4-funnel" viewBox="0 0 1920 1080" aria-hidden="true">
      <g class="c4-guides">${GX.map((x) => `<line x1="${x}" x2="${x}" y1="${CY - H0 / 2}" y2="${CY + H0 / 2}"/>`).join("")}</g>
      <g class="c4-env">${GX.slice(1).map((_, i) => `
        <path class="seg-${i + 1}" pathLength="1" d="M${GX[i]} ${CY - half[i]}L${GX[i + 1]} ${CY - half[i + 1]}M${GX[i]} ${CY + half[i]}L${GX[i + 1]} ${CY + half[i + 1]}"/>`).join("")}
      </g>
      <g class="c4-gates">${GX.map((x, i) => `<g class="c4-gate-${i}"><line x1="${x}" x2="${x}" y1="${CY - half[i]}" y2="${CY + half[i]}"/><circle cx="${x}" cy="${CY - half[i] - 10}" r="5"/></g>`).join("")}</g>
    </svg>
    ${M.stages.map((s, i) => `
      <div class="blk abs c4-label c4-label-${i}" style="left:${GX[i]}px">
        <p class="mono">${s.pct ? `× ${s.pct}` : "Universo"}</p><b>${s.text}</b><span>${s.label}</span>${s.source ? `<small>${s.source}</small>` : ""}
      </div>`).join("")}
    <div class="blk abs c4-q">
      <p class="mono">${M.demand.label}</p>
      <b>${M.demand.text}</b>
      <p class="small">${M.demand.calc}</p>
      <p class="c4-formula">${M.formula}</p>
    </div>

    <div class="blk abs c4-mateo">
      <p class="mono">Buyer Persona</p>
      <h3>${M.persona.name}</h3>
      <p class="c4-age">${M.persona.age}</p>
      <p class="lead">${M.persona.profile}</p>
    </div>
    <div class="blk abs c4-insight"><p class="mono mono--rec">Insight rector</p><p class="quote">${M.persona.insight}</p></div>
    <div class="blk abs c4-bartle">${M.persona.bartle.map((b) => `<div><p class="mono">Bartle · ${b.tag}</p><h4>${b.name}</h4><p class="small">${b.text}</p></div>`).join("")}</div>
    <div class="blk abs c4-octa"><p class="mono">Octalysis · White Hat</p>
      <ul>${M.persona.octalysis.map((o) => `<li>${o.name}${o.text ? ` <em>(${o.text})</em>` : ""}</li>`).join("")}</ul>
    </div>`,
  steps: [
    {
      name: "ENTER",
      thread: { p: fracAtX(funnel, 150), duration: 1 },
      build(tl) {
        enterHeader(tl);
        tl.from(".c4-guides line", { scaleY: 0, transformOrigin: "50% 50%", duration: 0.8, stagger: 0.06, ease: "power3.out" }, 0.4);
      },
    },
    ...gateSteps,
    {
      name: "DEMANDA",
      thread: { p: fracAtX(funnel, QX) },
      build(tl) {
        tl.from(".c4-q .mono", { ...OUT, y: 14, duration: 0.5 }, 0)
          .from(".c4-q b", { ...OUT, scale: 1.25, transformOrigin: "0 100%", duration: 1, ease: "expo.out" }, 0.15);
        rise(tl, [".c4-q .small", ".c4-q .c4-formula"], 0.5);
      },
    },
    {
      name: "PERSONA",
      thread: { shape: "persona", p: fracAtX(persona, 1800), duration: 1.3 },
      build(tl) {
        sink(tl, [".c4-funnel", ".c4-label", ".c4-q"], 0);
        tl.from(".c4-mateo .mono", { ...OUT, y: 14, duration: 0.5 }, 0.7)
          .from(".c4-mateo h3", { ...OUT, yPercent: 30, duration: 1, ease: "expo.out" }, 0.75);
        rise(tl, [".c4-mateo .c4-age", ".c4-mateo .lead"], 1.0);
        rise(tl, ".c4-insight > *", 1.2, { stagger: 0.15 });
      },
    },
    {
      name: "MOTIVACIONES",
      build(tl) {
        rise(tl, ".c4-bartle > div", 0, { stagger: 0.15 });
        rise(tl, [".c4-octa .mono", ".c4-octa li"], 0.35, { stagger: 0.08 });
      },
    },
  ],
};
