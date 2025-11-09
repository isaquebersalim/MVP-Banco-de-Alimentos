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
        .forEach((m) => m.classList.remove("active"));

    document.getElementById(sectionId).classList.add("active");
         if (event) {
          event.currentTarget.classList.add("active");
        } else {
          document
            .querySelector([onclick="showSection('${sectionId}')"])
            ?.classList.add("active");
        }
}

function cadastrarDoador(e) {
        e.preventDefault();
        const form = e.target;
        const doador = {
          id: Date.now(),
          nome: form.nome.value,
          cpf: form.cpf.value,
          email: form.email.value,
          telefone: form.telefone.value,
          endereco: form.endereco.value,
        };

        dados.doadores.push(doador);
        salvarDados();
        form.reset();
        atualizarListaDoadores();
        atualizarDashboard();
        atualizarSelects();
        alert("Doador cadastrado com sucesso!");
}