'use strict';
//var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const validacao = require('./api_validation');
const aws = require("./aws");
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

//#region "Métodos de BALDE"

exports.CriarBalde = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    await DesvincularProposta(requisicao);
    await CriarBaldeProposta(requisicao);
    await VincularProposta(requisicao);

    res.send(200);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

async function DesvincularProposta(requisicao) {
  try {
    var cql = queriesCql.cql.cqlDesvincularProposta.split('@NrProposta').join(requisicao.nrProposta)

    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};


async function VincularProposta(requisicao) {
  try {
    var cql = queriesCql.cql.cqlVincularProposta.split('@NrProposta').join(requisicao.nrProposta)

    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};


//#endregion

//#region "Métodos de DOCUMENTO"
exports.MergeDocumento = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    if (!requisicao.url) {
      var msg = "Url do documento não informada.";
      res.send(400, { message: msg });
    }


    let doc = await module.exports.Merge(requisicao);
    validacao.existsOrError(doc, "Erro ao carregar url da imagem");
    validacao.existsOrError(doc.url, "Erro ao carregar url da imagem");
    req.body.path = doc.url;
    next();
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

exports.MergeUploadDocumento = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    if (!requisicao.url) {
      var msg = "Url do documento não informada.";
      res.send(400, { message: msg });
    }


    let doc = await module.exports.Merge(requisicao);
    validacao.existsOrError(doc, "Erro ao carregar url da imagem");
    validacao.existsOrError(doc.url, "Erro ao carregar url da imagem");
    res.send(200, doc.url)
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

exports.Merge = async function (requisicao) {
  try {
    await DesvincularProposta(requisicao);
    let baldeProposta = await CriarBaldeProposta(requisicao);
    validacao.existsOrError(baldeProposta, "Erro ao carregar bucket");
    validacao.existsOrError(baldeProposta.nrProposta, "Erro ao carregar bucket");
    let documentoProposta = await VincularProposta(requisicao);
    validacao.existsOrError(documentoProposta, "Erro ao vincular documento com proposta");

    let cpf = requisicao.cpf ? requisicao.cpf : '';

    var cql = queriesCql.cql.cqlCriarDocumento
      .split('@NrProposta').join(requisicao.nrProposta)
      .split('@TipoDocumento').join(requisicao.tipoDocumento)
      .split('@Url').join(requisicao.url)
      .split('@Identificador').join(requisicao.identificador)
      .split('@CPF').join(requisicao.cpf);

    await DesvincularDocumento(requisicao);
    return await executeCypherAsync(cql);
  } catch (err) {
    throw err
  }
}

exports.ExcluirDocumento = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    await DesvincularDocumento(requisicao);

    res.send(200);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

async function ConsultarBaldeProposta(requisicao) {
  try {
    var cql = queriesCql.cql.cqlConsultarBaldeProposta
      .replace('@NrProposta', requisicao.nrProposta)

    return await executeCypherAsync(cql);
  } catch (err) {
    throw error;
  }
}

async function CriarBaldeProposta(requisicao) {
  try {
    var cql = queriesCql.cql.cqlCriarBalde
      .replace('@NrProposta', requisicao.nrProposta)

    return await executeCypherAsync(cql);
  } catch (err) {
    throw error;
  }
}

async function DesvincularDocumento(requisicao) {
  try {
    var cql = queriesCql.cql.cqlDesvincularDocumento
      .replace('@NrProposta', requisicao.nrProposta)
      .replace('@TipoDocumento', requisicao.tipoDocumento)
      .replace('@Identificador', requisicao.identificador)

    return await executeCypherAsync(cql);
  } catch (error) {
    throw error;
  }
};

exports.ConsultarDocumentosProposta = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    var query = queriesCql.cql.cqlbBuscarDocumentos;
    query = query.replace('@NrProposta', requisicao.nrProposta)
    let docs = await executeCypherAsync(query);
    res.send(200, docs);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

exports.ConsultarDocumentosPessoa = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    var query = queriesCql.cql.cqlbBuscarDocumentosPropostas;
    query = query.replace('@CPF', requisicao.cpf)
    let docs = await executeCypherAsync(query);
    res.send(200, docs);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}
//#endregion

//#######################################################
// Middleware que garente a criação do Número da Proposta 
//#######################################################
exports.ValidarMergeDocumento = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)
    validacao.existsOrError(requisicao.tipoDocumento, "O Tipo do Documento deve ser informado.");
    validacao.existsOrError(requisicao.nrProposta, "O Número da proposta deve ser informado.");
    validacao.existsOrError(requisicao.identificador, "O Identificador do arquivo deve ser informado.");
    validacao.existsOrError(requisicao.arquivoStream, "O Arquivo deve ser informado.");

    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}



