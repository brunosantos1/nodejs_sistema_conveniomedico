'use strict';
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;

//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql, base = config.neo4j_driver) {
  try {
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
  } catch (err) {
    session.close();
    driver.close();
    console.log(err);
    throw (err);
  }
}

exports.listarEntidades = async function (req, res, next) {
  try {
    var cql = queriesCql.cql.cqlListarEntidades;
    var result = await executeCypherAsync(cql, config.neo4j_driver);

    result = await BuscarParametrizacao(result, false);

    res.send(200, result);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

exports.listarEntidadesPorProfissao = async function (req, res, next) {
  try {
    if (req.params.profissao == undefined || req.params.profissao == null || req.params.profissao == ''){
      res.send(400, { message: "Profissão deve ser informada." });
      return;
    }

    if (req.params.uf == undefined || req.params.uf == null || req.params.uf == ''){
      res.send(400, { message: "Sigla do Estado deve ser informada." });
      return;
    }

    if (req.params.cidade == undefined || req.params.cidade == null || req.params.cidade == ''){
      res.send(400, { message: "A cidade deve ser informada." });
      return;
    }

    if (req.params.profissao.toLowerCase() == 'não sei' || req.params.profissao.toLowerCase() == 'nã£o sei'){
      var result = '';

      result = await BuscarParametrizacao(result, true);
    }
    else {
      var cql = queriesCql.cql.cqListarEntidadesPorProfissao;
      
      cql = cql.replace('@Profissao', req.params.profissao);
      cql = cql.replace('@uf', req.params.uf.toUpperCase());
      cql = cql.replace('@cidade', req.params.cidade);

      var result = await executeCypherAsync(cql, config.neo4j_driver);
    }
    
    if (result && result.length == 0)
      res.send(404, { message: "Nenhum resultado encontrado" });
    else
      res.send(200, result);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

async function BuscarParametrizacao(retorno, filtrar){
  try{
    var cql = queriesCql.cql.cqlBuscarParametrizacao;
    let retornoParametrizacao = await executeCypherAsync(cql, config.neo4j_catalogo);
  
    if (filtrar){
      if (!(retornoParametrizacao.Profissao == undefined || retornoParametrizacao.Profissao == null)){
        retorno = [{ NomeFantasia: retornoParametrizacao.Entidade, RazaoSocial: retornoParametrizacao.Entidade }];
      }
    }
    else {
      if (!(retornoParametrizacao.Profissao == undefined || retornoParametrizacao.Profissao == null)){
        retorno[retorno.length] = { NomeFantasia: retornoParametrizacao.Entidade, RazaoSocial: retornoParametrizacao.Entidade };
      }
    }
  }
  catch(err){
    retorno = [];
  }

  return retorno;
}
