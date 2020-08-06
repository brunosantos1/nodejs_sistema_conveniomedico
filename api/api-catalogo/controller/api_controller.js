var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const validation = require("./api_validation");

//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql) {
  try {
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
      return null;

  } catch (err) {
    session.close();
    driver.close();
    console.log(err);
    throw (err);
  }
}

exports.listarEntidades = async function(req, res, next) {
  try {
    var result = [{ entidade: 'CAASP'},{ entidade: 'UBE'},{ entidade: 'UBES'}];

    if (result && result.length == 0)
      res.send(404, { message: "Nenhuma Entidade encontrada." });
    else
      res.send(200, result);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

exports.listarOperadoras = async function(req, res, next) {
  try {

    var params = req.query;

    for (const propriedade in params) {
      validation.existsOrError(propriedade,`O parâmetro ${propriedade} informado não é valido`);
    }

    if(!(params.entidade && params.dtNascimento && params.profissao)){
      throw "Fornecer os seguintes parametros: entidade, dtNascimento, profissao";
    }

    validation.validarDataNascimento(params.dtNascimento, 2, 65,`A idade informada não atende aos requisitos, pois deve ser entre 2 à 65 anos.`);
    
    let result = '';

    if (params.entidade == "UBE" && params.profissao == "Estudante") {
      result = [{ operadora: 'AMIL SAÚDE SA' }, { operadora: 'SulAmérica Saúde' }];
    } else {
      result = [{operadora:''}];
    }

    if (result == undefined || result == null && result.length == 0)
      res.send(404, { message: "Nenhuma Operadora encontrada." });
    else
      res.send(200, result);

  } catch (err) {
    console.log(err);
    var msg = err.message || err;
    res.send(400, { message: msg });

  }
}
