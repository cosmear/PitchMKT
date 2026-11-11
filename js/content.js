// Content layer: todo el texto visible, tomado de footage-pitch-deck-guia.docx
// (solo "Contenido Específico para la Diapositiva", ganchos visuales y planner táctico).
// Los guiones de defensa oral y la matriz de defensa NO se incluyen.

export const META = {
  game: "FOOTAGE",
  tagline: "Lo que la cámara no muestra",
  pitch: "Plan de Rescate y Reposicionamiento Comercial",
  course: "UADE · Marketing para Videojuegos",
  date: "Noviembre de 2026 · Docente: Lic. Romina Luna",
  project: "Videojuego de tesis del Estudio NQS",
};

export const CHAPTERS = [
  { n: "01", label: "Introducción" },
  { n: "02", label: "El problema" },
  { n: "03", label: "Misión y visión" },
  { n: "04", label: "Mercado" },
  { n: "05", label: "Cintas Recuperadas" },
  { n: "06", label: "Funnel 5A" },
  { n: "07", label: "Viabilidad" },
  { n: "08", label: "Plan 30 días" },
];

export const TEAM = [
  { name: "Federico Degraf", role: "Marketing Manager" },
  { name: "Cosme Argerich", role: "Analista de Datos" },
  { name: "Martin Leandro Rota", role: "Social Media Manager" },
  { name: "Simón Morales Lozano", role: "Especialista en Growth" },
];

export const PROBLEM = {
  title: "El diagnóstico",
  subtitle: "El problema de alcance vs. calidad",
  hook: "Un producto con identidad clara que nadie puede comprar porque nadie lo conoce",
  invisibility: {
    label: "Métricas de invisibilidad actual",
    big: "0",
    bigCaption: "menciones en prensa",
    items: ["Sin tráiler público oficial", "Sin página de Steam habilitada", "Sin lista de deseados (wishlists)"],
    notes: [
      "Instagram oficial: cuenta únicamente con seguidores del propio equipo de desarrollo.",
    ],
  },
  saturation: {
    label: "Saturación del mercado · SteamDB 2025",
    big: "+3.000",
    bigCaption: "títulos con etiqueta de terror lanzados en Steam en 2025",
    bars: [{ year: "2024", value: 2600, text: "2.600" }, { year: "2025", value: 3000, text: "+3.000" }],
    note: "La oferta masiva está dominada por sustos repentinos (jumpscares), persecuciones y monstruos predecibles.",
  },
  finance: {
    label: "La falla financiera original",
    big: "150–200",
    bigCaption: "copias proyectadas en el primer año, sin respaldo empírico",
    rows: [
      { k: "Presupuesto de lanzamiento", v: "USD 7.000" },
      { k: "ROI", v: "−84% a −88%" },
      { k: "CAC", v: "USD 35 a 47 por usuario" },
    ],
  },
};

export const POSITIONING = {
  title: "Misión, visión y diferencial competitivo",
  hook: "Terror psicológico found footage sin combate: el hotel abandonado como protagonista y antagonista",
  mission: "Crear una experiencia inmersiva de inquietud y misterio psicológico que deje preguntas abiertas y active el debate comunitario.",
  vision: "Convertirse en el referente del subgénero de terror psicológico found footage en idioma español.",
  reason: "Llenar el vacío existente entre el terror de acción genérico y los simuladores pasivos de caminata, ofreciendo tensión pura de exploración sin armas.",
  // Precios en USD tal como figuran en la matriz de benchmarking.
  competitors: [
    { name: "The Complex: Found Footage", price: 4.99, priceText: "USD 4,99", text: "Superamos el simple simulador estético de pasillos incorporando narrativa ambiental, recolección de CDs y misterio policial." },
    { name: "MADiSON", price: 34.99, priceText: "USD 34,99", text: "Adoptamos la cámara como dispositivo para revelar lo invisible, pero eliminamos el precio prohibitivo y los jumpscares." },
    { name: "Silent Hill 2", price: 69.99, priceText: "USD 69,99", text: "Rescatamos los ángulos de cámara fija, controles tanque y nostalgia de PS2, prescindiendo del combate para maximizar la vulnerabilidad del explorador." },
  ],
  footage: { name: "FOOTAGE", price: 7.99, priceText: "USD 7,99" },
};

