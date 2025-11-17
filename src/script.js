// ========================================
// CONFIGURAÇÃO DO SUPABASE
// ========================================
// Substitua pelas suas credenciais do Supabase

const SUPABASE_URL = "https://sedypjtvletikyfwnqve.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZHlwanR2bGV0aWt5ZnducXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzA3ODIsImV4cCI6MjA3ODg0Njc4Mn0.g_nC7I_OFCdXERAdDfVmD4rBxAHki4SMCh2PjqKhD58";

// Verificar se o Supabase está disponível
let supabase;
try {
  supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
  console.error("Erro ao inicializar Supabase:", error);
}

// ========================================
// INICIALIZAÇÃO
// ========================================
window.addEventListener("DOMContentLoaded", () => {
  atualizarListagensGerais();
});

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

// ========================================
// FUNÇÕES DE NAVEGAÇÃO
// ========================================
function toggleSubmenu(id) {
  const submenu = document.getElementById("submenu-" + id);
  const arrow = event.currentTarget.querySelector(".menu-arrow");

  if (submenu && arrow) {
    submenu.classList.toggle("open");
    arrow.classList.toggle("open");
  }
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

  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add("active");
  }

  if (event) {
    event.currentTarget.classList.add("active");
  } else {
    const menuItem = document.querySelector(
      `[onclick="showSection('${sectionId}')"]`
    );
    if (menuItem) {
      menuItem.classList.add("active");
    }
  }
}

// ========================================
// VALIDAÇÕES
// ========================================
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

