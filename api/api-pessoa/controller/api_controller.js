'use strict';
//var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const validacao = require('./api_validation');

//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql) {
  let driver = neo4j.default.driver(
    config.neo4j_driver.url_bold,
    config.neo4j_driver.auth,
    { disableLosslessIntegers: true }
  );
  let session = driver.session();
  var result = await session.run(cql, null);

  session.close();
  driver.close();
  if (result && result.records && result.records.length > 0 && result.records[0]._fields && result.records[0]._fields.length > 0)
    return result.records[0]._fields[0];
  else
    return null
}

//#region "Métodos de Pessoa"

exports.inserir = async function (dados){
  try {
    var cql = queriesCql.cql.cqlIncluirPessoa
    .replace('@Nome', dados.NomeCompleto)
    .replace('@CPF', dados.CPF)
    .replace('@Email', dados.Email)
    .replace('@Telefone', dados.Telefone)
    .replace('@DataNascimento', dados.DataNascimento);
  await executeCypherAsync(cql);
    
  } catch (error) {
    throw error
  }
}

exports.incluirPessoa = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

      await inserir(requisicao);

    res.send(201, { message: 'Pessoa incluída com sucesso.' });
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

exports.alterarPessoa = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    var cql = queriesCql.cql.cqlAlterarPessoa
      .replace('@CPF', requisicao.CPF)
      .replace('@Nome', requisicao.Nome)
      .replace('@Email', requisicao.Email)
      .replace('@Telefone', requisicao.Telefone)
      .replace('@DataNascimento', requisicao.DataNascimento);

    var retorno = await executeCypherAsync(cql);
    if (retorno)
      res.send(204);
    else
      res.send(404, { message: 'CPF informado não foi localizado.' });
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

exports.excluirPessoa = async function (req, res, next)     {
  try {
    var cpf = req.params.CPF;
    validacao.existsOrError(cpf, "O CPF da pessoa deve ser informado.");
    validacao.validarCPF(cpf, 'CPF inválido.');

    var cql = queriesCql.cql.cqlInativarPessoa
      .replace('@CPF', cpf)

    var retorno = await executeCypherAsync(cql);
    if (retorno)
      res.send(200, { message: 'Pessoa desativada com sucesso.' });
    else
      res.send(404, { message: 'CPF informado não foi localizado.' });
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

exports.consultarPessoa = async function (req, res, next) {
  try {
    var cpf = req.params.CPF;
    validacao.existsOrError(cpf, "O CPF da pessoa deve ser informado.");
    validacao.validarCPF(cpf, 'CPF inválido.');

    var cql = queriesCql.cql.cqlConsultarPessoa
      .replace('@CPF', cpf)
    var retorno = await executeCypherAsync(cql);
    if (retorno)
      res.send(200, retorno);
    else
      res.send(404, { message: "CPF informado não foi localizado." });
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

exports.validarPessoa = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)
    validacao.existsOrError(requisicao.nome, "O nome da pessoa deve ser informado.");
    validacao.existsOrError(requisicao.cpf, "O CPF da pessoa deve ser informado.");
    validacao.existsOrError(requisicao.email, "O E-mail da pessoa deve ser informado.");
    validacao.existsOrError(requisicao.datanascimento, "A data de Nascimento da pessoa deve ser informado.");
    validacao.validarCPF(requisicao.cpf, 'CPF inválido.');
    validacao.validarEmail(requisicao.email, 'E-mail inválido.');
    validacao.validarDataNascimento(requisicao.datanascimento, 0, 100, 'Data de nascimento inválida');
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

exports.validarPessoaExistente = async function (req, res, next) {
  try {
    const requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    const cql = queriesCql.cql.cqlConsultarPessoa
      .replace('@CPF', requisicao.CPF)
    const pessoa = await executeCypherAsync(cql);
    validacao.validarPessoaExistente(pessoa, "CPF já cadastrado.")
    next();
  }
  catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

//#endregion


//#region "Métodos de Dependentes"

exports.validarDependente = async function (req, res, next) {
  try {
    var requisicao = req.body;
    validacao.existsOrError(requisicao.id_simulacao, "O ID da Simulação deve ser informado.");
    validacao.existsOrError(requisicao.datanascimento, " A(s) data(s) de nascimento deve(m) ser informada(s).");
    requisicao.datanascimento.forEach(function (data, index) {
      validacao.validarDataNascimento(data, 0, 101, "Data de Nascimento do dependente " + (index + 1) + " é inválida.");
    });
    next();
  }
  catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

//
// Método para inclusão de depententes
//
exports.incluirDependente = async function (id_simulacao, datas_nascimento) {
  try {
    var cql = queriesCql.cql.cqlIncluirDependente;
    datas_nascimento.forEach(async function (data) {
      cql = cql.replace('@DataNascimento', data.value)
        .replace('@IdSimulacao', id_simulacao);
      await executeCypherAsync(cql);
    });
  } catch (error) {
    throw error
  }
}

exports.incluirDependenteAPI = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')

      requisicao = JSON.parse(requisicao);
    await module.exports.incluirDependente(requisicao.id_simulacao, requisicao.datanascimento)
    res.send(201, { message: 'Dependente(s) incluído(s) com sucesso.' });
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}
//#endregion