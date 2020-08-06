var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;

//
// Método privado genérico para execução de cypher query.
//
// async function executeCypherAsync(cql) {
//     let driver = neo4j.default.driver(
//       config.neo4j_driver.url_bold,
//       config.neo4j_driver.auth,
//       { disableLosslessIntegers: true }
//     );
//     let session = driver.session();
//     var result = await session.run(cql, null);

//     session.close();
//     driver.close();
// 	if (result && result.records && result.records.length > 0 && result.records[0]._fields && result.records[0]._fields.length > 0)
// 		return result.records[0]._fields[0];
// 	else
// 		return {}
// }

exports.gerarProtocolo = async function(req, res, next) {
  try {

    var requisicao = req.body
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    console.log("ID DA PROPOSTA", requisicao.evento.dados.idproposta); 
    //TODO: Realizar a execução da geração de Protocolo
    
    await callBackCoreFinalizar(requisicao);

    res.send("Protocolo gerado para proposta ", requisicao.evento.dados.idproposta);
  } catch (err) {
    next(err);
  }
};

async function callBackCoreFinalizar(body) {
  await axios({
    method: 'PUT',
    baseURL: `${config.core.http_server}${config.core.resource_uri}`,
    url: `${config.core.http_server}${config.core.resource_uri}`,
    data: body,
    headers: {
      'Accept': 'application/json; charset=UTF-8',
      'Content-Type': 'application/json; charset=UTF-8',
    }
  })
}
