var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const validacao = require('./api_validation');
const pessoa = require("../../api-pessoa/controller/api_controller.js");

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

async function CriarSimulacao(pBodyRequest) {

  var cQuery = queriesCql.cql.cqlCriarSimulacao;
  cQuery = cQuery.replace('@Veiculo', pBodyRequest.Veiculo);
  cQuery = cQuery.replace('@Formato', pBodyRequest.Formato);
  cQuery = cQuery.replace('@Campanha', pBodyRequest.Campanha);
  cQuery = cQuery.replace('@DataSimulacao', pBodyRequest.DataSimulacao);
  cQuery = cQuery.replace('@Estado', pBodyRequest.Estado);
  cQuery = cQuery.replace('@CEP', pBodyRequest.CEP);
  cQuery = cQuery.replace('@Profissao', pBodyRequest.Profissao);
  cQuery = cQuery.replace('@CodigoEntidade', pBodyRequest.CodigoEntidade);
  cQuery = cQuery.replace('@Entidade', pBodyRequest.Entidade);
  cQuery = cQuery.replace('@CodigoOperadora', pBodyRequest.CodigoOperadora);
  cQuery = cQuery.replace('@Operadora', pBodyRequest.Operadora);
  cQuery = cQuery.replace('@TipoAcomodacao', pBodyRequest.TipoAcomodacao);
  cQuery = cQuery.replace('@Reembolso', pBodyRequest.Reembolso);
  cQuery = cQuery.replace('@AdicionaDependentes', pBodyRequest.AdicionaDependentes);
  cQuery = cQuery.replace('@QuantidadeDependentes', pBodyRequest.QuantidadeDependentes);
  cQuery = cQuery.replace('@CodigoPlano', pBodyRequest.CodigoPlano);
  cQuery = cQuery.replace('@Plano', pBodyRequest.Plano);
  cQuery = cQuery.replace('@ValorPlanoSimulado', pBodyRequest.ValorPlanoSimulado);
  cQuery = cQuery.replace('@FiltroRangeValor', pBodyRequest.FiltroRangeValor);
  cQuery = cQuery.replace('@TipoLead_ContatoNao', pBodyRequest.TipoLead_ContatoNao);
  cQuery = cQuery.replace('@Hora_ContatoNao', pBodyRequest.Hora_ContatoNao);
  cQuery = cQuery.replace('@TipoLead_ClickToCall', pBodyRequest.TipoLead_ClickToCall);
  cQuery = cQuery.replace('@Hora_ClickToCall', pBodyRequest.Hora_ClickToCall);
  cQuery = cQuery.replace('@TipoLead_Chat', pBodyRequest.TipoLead_Chat);
  cQuery = cQuery.replace('@Hora_Chat', pBodyRequest.Hora_Chat);
  cQuery = cQuery.replace('@TipoLead_DetalhesPlano', pBodyRequest.TipoLead_DetalhesPlano);
  cQuery = cQuery.replace('@Hora_DetalhesPlano', pBodyRequest.Hora_DetalhesPlano);
  cQuery = cQuery.replace('@TipoLead_ContatoSim', pBodyRequest.TipoLead_ContatoSim);
  cQuery = cQuery.replace('@Hora_ContatoSim', pBodyRequest.Hora_ContatoSim);
  cQuery = cQuery.replace('@TipoLead_PedidoOnline', pBodyRequest.TipoLead_PedidoOnline);
  cQuery = cQuery.replace('@Hora_PedidoOnline', pBodyRequest.Hora_PedidoOnline);
  cQuery = cQuery.replace('@TipoLead_MobileSim', pBodyRequest.TipoLead_MobileSim);
  cQuery = cQuery.replace('@Hora_MobileSim', pBodyRequest.Hora_MobileSim);
  //TODO: ESSES CAMPOS COMENTADOS PROVAVELMENTE VIRÃO SER IMPLEMENTADOS EM DEZEMBRO DE 2019. 
  // cQuery = cQuery.replace('@TipoLead_HOME_LOGIN_DESISTENCIA', pBodyRequest.TipoLead_HOME_LOGIN_DESISTENCIA);
  // cQuery = cQuery.replace('@hora_HOME_LOGIN_DESISTENCIA', pBodyRequest.hora_HOME_LOGIN_DESISTENCIA);
  // cQuery = cQuery.replace('@TipoLead_LOGIN_DESISTENCIA', pBodyRequest.TipoLead_LOGIN_DESISTENCIA);
  // cQuery = cQuery.replace('@hora_LOGIN_DESISTENCIA', pBodyRequest.hora_LOGIN_DESISTENCIA);
  // cQuery = cQuery.replace('@TipoLead_CADASTRO_DESISTENCIA', pBodyRequest.TipoLead_CADASTRO_DESISTENCIA);
  // cQuery = cQuery.replace('@hora_CADASTRO_DESISTENCIA', pBodyRequest.hora_CADASTRO_DESISTENCIA);
    // cQuery = cQuery.replace('@LEAD_ACEITA_CONTATO', pBodyRequest.LEAD_ACEITA_CONTATO);


  return await executeCypherAsync(cQuery);
}