// ========================================
// FUNÇÕES DE CADASTRO
// ========================================
async function cadastrarDoador(e) {
  e.preventDefault();
  const form = e.target;

  const nome = form.nome.value.trim();
  const cpf = form.cpf.value.trim();
  const email = form.email.value.trim();
  const telefone = form.telefone.value.trim();
  const endereco = form.endereco.value.trim();

  if (!nome || !cpf || !email || !telefone || !endereco) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (!validarCPF(cpf)) {
    alert("CPF inválido!");
    return;
  }

  const cpfJaExiste = dados.doadores.some((d) => d.cpf === cpf);
  if (cpfJaExiste) {
    alert("Já existe um doador cadastrado com esse CPF!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("E-mail inválido!");
    return;
  }

  const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  if (!telefoneRegex.test(telefone)) {
    alert("Telefone inválido! Use o formato (XX) XXXXX-XXXX");
    return;
  }

  try {
    const { error } = await supabase.from("doadores").insert([
      {
        nome,
        cpf,
        email,
        telefone,
        endereco,
      },
    ]);

    if (error) throw error;

    alert("Doador cadastrado com sucesso!");
    await atualizarListagensGerais();
    form.reset();
  } catch (error) {
    alert("Erro ao cadastrar no banco!");
    console.error(error);
  }
}

async function cadastrarInstituicao(e) {
  e.preventDefault();
  const form = e.target;

  const nome = form.nome.value;
  const cnpj = form.cnpj.value;
  const email = form.email.value;
  const telefone = form.telefone.value;
  const endereco = form.endereco.value;

  try {
    const { error } = await supabase.from("instituicoes").insert([
      {
        nome,
        cnpj,
        email,
        telefone,
        endereco,
      },
    ]);

    if (error) throw error;

    form.reset();
    await atualizarListagensGerais();
    alert("Instituição cadastrada com sucesso!");
  } catch (error) {
    alert("Erro ao cadastrar instituição!");
    console.error(error);
  }
}

async function cadastrarVoluntario(e) {
  e.preventDefault();
  const form = e.target;

  const nome = form.nome.value;
  const cpf = form.cpf.value;
  const email = form.email.value;
  const telefone = form.telefone.value;

  try {
    const { error } = await supabase.from("voluntarios").insert([
      {
        nome,
        cpf,
        email,
        telefone,
      },
    ]);

    if (error) throw error;

    form.reset();
    await atualizarListagensGerais();
    alert("Voluntário cadastrado com sucesso!");
  } catch (error) {
    alert("Erro ao cadastrar voluntário!");
    console.error(error);
  }
}

async function registrarDoacao(e) {
  e.preventDefault();
  const form = e.target;

  const id_doador = form.id_doador.value;
  const id_instituicao = form.id_instituicao.value;
  const tipo = form.tipo.value;
  const quantidade = form.quantidade.value;
  const data_doacao = form.data_doacao.value;

  try {
    const { error } = await supabase.from("doacoes").insert([
      {
        id_doador,
        id_instituicao,
        tipo,
        quantidade,
        data_doacao,
      },
    ]);

    if (error) throw error;

    form.reset();
    await atualizarListagensGerais();
    alert("Doação registrada com sucesso!");
  } catch (error) {
    alert("Erro ao registrar doação!");
    console.error(error);
  }
}

async function cadastrarAlimento(e) {
  e.preventDefault();
  const form = e.target;

  const nome = form.nome.value;
  const categoria = form.categoria.value;
  const quantidade = form.quantidade.value;
  const unidade = form.unidade.value;
  const validade = form.validade.value;

  try {
    const { error } = await supabase.from("alimentos").insert([
      {
        nome,
        categoria,
        quantidade,
        unidade,
        validade,
      },
    ]);

    if (error) throw error;

    form.reset();
    await atualizarListagensGerais();
    alert("Alimento cadastrado com sucesso!");
  } catch (error) {
    alert("Erro ao cadastrar alimento!");
    console.error(error);
  }
}

async function registrarColeta(e) {
  e.preventDefault();
  const form = e.target;

  const id_doador = form.id_doador.value;
  const data_coleta = form.data_coleta.value;
  const responsavel = form.responsavel.value;
  const observacoes = form.observacoes.value;

  try {
    const { error } = await supabase.from("coletas").insert([
      {
        id_doador,
        data_coleta,
        responsavel,
        observacoes,
      },
    ]);

    if (error) throw error;

    form.reset();
    await atualizarListagensGerais();
    alert("Coleta registrada com sucesso!");
  } catch (error) {
    alert("Erro ao registrar coleta!");
    console.error(error);
  }
}

async function registrarDistribuicao(e) {
  e.preventDefault();
  const form = e.target;

  const id_instituicao = form.id_instituicao.value;
  const data_distribuicao = form.data_distribuicao.value;
  const responsavel = form.responsavel.value;
  const observacoes = form.observacoes.value;

  try {
    const { error } = await supabase.from("distribuicoes").insert([
      {
        id_instituicao,
        data_distribuicao,
        responsavel,
        observacoes,
      },
    ]);

    if (error) throw error;

    form.reset();
    await atualizarListagensGerais();
    alert("Distribuição registrada com sucesso!");
  } catch (error) {
    alert("Erro ao registrar distribuição!");
    console.error(error);
  }
}

async function cadastrarCategoria(e) {
  e.preventDefault();
  const form = e.target;

  const nome_categoria = form.nome_categoria.value;

  try {
    const { error } = await supabase.from("categorias").insert([
      {
        nome_categoria,
      },
    ]);

    if (error) throw error;

    form.reset();
    await atualizarListagensGerais();
    alert("Categoria cadastrada com sucesso!");
  } catch (error) {
    alert("Erro ao cadastrar categoria!");
    console.error(error);
  }
}

async function cadastrarCampanha(e) {
  e.preventDefault();
  const form = e.target;

  const nome = form.nome.value;
  const descricao = form.descricao.value;
  const data_inicio = form.data_inicio.value;
  const data_fim = form.data_fim.value;

  try {
    const { error } = await supabase.from("campanhas").insert([
      {
        nome,
        descricao,
        data_inicio,
        data_fim,
      },
    ]);

    if (error) throw error;

    form.reset();
    await atualizarListagensGerais();
    alert("Campanha criada com sucesso!");
  } catch (error) {
    alert("Erro ao cadastrar campanha!");
    console.error(error);
  }
}

// ========================================
// FUNÇÕES DE EXCLUSÃO
// ========================================
async function excluirDoador(id) {
  if (!confirm("Deseja realmente excluir este doador?")) return;

  try {
    const { error } = await supabase.from("doadores").delete().eq("id", id);
    if (error) throw error;

    await atualizarListagensGerais();
    alert("Doador excluído com sucesso!");
  } catch (error) {
    alert("Erro ao excluir!");
    console.error(error);
  }
}

async function excluirInstituicao(id) {
  if (!confirm("Deseja realmente excluir esta instituição?")) return;

  try {
    const { error } = await supabase.from("instituicoes").delete().eq("id", id);
    if (error) throw error;

    await atualizarListagensGerais();
    alert("Instituição excluída com sucesso!");
  } catch (error) {
    alert("Erro ao excluir!");
    console.error(error);
  }
}

async function excluirVoluntario(id) {
  if (!confirm("Deseja realmente excluir este voluntário?")) return;

  try {
    const { error } = await supabase.from("voluntarios").delete().eq("id", id);
    if (error) throw error;

    await atualizarListagensGerais();
    alert("Voluntário excluído com sucesso!");
  } catch (error) {
    alert("Erro ao excluir!");
    console.error(error);
  }
}

async function excluirDoacao(id) {
  if (!confirm("Deseja realmente excluir esta doação?")) return;

  try {
    const { error } = await supabase.from("doacoes").delete().eq("id", id);
    if (error) throw error;

    await atualizarListagensGerais();
    alert("Doação excluída com sucesso!");
  } catch (error) {
    alert("Erro ao excluir!");
    console.error(error);
  }
}

async function excluirAlimento(id) {
  if (!confirm("Deseja realmente excluir este alimento?")) return;

  try {
    const { error } = await supabase.from("alimentos").delete().eq("id", id);
    if (error) throw error;

    await atualizarListagensGerais();
    alert("Alimento excluído com sucesso!");
  } catch (error) {
    alert("Erro ao excluir!");
    console.error(error);
  }
}

async function excluirColeta(id) {
  if (!confirm("Deseja realmente excluir esta coleta?")) return;

  try {
    const { error } = await supabase.from("coletas").delete().eq("id", id);
    if (error) throw error;

    await atualizarListagensGerais();
    alert("Coleta excluída com sucesso!");
  } catch (error) {
    alert("Erro ao excluir!");
    console.error(error);
  }
}

async function excluirDistribuicao(id) {
  if (!confirm("Deseja realmente excluir esta distribuição?")) return;

  try {
    const { error } = await supabase
      .from("distribuicoes")
      .delete()
      .eq("id", id);
    if (error) throw error;

    await atualizarListagensGerais();
    alert("Distribuição excluída com sucesso!");
  } catch (error) {
    alert("Erro ao excluir!");
    console.error(error);
  }
}

async function excluirCategoria(id) {
  if (!confirm("Deseja realmente excluir esta categoria?")) return;

  try {
    const { error } = await supabase.from("categorias").delete().eq("id", id);
    if (error) throw error;

    await atualizarListagensGerais();
    alert("Categoria excluída com sucesso!");
  } catch (error) {
    alert("Erro ao excluir!");
    console.error(error);
  }
}

async function excluirCampanha(id) {
  if (!confirm("Deseja realmente excluir esta campanha?")) return;

  try {
    const { error } = await supabase.from("campanhas").delete().eq("id", id);
    if (error) throw error;

    await atualizarListagensGerais();
    alert("Campanha excluída com sucesso!");
  } catch (error) {
    alert("Erro ao excluir!");
    console.error(error);
  }
}

// ========================================
// FUNÇÕES DE ATUALIZAÇÃO DE LISTAS
// ========================================
function atualizarDashboard() {
  const totalDoadores = document.getElementById("total-doadores");
  const totalDoacoes = document.getElementById("total-doacoes");
  const totalAlimentos = document.getElementById("total-alimentos");
  const totalInstituicoes = document.getElementById("total-instituicoes");

  if (totalDoadores) totalDoadores.textContent = dados.doadores.length;
  if (totalDoacoes) totalDoacoes.textContent = dados.doacoes.length;
  if (totalAlimentos) totalAlimentos.textContent = dados.alimentos.length;
  if (totalInstituicoes)
    totalInstituicoes.textContent = dados.instituicoes.length;
}

function atualizarListaDoadores() {
  const tbody = document.getElementById("lista-doadores");
  if (!tbody) return;

  if (dados.doadores.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhum doador cadastrado</td></tr>';
    return;
  }

  tbody.innerHTML = dados.doadores
    .map(
      (d) => `<tr>
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
    )
    .join("");
}

function atualizarListaInstituicoes() {
  const tbody = document.getElementById("lista-instituicoes");
  if (!tbody) return;

  if (dados.instituicoes.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhuma instituição cadastrada</td></tr>';
    return;
  }

  tbody.innerHTML = dados.instituicoes
    .map(
      (i) => `<tr>
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
    )
    .join("");
}

function atualizarListaVoluntarios() {
  const tbody = document.getElementById("lista-voluntarios");
  if (!tbody) return;

  if (dados.voluntarios.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhum voluntário cadastrado</td></tr>';
    return;
  }

  tbody.innerHTML = dados.voluntarios
    .map(
      (v) => `<tr>
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
    )
    .join("");
}

function atualizarListaDoacoes() {
  const tbody = document.getElementById("lista-doacoes");
  if (!tbody) return;

  if (dados.doacoes.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; color: #7f8c8d;">Nenhuma doação registrada</td></tr>';
    return;
  }

  tbody.innerHTML = dados.doacoes
    .map((d) => {
      const doador = dados.doadores.find((x) => x.id == d.id_doador);
      const instituicao = dados.instituicoes.find(
        (x) => x.id == d.id_instituicao
      );
      return `<tr>
            <td>${new Date(d.data_doacao).toLocaleDateString("pt-BR")}</td>
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
    })
    .join("");
}

