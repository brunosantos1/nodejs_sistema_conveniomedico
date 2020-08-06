var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1; 

//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql, usarEstatica) {
  try {
    let driver;

    if (usarEstatica == true) {
      driver = neo4j.default.driver(
        config.neo4j_driver_estatica.url_bolt,
        config.neo4j_driver_estatica.auth,
        { disableLosslessIntegers: true }
      );
    }
    else {
      driver = neo4j.default.driver(
        config.neo4j_driver.url_bold,
        config.neo4j_driver.auth,
        { disableLosslessIntegers: true }
      );
    }

    
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

exports.ConsultarQuestionario = async function(req, res, next) {
  try {
    if (req.query.NumeroProposta == undefined || req.query.NumeroProposta == null || req.query.NumeroProposta == ""){
      res.send(400, { message: "Parâmetro não pode ser vazio!" });
      return;
    }

    var retornoDPS = [];
    var dps = [];
    var numeroProposta = req.query.NumeroProposta;

    retornoDPS = await BuscarQuestionario(numeroProposta);

    for (r = 0; r < retornoDPS.length; r++) {
      dps[r] = {"nome": retornoDPS[r].nome, "id": retornoDPS[r].id, "titular": retornoDPS[r].titular, "DPS": retornoDPS[r].DPS };
    }

    if (dps == undefined || dps == null || dps.length == 0)
      res.send(404, { message: "Nenhuma DPS foi encontrado!" });
    else
      res.send(200, dps);
  } catch (err) {
    res.send(400, { message: err + ' - Falha ao consultar a DPS.' });
  }
};

async function BuscarQuestionario(numeroProposta) {
  var retornoDPS = [];

  var cQuery = queriesCql.cql.cqlConsultarDpsProposta;
  cQuery = cQuery.replace('@nrProposta', numeroProposta);

  var pessoas = await executeCypherAsync(cQuery, false);
  cQuery = '';

  if (pessoas == undefined || pessoas == null){
    throw "Proposta inválida. Nenhuma pessoa vinculada ou Proposta inexistente!";
  }

  if (pessoas.idPlanoSinf == undefined || pessoas.idPlanoSinf == null || pessoas.idPlanoSinf == ''){
    throw "Proposta inválida. Plano não encontrado!";
  }

  if (pessoas.TipoDPS == 'DpsOperadora' || pessoas.TipoDPS == 'DpsParticular') {
    retornoDPS[0] = { nome: pessoas.titular.beneficiario.properties.nome, id: pessoas.titular.id, titular: true, DPS: [], valida: false };
  }
  else {
    if (pessoas.titular.dps == undefined || pessoas.titular.dps == null) {
      pessoas.titular.dps = await BuscarDPS(pessoas.idPlanoSinf);

      retornoDPS[0] = { nome: pessoas.titular.beneficiario.properties.nome, id: pessoas.titular.id, titular: true, DPS: pessoas.titular.dps, valida: false };
    }
    else {
      pessoas.titular.dps = await TratarDpsPreenchida(pessoas.idPlanoSinf,pessoas.titular.dps,pessoas.titular.codigoDps.properties.CodigoQuestionario);

      if (pessoas.titular.dps == undefined || pessoas.titular.dps == null || pessoas.titular.dps == 0){
        throw 'Nenhuma DPS encontrada';
      }

      retornoDPS[0] = { nome: pessoas.titular.beneficiario.properties.nome, id: pessoas.titular.id, titular: true, DPS: pessoas.titular.dps.dpsTratada, valida: pessoas.titular.dps.DPSValida };
    }
  }

  var p = 1;

  if (pessoas.dependentes != undefined && pessoas.dependentes != null && pessoas.dependentes[0].id != null){
    var dpsDependente = [];

    for (i = 0; i < pessoas.dependentes.length; i++) {

      if (pessoas.TipoDPS == 'DpsOperadora' || pessoas.TipoDPS == 'DpsParticular') {
        retornoDPS[p] = { nome: pessoas.dependentes[i].dependente.properties.nome, id: pessoas.dependentes[i].id, titular: false, DPS: [], valida: false };
      }
      else {
        if (pessoas.dependentes[i].dps == undefined || pessoas.dependentes[i].dps == null) {
          dpsDependente = await BuscarDPS(pessoas.idPlanoSinf);

          retornoDPS[p] = { nome: pessoas.dependentes[i].dependente.properties.nome, id: pessoas.dependentes[i].id, titular: false, DPS: dpsDependente, valida: false };
        }
        else {
          dpsDependente = await TratarDpsPreenchida(pessoas.idPlanoSinf,pessoas.dependentes[i].dps,pessoas.titular.codigoDps.properties.CodigoQuestionario); 

          if (dpsDependente.dpsTratada == undefined || dpsDependente.dpsTratada == null || dpsDependente.dpsTratada == 0){
            throw 'Nenhuma DPS encontrada';
          }
      
          retornoDPS[p] = { nome: pessoas.dependentes[i].dependente.properties.nome, id: pessoas.dependentes[i].id, titular: false, DPS: dpsDependente.dpsTratada, valida: pessoas.titular.dps.DPSValida };
        }
      }

      p++;
      dpsDependente = [];
    }
  }

  return retornoDPS;
}

async function TratarDpsPreenchida(idPlanoSinf, dpsPessoa, codigoQuestionario) {
  var qtdePerguntas = await BuscarQuantidadePerguntasDPS(idPlanoSinf);

  if (qtdePerguntas > 0){
    var dpsAtual = JSON.stringify(dpsPessoa.properties).replace("{","").replace("{","").replace("}","").replace("}","").split(',"');

    //limpa as strings para comparação
    for (t = 0; t < dpsAtual.length; t++) {
      dpsAtual[t] = dpsAtual[t].replace('""','"');
    }

    var item = [];
    var dpsRetorno = null;
    var dpsValida = true;
    var dpsTratada = [];
    var subItemResposta = null;
    var subItemTipoResposta = null;
    var itemOrdem = null;
    var subItemCodigoPergunta = null;
    var subItemEspecificacoes = null;
    var subItemPergunta = null;
    var subItemDataEvento = null;
    var subItemCodigoQuestionario = codigoQuestionario;
    
    for (iDps = 0; iDps < qtdePerguntas; iDps++) {
      subItemResposta = null;
      subItemTipoResposta = null;
      itemOrdem = null;
      subItemCodigoPergunta = null;
      subItemEspecificacoes = null;
      subItemPergunta = null;
      subItemDataEvento = null;

      for (p = 0; p < dpsAtual.length; p++) {
        item = dpsAtual[p].split(':');
        item[0] = item[0].replace('"','').replace('"','');
        item[1] = item[1].replace('"','').replace('"','');

        //Resposta
        if (item[0] == "Resposta" + (iDps + 1)){
          subItemResposta = item[1];

          if ((subItemResposta == "" || subItemResposta == 0) && dpsValida == true){
            dpsValida = false;
          }
        }

        //TipoResposta
        if (item[0] == "TipoResposta" + (iDps + 1)){
          subItemTipoResposta = item[1];
        }          

        //Ordem
        itemOrdem = (iDps + 1);

        //CodigoPergunta
        if (item[0] == "CodigoPergunta" + (iDps + 1)){
          subItemCodigoPergunta = item[1];
        }

        //Especificacoes
        if (item[0] == "Especificacoes" + (iDps + 1)){
          subItemEspecificacoes = item[1];
        }

        //Pergunta
        if (item[0] == "Pergunta" + (iDps + 1)){
          subItemPergunta = item[1];
        }

        //DataEvento
        if (item[0] == "DataEvento" + (iDps + 1)){
          subItemDataEvento = item[1];
        }
      }
      
      if (!(subItemResposta == null ||
        subItemTipoResposta == null ||
        itemOrdem == null ||
        subItemCodigoPergunta == null ||
        subItemEspecificacoes == null ||
        subItemPergunta == null ||
        subItemCodigoQuestionario == null)){
        dpsTratada[iDps] = { "Resposta":subItemResposta, "TipoResposta":subItemTipoResposta, "Ordem":itemOrdem, "CodigoPergunta":subItemCodigoPergunta, "Especificacoes":subItemEspecificacoes, "Pergunta":subItemPergunta, "CodigoQuestionario":subItemCodigoQuestionario, "DataEvento" : subItemDataEvento };
      }
    }

    if (dpsTratada.length == 0){
      dpsTratada = await BuscarDPS(idPlanoSinf);
    }

    dpsRetorno = { DPSValida: dpsValida, dpsTratada: dpsTratada};

    return dpsRetorno;
  }
  else{
    return await BuscarDPS(idPlanoSinf);
  }
}

async function BuscarQuantidadePerguntasDPS(idPlanoSinf) {
  var qtdePerguntas = 0;

  var perguntasOperadora = await BuscarDPS(idPlanoSinf);

  if (perguntasOperadora == undefined || perguntasOperadora == null || perguntasOperadora.length == 0){
    qtdePerguntas = 0;
  }
  else{
    qtdePerguntas = perguntasOperadora.length;
  }

  return qtdePerguntas;
}

async function BuscarDPS(idPlanoSinf) {
  var novaDps = [];

  var nomeOperadora = await ObterOperadoraPorPlano(idPlanoSinf);

  if(nomeOperadora == undefined || nomeOperadora == null || nomeOperadora == ''){
    throw 'Operadora não encontrada.';
  }

  cQuery = queriesCql.cql.sqlConsultaDpsSinf;
  cQuery = cQuery.replace('@NOME_FANTASIA_OPERADORA', nomeOperadora);

  var dps = await executeCypherAsync(cQuery, false);
  cQuery = '';

  if (dps == undefined || dps == null || dps.length == 0){
    return null;
  }

  var novaDps = [];

  for (d = 0; d < dps.length; d++) {
    novaDps[d] = { "Resposta": dps[d].Resposta, "TipoResposta": dps[d].TipoResposta, "Ordem": dps[d].Ordem, "CodigoPergunta": dps[d].CodigoPergunta, "Especificacoes": "", "Pergunta": dps[d].Pergunta, "CodigoQuestionario": dps[d].CodigoQuestionario, "DataEvento" : ""  };
  }

  return novaDps;
}

async function ObterOperadoraPorPlano(idPlanoSinf) {
  try {
    if (idPlanoSinf == undefined || idPlanoSinf == null || idPlanoSinf == 0) {
      throw 'Plano não encontrado.'
    }

    var cQuery = queriesCql.cql.cqlBaseEstaticaBuscarOperadoraPorPlano;
    cQuery = cQuery.replace('@planoIdSinf', idPlanoSinf);
    
    var operadora = await executeCypherAsync(cQuery, true);

    return operadora;
  } catch (err) {
      throw err.message;
  }
}

exports.InserirDPS = async function(req, res, next) {
  try {
    if (req.body == undefined || req.body == null){
      res.send(400, { message: "Parâmetro não pode ser vazio!" });
      return;
    }

    if (req.body.idPessoa == undefined || req.body.idPessoa == null || req.body.idPessoa < 1){
      res.send(400, { message: "Parâmetro idPessoa inválido!" });
      return;
    }
    
    if (req.body.Operadora == undefined || req.body.Operadora == null || req.body.Operadora == ""){
      res.send(400, { message: "Parâmetro Operadora inválido!" });
      return;
    }
    
    if (req.body.DataPreenchimento == undefined || req.body.DataPreenchimento == null || req.body.DataPreenchimento == ""){
      res.send(400, { message: "Parâmetro DataPreenchimento inválido!" });
      return;
    }
    
    if (req.body.NumeroProposta == undefined || req.body.NumeroProposta == null || req.body.NumeroProposta == ""){
      res.send(400, { message: "Parâmetro NumeroProposta inválido!" });
      return;
    }
    
    if (req.body.DPS == undefined || req.body.DPS == null || req.body.DPS.length == 0){
      res.send(400, { message: "Parâmetro DPS inválido!" });
      return;
    }
    
    var cQueryPrincipal = queriesCql.cql.cqlIncluirDPS;
    cQueryPrincipal = cQueryPrincipal.replace('@idPessoa', req.body.idPessoa);
    cQueryPrincipal = cQueryPrincipal.replace('@NmOperadora', req.body.Operadora);
    cQueryPrincipal = cQueryPrincipal.replace('@DataPreenchimento', req.body.DataPreenchimento);
    cQueryPrincipal = cQueryPrincipal.replace('@NumeroProposta', req.body.NumeroProposta);

    var cQueryPerguntas = '';
    var idQuestionario = 0;

    for (i = 0; i < req.body.DPS.length; i++) {
      var cQueryPerguntaAtual = queriesCql.cql.pergunta;

      if (i < req.body.DPS.length - 1){
        cQueryPerguntaAtual = cQueryPerguntaAtual + ', ';
      }

      idQuestionario = req.body.DPS[i].CodigoQuestionario;
      
      cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
      cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Pergunta', req.body.DPS[i].Pergunta);
      cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
      cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Resposta', req.body.DPS[i].Resposta);
      cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
      cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@idPergunta', req.body.DPS[i].CodigoPergunta);
      cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@DataPreenchimento', req.body.DPS[i].DataPreenchimento);
      cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
      cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Especificacoes', req.body.DPS[i].Especificacoes);

      cQueryPerguntas += cQueryPerguntaAtual;
    }

    cQueryPrincipal = cQueryPrincipal.replace('@Perguntas',cQueryPerguntas)
    cQueryPrincipal = cQueryPrincipal.replace('@Questionario',idQuestionario)
    
    var dps = await executeCypherAsync(cQueryPrincipal, false);

     if (dps == undefined || dps == null)
       res.send(400, { message: "DPS não foi criada!" });
     else
       res.send(201, { message: "DPS criada com sucesso!" });
  } catch (err) {
    res.send(400, { message: err });
  }
};

exports.AtualizarDPS = async function(req, res, next) {
  try {
    if (req.body.idPessoa == undefined || req.body.idPessoa == null) {
      res.send(400, { message: "idPessoa não foi informado!" });
      return;
    }

    if (req.body.NumeroProposta == undefined || req.body.NumeroProposta == null) {
      res.send(400, { message: "NumeroProposta não foi informado!" });
      return;
    }

    if (req.body.TipoDPS == undefined || req.body.TipoDPS == null) {
      res.send(400, { message: "Tipo não foi informado!" });
      return;
    }

    if (req.body.TipoDPS != 'DpsOnline'){
      var cQueryPrincipal = queriesCql.cql.cqlAtualizarProposta;
      cQueryPrincipal = cQueryPrincipal.replace('@NumeroProposta', req.body.NumeroProposta);
      cQueryPrincipal = cQueryPrincipal.replace('@TipoDPS', req.body.TipoDPS);

      var retorno = await executeCypherAsync(cQueryPrincipal, false);
      
      if (retorno == undefined || retorno == null)
        res.send(400, { message: "Proposta não foi atualizada!" });
      else
        res.send(200, { message: "Proposta atualizada com sucesso!" });
    }
    else{
      var cQueryPrincipal = queriesCql.cql.cqlIncluirAtualizarDPS;
      cQueryPrincipal = cQueryPrincipal.replace('@idPessoa', req.body.idPessoa);
      cQueryPrincipal = cQueryPrincipal.replace('@nrProposta', req.body.NumeroProposta);
      cQueryPrincipal = cQueryPrincipal.replace('@TipoDPS', req.body.TipoDPS);

      var cQueryPerguntas = '';
      var faltaEspecificacao = '';
      var idQuestionario = 0;

      if (req.body.titular == undefined || req.body.titular == null) {
        res.send(400, { message: "Nivel de Titular não foi informado!" });
        return;
      }
  
      if (req.body.DPS == undefined || req.body.DPS == null || req.body.DPS.length == 0){
        cQueryPrincipal = cQueryPrincipal.replace(', @perguntaAtualizar', '');
      }
      else
      {
        for (i = 0; i < req.body.DPS.length; i++) {
          var cQueryPerguntaAtual = queriesCql.cql.perguntaAtualizar;

          if (i < req.body.DPS.length - 1){
            cQueryPerguntaAtual = cQueryPerguntaAtual + ', ';
          }

          if (idQuestionario == 0)
            idQuestionario = req.body.DPS[i].CodigoQuestionario;
          
          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@questionario',idQuestionario)
          
          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Pergunta', req.body.DPS[i].Pergunta);

          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Resposta', req.body.DPS[i].Resposta);

          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@idPergunta', req.body.DPS[i].CodigoPergunta);

          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@CodigoQuestionario', req.body.DPS[i].Ordem);

          if (req.body.DPS[i].TipoResposta == 'sim/não' && req.body.DPS[i].Resposta == 'SIM' && (req.body.DPS[i].Especificacoes == undefined || req.body.DPS[i].Especificacoes == null || req.body.DPS[i].Especificacoes == '')){
            faltaEspecificacao += 'Pergunta de Ordem nº ' + req.body.DPS[i].Ordem + ' foi marcado como SIM mas justificativa não especificada! '
          }

          if (req.body.DPS[i].TipoResposta == 'sim/não' && req.body.DPS[i].Resposta == 'SIM' && (req.body.DPS[i].DataEvento == undefined || req.body.DPS[i].DataEvento == null || req.body.DPS[i].DataEvento == '')){
            faltaEspecificacao += 'Pergunta de Ordem nº ' + req.body.DPS[i].Ordem + ' foi marcado como SIM mas data do evento não preenchida! '
          }

          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Especificacoes', req.body.DPS[i].Especificacoes);

          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@DataEvento', req.body.DPS[i].DataEvento);

          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@Ordem', req.body.DPS[i].Ordem);
          cQueryPerguntaAtual = cQueryPerguntaAtual.replace('@TipoResposta', req.body.DPS[i].TipoResposta);

          cQueryPerguntas += cQueryPerguntaAtual;
        }
        
        cQueryPrincipal = cQueryPrincipal.replace('@perguntaAtualizar',cQueryPerguntas);
      }

      if (req.body.titular == true){
        cQueryPrincipal = cQueryPrincipal.replace('@nivelBeneficiario',queriesCql.cql.titular);
      }
      else{
        cQueryPrincipal = cQueryPrincipal.replace('@nivelBeneficiario',queriesCql.cql.dependente);
      }

      if (faltaEspecificacao != ''){
        res.send(400, { message: faltaEspecificacao });
        return;
      }

      var dps = await executeCypherAsync(cQueryPrincipal, false);
      
      if (dps == undefined || dps == null)
        res.send(400, { message: "DPS não foi atualizada!" });
      else
        res.send(200, { message: "DPS atualizada com sucesso!" });
    }
  } catch (err) {
    res.send(400, { message: err.message });
  }
};

exports.ValidarDpsProposta = async function(req, res, next) {
  try {
    if (req.body.NumeroProposta == undefined || req.body.NumeroProposta == null || req.body.NumeroProposta == ""){
      res.send(400, { message: "Parâmetro não pode ser vazio!" });
      return;
    }

    var retornoDPS = [];
    var valida = false;

    retornoDPS = await BuscarQuestionario(req.body.NumeroProposta);

    for (v = 0; v < retornoDPS.length; v++) {
      if (retornoDPS[v].valida == false){
        valida = false;
        break;
      }
      else{
        valida = true;
      }
    }

    if (valida == true)
      res.send(200, { validacao: valida, message: 'DPS completa.'});
    else
      res.send(400, { validacao: false, message: 'DPS incompleta.' });
  } catch (err) {
    res.send(400, { validacao: false, message: err + ' - Falha ao validar a DPS.' });
  }
};