export const MARKET = {
  title: "Investigación de nicho",
  subtitle: "Tamaño de mercado y Buyer Persona",
  hook: "Demanda potencial validada de USD 9,3 Millones en Latinoamérica",
  formula: "Q = n × q × p",
  // value en millones de personas; pct = filtro aplicado sobre la etapa anterior.
  stages: [
    { value: 394, text: "394 M", label: "Jugadores en Latinoamérica", source: "Newzoo 2026", pct: null },
    { value: 83.1, text: "83,1 M", label: "Plataforma PC", source: "Pesquisa Game Brasil 2026", pct: "21,1%" },
    { value: 25.4, text: "25,4 M", label: "Afinidad con el terror", source: "Encuesta NRG 2025", pct: "~30%" },
    { value: 2.54, text: "2,54 M", label: "Terror psicológico / indie premium", source: "", pct: "10%" },
    { value: 1.16, text: "1,16 M", label: "Compradores potenciales", source: "Pagadores reales en PC · Newzoo", pct: "45,9%" },
  ],
  demand: { text: "≈ USD 9,3 M", calc: "1,16 M × 1 copia × USD 7,99", label: "Demanda total estimada (Q)" },
  persona: {
    name: "Mateo",
    age: "25 a 35 años",
    profile: "Jugador de PC de Latinoamérica y España, usuario intensivo de Steam, Instagram y Discord.",
    insight: "Quiero que el juego me deje pensando días después",
    bartle: [
      { tag: "Primario", name: "Explorador", text: "Descubrimiento de CDs, lore y ángulos secretos." },
      { tag: "Secundario", name: "Socializador", text: "Discusión de teorías del final abierto." },
    ],
    octalysis: [
      { name: "Desarrollo y Logro", text: "revelar pistas" },
      { name: "Empoderamiento de la Creatividad", text: "teorías" },
      { name: "Curiosidad e Impredecibilidad", text: "cámara" },
      { name: "Influencia Social", text: "" },
    ],
  },
};

export const CAMPAIGN = {
  title: "Estrategia de comunicación y RR. PP.",
  subtitle: "“Cintas Recuperadas”",
  hook: "El contenido ES el juego: convertir el misterio del hotel en conversación comunitaria",
  tapes: [
    {
      code: "CINTA 01", name: "Cintas Recuperadas", kind: "Campaña eje",
      points: [
        "Publicación de una pieza audiovisual semanal con estética VHS/PS2 mostrando fragmentos inquietantes del hotel.",
        "La comunidad interactúa en comentarios descifrando pistas y elaborando teorías sobre los asesinatos ocurridos.",
      ],
    },
    {
      code: "CINTA 02", name: "Video corto 15–30 s", kind: "Formatos nativos",
      points: [
        "Reels en Instagram, TikTok y YouTube Shorts: el subgénero found footage es nativo del video vertical.",
        "Enfoque: ángulos de cámara fija, ambientación sonora opresiva, uso de la videocámara y vulnerabilidad total.",
      ],
    },
    {
      code: "CINTA 03", name: "Discord", kind: "Gestión de comunidad · retención",
      points: [
        "Servidor oficial de Discord enfocado exclusivamente en debate de lore y teorías.",
        "Material extra post-juego (notas inéditas y pistas sonoras) para incentivar la permanencia de los jugadores.",
      ],
    },
    {
      code: "CINTA 04", name: "10 creadores de terror indie", kind: "Alianzas",
      lead: "Envío anticipado de la build jugable a microcreadores hispanohablantes especializados con audiencias hipersegmentadas:",
      creators: [
        ["The Bizarre Bastard Gameplays", "30K seg., Chile"],
        ["Jhotade", "1.800 seg."],
      ],
    },
    {
      code: "CINTA 05", name: "Prensa especializada", kind: "Cobertura",
      lead: "Contactos con:",
      press: ["Dread Central", "Bloody Disgusting", "LevelUp", "Shacknews", "Game Rant"],
    },
  ],
};

export const FUNNEL = {
  title: "Embudo de conversión",
  subtitle: "Las 5A de Kotler",
  hook: "Del clip viral y el evento presencial a la lista de deseados y la compra en Steam",
  stages: [
    {
      name: "Aware", es: "Atención / Descubrimiento", short: "Reels · TikTok · Playday · creadores",
      points: [
        "Clips orgánicos y pautados en Reels y TikTok con estética VHS.",
        "Eventos presenciales (Playday) con banner, póster y tarjetas con códigos QR y enlaces UTM parametrizados.",
        "Cobertura y gameplays iniciales de microcreadores de contenido.",
      ],
    },
    {
      name: "Appeal", es: "Atracción / Interés", short: "Videos verticales · diferencial del juego",
      points: ["Videos en formato vertical que expliquen el diferencial del juego."],
    },
    {
      name: "Ask", es: "Indagación / Validación", short: "Página de Steam · demo · Discord",
      points: [
        "Tráfico dirigido a la página de Steam: landing page principal con SEO optimizado en español e inglés.",
        "Tráiler oficial sobrio y demo gratuita jugable (Steam e itch.io, siguiendo el modelo MADiSON).",
        "Consulta de dudas y lectura de teorías en el canal general de Discord.",
      ],
    },
    {
      name: "Act", es: "Acción / Conversión", short: "Wishlists · compra a USD 7,99",
      points: [
        "Incorporación masiva a la lista de deseados (wishlists) antes del lanzamiento.",
        "Conversión de compra en la primera semana a USD 7,99 con descuento inicial de lanzamiento.",
      ],
    },
    {
      name: "Advocate", es: "Recomendación / Lealtad", short: "Reseñas · videos de teorías · comunidad",
      points: ["El final abierto incentiva a redactar reseñas positivas en Steam y grabar videos de teorías y reacciones."],
    },
  ],
};

