// Piezas comunes a todos los capítulos: cabecera de entrada y utilidades de timeline.
// Oculto = autoAlpha 0 (opacity 0 + visibility hidden). Con 0.002 (convención de la librería)
// el texto llegaba a verse levemente sobre la textura de la escena.
export const OUT = { autoAlpha: 0 };

export const header = ({ n, kicker, title, hook }) => `
  <div class="blk abs ch-num" aria-hidden="true">${n}</div>
  <header class="blk abs ch-head">
    <p class="ch-kicker"><span class="ch-kicker__n">${n} / 08</span><i class="ch-kicker__rule"></i><span>${kicker}</span></p>
    <h2 class="ch-title" data-type="words"><span data-ls-line>${title}</span></h2>
    ${hook ? `<p class="ch-hook">${hook}</p>` : ""}
  </header>`;

/** Entrada de capítulo: indicador, regla y gancho. El título lo revela type.js (lusion). */
export function enterHeader(tl, at = 0) {
  tl.from(".ch-num", { opacity: 0, xPercent: 8, duration: 1.4, ease: "power3.out" }, at)
    .from(".ch-kicker", { ...OUT, x: -24, duration: 0.6, ease: "power3.out" }, at)
    .from(".ch-kicker__rule", { scaleX: 0, transformOrigin: "0 50%", duration: 0.8, ease: "power3.inOut" }, at)
    .from(".ch-hook", { ...OUT, y: 18, duration: 0.7, ease: "power3.out" }, at + 0.45);
  return tl;
}

/** Aparición estándar de un bloque. */
export const rise = (tl, targets, at, extra = {}) =>
  tl.from(targets, { ...OUT, y: 28, duration: 0.7, ease: "power3.out", stagger: 0.08, ...extra }, at);

/** Retiro intencional de una escena interna (sustitución dentro del capítulo). */
export const sink = (tl, targets, at = 0) =>
  tl.to(targets, { ...OUT, y: -24, duration: 0.45, ease: "power2.in", stagger: 0.03 }, at);

/** Trazo SVG de 0 a 1 (requiere pathLength="1"). */
export const stroke = (tl, targets, at, extra = {}) =>
  tl.fromTo(targets, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", ...extra }, at);
