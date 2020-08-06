const config = require("./api_config");
const {db} = config;
const queriesCql = require("./api_cql");

exports.gerarToken = async function (req, res, next) {
  try {
    var tipo = '';
    var tokenValido =  false;
    var token;
    if(req.query.tipo){
      tipo = req.query.tipo;
    }

    while (tokenValido == false) {
      token = await criaToken();
      if(await existeToken(token)){
        tokenValido =  true;
      }
    }

    res.send(200, await salvarToken(token, tipo, req.query.proposta));
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
  next();
};

exports.validaToken = async function (req, res, next) {
  try {
    var validado = await validaToken(req.body.token, req.body.proposta, req.body.ip, req.body.localizacao);

    if(validado){
      res.send(200, { message: true});
    } else {
      res.send(200, { message: false });
    }
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
  next();
};


async function criaToken() {
    try {
      var c1, c2, c3, c4
      c1 = Math.random().toString(36).substr(2, 1);
      c2 = Math.floor(Math.random() * 10);
      c3 = Math.random().toString(36).substr(2, 1);
      c4 = Math.random().toString(36).substr(2, 1);
    
      var token =  c1 + c2 + c3 + c4;

      return token.toUpperCase();

    } catch (error) {
      throw error
    }  
}

async function salvarToken(token, tipo, proposta){
  try {
    cqlQuery = queriesCql.cql.existeTokenProposta;
    cqlQuery = cqlQuery.replace("@TIPO", tipo);
    cqlQuery = cqlQuery.replace("@PROPOSTA", proposta);
    await db.execute(cqlQuery);

    cqlQuery = queriesCql.cql.salvarToken;
    cqlQuery = cqlQuery.replace("@TOKEN", token);
    cqlQuery = cqlQuery.replace("@PARAM", config.config.validadeToken);
    cqlQuery = cqlQuery.replace("@TIPO", tipo);
    cqlQuery = cqlQuery.replace("@PROPOSTA", proposta);
    var retorno = await db.execute(cqlQuery);

    if(retorno[0].DadosToken[0]){
      return {message: 'Token Criado com Sucesso!'};
    }
  } catch (error) {
    throw error
  }
}

async function existeToken(token){
  try {
    cqlQuery = queriesCql.cql.existeToken;
    cqlQuery = cqlQuery.replace("@TOKEN", token);
    var retorno = await db.execute(cqlQuery);

    if(retorno.length == 0){
      return true;
    }
    return false;
  } catch (error) {
    throw error
  }
}

async function validaToken(token, proposta, ip, localizacao) {
  try {
    cqlQuery = queriesCql.cql.validaToken;
    cqlQuery = cqlQuery.replace("@TOKEN", token);
    cqlQuery = cqlQuery.replace("@IP", ip);
    cqlQuery = cqlQuery.replace("@Localizacao", localizacao);
    cqlQuery = cqlQuery.replace("@Proposta", proposta);
    var retorno = await db.execute(cqlQuery);

    if(retorno.length){
      return true;
    }
    return false;
  } catch (error) {
    throw error
}
}
