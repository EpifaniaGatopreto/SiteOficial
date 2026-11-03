// Todos os links externos do site num lugar só. Preencha e pronto: os botões passam a funcionar.
// Link vazio = o botão fica visível, mas avisa "em breve" em vez de levar a lugar nenhum.
export const LINKS = {
  instagram: "", // ex.: "https://instagram.com/epifaniagatopreto"
  tiktok: "",
  whatsapp: "", // grupo da comunidade: "https://chat.whatsapp.com/..."
  discord: "", // "https://discord.gg/..."
  email: "", // ex.: "mailto:contato@epifaniagatopreto.com.br"
};

export function aplicarLinks() {
  for (const a of document.querySelectorAll("[data-link]")) {
    const url = LINKS[a.dataset.link];
    if (url) {
      a.href = url;
      if (!url.startsWith("mailto:")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
    } else {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.title = "Em breve";
      a.style.cursor = "not-allowed";
    }
  }
}
