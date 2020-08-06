'use strict';

const axios = require('axios');
const config = require("../../api_config.js");
const queriesCql = require("./cql");
const neo4j = require("neo4j-driver").v1;
const validacao = require('../../api_validation');

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


//##################################################################################
// Função responsável por consultar Proposta Ativa relacionada ao CPF.
//##################################################################################
exports.ConsultarProposta = async function (requisicao) {
  try {
    var cqlProposta = queriesCql.cql.cqlConsultarProposta
      .replace('@NrProposta', requisicao.nrProposta)
      .replace('@CPF', requisicao.cpf)

    return await executeCypherAsync(cqlProposta);
  } catch (error) {
    throw error;
  }
};

exports.AtualizarTitular = async function (cpf, nrProposta, dadosPessoais, dadosComplementares) {
  try {
    let fields = {};
    dadosPessoais.forEach(el => {
      if (!isNaN(el.hidde) || !isNaN(el.optionalField)) return;
      if (el.type == 'select')
        fields[el.name] = el.value.code || el.value.code == 0 ? el.value.code : el.value
      else fields[el.name] = el.value
    });
    dadosComplementares.forEach(el => {
      if (!isNaN(el.hidde) || !isNaN(el.optionalField)) return;
      if (el.type == 'select')
        fields[el.name] = el.value.code || el.value.code == 0 ? el.value.code : el.value
      else fields[el.name] = el.value
    });

    fields = JSON.stringify(fields).replace(/\"([^(\")"]+)\":/g, "$1:");
    var cql = queriesCql.cql.cqlAtualizarTitular
      .replace('@CPF', cpf)
      .replace('@NrProposta', nrProposta)
      .replace('@body', fields)

    await DesvincularTitular(cpf, nrProposta)
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

exports.AtualizarEnderecoResidencial = async function (nrProposta, dadosEndereco) {
  try {
    let fields = {};
    dadosEndereco.forEach(el => {
      if (!isNaN(el.hidde) || !isNaN(el.optionalField)) return;
      if (el.type == 'select')
        fields[el.name] = el.value.code || el.value.code == 0 ? el.value.code : el.value
      else fields[el.name] = el.value
    });

    fields = JSON.stringify(fields).replace(/\"([^(\")"]+)\":/g, "$1:");
    var cql = queriesCql.cql.cqlAtualizarEnderecoResidencial
      .replace('@NrProposta', nrProposta)
      .replace('@body', fields)

    await DesvincularEndereco(nrProposta)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

async function DesvincularEndereco(nrProposta) {
  try {
    var cql = queriesCql.cql.cqlDesvincularEnderecoResidencial
      .replace('@NrProposta', nrProposta)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.AtualizarEnderecoComercial = async function (nrProposta, dadosEndereco) {
  try {
    let fields = {};

    dadosEndereco.forEach(el => {
      if (!isNaN(el.hidde) || !isNaN(el.optionalField)) return;
      if (el.type == 'select')
        fields[el.name] = el.value.code || el.value.code == 0 ? el.value.code : el.value
      else fields[el.name] = el.value
    });

    fields = JSON.stringify(fields).replace(/\"([^(\")"]+)\":/g, "$1:");
    var cql = queriesCql.cql.cqlAtualizarEnderecoComercial
      .replace('@NrProposta', nrProposta)
      .replace('@body', fields)

    await module.exports.DesvincularEnderecoComercial(nrProposta)
    if (!dadosEndereco || !dadosEndereco.length) return true;
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.DesvincularEnderecoComercial = async function (nrProposta) {
  try {
    var cql = queriesCql.cql.cqlDesvincularEnderecoComercial
      .replace('@NrProposta', nrProposta)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.AtualizarEnderecoCobranca = async function (nrProposta, endereco) {
  try {
    var data = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
    var cql = queriesCql.cql.cqlAtualizarEnderecoCobranca
      .replace('@NrProposta', nrProposta)
      .replace('@EnderecoCobranca', endereco)
      .replace('@DataAlteracao', data + ' ' + time)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.AtualizarResponsavelLegal = async function (nrProposta, dadosResponsavel) {
  try {
    let fields = {};
    dadosResponsavel.forEach(el => {
      if (!isNaN(el.hidde) || !isNaN(el.optionalField)) return;
      if (el.type == 'select')
        fields[el.name] = el.value.code || el.value.code == 0 ? el.value.code : el.value
      else fields[el.name] = el.value
    });

    fields = JSON.stringify(fields).replace(/\"([^(\")"]+)\":/g, "$1:");
    var cql = queriesCql.cql.cqlAtualizarResponsavelLegal
      .replace('@NrProposta', nrProposta)
      .replace('@body', fields)

    await module.exports.DesvincularResponsavelLegal(nrProposta)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.DesvincularResponsavelLegal = async function (nrProposta) {
  try {
    var cql = queriesCql.cql.cqlDesvincularResponsavelLegal
      .replace('@NrProposta', nrProposta)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};


exports.AtualizarOperadoraCongenere = async function (nrProposta, dadosOperadora) {
  try {
    var data = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
    var cql = queriesCql.cql.cqlAtualizarOperadoraCongenere
      .replace('@NrProposta', nrProposta)
      .replace('@PossuiPlano', dadosOperadora.value)
      .replace('@OperadoraCongenere', dadosOperadora.operadoraCongenere)
      .replace('@AceiteNaoReducaoCarencia', dadosOperadora.aceiteNaoReducaoCarencia)
      .replace('@DataAlteracao', data + ' ' + time)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.AtualizarSequencia = async function (nrProposta, sequencia) {
  try {
    var data = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
    var cql = queriesCql.cql.cqlAtualizarSequencia
      .replace('@NrProposta', nrProposta)
      .replace('@Sequencia', sequencia)
      .replace('@DataAlteracao', data + ' ' + time)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.AtualizarDependente = async function (nrProposta, dependentes) {
  try {
    var promises = [];
    promises.push(module.exports.DesvincularDependentes(nrProposta))
    dependentes.forEach(dep => {
      let fields = {};
      dep.fields.forEach(el => {
        if (!isNaN(el.hidde) || !isNaN(el.optionalField)) return;
        if (el.type == 'select')
          fields[el.name] = el.value.code || el.value.code == 0 ? el.value.code : el.value
        else fields[el.name] = el.value

        if (el.name == 'possuiPlano') {
          fields['operadoraCongenere'] = el.operadoraCongenere;
          fields['aceiteNaoReducaoCarencia'] = el.aceiteNaoReducaoCarencia;
        }
      });
      fields['id'] = dep.id;
      fields = JSON.stringify(fields).replace(/\"([^(\")"]+)\":/g, "$1:");
      var cql = queriesCql.cql.cqlAtualizarDependente
        .replace('@NrProposta', nrProposta)
        .replace('@body', fields)

      promises.push(executeCypherAsync(cql))
    });
    return await Promise.all(promises);
  } catch (error) {
    throw error;
  }
};

exports.DesvincularDependentes = async function (nrProposta) {
  try {
    var cql = queriesCql.cql.cqlDesvincularDependente
      .replace('@NrProposta', nrProposta)
    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};