function atualizarListaAlimentos() {
  const tbody = document.getElementById("lista-alimentos");
  if (!tbody) return;

  if (dados.alimentos.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; color: #7f8c8d;">Nenhum alimento cadastrado</td></tr>';
    return;
  }

  tbody.innerHTML = dados.alimentos
    .map(
      (a) => `<tr>
                <td>${a.nome}</td>
                <td>${a.categoria}</td>
                <td>${a.quantidade}</td>
                <td>${a.unidade}</td>
                <td>${
                  a.validade
                    ? new Date(a.validade).toLocaleDateString("pt-BR")
                    : "-"
                }</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="excluirAlimento(${
                          a.id
                        })">Excluir</button>
                    </div>
                </td>
            </tr>`
    )
    .join("");
}

function atualizarListaColetas() {
  const tbody = document.getElementById("lista-coletas");
  if (!tbody) return;

  if (dados.coletas.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhuma coleta registrada</td></tr>';
    return;
  }

  tbody.innerHTML = dados.coletas
    .map((c) => {
      const doador = dados.doadores.find((x) => x.id == c.id_doador);
      return `<tr>
                <td>${new Date(c.data_coleta).toLocaleDateString("pt-BR")}</td>
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
    })
    .join("");
}

function atualizarListaDistribuicoes() {
  const tbody = document.getElementById("lista-distribuicoes");
  if (!tbody) return;

  if (dados.distribuicoes.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhuma distribuição registrada</td></tr>';
    return;
  }

  tbody.innerHTML = dados.distribuicoes
    .map((d) => {
      const instituicao = dados.instituicoes.find(
        (x) => x.id == d.id_instituicao
      );
      return `<tr>
                <td>${new Date(d.data_distribuicao).toLocaleDateString(
                  "pt-BR"
                )}</td>
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
    })
    .join("");
}

