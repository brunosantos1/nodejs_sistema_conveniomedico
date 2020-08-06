const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const validacao = require("./api_validation.js");

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
  }

  return retorno;
}

exports.ConsultarEstados = async function (req, res, next) {
  try {
    var retorno = {
      "Estados": [{ "Estado": "Acre", "Sigla": "AC" },
      { "Estado": "Alagoas", "Sigla": "AL" },
      { "Estado": "Amapá", "Sigla": "AP" },
      { "Estado": "Amazonas", "Sigla": "AM" },
      { "Estado": "Bahia", "Sigla": "BA" },
      { "Estado": "Ceará", "Sigla": "CE" },
      { "Estado": "Distrito Federal", "Sigla": "DF" },
      { "Estado": "Espírito Santo", "Sigla": "ES" },
      { "Estado": "Goiás", "Sigla": "GO" },
      { "Estado": "Maranhão", "Sigla": "MA" },
      { "Estado": "Mato Grosso", "Sigla": "MT" },
      { "Estado": "Mato Grosso do Sul", "Sigla": "MS" },
      { "Estado": "Minas Gerais", "Sigla": "MG" },
      { "Estado": "Pará", "Sigla": "PA" },
      { "Estado": "Paraíba", "Sigla": "PB" },
      { "Estado": "Paraná", "Sigla": "PR" },
      { "Estado": "Pernambuco", "Sigla": "PE" },
      { "Estado": "Piauí", "Sigla": "PI" },
      { "Estado": "Rio de Janeiro", "Sigla": "RJ" },
      { "Estado": "Rio Grande do Norte", "Sigla": "RN" },
      { "Estado": "Rio Grande do Sul", "Sigla": "RS" },
      { "Estado": "Rondônia", "Sigla": "RO" },
      { "Estado": "Roraima", "Sigla": "RR" },
      { "Estado": "Santa Catarina", "Sigla": "SC" },
      { "Estado": "São Paulo", "Sigla": "SP" },
      { "Estado": "Sergipe", "Sigla": "SE" },
      {
        "Estado": "Tocantins", "Sigla": "TO"
      }]
    }

    res.send(200, retorno);
  } catch (err) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }

  next();
};

exports.ConsultarCidadesPorEstado = async function (req, res, next) {
  try {
    var pEstado = req.params.uf;

    if (pEstado == undefined || pEstado == null || pEstado == '')
    {
      res.send(400, { message: "Parâmetro UF não pode ser vazio!" });
      return;
    }

    var cQuery = queriesCql.cql.cqlConsultaCidadesPorEstado;
    cQuery = cQuery.replace('@Estado', pEstado);

    var cidades = await executeCypherAsync(cQuery);

    if (cidades == undefined || cidades == null || cidades.Cidades.length == 0){
      res.send(404, { message: "Dados não encontrados!" });
    }
    else
      res.send(200, cidades);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }

  next();
};




