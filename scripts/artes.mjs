// Gera as versões PÚBLICAS das artes: no máximo 1200 px, com marca d'água, em AVIF e WebP.
// Os originais ficam em assets-fonte/arte-original/ (fora do git) e nunca são publicados.
// Uso: npm run artes
import sharp from "sharp";
import { mkdirSync, readdirSync } from "node:fs";
import { join, parse } from "node:path";
import { marcaDagua } from "./lib/marca-dagua.mjs";

const SRC = "assets-fonte/arte-original";
const OUT = "public/arte";
const LOGO = "assets-fonte/logo.png";
const WIDTHS = [600, 1029]; // 1029 x 1200 é o teto para a proporção da arte (6:7)
const MAX = 1200;

mkdirSync(OUT, { recursive: true });
for (const file of readdirSync(SRC).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))) {
  const name = parse(file).name;
  for (const w of WIDTHS) {
    const base = await sharp(join(SRC, file))
      .resize({ width: w, height: MAX, fit: "inside", withoutEnlargement: true })
      .toBuffer();
    const marked = await marcaDagua(base, LOGO);
    await sharp(marked).avif({ quality: 55 }).toFile(join(OUT, `${name}-${w}.avif`));
    await sharp(marked).webp({ quality: 80 }).toFile(join(OUT, `${name}-${w}.webp`));
  }
  console.log("arte:", name);
}