function atualizarListaCategorias() {
  const tbody = document.getElementById("lista-categorias");
  if (!tbody) return;

  if (dados.categorias.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="2" style="text-align: center; color: #7f8c8d;">Nenhuma categoria cadastrada</td></tr>';
    return;
  }

  tbody.innerHTML = dados.categorias
    .map(
      (c) => `<tr>
                <td>${c.nome_categoria}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="excluirCategoria(${c.id})">Excluir</button>
                    </div>
                </td>
            </tr>`
    )
    .join("");
}

function atualizarListaCampanhas() {
  const tbody = document.getElementById("lista-campanhas");
  if (!tbody) return;

  if (dados.campanhas.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; color: #7f8c8d;">Nenhuma campanha cadastrada</td></tr>';
    return;
  }

  tbody.innerHTML = dados.campanhas
    .map((c) => {
      const hoje = new Date();
      const inicio = new Date(c.data_inicio);
      const fim = c.data_fim ? new Date(c.data_fim) : null;
      let status = "Ativa";

      if (fim && hoje > fim) status = "Encerrada";
      else if (hoje < inicio) status = "Aguardando";

      return `<tr>
                <td>${c.nome}</td>
                <td>${c.descricao || "-"}</td>
                <td>${new Date(c.data_inicio).toLocaleDateString("pt-BR")}</td>
                <td>${
                  c.data_fim
                    ? new Date(c.data_fim).toLocaleDateString("pt-BR")
                    : "-"
                }</td>
                <td><span style="padding: 4px 8px; background: ${
                  status === "Ativa" ? "#27ae60" : "#95a5a6"
                }; color: white; border-radius: 4px; font-size: 12px;">${status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="excluirCampanha(${
                          c.id
                        })">Excluir</button>
                    </div>
                </td>
            </tr>`;
    })
    .join("");
}

