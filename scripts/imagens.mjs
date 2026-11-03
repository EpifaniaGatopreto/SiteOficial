// Fotos e logo otimizados (AVIF + WebP em várias larguras), favicon e imagem de compartilhamento.
// Uso: npm run imagens
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = "public/img";
mkdirSync(OUT, { recursive: true });

async function salvar(pipeline, nome, w) {
  const img = pipeline.clone().resize({ width: w, withoutEnlargement: true });
  await img.clone().avif({ quality: 52 }).toFile(`${OUT}/${nome}-${w}.avif`);
  await img.clone().webp({ quality: 78 }).toFile(`${OUT}/${nome}-${w}.webp`);
}

// Fotos dos modelos em 4:5, recortadas SEMPRE a partir do topo: a cabeça nunca é cortada
for (const [src, nome] of [
  ["assets-fonte/modelo_masculino_frente.png", "modelo-masculino"],
  ["assets-fonte/modelo_feminina_frente.png", "modelo-feminina"],
]) {
  const { width } = await sharp(src).metadata();
  const recorte = sharp(src).extract({ left: 0, top: 0, width, height: Math.round(width * 1.25) });
  for (const w of [480, 960, 1440]) await salvar(recorte, nome, w);
  console.log("foto:", nome);
}

for (const w of [480, 960]) await salvar(sharp("Imgs/Morgana.jpg"), "morgana", w);
for (const w of [160, 320]) await salvar(sharp("Imgs/GatoPreto_transparente.png"), "logo-comunidade", w);

// Logo da marca: pequeno para o header, grande para a abertura do site
for (const h of [48, 96]) {
  await sharp("assets-fonte/logo.png").resize({ height: h }).webp({ quality: 90 }).toFile(`${OUT}/logo-${h}.webp`);
}
for (const h of [300, 601]) {
  const logo = sharp("assets-fonte/logo.png").resize({ height: h, withoutEnlargement: true });
  await logo.clone().webp({ quality: 92 }).toFile(`${OUT}/logo-grande-${h}.webp`);
  await logo.clone().avif({ quality: 70 }).toFile(`${OUT}/logo-grande-${h}.avif`);
}

// Favicon com fundo transparente (sem barras nas laterais do oval)
const transparente = { r: 0, g: 0, b: 0, alpha: 0 };
for (const s of [32, 192]) {
  await sharp("assets-fonte/logo.png").resize(s, s, { fit: "contain", background: transparente }).png().toFile(`public/favicon-${s}.png`);
}
// iPhone não aceita transparência no ícone: fundo creme com respiro em volta
const icone = await sharp("assets-fonte/logo.png").resize({ height: 140 }).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: "#f4eee3" } })
  .composite([{ input: icone, gravity: "center" }])
  .png()
  .toFile("public/apple-touch-icon.png");

// Imagem de compartilhamento (WhatsApp, Instagram...): logo grande sobre o preto da marca
const glow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><radialGradient id="g" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#f2b705" stop-opacity="0.35"/><stop offset="1" stop-color="#f2b705" stop-opacity="0"/>
  </radialGradient></defs>
  <rect width="1200" height="630" fill="#0b0a08"/><ellipse cx="600" cy="315" rx="420" ry="300" fill="url(#g)"/>
</svg>`);
const logoOg = await sharp("assets-fonte/logo.png").resize({ height: 470 }).png().toBuffer();
await sharp(glow).composite([{ input: logoOg, gravity: "center" }]).jpeg({ quality: 85 }).toFile("public/og.jpg");
console.log("logo, favicon e og ok");