async function CriarRelacaoSimulacao(pCPF, pIdSimulacao) {

  var cQuery = queriesCql.cql.cqlCriarRelacaoSimulacaoPessoa;
  cQuery = cQuery.replace('@CPF', pCPF);
  cQuery = cQuery.replace('@idSimulacao', pIdSimulacao);

  await executeCypherAsync(cQuery);
}

async function UpdateStatusSimulacao(pCPF) {

  var cQuery = queriesCql.cql.cqlAtualizarStatusSimulacao;
  cQuery = cQuery.replace('@CPF', pCPF);

  await executeCypherAsync(cQuery);
}

async function BuscarSimulacao(pCPF) {

  var cQuery = queriesCql.cql.cqlConsultarSimulacoesPorCPF;
  cQuery = cQuery.replace('@CPF', pCPF);

  return await executeCypherAsync(cQuery);
}

async function VerificaExisteCPF(pCPF) {

  var cQuery = queriesCql.cql.cqlBuscaExisteCPF;
  cQuery = cQuery.replace('@CPF', pCPF);

  var idPessoa = await executeCypherAsync(cQuery);

  if (idPessoa == undefined || idPessoa == null)
    return false;
  else
    return true;
}

exports.IncluirSimulacao = async function (req, res, next) {
  try {
     //VERIFICA O CONTEÚDO DO BODY
    if (req.body == undefined || req.body == null) {
      res.send(400, { message: "Parâmetros inválidos para inclusão da Simulação!" });
    }

    if (req.body.CPF == undefined || req.body.CPF == null) {
      res.send(400, { message: "CPF não informado. Simulação não foi criada!" });
    }

    var existe = await VerificaExisteCPF(req.body.CPF);

    if (!existe) {
      await pessoa.inserir(req.body);
    }

    if ((req.body.AdicionaDependentes == true && req.body.QuantidadeDependentes < 1)
      || (req.body.AdicionaDependentes == false && req.body.QuantidadeDependentes > 0)) {
      res.send(400, { message: "Quantidades de dependentes inválida!" });
      return;
    }

    if (req.body.AdicionaDependentes == true && (req.body.Dependentes == undefined || req.body.Dependentes == null || req.body.Dependentes.length == 0)) {
      res.send(400, { message: "Listagem de dependentes inválida!" });
      return;
    }

    //Consulta para ver se há uma simulação ativa, caso sim a desativa.
    var cQueryConsulta = await BuscarSimulacao(req.body.CPF);
    if (cQueryConsulta != null && cQueryConsulta != undefined) {
      await UpdateStatusSimulacao(req.body.CPF);
    }

    //Cria Simulacao
    var idSimulacao = await CriarSimulacao(req.body);

    //Cria Relação Pessoa>Simulacao
    await CriarRelacaoSimulacao(req.body.CPF, idSimulacao);

    if (idSimulacao != undefined && idSimulacao != null && idSimulacao > 0) {
      if (req.body.AdicionaDependentes == true && req.body.Dependentes.length > 0) {
        if (idSimulacao != undefined && idSimulacao != null && idSimulacao > 0) {
          await pessoa.incluirDependente(idSimulacao, req.body.Dependentes);
        }
      }
    }

    res.send(201, { message: "Simulação Criada com Sucesso!" });
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }

  next();
};