function atualizarSelects() {
  const selectsDoador = document.querySelectorAll(
    "#select-doador, #select-doador-coleta"
  );
  selectsDoador.forEach((select) => {
    const valorAtual = select.value;
    select.innerHTML =
      '<option value="">Selecione um doador</option>' +
      dados.doadores
        .map((d) => `<option value="${d.id}">${d.nome}</option>`)
        .join("");
    select.value = valorAtual;
  });

  const selectsInstituicao = document.querySelectorAll(
    "#select-instituicao, #select-instituicao-dist"
  );
  selectsInstituicao.forEach((select) => {
    const valorAtual = select.value;
    select.innerHTML =
      '<option value="">Selecione uma instituição</option>' +
      dados.instituicoes
        .map((i) => `<option value="${i.id}">${i.nome}</option>`)
        .join("");
    select.value = valorAtual;
  });
}

function atualizarTodasListagens() {
  atualizarListaDoadores();
  atualizarListaInstituicoes();
  atualizarListaVoluntarios();
  atualizarListaDoacoes();
  atualizarListaAlimentos();
  atualizarListaColetas();
  atualizarListaDistribuicoes();
  atualizarListaCategorias();
  atualizarListaCampanhas();
  atualizarSelects();
}

// ========================================
// FUNÇÕES DE RELATÓRIOS
// ========================================
function gerarRelatorioGeral() {
  const dataInicio = document.getElementById("rel-data-inicio")?.value;
  const dataFim = document.getElementById("rel-data-fim")?.value;

  if (!dataInicio || !dataFim) {
    alert("Por favor, selecione o período para gerar o relatório");
    return;
  }

  const doacoesFiltradas = dados.doacoes.filter((d) => {
    return d.data_doacao >= dataInicio && d.data_doacao <= dataFim;
  });

  const resultado = document.getElementById("relatorio-resultado");
  if (!resultado) return;

  resultado.innerHTML = `<div style="padding: 20px;">
            <h4>Relatório de Doações - Período: 
                ${new Date(dataInicio).toLocaleDateString(
                  "pt-BR"
                )} a ${new Date(dataFim).toLocaleDateString("pt-BR")}
            </h4>
            <div style="margin-top: 20px;">
                <p><strong>Total de Doações:</strong> ${
                  doacoesFiltradas.length
                }</p>
                <p><strong>Quantidade Total Doada:</strong> ${doacoesFiltradas.reduce(
                  (acc, d) => acc + parseInt(d.quantidade),
                  0
                )} unidades</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <h5>Detalhamento:</h5>
                <ul style="list-style: none; padding: 0;">
                    ${doacoesFiltradas
                      .map((d) => {
                        const doador = dados.doadores.find(
                          (x) => x.id == d.id_doador
                        );
                        const instituicao = dados.instituicoes.find(
                          (x) => x.id == d.id_instituicao
                        );
                        return `<li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                            ${new Date(d.data_doacao).toLocaleDateString(
                              "pt-BR"
                            )} - 
                            ${doador?.nome || "N/A"} → 
                            ${instituicao?.nome || "N/A"} - 
                            ${d.quantidade} ${d.tipo}
                        </li>`;
                      })
                      .join("")}
                </ul>
            </div>
        </div>`;
}

