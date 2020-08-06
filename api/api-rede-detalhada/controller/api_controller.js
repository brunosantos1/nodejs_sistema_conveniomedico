var axios = require("axios");
const config = require("./api_config.js");
const model = require("./api_model.js");
const validar = require("./api_validation.js");


var dadosModel = model.reqModel;

//
//API de Busca
//
exports.buscaRedeDetalhada = async function (req, res, next) {
  try {

    var dadosBody = req.body;

    preencheModel(dadosBody);

    validar.requestExistsOrError(model.reqModel);

    var autenticacao = await Autenticar();

    var result = await receberInformacao(autenticacao.data.access_token);
    
    res.send(200, { message: "Rede consultada com sucesso." , data: result.data})

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