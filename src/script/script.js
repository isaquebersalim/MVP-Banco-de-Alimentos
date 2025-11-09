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

    document.querySelectorAll(".content-section").forEach((s) => s.classList.remove("active"));
    document.querySelectorAll(".menu-item").forEach((m) => m.classList.remove("active"));
    document.querySelectorAll(".submenu-item").forEach((m) => m.classList.remove("active"));

    document.getElementById(sectionId).classList.add("active");
         if (event) {
          event.currentTarget.classList.add("active");
        } else {
          document.querySelector([onclick="showSection('${sectionId}')"])?.classList.add("active");
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

function cadastrarInstituicao(e) {
    e.preventDefault();
    const form = e.target;
    const instituicao = {
            id: Date.now(),
            nome: form.nome.value,
            cnpj: form.cnpj.value,
            email: form.email.value,
            telefone: form.telefone.value,
            endereco: form.endereco.value,
        };

    dados.instituicoes.push(instituicao);
    salvarDados();
    form.reset();
    atualizarListaInstituicoes();
    atualizarDashboard();
    atualizarSelects();
    alert("Instituição cadastrada com sucesso!");
}

function cadastrarVoluntario(e) {
    e.preventDefault();
    const form = e.target;
    const voluntario = {
            id: Date.now(),
            nome: form.nome.value,
            cpf: form.cpf.value,
            email: form.email.value,
            telefone: form.telefone.value,
        };

    dados.voluntarios.push(voluntario);
    salvarDados();
    form.reset();
    atualizarListaVoluntarios();
    alert("Voluntário cadastrado com sucesso!");
}

function registrarDoacao(e) {
    e.preventDefault();
    const form = e.target;
    const doacao = {
            id: Date.now(),
            id_doador: form.id_doador.value,
            id_instituicao: form.id_instituicao.value,
            tipo: form.tipo.value,
            quantidade: form.quantidade.value,
            data_doacao: form.data_doacao.value,
        };

    dados.doacoes.push(doacao);
    salvarDados();
    form.reset();
    atualizarListaDoacoes();
    atualizarDashboard();
    alert("Doação registrada com sucesso!");
}

function cadastrarAlimento(e) {
    e.preventDefault();
    const form = e.target;
    const alimento = {
            id: Date.now(),
            nome: form.nome.value,
            categoria: form.categoria.value,
            quantidade: form.quantidade.value,
            unidade: form.unidade.value,
            validade: form.validade.value,  
        };

    dados.alimentos.push(alimento);
    salvarDados();
    form.reset();
    atualizarListaAlimentos();
    atualizarDashboard();
    alert("Alimento cadastrado com sucesso!");
}

function registrarColeta(e) {
    e.preventDefault();
    const form = e.target;
    const coleta = {
            id: Date.now(),
            id_doador: form.id_doador.value,
            data_coleta: form.data_coleta.value,
            responsavel: form.responsavel.value,
            observacoes: form.observacoes.value,    
        };

    dados.coletas.push(coleta);
    salvarDados();
    form.reset();
    atualizarListaColetas();
    alert("Coleta registrada com sucesso!");
}

function registrarDistribuicao(e) {
    e.preventDefault();
    const form = e.target;
    const distribuicao = {
            id: Date.now(),
            id_instituicao: form.id_instituicao.value,
            data_distribuicao: form.data_distribuicao.value,
            responsavel: form.responsavel.value,
            observacoes: form.observacoes.value,
        };

    dados.distribuicoes.push(distribuicao);
    salvarDados();
    form.reset();
    atualizarListaDistribuicoes();
    alert("Distribuição registrada com sucesso!");
}

function cadastrarCategoria(e) {
    e.preventDefault();
    const form = e.target;
    const categoria = {
            id: Date.now(),
            nome_categoria: form.nome_categoria.value,
        };

    dados.categorias.push(categoria);
    salvarDados();
    form.reset();
    atualizarListaCategorias();
    alert("Categoria cadastrada com sucesso!");
}

function cadastrarCampanha(e) {
    e.preventDefault();
    const form = e.target;
    const campanha = {
            id: Date.now(),
            nome: form.nome.value,
            descricao: form.descricao.value,
            data_inicio: form.data_inicio.value,
            data_fim: form.data_fim.value,
        };

    dados.campanhas.push(campanha);
    salvarDados();
    form.reset();
    atualizarListaCampanhas();
    alert("Campanha criada com sucesso!");
}

function atualizarDashboard() {
    document.getElementById("total-doadores").textContent = dados.doadores.length;
    document.getElementById("total-doacoes").textContent = dados.doacoes.length;
    document.getElementById("total-alimentos").textContent = dados.alimentos.length;
    document.getElementById("total-instituicoes").textContent = dados.instituicoes.length;
}

function atualizarListaDoadores() {
    const tbody = document.getElementById("lista-doadores");
    if (dados.doadores.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhum doador cadastrado</td></tr>';
            return;
        }

    tbody.innerHTML = dados.doadores.map((d) =>
            `<tr>
                <td>${d.nome}</td>
                <td>${d.cpf}</td>
                <td>${d.email || "-"}</td>
                <td>${d.telefone || "-"}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="excluirDoador(${
                            d.id
                        })">Excluir</button>
                    </div>
                </td>
            </tr>`
        ).join("");
}

function atualizarListaInstituicoes() {
    const tbody = document.getElementById("lista-instituicoes");
    if (dados.instituicoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhuma instituição cadastrada</td></tr>';
            return;
        }

    tbody.innerHTML = dados.instituicoes.map((i) => 
            `<tr>
                <td>${i.nome}</td>
                <td>${i.cnpj}</td>
                <td>${i.email || "-"}</td>
                <td>${i.telefone || "-"}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="excluirInstituicao(${
                            i.id
                        })">Excluir</button>
                    </div>
                </td>
            </tr>`
        ).join("");
}

function atualizarListaVoluntarios() {
        const tbody = document.getElementById("lista-voluntarios");
        if (dados.voluntarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhum voluntário cadastrado</td></tr>';
            return;
        }

        tbody.innerHTML = dados.voluntarios.map((v) => 
            `<tr>
                <td>${v.nome}</td>
                <td>${v.cpf}</td>
                <td>${v.email || "-"}</td>
                <td>${v.telefone || "-"}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="excluirVoluntario(${
                            v.id
                        })">Excluir</button>
                    </div>
                </td>
            </tr>`
        ).join("");
}

function atualizarListaDoacoes() {
    const tbody = document.getElementById("lista-doacoes");
    if (dados.doacoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #7f8c8d;">Nenhuma doação registrada</td></tr>';
            return;
        }

        tbody.innerHTML = dados.doacoes.map((d) => {
            const doador = dados.doadores.find((x) => x.id == d.id_doador);
            const instituicao = dados.instituicoes.find((x) => x.id == d.id_instituicao);
            return 
            
            `<tr>
                <td>${new Date(d.data_doacao).toLocaleDateString(
                    "pt-BR"
                )}</td>
                <td>${doador ? doador.nome : "N/A"}</td>
                <td>${instituicao ? instituicao.nome : "N/A"}</td>
                <td>${d.tipo}</td>
                <td>${d.quantidade}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="excluirDoacao(${
                            d.id
                        })">Excluir</button>
                    </div>
                </td>
            </tr>`;
        }).join("");
}

function atualizarListaAlimentos() {
        const tbody = document.getElementById("lista-alimentos");
        if (dados.alimentos.length === 0) {
          tbody.innerHTML =
            '<tr><td colspan="6" style="text-align: center; color: #7f8c8d;">Nenhum alimento cadastrado</td></tr>';
          return;
        }

        tbody.innerHTML = dados.alimentos.map((a) => 
            `<tr>
                <td>${a.nome}</td>
                <td>${a.categoria}</td>
                <td>${a.quantidade}</td>
                <td>${a.unidade}</td>
                <td>${
                        a.validade? new Date(a.validade).toLocaleDateString("pt-BR"): "-"
                }</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="excluirAlimento(${
                            a.id
                        })">Excluir</button>
                    </div>
                </td>
            </tr>`
        ).join("");
}

function atualizarListaColetas() {
        const tbody = document.getElementById("lista-coletas");
        if (dados.coletas.length === 0) {
          tbody.innerHTML =
            '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhuma coleta registrada</td></tr>';
          return;
        }

        tbody.innerHTML = dados.coletas.map((c) => {
            const doador = dados.doadores.find((x) => x.id == c.id_doador);
            return 
                `<tr>
                    <td>${new Date(c.data_coleta).toLocaleDateString(
                        "pt-BR"
                        )}</td>
                    <td>${doador ? doador.nome : "N/A"}</td>
                    <td>${c.responsavel}</td>
                    <td>${c.observacoes || "-"}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-danger btn-small" onclick="excluirColeta(${
                                c.id
                            })">Excluir</button>
                        </div>
                    </td>
                </tr>`;
        }).join("");
}

function atualizarListaDistribuicoes() {
        const tbody = document.getElementById("lista-distribuicoes");
        if (dados.distribuicoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhuma distribuição registrada</td></tr>';
            return;
        }

        tbody.innerHTML = dados.distribuicoes.map((d) => {
            const instituicao = dados.instituicoes.find((x) => x.id == d.id_instituicao);
            return 
                `<tr>
                    <td>${new Date(d.data_distribuicao).toLocaleDateString("pt-BR")}</td>
                    <td>${instituicao ? instituicao.nome : "N/A"}</td>
                    <td>${d.responsavel}</td>
                    <td>${d.observacoes || "-"}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-danger btn-small" onclick="excluirDistribuicao(${
                                d.id
                            })">Excluir</button>
                        </div>
                    </td>
                </tr>`;
        }).join("");
}