exports.AlterarSimulacao = async function (req, res, next) {
  try {
    if ((req.body == undefined || req.body == null) || (req.body.CPF == undefined || req.body.CPF == null)) {
      res.send(400, { message: "O parâmetro não pode ser nulo!" });
      return;
    }

    var errorMessage = "";

    if (req.body.CPF == undefined || req.body.CPF == null)
      errorMessage = "Parametro CPF é inválido! ";

    var existe = await VerificaExisteCPF(req.body.CPF);

    if (!existe)
      errorMessage = "Parametro CPF não existe!";

      if ((req.body.AdicionaDependentes == true && req.body.QuantidadeDependentes < 1)
      || (req.body.AdicionaDependentes == false && req.body.QuantidadeDependentes > 0)) {
        errorMessage += "Quantidades de dependentes inválida! ";
    }

    if (req.body.AdicionaDependentes == true && (req.body.Dependentes == undefined || req.body.Dependentes == null || req.body.Dependentes.length == 0)) {
      errorMessage += "Listagem de dependentes inválida!";
    }

    if (errorMessage != "") {
      res.send(400, { message: errorMessage });
      return;
    }

  var cQuery = queriesCql.cql.cqlAtualizarSimulacao;
  cQuery = cQuery.replace('@CPF', req.body.CPF);
  cQuery = cQuery.replace('@Veiculo', req.body.Veiculo);
  cQuery = cQuery.replace('@Formato', req.body.Formato);
  cQuery = cQuery.replace('@Campanha', req.body.Campanha);
  cQuery = cQuery.replace('@DataSimulacao', req.body.DataSimulacao);
  cQuery = cQuery.replace('@Estado', req.body.Estado);
  cQuery = cQuery.replace('@CEP', req.body.CEP);
  cQuery = cQuery.replace('@Profissao', req.body.Profissao);
  cQuery = cQuery.replace('@CodigoEntidade', req.body.CodigoEntidade);
  cQuery = cQuery.replace('@Entidade', req.body.Entidade);
  cQuery = cQuery.replace('@CodigoOperadora', req.body.CodigoOperadora);
  cQuery = cQuery.replace('@Operadora', req.body.Operadora);
  cQuery = cQuery.replace('@TipoAcomodacao', req.body.TipoAcomodacao);
  cQuery = cQuery.replace('@Reembolso', req.body.Reembolso);
  cQuery = cQuery.replace('@AdicionaDependentes', req.body.AdicionaDependentes);
  cQuery = cQuery.replace('@QuantidadeDependentes', req.body.QuantidadeDependentes);
  cQuery = cQuery.replace('@CodigoPlano', req.body.CodigoPlano);
  cQuery = cQuery.replace('@Plano', req.body.Plano);
  cQuery = cQuery.replace('@ValorPlanoSimulado', req.body.ValorPlanoSimulado);
  cQuery = cQuery.replace('@FiltroRangeValor', req.body.FiltroRangeValor);
  cQuery = cQuery.replace('@TipoLead_ContatoNao', req.body.TipoLead_ContatoNao);
  cQuery = cQuery.replace('@Hora_ContatoNao', req.body.Hora_ContatoNao);
  cQuery = cQuery.replace('@TipoLead_ClickToCall', req.body.TipoLead_ClickToCall);
  cQuery = cQuery.replace('@Hora_ClickToCall', req.body.Hora_ClickToCall);
  cQuery = cQuery.replace('@TipoLead_Chat', req.body.TipoLead_Chat);
  cQuery = cQuery.replace('@Hora_Chat', req.body.Hora_Chat);
  cQuery = cQuery.replace('@TipoLead_DetalhesPlano', req.body.TipoLead_DetalhesPlano);
  cQuery = cQuery.replace('@Hora_DetalhesPlano', req.body.Hora_DetalhesPlano);
  cQuery = cQuery.replace('@TipoLead_ContatoSim', req.body.TipoLead_ContatoSim);
  cQuery = cQuery.replace('@Hora_ContatoSim', req.body.Hora_ContatoSim);
  cQuery = cQuery.replace('@TipoLead_PedidoOnline', req.body.TipoLead_PedidoOnline);
  cQuery = cQuery.replace('@Hora_PedidoOnline', req.body.Hora_PedidoOnline);
  cQuery = cQuery.replace('@TipoLead_MobileSim', req.body.TipoLead_MobileSim);
  cQuery = cQuery.replace('@Hora_MobileSim', req.body.Hora_MobileSim);

  //|TO-DO|: ESSES CAMPOS COMENTADOS PROVAVELMENTE VIRÃO SER IMPLEMENTADOS EM DEZEMBRO DE 2019. 
  // cQuery = cQuery.replace('@TipoLead_HOME_LOGIN_DESISTENCIA', req.body.TipoLead_HOME_LOGIN_DESISTENCIA);
  // cQuery = cQuery.replace('@hora_HOME_LOGIN_DESISTENCIA', req.body.hora_HOME_LOGIN_DESISTENCIA);
  // cQuery = cQuery.replace('@TipoLead_LOGIN_DESISTENCIA', req.body.TipoLead_LOGIN_DESISTENCIA);
  // cQuery = cQuery.replace('@hora_LOGIN_DESISTENCIA', req.body.hora_LOGIN_DESISTENCIA);
  // cQuery = cQuery.replace('@TipoLead_CADASTRO_DESISTENCIA', req.body.TipoLead_CADASTRO_DESISTENCIA);
  // cQuery = cQuery.replace('@hora_CADASTRO_DESISTENCIA', req.body.hora_CADASTRO_DESISTENCIA);
  // cQuery = cQuery.replace('@LEAD_ACEITA_CONTATO', req.body.LEAD_ACEITA_CONTATO);
  
    var simulacoes = await executeCypherAsync(cQuery);

    if (simulacoes == null)
      errorMessage = "Nenhuma Simulação encontrada para o CPF informado!";
    else {
      if (req.body.AdicionaDependentes == true && req.body.Dependentes.length > 0) {
        if (simulacoes.Atualizado.SimulacaoId != undefined && simulacoes.Atualizado.SimulacaoId != null && simulacoes.Atualizado.SimulacaoId > 0) {
          await pessoa.incluirDependente(simulacoes.Atualizado.SimulacaoId, req.body.Dependentes);
        }
      }
    }

    if (errorMessage != '')
      res.send(404, { message: errorMessage });
    else
      res.send(200, simulacoes);
  } catch (err) {
      res.send(400, { message: err });
  }
};

