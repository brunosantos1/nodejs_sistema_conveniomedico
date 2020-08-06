const config = require("./api_config");
const {db} = config;
const queriesCql = require("./api_cql");

exports.buscaEstadoCivil = async function (req, res, next) {
  try {

    var resposta = await db.execute(queriesCql.cql.buscaEstadoCivil)
  
    res.send(200, resposta[0].DadosEstadoCivil);
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
  next();
};

