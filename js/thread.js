// THE THREAD — una sola línea que recorre los ocho capítulos.
// Cada capítulo es un tramo de 1920 px puesto a continuación del anterior, de modo que
// el final del tramo i coincide con el inicio del tramo i+1. Cambiar de capítulo es
// desplazar la cinta completa (pan), nunca reiniciarla.
// Todas las formas son listas de puntos con la misma cantidad (N), así GSAP puede
// interpolarlas punto a punto (morphing sin plugins).
// Dibujo con pathLength="1" + stroke-dashoffset: técnica de lusion/effects/ribbon.js.

const gsap = window.gsap;
export const W = 1920;
export const H = 1080;
const N = 480;
const NS = "http://www.w3.org/2000/svg";

const pt = (x, y) => ({ x, y });

/** Curva cúbica muestreada. */
export function cubic(p0, p1, p2, p3, steps = 40) {
  const out = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps, u = 1 - t;
    out.push(pt(
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ));
  }
  return out;
}

/** Curva suave (Catmull-Rom) que pasa por todos los puntos dados. */
export function through(points, steps = 30) {
  const out = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    out.push(...cubic(p1, c1, c2, p2, steps).slice(i ? 1 : 0));
  }
  return out;
}

/** Une tramos (listas de puntos o pares [x,y]) en una sola polilínea. */
export function chain(...parts) {
  const out = [];
  // Cada parte es un par [x, y] o una lista de puntos ({x,y} o [x,y]).
  parts.flatMap((part) => (typeof part[0] === "number" ? [part] : part)).forEach((p) => {
    const q = Array.isArray(p) ? pt(p[0], p[1]) : p;
    const last = out[out.length - 1];
    if (!last || Math.hypot(last.x - q.x, last.y - q.y) > 0.01) out.push(q);
  });
  return pad(out);
}

/** Lleva la polilínea a N puntos partiendo el tramo más largo: conserva las esquinas. */
function pad(points) {
  const out = points.slice();
  if (out.length > N) throw new Error(`thread: ${out.length} puntos > ${N}`);
  while (out.length < N) {
    let best = 0, len = -1;
    for (let i = 0; i < out.length - 1; i += 1) {
      const l = Math.hypot(out[i + 1].x - out[i].x, out[i + 1].y - out[i].y);
      if (l > len) { len = l; best = i; }
    }
    const a = out[best], b = out[best + 1];
    out.splice(best + 1, 0, pt((a.x + b.x) / 2, (a.y + b.y) / 2));
  }
  return out;
}

/** Fracción de longitud de arco en la que la línea alcanza la coordenada x. */
export function fracAtX(points, x) {
  let total = 0, at = null;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1], b = points[i];
    const l = Math.hypot(b.x - a.x, b.y - a.y);
    if (at === null && b.x >= x) at = total + (b.x === a.x ? 0 : l * Math.min(1, Math.max(0, (x - a.x) / (b.x - a.x))));
    total += l;
  }
  return at === null ? 1 : at / total;
}

const toD = (points) => "M" + points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L");

const svgEl = (tag, attrs = {}) => {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

/**
 * @param svg  <svg viewBox="0 0 1920 1080"> de la escena
 * @param shapesByChapter  [{ base: puntos, otraForma: puntos, ... }] uno por capítulo
 */
export function createThread(svg, shapesByChapter) {
  const pan = svgEl("g", { class: "thread-pan" });
  const segments = shapesByChapter.map((shapes, i) => {
    const group = svgEl("g", { transform: `translate(${i * W} 0)` });
    const ghost = svgEl("path", { class: "thread-ghost" });
    const live = svgEl("path", { class: "thread-live", pathLength: "1" });
    group.append(ghost, live);
    pan.append(group);
    return { shapes, shape: "base", pts: shapes.base.map((p) => ({ ...p })), p: 0, ghost, live };
  });
  const head = svgEl("g", { class: "thread-head" });
  head.append(svgEl("circle", { class: "thread-head__ring", r: 18 }), svgEl("circle", { class: "thread-head__dot", r: 7 }));
  pan.append(head);
  svg.append(pan);

  let current = 0;

  function draw(i) {
    const s = segments[i];
    const d = toD(s.pts);
    s.ghost.setAttribute("d", d);
    s.live.setAttribute("d", d);
    s.live.style.strokeDasharray = "1 1";
    s.live.style.strokeDashoffset = String(1 - s.p);
    if (i === current) placeHead();
  }

  function placeHead() {
    const s = segments[current];
    const p = s.live.getPointAtLength(s.live.getTotalLength() * Math.min(1, Math.max(0, s.p)));
    gsap.set(head, { x: p.x + current * W, y: p.y });
  }

  segments.forEach((_, i) => draw(i));

  return {
    head,
    /** Estado inmediato de un tramo. */
    set(i, { shape, p }) {
      const s = segments[i];
      gsap.killTweensOf([s, s.pts]);
      if (shape && shape !== s.shape) {
        s.shape = shape;
        s.shapes[shape].forEach((q, k) => { s.pts[k].x = q.x; s.pts[k].y = q.y; });
      }
      if (p != null) s.p = p;
      draw(i);
    },
    /** Anima forma (morph) y/o avance del tramo. Devuelve un timeline. */
    to(i, { shape, p }, { duration = 0.9, ease = "power2.inOut" } = {}) {
      const s = segments[i];
      const tl = gsap.timeline({ onUpdate: () => draw(i) });
      if (shape && shape !== s.shape) {
        const target = s.shapes[shape];
        s.shape = shape;
        tl.to(s.pts, { x: (k) => target[k].x, y: (k) => target[k].y, duration, ease, overwrite: "auto" }, 0);
      }
      if (p != null) tl.to(s, { p, duration, ease, overwrite: "auto" }, 0);
      return tl;
    },
    focus(i) { current = i; placeHead(); },
    pan(i, { duration = 1, ease = "power3.inOut" } = {}) {
      return gsap.to(pan, { x: -i * W, duration, ease });
    },
    jump(i) { gsap.set(pan, { x: -i * W }); },
  };
}
