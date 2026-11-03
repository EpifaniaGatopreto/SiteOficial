// Fotos e logo otimizados (AVIF + WebP em várias larguras), favicon e imagem de compartilhamento.
// Uso: npm run imagens
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = "public/img";
mkdirSync(OUT, { recursive: true });

const fotos = [
  { src: "assets-fonte/modelo_masculino_frente.png", name: "modelo-masculino", widths: [480, 960, 1440] },
  { src: "assets-fonte/modelo_feminina_frente.png", name: "modelo-feminina", widths: [480, 960, 1440] },
  { src: "Imgs/Morgana.jpg", name: "morgana", widths: [480, 960] },
  { src: "Imgs/GatoPreto_transparente.png", name: "logo-comunidade", widths: [160, 320] },
];

for (const f of fotos) {
  for (const w of f.widths) {
    const img = sharp(f.src).resize({ width: w, withoutEnlargement: true });
    await img.clone().avif({ quality: 52 }).toFile(`${OUT}/${f.name}-${w}.avif`);
    await img.clone().webp({ quality: 78 }).toFile(`${OUT}/${f.name}-${w}.webp`);
  }
  console.log("foto:", f.name);
}

// logo da marca (retrato oval) para o header
for (const h of [48, 96, 192]) {
  await sharp("assets-fonte/logo.png").resize({ height: h }).webp({ quality: 90 }).toFile(`${OUT}/logo-${h}.webp`);
}
await sharp("assets-fonte/logo.png").resize(32, 32, { fit: "contain", background: "#0b0a08" }).png().toFile("public/favicon-32.png");
await sharp("assets-fonte/logo.png").resize(180, 180, { fit: "contain", background: "#0b0a08" }).png().toFile("public/apple-touch-icon.png");

// imagem de compartilhamento (WhatsApp, Instagram, etc.)
await sharp("assets-fonte/modelo_masculino_frente_16x9.jpg").resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82 }).toFile("public/og.jpg");
console.log("logo, favicon e og ok");
