      let dados = {
        doadores: [],
        instituicoes: [],
        voluntarios: [],
        doacoes: [],
        alimentos: [],
        coletas: [],
        distribuicoes: [],
        categorias: [],
        campanhas: [],
      };

      function carregarDados() {
        const dadosSalvos = localStorage.getItem("bancoAlimentosDados");
        if (dadosSalvos) {
          dados = JSON.parse(dadosSalvos);
          atualizarDashboard();
          atualizarTodasListagens();
        }
      }

      function salvarDados() {
        localStorage.setItem("bancoAlimentosDados", JSON.stringify(dados));
      }

     function toggleSubmenu(id) {
        const submenu = document.getElementById("submenu-" + id);
        const arrow = event.currentTarget.querySelector(".menu-arrow");

        submenu.classList.toggle("open");
        arrow.classList.toggle("open");
      }

    function showSection(sectionId, event) {
        if (event) event.stopPropagation();

    document
        .querySelectorAll(".content-section")
        .forEach((s) => s.classList.remove("active"));
    document
        .querySelectorAll(".menu-item")
        .forEach((m) => m.classList.remove("active"));
    document
        .querySelectorAll(".submenu-item")
        .forEach((m) => m.classList.remove("active"));}