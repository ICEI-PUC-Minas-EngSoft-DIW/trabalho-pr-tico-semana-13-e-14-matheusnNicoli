document.addEventListener("DOMContentLoaded", async function () {
  const canvas = document.getElementById("grafico-principal");
  if (!canvas) return;

  const url = "http://localhost:3000/exposicoes";

  try {
    const resposta = await fetch(url);
    const itens = await resposta.json();

    if (!Array.isArray(itens) || itens.length === 0) {
      const ctx = canvas.getContext("2d");
      ctx.font = "16px Arial";
      ctx.fillText("Nenhum dado cadastrado para exibir no gráfico.", 10, 30);
      return;
    }

    const contagemPorCategoria = {};
    itens.forEach((item) => {
      const categoria = item.categoria || "Sem categoria";
      if (!contagemPorCategoria[categoria]) {
        contagemPorCategoria[categoria] = 0;
      }
      contagemPorCategoria[categoria] += 1;
    });

    const labels = Object.keys(contagemPorCategoria);
    const valores = Object.values(contagemPorCategoria);

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Exposições por categoria",
            data: valores,
            backgroundColor: "rgba(37, 99, 235, 0.7)",
            borderColor: "rgba(30, 64, 175, 1)",
            borderWidth: 1,
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  } catch (erro) {
    const ctx = canvas.getContext("2d");
    ctx.font = "16px Arial";
    ctx.fillText("Erro ao carregar dados da API.", 10, 30);
  }
});