export const FINANCE = {
  title: "Viabilidad económica",
  subtitle: "Presupuesto, ROI y punto de equilibrio",
  hook: "El punto de equilibrio exige captar apenas el 0,11% del mercado potencial",
  budget: 7000,
  budgetText: "USD 7.000",
  allocation: [
    { label: "Pauta digital paga", detail: "Meta Ads en Instagram y anuncios en Reddit", value: 2500, text: "USD 2.500", pct: "36%" },
    { label: "RR. PP. y creadores", detail: "Envío de builds y acuerdos", value: 1500, text: "USD 1.500", pct: "21%" },
    { label: "Costos fijos de infraestructura", detail: "Steam Direct USD 100 · tráiler freelance USD 500 · hosting one page USD 200 · IA/Ubersuggest USD 500", value: 1300, text: "USD 1.300", pct: "19%" },
    { label: "Materiales para eventos", detail: "Playday, stand, merchandising", value: 1000, text: "USD 1.000", pct: "14%" },
    { label: "Fondo de reserva", detail: "Contingencias", value: 700, text: "USD 700", pct: "10%" },
  ],
  price: 7.99, priceText: "USD 7,99",
  fee: 2.40, feeText: "USD 2,40", feeLabel: "Comisión Steam (30%)",
  net: 5.59, netText: "USD 5,59", netLabel: "Ingreso neto por copia (LTV de compra única)",
  breakEven: 1252, breakEvenText: "1.252", breakEvenCalc: "USD 7.000 / USD 5,59 = 1.252 copias netas (≈ 1.250)",
  penetration: "0,11%", penetrationCalc: "1.252 copias sobre 1,16 millones de compradores potenciales",
  scenarios: {
    nqs: { label: "Escenario NQS", copies: [150, 200], copiesText: "150–200 copias", income: "USD 839 a 1.119", result: "ROI negativo (−84% a −88%)" },
    goal: { label: "Nuestra meta", copies: 1250, copiesText: "1.250 copias", result: "Recuperación del 100% del capital y viabilidad económica comprobada" },
  },
};

export const PLAN = {
  title: "Hoja de ruta",
  subtitle: "Plan táctico de 30 días para awareness",
  hook: "Cronograma de ejecución del primer mes y activación inmediata",
  weeks: [
    {
      ig: { format: "Reel + Stories con UTM", axis: "Habilitación de página de Steam y lanzamiento de ‘Cinta Recuperada #1’.", goal: "Tráfico calificado hacia Steamworks y captación de seguidores." },
      tt: { format: "2 videos cortos (15–30 s)", axis: "Gameplay de ángulos de cámara fija y estética PS2 para fans de Silent Hill 2.", goal: "Alcance orgánico y visualizaciones en nicho de terror." },
    },
    {
      ig: { format: "Reel + Carrusel de pistas", axis: "Estreno del tráiler oficial (corte vertical) y ‘Cinta Recuperada #2’.", goal: "Retención de audiencia y comentarios con hipótesis de la trama." },
      tt: { format: "Video corto", axis: "Mecánica central: videocámara revelando eventos del pasado y CDs.", goal: "Interés en mecánicas de juego y redirección a wishlist." },
    },
    {
      ig: { format: "Reels colaborativos", axis: "Envío de build a microcreadores; testimonios destacando la tensión sin combate.", goal: "Superar la meta de 200 seguidores y generar prueba social." },
      tt: { format: "Videos cortos de reacción", axis: "Reacciones ante la vulnerabilidad del jugador al no poseer armas ni defensa.", goal: "Tráfico hacia la demo gratuita jugable en itch.io/Steam." },
    },
    {
      ig: { format: "Reel + Historias destacadas", axis: "Lanzamiento de ‘Cinta Recuperada #4’ y recopilación de teorías de usuarios.", goal: "Derivación a comunidad de Discord y fidelización comunitaria." },
      tt: { format: "Video destacado (push)", axis: "Resumen atmosférico del hotel como antagonista con CTA directo a wishlist.", goal: "Revisión integral de métricas en Steamworks y conversión final." },
    },
  ],
  kpis: {
    main: { label: "KPI rector", value: "Wishlists activas en Steam", note: "Señal crítica para el algoritmo de Steamworks." },
    social: { label: "Meta de redes", value: "200", note: "seguidores reales en la cuenta de Instagram" },
    support: { label: "Métricas de soporte", items: ["CTR desde enlaces UTM en bio", "Reproducciones completas de video", "Descargas de la demo"] },
  },
  ask: [
    "Aprobación formal del presupuesto de USD 7.000 y el plan de reposicionamiento.",
    "Entrega inmediata del acceso a la build jugable de Unity para recortar la demo pública.",
    "Acceso a los archivos de diseño de Playday y credenciales de Instagram para dar inicio a la Semana 1.",
  ],
};
