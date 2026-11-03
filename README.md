# Epifania — Gato Preto

Site da Epifania: marca de camisetas autorais que nasceu de uma comunidade de programação.

## Rodar localmente

```bash
npm install
npm run dev
```

## Onde mexer

| O quê | Onde |
| --- | --- |
| Links (Instagram, WhatsApp, Discord, TikTok, e-mail) | `src/links.js` — link vazio mostra o botão como "em breve" |
| Textos das seções | `index.html` |
| Frases do hero e em que ponto da rolagem aparecem | `index.html` (`.hero-line`) e `src/hero.js` (`LINHAS`) |
| Cores e fontes | `src/styles.css` (`@theme`) |

## Imagens e proteção das artes

Os originais ficam em `assets-fonte/`, que **não vai para o git** (o repositório é público).
Os scripts geram em `public/` só versões otimizadas — e, no caso das artes, com marca d'água e no máximo 1200 px.

```text
assets-fonte/
  arte-original/        artes em alta (ex.: gato-programador.png)
  logo.png              logo do peito (fundo transparente)
  modelo_*.png          fotos master dos modelos
  transicao_*.mp4       vídeo da transição do hero (16:9 e 9:16)
```

```bash
npm run artes     # artes com marca d'água -> public/arte/
npm run imagens   # fotos, logo, favicon, imagem de compartilhamento -> public/img/
npm run frames    # quadros do hero (precisa do ffmpeg) -> public/frames/
npm run assets    # os três
```

Para mostrar uma arte nova na seção "Em breve": coloque o original em `assets-fonte/arte-original/`,
rode `npm run artes` e troque o cartão placeholder em `index.html` por um `<picture>` apontando para
`/arte/<nome>-600.webp`.

## Publicação

Cada push na `main` publica o site pelo GitHub Actions (`.github/workflows/deploy.yml`) no domínio
`epifaniagatopreto.com.br` (`public/CNAME`). Em Settings → Pages, a fonte precisa estar em **GitHub Actions**.