exports.ConsultarSimulacao = async function (req, res, next) {
  try {
    if ((req.params == undefined || req.params == null) || (req.params.CPF == undefined || req.params.CPF == null)) {
      res.send(400, { message: "O parâmetro não pode ser nulo!" });
      return;
    }

    var pCPF = req.params.CPF;

    var cQuery = queriesCql.cql.cqlConsultarSimulacoesPorCPF;
    cQuery = cQuery.replace('@CPF', pCPF);
  
    var simulacoes = await executeCypherAsync(cQuery);

    if (simulacoes == undefined || simulacoes == null)
      res.send(404, { message: "Nenhuma Simulação encontrada para o CPF informado!" });
    else
      res.send(200, simulacoes);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
};

exports.ValidarRequest = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

      var errorMessage = "";

      if (requisicao.CPF == undefined || requisicao.CPF == null)
        errorMessage = "Parametro CPF não existe! ";

      if (requisicao.DataSimulacao == undefined || requisicao.DataSimulacao == null)
        errorMessage += "Parametro DataSimulacao não existe! ";

    if (errorMessage != "") {
      res.send(400, { message: errorMessage });
        return;
      }

    var cpf = requisicao.CPF.replace("-", "");
    cpf = cpf.replace(".", "");
    cpf = cpf.replace(".", "");
    
      validacao.validarCPF(cpf, 'CPF inválido!');
      validacao.existsOrError(requisicao.DataSimulacao, "Informe uma DataSimulacao!");
  } catch (err) {
    var msg = err.message || err;
      res.send(400, { message: msg });
    }
    next();
  };  
