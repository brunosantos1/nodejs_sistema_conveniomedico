const Moment = require('Moment');
const queriesCql = require("./api_cql");

module.exports = {
    existsOrError: existsOrError,
    notExistsOrError: notExistsOrError,
    validarCPF: validarCPF,
    validarEmail: validarEmail,
    validarDataNascimento: validarDataNascimento,
    validarPessoaExistente: validarPessoaExistente
}

//
// function para validar se o campo foi preenchido.
//
function existsOrError(value, msg) {
    if (!value) throw msg
    if (Array.isArray(value) && value.length === 0) throw msg
    if (typeof value === 'string' && !value.trim()) throw msg
    if (typeof value === 'object' && Object.entries(value).length === 0) throw msg
}

//
// Valida se existe ou não.
//
function notExistsOrError(value, msg) {
    try {
        existsOrError(value, msg)
    } catch (msg) {
        return
    }
    throw msg
}

//
// Validação de Data de Nascimento
//
function validarDataNascimento(data, idademin, idademax, msg) {
    const dataatual = Moment();
    const datamin = Moment(data, "YYYY-MM-DD").add(idademin, 'year');
    const datamax = Moment(data, "YYYY-MM-DD").add(idademax, 'year');
    if (dataatual.isBefore(datamin) || dataatual.isAfter(datamax))
        throw msg;
}

//
// Verificação de E-mail válido
//
function validarEmail(email, msg) {
    var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!filter.test(email))
        throw msg;
    else
        return;
}

//
// Verificação de CPF válido
//
function validarCPF(cpf, msg) {
    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11)
        throw msg;
    for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }
    if (!digitos_iguais) {
        numeros = cpf.substring(0, 9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--)
            soma += numeros.charAt(10 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            throw msg;
        numeros = cpf.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--)
            soma += numeros.charAt(11 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            throw msg;
        return;
    }
    else
        throw msg;
}

function validarPessoaExistente(pessoa, msg) {
    if (pessoa && pessoa.Ativo)
        throw msg;

    return;
}