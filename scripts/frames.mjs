// Extrai os quadros da transição (só o trecho em movimento) para o scrollytelling do hero.
// Uso: npm run frames   (precisa do ffmpeg no PATH)
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const FRAMES = 90;
const START = 0.9; // o vídeo segura 0,9 s no modelo masculino antes de começar a transição
const LENGTH = 3.2; // duração da transição

const sets = [
  { name: "desktop", src: "assets-fonte/transicao_16x9.mp4", width: 1600, quality: 68 },
  { name: "mobile", src: "assets-fonte/transicao_9x16.mp4", width: 720, quality: 66 },
];

for (const s of sets) {
  const out = join("public", "frames", s.name);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  execFileSync("ffmpeg", [
    "-v", "error", "-y",
    "-ss", String(START), "-t", String(LENGTH), "-i", s.src,
    "-vf", `fps=${FRAMES / LENGTH},scale=${s.width}:-2:flags=lanczos`,
    "-frames:v", String(FRAMES),
    "-c:v", "libwebp", "-quality", String(s.quality), "-compression_level", "6",
    join(out, "%03d.webp"),
  ]);
  const files = readdirSync(out);
  const kb = files.reduce((t, f) => t + statSync(join(out, f)).size, 0) / 1024;
  console.log(`${s.name}: ${files.length} quadros, ${(kb / 1024).toFixed(1)} MB`);
}
