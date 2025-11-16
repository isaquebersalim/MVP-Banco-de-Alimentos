// Cadastro de Doadores
function cadastrarDoador(e) {
  e.preventDefault();
  const form = e.target;

  const nome = form.nome.value.trim();
  const cpf = form.cpf.value.trim();
  const email = form.email.value.trim();
  const telefone = form.telefone.value.trim();
  const endereco = form.endereco.value.trim();

  // ============================
  // 🔍 1. Valida campos obrigatórios
  // ============================
  if (!nome || !cpf || !email || !telefone || !endereco) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // ============================
  // 🔍 2. Validação de CPF
  // ============================
  if (!validarCPF(cpf)) {
    alert("CPF inválido!");
    return;
  }

  // ============================
  // 🔍 3. Verificar CPF duplicado
  // ============================
  const cpfJaExiste = dados.doadores.some((d) => d.cpf === cpf);
  if (cpfJaExiste) {
    alert("Já existe um doador cadastrado com esse CPF!");
    return;
  }

  // ============================
  // 🔍 4. Validação de e-mail
  // ============================
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("E-mail inválido!");
    return;
  }

  // ============================
  // 🔍 5. Validação de telefone
  // Formato básico: (99) 99999-9999 ou 99999999999
  // ============================
  const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  if (!telefoneRegex.test(telefone)) {
    alert("Telefone inválido! Use o formato (XX) XXXXX-XXXX");
    return;
  }

  // ============================
  // ✅ Tudo válido → cadastrar
  // ============================
  const doador = {
    id: Date.now(),
    nome,
    cpf,
    email,
    telefone,
    endereco,
  };

  dados.doadores.push(doador);
  salvarDados();
  form.reset();
  atualizarListaDoadores();
  atualizarDashboard();
  atualizarSelects();
  alert("Doador cadastrado com sucesso!");
}
// Validação do CPF

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

// Cadastro de Instituicao
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
  alert("[translate:Instituição cadastrada com sucesso!]");
}

// Cadastro de Voluntario
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
  alert("[translate:Voluntário cadastrado com sucesso!]");
}