exports.ConsultarEndereco = async function (req, res, next) {
  try {
    var pCEP = req.params.cep;

    if (pCEP == undefined || pCEP == null || pCEP == "") {
      res.send(400, { message: "Informe um CEP para a pesquisa!" });
      return;
    }

    var enderecos = await module.exports.consultarEnderecoPorCEP(pCEP);
    
    if (enderecos == undefined || enderecos == null)
      res.send(404, { message: "O CEP informado não foi encontrado." });
    else
      res.send(200, enderecos);

  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

///
/// Função utiliazada pela API de planos
///
exports.consultarEnderecoPorCEP = async function(cep)
{
  try {

    var cQuery = queriesCql.cql.oracleConsultarEndereco;
    cQuery = cQuery.replace('@CEP', cep.replace("-", ""));
    var enderecos = await executeCypherAsync(cQuery);
    return enderecos;
    
  } catch(error)
  {
    throw error
  }

}



exports.GravarEndereco = async function (req, res, next) {
  try {
    var pCEP = req.body.CEP;
    var pTipoEndereco = req.body.TipoEndereco;
    var pEndereco = req.body.Endereco;
    var pEnderecoAbreviado = req.body.EnderecoAbreviado;
    var pNumero = req.body.Numero;
    var pComplemento = req.body.Complemento;
    var pBairro = req.body.Bairro;
    var pBairroAbrev = req.body.BairroAbrev;
    var pCidade = req.body.Cidade;
    var pEstado = req.body.Estado;
    var pCPF = req.body.CPF;

    pCEP = pCEP.replace("-", "");

    var cQueryRetorno = queriesCql.cql.cqlConsultarEndereco;
    cQueryRetorno = cQueryRetorno.replace('@CEP', pCEP);
    var responseCode = 0;

    var retorno = await executeCypherAsync(cQueryRetorno);

    if (retorno.Enderecos.length < 1) {
      var cQuery = queriesCql.cql.cqlInserirEndereco;
      cQuery = cQuery.replace('@CEP', pCEP);
      cQuery = cQuery.replace('@TIPOENDERECO', pTipoEndereco);
      cQuery = cQuery.replace('@ENDERECO', pEndereco);
      cQuery = cQuery.replace('@ENDERECO_ABREV', pEnderecoAbreviado);
      cQuery = cQuery.replace('@NUMERO', pNumero);
      cQuery = cQuery.replace('@COMPLEMENTO', pComplemento);
      cQuery = cQuery.replace('@BAIRRO', pBairro);
      cQuery = cQuery.replace('@BAIRRO_ABREV', pBairroAbrev);

      var enderecos = await executeCypherAsync(cQuery);

      if (enderecos != undefined && enderecos != null) {
        await VincularEnderecoCidade(pCEP, pCidade, pEstado);
        await VincularEnderecoPessoa(pCEP, pCPF);
      }

      retorno = "Endereço cadastrado com sucesso!";
      responseCode = 201;
    }
    else {
      cQueryRetorno = queriesCql.cql.cqlConsultarPessoaEndereco;
      cQueryRetorno = cQueryRetorno.replace('@CEP', pCEP);
      cQueryRetorno = cQueryRetorno.replace('@CPF', pCPF);

      var enderecoPessoa = await executeCypherAsync(cQueryRetorno);

      if (enderecoPessoa == null) {
        await VincularEnderecoPessoa(pCEP, pCPF);
        retorno = "CEP vinculado com sucesso à pessoa.";
        responseCode = 200;
      }
      else{
        retorno = "Endereço já cadastrado.";
        responseCode = 400;
      }
    }

    res.send(responseCode, { message: retorno });
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

async function VincularEnderecoCidade(pCep, pCidade, pEstado) {
  var cQuery = queriesCql.cql.cqlVincularEnderecoCidade;
  cQuery = cQuery.replace("@CEP", pCep);
  cQuery = cQuery.replace("@Cidade", pCidade);
  cQuery = cQuery.replace("@Estado", pEstado);

  return await executeCypherAsync(cQuery);
}

async function VincularEnderecoPessoa(pCep, pCpf) {
  var cQuery = queriesCql.cql.cqlVincularEnderecoPessoa;
  cQuery = cQuery.replace("@CEP", pCep);
  cQuery = cQuery.replace("@CPF", pCpf);

  return await executeCypherAsync(cQuery);
}

exports.ValidarRequest = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    var cpf = requisicao.CPF.replace("-", "");
    cpf = cpf.replace(".", "");
    cpf = cpf.replace(".", "");

    validacao.existsOrError(requisicao.CPF, 'CPF inválido!');
    validacao.existsOrError(requisicao.Estado, "Informe um Estado!");
    validacao.existsOrError(requisicao.Cidade, "Informe uma Cidade!");
    validacao.existsOrError(requisicao.CEP, "Informe uma CEP!");
    validacao.existsOrError(requisicao.TipoEndereco, "Informe um Tipo de Endereço!");
    validacao.existsOrError(requisicao.Endereco, "Informe um Endereço!");
    validacao.existsOrError(requisicao.EnderecoAbreviado, "Informe o Endereço abreviado!");
    validacao.existsOrError(requisicao.Bairro, "Informe um Bairro!");
    validacao.existsOrError(requisicao.BairroAbrev, "Informe um Bairro abreviado!");
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};