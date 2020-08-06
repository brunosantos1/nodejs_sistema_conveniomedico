'user strict'
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

exports.validarGrauParentesco = async function (req, res, next) {
  try {
    const requisicao = req.params;
    validacao.existsOrError(requisicao.idplano_sinf, "É necessário informar o ID do Plano SINF.");
    next();
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

exports.listarGrauParentesco = async function (req, res, next) {
  try {
    const requisicao = req.params;
    var cql = queriesCql.cql.cqlListarGrauParentesco;
    cql = cql.replace('@IdPlano', requisicao.idplano_sinf);


    let retorno = await executeCypherAsync(cql);
    if (retorno.length == 0) {
      res.send(404, { message: "Não existe grau de parentesco para a requisição realizada." });
    }
    else {
      res.send(200, retorno);
    }

  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

exports.listarGrauParentescoDependente = async function (req, res, next) {
  try {
    const requisicao = req.params;
    var cql = queriesCql.cql.cqlListarGrauParentescoDependente;
    cql = cql.replace('@IdPlano', requisicao.idplano_sinf);


    let retorno = await executeCypherAsync(cql);
    if (retorno.length == 0) {
      res.send(404, { message: "Não existe grau de parentesco para a requisição realizada." });
    }
    else {
      res.send(200, retorno);
    }

  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

exports.listarGrauParentescoRepresentante = async function (req, res, next) {
  try {
    const requisicao = req.params;
    var cql = queriesCql.cql.cqlListarGrauParentescoRepresentante;
    cql = cql.replace('@IdPlano', requisicao.idplano_sinf);


    let retorno = await executeCypherAsync(cql);
    if (retorno.length == 0) {
      res.send(404, { message: "Não existe grau de parentesco para a requisição realizada." });
    }
    else {
      res.send(200, retorno);
    }

  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};