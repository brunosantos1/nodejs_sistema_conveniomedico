const config = require("./api_config");
const {db} = config;
const queriesCql = require("./api_cql");

exports.buscaOperadoraCongenere = async function (req, res, next) {
  try {

    var resposta = [
      { descricao: "Nenhuma dessas", id: -1 },
      { descricao: "Amil Saúde", id: 29309127012266 },
      { descricao: "Mapfre Saúde", id: 15300953000142 },
      { descricao: "AMIL-CMP", id: 29309127013238 },
      { descricao: "SulAmérica Saúde", id: 1685053000156 },
      { descricao: "Notre Dame (linha Intermédica)", id: 44649812000138 },
      { descricao: "SulAmérica Vida", id: 1704513001037 },
      { descricao: "Unimed Paulistana", id: 43202472000130 },
      { descricao: "Seguros Unimed", id: 4487255000181 }
    ]

    res.send(200, resposta);
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
  next();
};

