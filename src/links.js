// Todos os links externos do site num lugar só. Preencha e pronto: os botões aparecem sozinhos.
// Link vazio = o botão não aparece, em vez de levar a lugar nenhum.
export const LINKS = {
  instagram: "https://www.instagram.com/epifaniagatopreto",
  tiktok: "",
  whatsapp: "https://chat.whatsapp.com/FDYjm1nDJH6B4ZynmbEPOY", // grupo da comunidade
  discord: "", // o convite antigo expirou: gerar um novo, sem validade, e colar aqui ("https://discord.gg/...")
  github: "https://github.com/EpifaniaGatopreto/SiteOficial",
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
      (a.closest("li") ?? a).remove();
    }
  }
}
