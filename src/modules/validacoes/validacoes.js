// =====================
// VALIDAÇÕES
// =====================
export function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += cpf[i] * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto != cpf[9]) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += cpf[i] * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  return resto == cpf[10];
}

export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarTelefone(telefone) {
  const regex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  return regex.test(telefone);
}

export function validarCampoVazio(valor, minimo = 1) {
  return valor.trim().length >= minimo;
}
