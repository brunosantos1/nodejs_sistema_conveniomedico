'use strict';
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;

//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql, base = config.neo4j_driver) {

  let driver = neo4j.default.driver(
    base.url_bolt,
    base.auth,
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

}


exports.listarProfissao = async function (req, res, next) {
  try {

    var cql = queriesCql.cql.cqlListarProfissao;
    let retorno = await executeCypherAsync(cql, config.neo4j_driver);

    retorno = await BuscarParametrizacao(retorno);

    res.send(200, retorno);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
  //next();
};

exports.listarProfissaoPorEstado = async function (req, res, next) {
  try {
    if (req.params.uf == undefined || req.params.uf == null || req.params.uf == ""){
      res.send(400, { message: "UF do Estado não informado!" });
      return;
    }

    if (req.params.cidade == undefined || req.params.cidade == null || req.params.cidade == ""){
      res.send(400, { message: "Cidade não informada!" });
      return;
    }

    var cql = queriesCql.cql.cqlListarProfissaoPorCidadeEstado;
    cql = cql.replace('@uf',req.params.uf)
    cql = cql.replace('@cidade',req.params.cidade)
    let retorno = await executeCypherAsync(cql, config.neo4j_driver);

    if (retorno == undefined || retorno == null || retorno.length == 0){
      res.send(404, { message: "Dados não encontrados!" });
    }
    else{
      retorno = await BuscarParametrizacao(retorno);

      res.send(200, retorno);
    }
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

async function BuscarParametrizacao(retorno){
  try{
    var cql = queriesCql.cql.cqlBuscarParametrizacao;
    let retornoParametrizacao = await executeCypherAsync(cql, config.neo4j_catalogo);
  
    if (!(retornoParametrizacao.Profissao == undefined || retornoParametrizacao.Profissao == null)){
      retorno[retorno.length] = { profissao: retornoParametrizacao.Profissao };
    }
  }
  catch(err){
    return retorno;
  }

  return retorno;
}
