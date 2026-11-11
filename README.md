# FOOTAGE — Pitch interactivo

Presentación web en 8 capítulos (HTML + CSS + JS vanilla + GSAP/ScrollTrigger + SVG). Sitio estático, sin build.

## Ejecutar

```bash
python serve.py
```

Abrir http://localhost:5521 (los módulos ES no funcionan abriendo el HTML con doble clic).

## Desplegar

Subir la carpeta tal cual a Cloudflare Pages o GitHub Pages (sin comando de build; directorio de salida: la raíz).

## Controles

| Acción | Teclas |
| --- | --- |
| Avanzar paso | → · ↓ · Espacio · PageDown · rueda/trackpad |
| Retroceder | ← · ↑ · Shift+Espacio · PageUp |
| Ir a capítulo | 1–8 · Home · End · botones inferiores |
| Pantalla completa | F (Esc para salir) |

La URL guarda capítulo y paso (`#4.3`), así que recargar no pierde el lugar.

## Estructura

- `js/content.js` — todo el texto visible (extraído del Word, sin guion oral).
- `js/chapters/0X-*.js` — composición, pasos y forma del hilo de cada capítulo.
- `js/thread.js` — la línea continua (tramos encadenados, morphing por puntos, pan entre capítulos).
- `js/main.js` — motor de estados, transiciones y navegación.
- `js/loopsmith/` — módulos de LibreriaDeAnimaciones (`animaciones/lusion/effects/type.js`, `loader.js`, `cursor.js`) sin modificar.