function gerarRelatorioDoadores() {
  const doadoresComTotal = dados.doadores
    .map((doador) => {
      const totalDoacoes = dados.doacoes.filter(
        (d) => d.id_doador == doador.id
      ).length;
      const quantidadeTotal = dados.doacoes
        .filter((d) => d.id_doador == doador.id)
        .reduce((acc, d) => acc + parseInt(d.quantidade), 0);
      return { ...doador, totalDoacoes, quantidadeTotal };
    })
    .sort((a, b) => b.totalDoacoes - a.totalDoacoes);

  const resultado = document.getElementById("relatorio-resultado");
  if (!resultado) return;

  resultado.innerHTML = `<div style="padding: 20px;">
            <h4>Top Doadores</h4>
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Posição</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Nome</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Total de Doações</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Quantidade Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${doadoresComTotal
                          .slice(0, 10)
                          .map(
                            (d, i) => `<tr>
                                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${
                                  i + 1
                                }º</td>
                                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${
                                  d.nome
                                }</td>
                                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${
                                  d.totalDoacoes
                                }</td>
                                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${
                                  d.quantidadeTotal
                                } unidades</td>
                            </tr>`
                          )
                          .join("")}
                    </tbody>
                </table>
        </div>`;
}

function gerarRelatorioInstituicoes() {
  const instituicoesComTotal = dados.instituicoes
    .map((inst) => {
      const totalRecebimentos = dados.doacoes.filter(
        (d) => d.id_instituicao == inst.id
      ).length;
      const quantidadeTotal = dados.doacoes
        .filter((d) => d.id_instituicao == inst.id)
        .reduce((acc, d) => acc + parseInt(d.quantidade), 0);
      return { ...inst, totalRecebimentos, quantidadeTotal };
    })
    .sort((a, b) => b.totalRecebimentos - a.totalRecebimentos);

  const resultado = document.getElementById("relatorio-resultado");
  if (!resultado) return;

  resultado.innerHTML = `<div style="padding: 20px;">
            <h4>Instituições Atendidas</h4>
            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Instituição</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">CNPJ</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Total Recebido</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Quantidade</th>
                    </tr>
                </thead>
                <tbody>
                    ${instituicoesComTotal
                      .map(
                        (i) => `<tr>
                            <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${i.nome}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${i.cnpj}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${i.totalRecebimentos} doações</td>
                            <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${i.quantidadeTotal} unidades</td>
                        </tr>`
                      )
                      .join("")}
                </tbody>
            </table>
        </div>`;
}

