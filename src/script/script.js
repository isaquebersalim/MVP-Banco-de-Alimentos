      // Dados em memória
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

      // Carregar dados do localStorage
      function carregarDados() {
        const dadosSalvos = localStorage.getItem("bancoAlimentosDados");
        if (dadosSalvos) {
          dados = JSON.parse(dadosSalvos);
          atualizarDashboard();
          atualizarTodasListagens();
        }
      }

      // Salvar dados no localStorage
      function salvarDados() {
        localStorage.setItem("bancoAlimentosDados", JSON.stringify(dados));
      }