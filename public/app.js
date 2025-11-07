// Substitua pelo SEU link do Apps Script publicado como Web App
const API_URL = "https://script.google.com/macros/s/AKfycbzyQYS_83e_W9mA5UCQpAfEfT_K_jn0HxyxgrLEQdX-dNRgZw_tTjy4ljZmOi3K-8wo/exec";


const div = document.getElementById("resultado");
const input = document.getElementById("filtro");
const btnBuscar = document.getElementById("btnBuscar");

let todosOsDados = [];

// 🔹 Buscar todos os produtos ao carregar a página
window.addEventListener("load", () => {
  div.innerHTML = "<p>⏳ Carregando dados...</p>";

  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.rows) {
        div.innerHTML = "<p>⚠️ Nenhum dado encontrado.</p>";
        return;
      }

      todosOsDados = data.rows;
      mostrarProdutos(todosOsDados);
    })
    .catch((err) => {
      console.error("Erro ao buscar:", err);
      div.innerHTML = "<p>❌ Erro ao buscar os dados.</p>";
    });
});

// 🔹 Filtro de busca (produto)
input.addEventListener("input", () => {
  const termo = input.value.toLowerCase();
  const filtrados = todosOsDados.filter((item) =>
    item.PRODUTO.toLowerCase().includes(termo)
  );
  mostrarProdutos(filtrados);
});

// 🔹 Botão Buscar (opcional)
btnBuscar.addEventListener("click", () => {
  const termo = input.value.toLowerCase();
  const filtrados = todosOsDados.filter((item) =>
    item.PRODUTO.toLowerCase().includes(termo)
  );
  mostrarProdutos(filtrados);
});

// 🔹 Mostrar produtos na tela
function mostrarProdutos(lista) {
  div.innerHTML = "";

  if (lista.length === 0) {
    div.innerHTML = "<p>❌ Nenhum produto encontrado.</p>";
    return;
  }

  lista.forEach((item) => {
    const card = document.createElement("div");
    card.className = "produto-item";

    // verificar se há imagem
    const imagem = item["IMAGEM APP"]
      ? `<img src="${item["IMAGEM APP"]}" alt="${item.PRODUTO}" class="produto-img">`
      : "";

    card.innerHTML = `
      <h3>${item.PRODUTO}</h3>
      ${imagem}
      <p><strong>Categoria:</strong> ${item.CATEGORIA}</p>
      <p><strong>Quantidade:</strong> ${item.QUANTIDADE}</p>
      <p><strong>Caixa:</strong> ${item.CAIXA}</p>
      <p><strong>Valor:</strong> R$ ${Number(item.VALOR).toFixed(2)}</p>
    `;

    div.appendChild(card);
  });
}
