var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const model = require("./api_model.js");
const validar = require("./api_validation.js");

var dadosModel = model.reqModel;

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

    return result.records[0]._fields[0];
  } catch (err) {
    session.close();
    driver.close();
    console.log(err);
  }

  return retorno;
}

//
// Método privado para popular objeto.
//
async function listaRede(planos) {
  try {
    var retorno = [];

    for (let index = 0; index < planos.length; index++) {
      const plano = planos[index];
      var cqlQuery = queriesCql.cql.BuscaRedeReferenciada;
      cqlQuery = cqlQuery.replace("@IDPLANO", plano);

      var redeReferencia = await executeCypherAsync(cqlQuery)
      var redeReferenciaTop = [];

      var hosp = 0, lab = 0, mat = 0, ps = 0;
      redeReferencia.forEach(el => {


        switch (el.TipoPrestador) {
          case "Hospital":
            hosp = hosp + 1
            break;
          case "Laboratório":
            lab = lab + 1
            break;
          case "Laboratorio":
              lab = lab + 1
              break;              
          case "Maternidade":
            mat = mat + 1
            break;
          case "Pronto Socorro":
            ps = ps + 1
            break;
          default:
            break;
        }

        if (el.Top == true) {
          redeReferenciaTop.push(el)
        }
      });

      var redeReferenciaTop = (redeReferencia.length < 5) || (redeReferenciaTop.length < 1)  ? redeReferencia.slice(0, 5) : redeReferenciaTop
      retorno.push(
        {
          IdPlano: plano,
          RedeReferenciada: redeReferenciaTop,
          totalRedeReferenciada:
          {
            total: redeReferencia.length,
            lista: { "Hospital": hosp, "Laboratório": lab, "Maternidade": mat, "Pronto_Socorro": ps }
          }
        });
    }
    return retorno;
  } catch (err) {
    throw err;
  }
}

///
/// Método para retornar a Rede Resumida por lista de Planos
///
exports.listarRedePorPlanos = async function (planos) {
  try {
    const retorno = await listaRede(planos);
    return retorno;
  }
  catch (error) {
    throw error;
  }

}


exports.buscaRedeResumidaPorId = async function (req, res, next) {
  try {
    var cql = queriesCql.cql.BuscaRedeReferenciadaId(req.params);
    var retorno = await executeCypherAsync(cql);
  if (retorno)
    res.send(200, retorno);
  else
    res.send(404, { message: "Não foram encontradas redes referenciadas para o ID e tipo informado." });
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

exports.buscaRedeResumida = async function (req, res, next) {
  try {
    var requisicao = req.body
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    const retorno = await listaRede(requisicao.Planos);
    res.send(200, retorno);

  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }

};


//
//API de Busca de rede detalhada
//
exports.buscaRedeDetalhada = async function (req, res, next) {
  try {

    var dadosBody = req.body;

    preencheModel(dadosBody);

    validar.requestExistsOrError(model.reqModel);

    var autenticacao = await Autenticar();

    var result = await receberInformacao(autenticacao.data.access_token);

    res.send(200, { message: "Rede consultada com sucesso.", data: result.data })

  } catch (error) {

    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

//
// Método de envio de parâmetros para receber a lista de prestadores detalhada
//
async function receberInformacao(token) {
  try {
    return await axios({
      method: 'GET',
      baseURL: config.requestApi.Send.baseUrl,
      url: config.requestApi.Send.url,
      params: {
        codcarteirinha: dadosModel.codCarteirinha,
        endereco: dadosModel.endereco,
        latitude: dadosModel.latitude,
        longitude: dadosModel.longitude,
        categoria: dadosModel.categoria,
        especialidade: dadosModel.especialidade,
        redes: dadosModel.redes,
        subpadrao: dadosModel.subpadrao,
        listauf: dadosModel.listaUf,
        tipoprod: dadosModel.tipoProd,
        prestador: dadosModel.prestador,
        qualificacoes: dadosModel.qualificacoes
      },
      headers: {
        'Accept': config.requestApi.Send.headers.Accept,
        'client_id': config.requestApi.Send.headers.client_id,
        'access_token': token
      }
    })

  } catch (error) {
    throw error;
  }
}

//
//Function que gera o token de autenticação
//
async function Autenticar() {
  try {

    return await axios({
      method: 'POST',
      baseURL: config.requestApi.Auth.baseUrl,
      url: config.requestApi.Auth.url,
      data: {

      },
      headers: config.requestApi.Auth.headers
    });

  } catch (error) {

    throw error;
  }
}

//
// Método responsável por preencher a model com os dados vindos do Json do Front
//
function preencheModel(paramsBody) {

  dadosModel: { };

  dadosModel.codCarteirinha = paramsBody.codcarteirinha;
  dadosModel.endereco = paramsBody.endereco;
  dadosModel.latitude = paramsBody.latitude;
  dadosModel.longitude = paramsBody.longitude;
  dadosModel.categoria = paramsBody.categoria;
  dadosModel.especialidade = paramsBody.especialidade;
  dadosModel.redes = paramsBody.redes;
  dadosModel.subpadrao = paramsBody.subpadrao;
  dadosModel.listaUf = paramsBody.listaUf;
  dadosModel.tipoProd = paramsBody.tipoProd;
  dadosModel.prestador = paramsBody.prestador;
  dadosModel.qualificacoes = paramsBody.qualificacoes;

}