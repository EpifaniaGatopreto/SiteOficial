// Marca d'água "epifania" + logo, repetida em diagonal, aplicada direto nos pixels da imagem.
import sharp from "sharp";
import { readFileSync } from "node:fs";

const INK = "#2b1a10";
const HALO = "#f3ebdd";
const OPACITY = 0.42;

export async function marcaDagua(buffer, logoPath) {
  const { width: w, height: h } = await sharp(buffer).metadata();
  const size = Math.max(28, Math.round(w / 15));
  const logoH = Math.round(size * 1.05);
  const logo = await sharp(logoPath).resize({ height: logoH }).png().toBuffer();
  const logoW = (await sharp(logo).metadata()).width;
  const logoUri = `data:image/png;base64,${logo.toString("base64")}`;

  const textW = Math.round(size * 0.55 * 8); // monoespaçada: ~0,55 em por letra
  const tileW = logoW + size * 0.4 + textW + size * 1.1;
  const tileH = size * 2.0;
  const stroke = Math.max(2, Math.round(size / 14));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <pattern id="p" width="${tileW}" height="${tileH * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
      ${[
        [0, 0],
        [tileW / 2, tileH],
        [-tileW / 2, tileH], // the offset row wraps around the tile edge; draw it on both sides
      ]
        .map(([x, y]) => {
          return `<g transform="translate(${x} ${y})" opacity="${OPACITY}">
            <image href="${logoUri}" x="0" y="${(tileH - logoH) / 2}" width="${logoW}" height="${logoH}"/>
            <text x="${logoW + size * 0.4}" y="${tileH / 2 + size * 0.35}" font-family="Consolas, 'Courier New', monospace"
              font-weight="700" font-size="${size}" fill="${INK}" stroke="${HALO}" stroke-width="${stroke}"
              paint-order="stroke">epifania</text>
          </g>`;
        })
        .join("")}
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#p)"/>
</svg>`;

  return sharp(buffer).composite([{ input: Buffer.from(svg) }]).toBuffer();
}

export const readLogo = (p) => readFileSync(p);
