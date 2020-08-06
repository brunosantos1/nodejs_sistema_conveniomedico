'use strict';

const config = require("../../api_config.js");
const queriesCql = require("./cql");
const neo4j = require("neo4j-driver").v1;
const validacao = require('../../api_validation');
const axios = require('axios');

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


exports.CriarTitular = async function (requisicao) {
  try {

    await DesvincularTitular(requisicao.titular.cpf, requisicao.contratacao.nrProposta)

    var cql = queriesCql.cql.cqlCriarTitular
      .split('@NrProposta').join(requisicao.contratacao.nrProposta)
      .split('@cpf').join(requisicao.titular.cpf)
      .replace('@nome', requisicao.titular.nome)
      .replace('@email', requisicao.titular.email)
      .replace('@nascimento', requisicao.titular.nascimento.split("/")
        .reverse()
        .join("-"))
      .replace('@telefone', requisicao.titular.telefone)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};


async function DesvincularTitular(cpf, nrProposta) {
  try {
    var cql = queriesCql.cql.cqlDesvincularTitular
      .replace('@CPF', cpf)
      .replace('@NrProposta', nrProposta)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.CriarEndereco = async function (requisicao) {
  try {

    await DesvincularEndereco(requisicao.endereco.cep, requisicao.contratacao.nrProposta)

    var cql = queriesCql.cql.cqlCriarEndereco
      .split('@NrProposta').join(requisicao.contratacao.nrProposta)
      .split('@cep').join(requisicao.endereco.cep)
      .replace('@estado', requisicao.endereco.estado)
      .replace('@cidade', requisicao.endereco.cidade)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

async function DesvincularEndereco(cep, nrProposta) {
  try {
    var cql = queriesCql.cql.cqlDesvincularEndereco
      .replace('@cep', cep)
      .replace('@nrProposta', nrProposta)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.CriarProfissao = async function (requisicao) {
  try {

    await DesvincularProfissao(requisicao.profissao, requisicao.entidade, requisicao.contratacao.nrProposta)

    var cql = queriesCql.cql.cqlCriarProfissao
      .split('@NrProposta').join(requisicao.contratacao.nrProposta)
      .replace('@profissao', requisicao.profissao)
      .replace('@entidade', requisicao.entidade)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

async function DesvincularProfissao(profissao, entidade, nrProposta) {
  try {
    var cql = queriesCql.cql.cqlDesvincularProfissao
      .replace('@profissao', profissao)
      .replace('@entidade', entidade)
      .replace('@nrProposta', nrProposta)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.CriarDependentes = async function (requisicao) {
  try {
    await DesvincularDependentes(requisicao.dependentes, requisicao.contratacao.nrProposta)

    var cql = "";
    requisicao.dependentes.forEach(async function (data) {
      cql = queriesCql.cql.cqlCriarDependente;
      let nascimento = data.value.split("/")
        .reverse()
        .join("-");
      cql = cql.replace('@Nascimento', nascimento)
        .replace('@Id', data.id)
        .replace('@NrProposta', requisicao.contratacao.nrProposta);
      await executeCypherAsync(cql);
    });
  } catch (error) {
    throw error;
  }
};

async function DesvincularDependentes(dependentes, nrProposta) {
  try {
    var cql = "";
    dependentes.forEach(async function (data) {
      cql = queriesCql.cql.cqlDesvincularDependente;
      cql = cql.replace('@Id', data.id)
        .replace('@NrProposta', nrProposta);
      await executeCypherAsync(cql);
    });
  } catch (error) {
    throw error;
  }
};

//#######################################################
// Middleware que garente a criação do Número da Proposta 
//#######################################################
exports.validarCriacaoProposta = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    validacao.existsOrError(requisicao.contratacao, "Os dados da contratação devem ser informados.");
    validacao.existsOrError(requisicao.contratacao.fluxoId, "O FluxoId deve ser informado.");
    validacao.existsOrError(requisicao.contratacao.planoId, "O PlanoId deve ser informado.");
    validacao.existsOrError(requisicao.contratacao.planoIdSinf, "O PlanoIdSinf deve ser informado.");

    validacao.existsOrError(requisicao.titular, "Os dados do titular devem ser informados.");
    validacao.existsOrError(requisicao.titular.cpf_raiz, "O CPF utilizado na simulação deve ser informado.");
    validacao.existsOrError(requisicao.titular.cpf, "O CPF deve ser informado.");
    validacao.existsOrError(requisicao.titular.nome, "O PlanoIdSinf deve ser informado.");
    validacao.existsOrError(requisicao.titular.email, "O PlanoIdSinf deve ser informado.");
    validacao.existsOrError(requisicao.titular.nascimento, "O PlanoIdSinf deve ser informado.");

    validacao.existsOrError(requisicao.endereco, "Os dados de endereco devem ser informados.");
    validacao.existsOrError(requisicao.endereco.cep, "O CPF deve ser informado.");
    validacao.existsOrError(requisicao.endereco.estado, "O CPF deve ser informado.");
    validacao.existsOrError(requisicao.endereco.cidade, "O CPF deve ser informado.");

    validacao.existsOrError(requisicao.profissao, "A profissãoo deve ser informada.");
    validacao.existsOrError(requisicao.entidade, "A entidade deve ser informada.");

    let simulacao = await ConsultarSimulacao(requisicao.titular.cpf_raiz);
    validacao.existsOrError(simulacao, "Nenhuma simulação encontrada para este CPF.");

    /* 
    //Futuramente será alterada a api de gerar numero de proposta para receber a operadora como parametro.
    var query = queriesCql.cql.cqlConsultarOperadora; // consultar na base estatica (Qualitech)
    query = query.replace('@pbsId', requisicao.contratacao.planoId);
    query = query.replace('@pbsId', requisicao.contratacao.planoId);
    query = query.replace('@pbsId', requisicao.contratacao.planoId);
    query = query.replace('@pbsId', requisicao.contratacao.planoId);
    var operadora = await executeCypherAsync_estatica(query);
    */

    const nrProposta = await GerarNumeroProposta();

    validacao.existsOrError(nrProposta, "O Número da Proposta deve ser informado.");

    requisicao.contratacao.nrProposta = nrProposta;
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

//##################################################################################
// Função responsável verificar se existe simulação para o CPF.
//##################################################################################
async function ConsultarSimulacao(cpf) {
  try {
    var cql = queriesCql.cql.cqlConsultarSimulacao
      .replace('@CPF', cpf)

    const simulacao = await executeCypherAsync(cql);
    return simulacao;
  } catch (error) {
    throw error;
  }
};

//##################################################################################
// Função responsável por gerar/buscar o número da proposta.
// Se já exitir uma proposta no NEO4J com o mesmo número, mandar gerar/buscar outro.
//##################################################################################
async function GerarNumeroProposta() {
  try {
    var nrProposta;
    var retorno;
    
    try{
      retorno  =  await axios({
        method: 'post',
        url: config.range_proposta_url,
        data: {
          quantidade: '1',
          tipo: "Qualicorp",//futuramente trocar pela operadora
          contrato: config.range_proposta_contrato,
          observacao: config.range_proposta_observacao,
          usuario: config.range_proposta_usuario
        }
      });
      nrProposta = retorno.data[0].NumeroInicio;
    }
    catch(err)
    {
      nrProposta = '_' + Math.random().toString(36).substr(2, 9);
    }

    var cql = queriesCql.cql.cqlConsultarProposta
      .replace('@NrProposta', nrProposta)

    const proposta = await executeCypherAsync(cql);
    if (!proposta)
      return nrProposta;
    else
      return await GerarNumeroProposta();
  } catch (error) {
    throw error;
  }
};

//##################################################################################
// Função responsável por Vincular a proposta gerada a simulação referente ao CPF
//##################################################################################
exports.VincularSimulacao = async function (requisicao) {
  try {
    var cql = queriesCql.cql.cqlVincularSimulacao
      .replace('@CPF', requisicao.titular.cpf_raiz)
      .replace('@NrProposta', requisicao.contratacao.nrProposta)

    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};