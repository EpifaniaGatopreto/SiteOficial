// Hero "scrollytelling": a seção fica fixa e os quadros do vídeo avançam conforme a rolagem.
const TOTAL = 90;
const SETS = {
  desktop: { path: "/frames/desktop/", w: 1600, h: 900 },
  mobile: { path: "/frames/mobile/", w: 720, h: 1280 },
};
const MOBILE_MQ = "(max-width: 767px), (max-aspect-ratio: 4/5)";

// Em que ponto da rolagem (0 a 1) cada coisa acontece
const FRAMES_DE = 0.18; // até aqui: modelo masculino parado ("Uma camisa.")
const FRAMES_ATE = 0.8; // daqui em diante: modelo feminina parada (slogan)
const LINHAS = [
  { entra: -1, cheia: 0, sai: 0.16, some: 0.26 }, // "Uma camisa."
  { entra: 0.3, cheia: 0.38, sai: 0.6, some: 0.68 }, // "Para todos."
  { entra: 0.72, cheia: 0.82, sai: 2, some: 3 }, // slogan
];

const nome = (i) => String(i + 1).padStart(3, "0") + ".webp";
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function opacidade(p, l) {
  if (p <= l.entra || p >= l.some) return 0;
  if (p < l.cheia) return (p - l.entra) / (l.cheia - l.entra);
  if (p > l.sai) return 1 - (p - l.sai) / (l.some - l.sai);
  return 1;
}

// ordem de carregamento: pontas primeiro, depois a cada 16, 8, 4, 2, 1 quadros —
// assim a rolagem já funciona (em menor fluidez) enquanto o resto chega
function ordem() {
  const vistos = new Set();
  const out = [];
  for (const passo of [TOTAL - 1, 16, 8, 4, 2, 1]) {
    for (let i = 0; i < TOTAL; i += passo) if (!vistos.has(i)) vistos.add(i), out.push(i);
  }
  if (!vistos.has(TOTAL - 1)) out.push(TOTAL - 1);
  return out;
}

export function iniciarHero() {
  const secao = document.querySelector(".hero-anim");
  const canvas = document.getElementById("hero-canvas");
  if (!secao || !canvas) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  const linhas = [...document.querySelectorAll(".hero-line")];
  const loader = document.querySelector(".hero-loader");
  const barra = loader.querySelector("span");
  const dica = document.querySelector(".hero-hint");

  let set = null;
  let quadros = [];
  let carregados = 0;
  let ultimoDesenhado = -1;
  let agendado = false;

  function progresso() {
    const r = secao.getBoundingClientRect();
    return clamp(-r.top / (r.height - innerHeight), 0, 1);
  }

  function ajustarCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    ultimoDesenhado = -1;
  }

  function desenhar(i) {
    // usa o quadro carregado mais próximo do desejado
    let img = null;
    for (let d = 0; d < TOTAL && !img; d++) img = quadros[i - d] || quadros[i + d];
    if (!img) return;
    const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }

  function render() {
    agendado = false;
    const p = progresso();
    const t = clamp((p - FRAMES_DE) / (FRAMES_ATE - FRAMES_DE), 0, 1);
    const i = Math.round(t * (TOTAL - 1));
    if (i !== ultimoDesenhado || !quadros[i]) {
      desenhar(i);
      if (quadros[i]) ultimoDesenhado = i;
    }
    linhas.forEach((el, k) => {
      const o = opacidade(p, LINHAS[k]);
      el.style.opacity = o;
      el.style.transform = `translateY(${(1 - o) * 14}px)`;
    });
    dica.style.opacity = p > 0.03 ? 0 : 1;
  }

  const agendar = () => {
    if (!agendado) (agendado = true), requestAnimationFrame(render);
  };

  function carregar(nomeSet) {
    set = nomeSet;
    quadros = new Array(TOTAL);
    carregados = 0;
    loader.classList.remove("fim");
    const cfg = SETS[nomeSet];
    const fila = ordem();
    let ativos = 0;
    const MAX_PARALELO = 6;

    const proximo = () => {
      if (set !== nomeSet) return; // mudou de desktop para mobile no meio do caminho
      while (ativos < MAX_PARALELO && fila.length) {
        const i = fila.shift();
        const img = new Image();
        img.decoding = "async";
        img.src = cfg.path + nome(i);
        ativos++;
        img
          .decode()
          .then(() => {
            if (set !== nomeSet) return;
            quadros[i] = img;
            carregados++;
            const pct = Math.round((carregados / TOTAL) * 100);
            barra.style.width = pct + "%";
            loader.setAttribute("aria-valuenow", pct);
            if (carregados === 1) canvas.classList.add("pronto");
            if (carregados === TOTAL) loader.classList.add("fim");
            agendar();
          })
          .catch(() => {})
          .finally(() => {
            ativos--;
            proximo();
          });
      }
    };
    proximo();
  }

  const mq = matchMedia(MOBILE_MQ);
  const escolher = () => (mq.matches ? "mobile" : "desktop");

  ajustarCanvas();
  render();
  addEventListener("scroll", agendar, { passive: true });
  addEventListener("resize", () => {
    ajustarCanvas();
    agendar();
  });
  mq.addEventListener("change", () => {
    canvas.classList.remove("pronto");
    carregar(escolher());
  });

  // só começa a baixar os quadros depois que a página principal carregou (não atrasa a 1ª tela)
  const comecar = () => carregar(escolher());
  if (document.readyState === "complete") comecar();
  else addEventListener("load", comecar, { once: true });
}
