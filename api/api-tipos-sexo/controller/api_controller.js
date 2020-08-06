const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;

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

    return result.records;
  } catch (err) {
    session.close();
    driver.close();
    console.log(err);
  }

  return retorno;
}

//
//API que retorna os tipos de sexo
//
exports.retornaSexo = async function (req, res, next) {
  try {

    var result = await obterSexo();

    if(result){
      res.send(200, {message: "Sexo consultado com sucesso.", data: result});
    }

  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

//
//Método Assíncrono que realiza a buscar dos tipos de sexo no Neo4j.
//
async function obterSexo() {
  try {

    var query = queriesCql.cql.cqlConsultaSexo;

    var result = await executeCypherAsync(query);

    return result[0]._fields[0];

  } catch (error) {

    throw error;
  
  }
}

