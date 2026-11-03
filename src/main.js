import "./styles.css";
import { aplicarLinks } from "./links.js";

aplicarLinks();

// O bloco do próximo encontro some sozinho quando a data passa
for (const aviso of document.querySelectorAll("[data-ate]")) {
  if (new Date() > new Date(`${aviso.dataset.ate}T23:59:59-03:00`)) aviso.remove();
}

// Entrada suave das seções
const reveal = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("visivel");
        reveal.unobserve(e.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
);
document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));

// Proteção dissuasiva das artes: sem clique direito e sem arrastar
for (const el of document.querySelectorAll("[data-protegido]")) {
  el.addEventListener("contextmenu", (e) => e.preventDefault());
  el.addEventListener("dragstart", (e) => e.preventDefault());
}

// Fecha o menu do celular ao escolher um item, ao tocar fora dele ou com Esc
const menu = document.querySelector(".menu-mobile");
menu?.addEventListener("click", (e) => {
  if (e.target.closest("a")) menu.removeAttribute("open");
});
document.addEventListener("click", (e) => {
  if (!menu?.contains(e.target)) menu?.removeAttribute("open");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") menu?.removeAttribute("open");
});