function gerarRelatorioEstoque() {
  const alimentosPorCategoria = {};
  dados.alimentos.forEach((a) => {
    if (!alimentosPorCategoria[a.categoria]) {
      alimentosPorCategoria[a.categoria] = [];
    }
    alimentosPorCategoria[a.categoria].push(a);
  });

  const resultado = document.getElementById("relatorio-resultado");
  if (!resultado) return;

  resultado.innerHTML = `<div style="padding: 20px;">
                <h4>Relatório de Estoque</h4>
                <p><strong>Total de Itens:</strong> ${
                  dados.alimentos.length
                }</p>
            <div style="margin-top: 20px;">
                ${Object.keys(alimentosPorCategoria)
                  .map(
                    (categoria) => `<div style="margin-bottom: 20px;">
                        <h5 style="background: #f8f9fa; padding: 10px; border-radius: 4px;">${categoria}</h5>
                        <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Alimento</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Quantidade</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Validade</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${alimentosPorCategoria[categoria]
                                  .map(
                                    (a) => `<tr>
                                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${
                                          a.nome
                                        }</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${
                                          a.quantidade
                                        } ${a.unidade}</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${
                                          a.validade
                                            ? new Date(
                                                a.validade
                                              ).toLocaleDateString("pt-BR")
                                            : "Não informado"
                                        }</td>
                                    </tr>`
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>`
                  )
                  .join("")}
            </div>
        </div>`;
}

// ========================================
// CARREGAMENTO DE DADOS DO BANCO
// ========================================
async function atualizarListagensGerais() {
  if (!supabase) {
    console.warn("Supabase não está inicializado. Configure suas credenciais.");
    return;
  }

  try {
    // Carregar dados do Supabase em paralelo
    const [
      { data: doadores },
      { data: instituicoes },
      { data: voluntarios },
      { data: doacoes },
      { data: alimentos },
      { data: coletas },
      { data: distribuicoes },
      { data: categorias },
      { data: campanhas },
    ] = await Promise.all([
      supabase.from("doadores").select("*"),
      supabase.from("instituicoes").select("*"),
      supabase.from("voluntarios").select("*"),
      supabase.from("doacoes").select("*"),
      supabase.from("alimentos").select("*"),
      supabase.from("coletas").select("*"),
      supabase.from("distribuicoes").select("*"),
      supabase.from("categorias").select("*"),
      supabase.from("campanhas").select("*"),
    ]);

    // Atualizar objeto de dados
    dados.doadores = doadores || [];
    dados.instituicoes = instituicoes || [];
    dados.voluntarios = voluntarios || [];
    dados.doacoes = doacoes || [];
    dados.alimentos = alimentos || [];
    dados.coletas = coletas || [];
    dados.distribuicoes = distribuicoes || [];
    dados.categorias = categorias || [];
    dados.campanhas = campanhas || [];

    // Atualizar interface
    atualizarTodasListagens();
    atualizarDashboard();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    // Não mostrar alerta para não incomodar o usuário durante desenvolvimento
  }
}

// ========================================
// EXPORTAR FUNÇÕES GLOBAIS
// ========================================
window.toggleSubmenu = toggleSubmenu;
window.showSection = showSection;
window.cadastrarDoador = cadastrarDoador;
window.cadastrarInstituicao = cadastrarInstituicao;
window.cadastrarVoluntario = cadastrarVoluntario;
window.registrarDoacao = registrarDoacao;
window.cadastrarAlimento = cadastrarAlimento;
window.registrarColeta = registrarColeta;
window.registrarDistribuicao = registrarDistribuicao;
window.cadastrarCategoria = cadastrarCategoria;
window.cadastrarCampanha = cadastrarCampanha;
window.excluirDoador = excluirDoador;
window.excluirInstituicao = excluirInstituicao;
window.excluirVoluntario = excluirVoluntario;
window.excluirDoacao = excluirDoacao;
window.excluirAlimento = excluirAlimento;
window.excluirColeta = excluirColeta;
window.excluirDistribuicao = excluirDistribuicao;
window.excluirCategoria = excluirCategoria;
window.excluirCampanha = excluirCampanha;
window.gerarRelatorioGeral = gerarRelatorioGeral;
window.gerarRelatorioDoadores = gerarRelatorioDoadores;
window.gerarRelatorioInstituicoes = gerarRelatorioInstituicoes;
window.gerarRelatorioEstoque = gerarRelatorioEstoque;
