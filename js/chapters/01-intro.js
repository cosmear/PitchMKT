import { META, TEAM } from "../content.js";
import { chain, cubic, fracAtX } from "../thread.js";
import { OUT, rise } from "./shared.js";

const Y = 640;
const COLS = [120, 560, 1000, 1440];
const base = chain([0, Y], [1760, Y], cubic([1760, Y], [1870, Y], [1850, 336], [1920, 336]));

export default {
  shapes: { base },
  html: `
    <h1 class="blk abs c1-title" data-type="chars" data-delay=".7"><span data-ls-line>${META.game}</span></h1>
    <p class="blk abs c1-tag">“${META.tagline}”</p>
    <p class="blk abs c1-pitch">${META.pitch}</p>
    <div class="blk abs c1-context">
      <div><p class="mono mono--rec">Proyecto analizado</p><p class="small">${META.project}</p></div>
      <div><p class="mono">${META.course}</p></div>
      <div><p class="mono dim">${META.date}</p></div>
    </div>
    <p class="blk abs mono c1-team-label">Equipo consultor</p>
    ${TEAM.map((m, i) => `
      <article class="blk member" style="left:${COLS[i]}px">
        <i class="member__node"></i><i class="member__tick"></i>
        <p class="mono">${m.role}</p>
        <h3>${m.name}</h3>
      </article>`).join("")}`,
  steps: [
    {
      name: "ENTER",
      // La línea aparece despacio y "revela la grabación": recorre la pantalla bajo el título.
      thread: { p: fracAtX(base, 1760), duration: 2.4, ease: "power2.inOut" },
      build(tl) {
        rise(tl, ".c1-tag", 1.2, { duration: 0.9 });
        rise(tl, ".c1-pitch", 1.5);
      },
    },
    {
      name: "CONTEXT",
      build(tl) { rise(tl, ".c1-context > div", 0, { stagger: 0.12 }); },
    },
    {
      name: "TEAM",
      build(tl) {
        tl.from(".c1-team-label", { ...OUT, x: -16, duration: 0.5 }, 0);
        // Los integrantes se revelan uno a uno, de izquierda a derecha, colgando de la línea.
        COLS.forEach((_, i) => {
          const at = 0.15 + i * 0.22;
          tl.from(`.member:nth-of-type(${i + 1}) .member__node`, { scale: 0, duration: 0.5, ease: "back.out(2.5)" }, at)
            .from(`.member:nth-of-type(${i + 1}) .member__tick`, { scaleY: 0, transformOrigin: "50% 0", duration: 0.4 }, at + 0.15)
            .from(`.member:nth-of-type(${i + 1}) > :is(p, h3)`, { ...OUT, y: 22, duration: 0.6, stagger: 0.07, ease: "power3.out" }, at + 0.2);
        });
      },
    },
  ],
};
