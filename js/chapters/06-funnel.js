import { FUNNEL as F } from "../content.js";
import { chain, through, fracAtX } from "../thread.js";
import { OUT, header, enterHeader, rise } from "./shared.js";

// El hilo se vuelve el camino del comprador: cinco estaciones, una geometría que sube y baja.
const S = [[260, 600], [600, 500], [940, 600], [1280, 500], [1620, 600]];
const base = chain(through([[0, 800], ...S, [1920, 480]], 34));

const stageStep = (i) => ({
  name: F.stages[i].name.toUpperCase(),
  thread: { p: fracAtX(base, S[i][0]), duration: 1.1 },
  build(tl) {
    if (i) tl.to(`.c6-d${i - 1}`, { ...OUT, y: -16, duration: 0.35, ease: "power2.in" }, 0);
    tl.from(`.c6-node-${i} .c6-orbit`, { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(1.6)" }, 0.55)
      .from(`.c6-s${i}`, { ...OUT, y: 20, duration: 0.6, ease: "power3.out" }, 0.5)
      .from(`.c6-d${i} > *`, { ...OUT, y: 22, duration: 0.6, stagger: 0.1, ease: "power3.out" }, 0.75);
    // Ask y Act ocurren en Steam: el tramo se marca al llegar.
    if (i === 2) tl.from(".c6-steam line", { scaleX: 0, transformOrigin: "0 50%", duration: 0.8, ease: "power2.inOut" }, 0.8).from(".c6-steam-label", { ...OUT, duration: 0.5 }, 1.1);
  },
});

export default {
  shapes: { base },
  html: `
    ${header({ n: "06", kicker: F.title, title: F.subtitle, hook: F.hook })}
    <svg class="blk art c6-nodes" viewBox="0 0 1920 1080" aria-hidden="true">
      ${S.map(([x, y], i) => `<g class="c6-node c6-node-${i}"><circle class="c6-orbit" cx="${x}" cy="${y}" r="34"/><circle class="c6-dot" cx="${x}" cy="${y}" r="11"/></g>`).join("")}
      <g class="c6-steam"><line x1="${S[2][0]}" x2="${S[3][0]}" y1="664" y2="664"/><line x1="${S[2][0]}" x2="${S[2][0]}" y1="652" y2="676"/><line x1="${S[3][0]}" x2="${S[3][0]}" y1="652" y2="676"/></g>
    </svg>
    <p class="blk abs mono c6-steam-label">Steam</p>
    ${F.stages.map((s, i) => `
      <div class="blk abs c6-stage c6-s${i}" style="left:${S[i][0]}px; top:${S[i][1] - 150}px">
        <p class="mono">0${i + 1} · ${s.es}</p><h3>${s.name}</h3>
      </div>`).join("")}
    ${F.stages.map((s, i) => `
      <div class="blk abs c6-detail c6-d${i}">
        <ul>${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>`).join("")}
    ${F.stages.map((s, i) => `<p class="blk abs c6-summary" style="left:${S[i][0]}px">${s.short}</p>`).join("")}`,
  steps: [
    {
      name: "ENTER",
      thread: { p: fracAtX(base, 150) },
      build(tl) {
        enterHeader(tl);
        // Las cinco estaciones esperan apagadas sobre el camino.
        tl.from(".c6-dot", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.08, ease: "back.out(2)" }, 0.5);
      },
    },
    ...F.stages.map((_, i) => stageStep(i)),
    {
      name: "RECORRIDO",
      thread: { p: fracAtX(base, 1800) },
      build(tl) {
        tl.to(`.c6-d${F.stages.length - 1}`, { ...OUT, y: -16, duration: 0.35, ease: "power2.in" }, 0);
        rise(tl, ".c6-summary", 0.3, { stagger: 0.1 });
      },
    },
  ],
  mount(el, api) {
    const nodes = [...el.querySelectorAll(".c6-node")];
    const stages = [...el.querySelectorAll(".c6-stage")];
    return api.onStep((step) => {
      nodes.forEach((n, i) => n.classList.toggle("is-on", step >= i + 1));
      stages.forEach((s, i) => s.classList.toggle("is-on", step >= i + 1));
    });
  },
};
