const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const _enumStatus = require("../../api-contratacao/controller/api_enum");
//const helper = require('@qualitech/qneo4j').helper
const { db } = config;
const { db_estatica } = config;
var parametros = [];
var retorno;

exports.validarDados = async function (req, res, next) {
  try {
    var requisicao = req.params;
    retorno = [];
    //Validação do status do plano
    const proposta = await constultarProposta(requisicao.nrProposta);
    if (!proposta)
      throw "Proposta não encontrada";

    parametros = await consultarParametros();
    if (!parametros.length)
      throw "Não foram encontrados os parâmetros de validações"

    await validarPlanoSuspenso(proposta);

    if (!retorno.length) {
      // Validação de propostas propostas pendentes com o mesmo titular 
      await validarProposta(proposta);

      // Validação de vencimento da vigência
      await validarVigencia(proposta);

      // Validação de DPS
      await validarDPS(proposta);

      //Realizar a validação de Upload de Arquivos 
      await validarDocumentos(proposta);

      // Validação pendências aceitação
      await validarAceitacao(proposta);

    }

    if (retorno && retorno.length && retorno.length > 0) {
      await atualizaStatusProposta(proposta, _enumStatus.statusProposta.PENDENTE_PREENCHIMENTO.value.toString());
    }
    else {
      await atualizaStatusProposta(proposta, _enumStatus.statusProposta.PREENCHIDO.value.toString());
    }

    res.send(200, retorno);

  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

//#region "Validações"

let validarDPS = async function (proposta) {
  try {
    const questionarios = await consultarQuestionario(proposta.nrProposta);
    if (questionarios.length) {
      let preenchido = true;
      for (idq = 0; idq < questionarios.length; idq++) {
        var propriedades = Object.keys(questionarios[idq]);
        propriedades = propriedades.filter((propriedade) => { return propriedade.startsWith('Resposta') })
        for (idp = 0; idp < propriedades.length; idp++) {
          if (questionarios[idq][propriedades[idp]] == "") {
            preenchido = false;
            obterValidacao('dps-incompleta');
            break;
          }
        }
        if (!preenchido) break;
      }
    }
    else {
      obterValidacao('dps-incompleta');
    }
  } catch (error) {
    throw error
  }
}

let validarPlanoSuspenso = async function (proposta) {
  try {
    const status = await consultarSituacaoANS(proposta.planoId);
    if (!status)
      throw "Não foi encontrada informação sobre o status ANS do plano indicado desta proposta";

    if (status != 'ATIVO')
      obterValidacao('plano-suspenso');

  } catch (error) {
    throw error
  }
}

let validarProposta = async function (proposta) {
  try {
    const titular = await consultarTitular(proposta.nrProposta);
    cql = queriesCql.cql.consultarPropostaPorTitular;
    resposta = await db.execute({ cypher: cql, params: { cpf: titular.cpf } });
    if (resposta.length > 1)
      obterValidacao('propostas-pendentes');
  }
  catch (error) {
    throw error
  }
}

let validarVigencia = async function (proposta) {
  try {

    if (!proposta.dataVigencia) {
      obterValidacao('vigencia-vencida');
    }
    else {
      const calendario = await constultarCalendario(proposta.planoId, proposta.dataVigencia);
      if (!calendario.dataVigencia) {
        //Se não encontrar, solicitar para informar uma nova vigência
        obterValidacao('vigencia-vencida');
      }
      else {
        var data = new Date();
        //Se o status da proposta for "Em Preenchimento" a data atual deve ser menor igual a "dataFechamentoAceitacao"
        if (calendario.dataFechamentoAceitacao < data.getTime() && proposta.statusProposta == _enumStatus.statusProposta.EM_PREENCHIMENTO.value.toString())
          obterValidacao('vigencia-vencida');
        //Se o status da proposta for "Pendente" a data atual deve ser menor igual a "dataFechamentoReapresentacao"
        else
          if (calendario.dataFechamentoReapresentacao < data.getTime() && proposta.statusProposta == _enumStatus.statusProposta.PENDENTE_ANALISE.value.toString())
            obterValidacao('vigencia-vencida');
      }
    }
  }
  catch (error) {
    throw error
  }
}

let validarAceitacao = async function (proposta) {
  try {
    const pendencias = await consultarPendenciasProposta(proposta.nrProposta);
    pendencias.forEach(pendencia => {
      let mensagem = pendencia.dados && pendencia.dados.descricao ? pendencia.dados.descricao.toLowerCase() : null
      switch (pendencia.dados.tipo) {
        case 'Cadastro':
          obterValidacao('aceitacao-cadastro', 'Pendência no Cadastro', mensagem);
          break;
        case 'Documentação':
          obterValidacao('aceitacao-documentacao', 'Pendência na Documentação', mensagem);
          break;
        default:
          obterValidacao('aceitacao-cadastro', 'Pendência no Cadastro', mensagem);
          break;
      }
    });
  }
  catch (error) {
    throw error
  }
}


let validarDocumentos = async function (proposta) {
  try {
    //TITULAR
    await consultarDocumentosTitular(proposta.nrProposta, proposta.possuiPlano, proposta.TipoDPS);

    //REPRESENTANTE LEGAL
    await consultarDocumentosResponsavelLegal(proposta.nrProposta);

    //DEPENDENTES
    let dependentes = await consultarDependentes(proposta.nrProposta);
    var promisesDps = [];
    dependentes.forEach(dep => {
      promisesDps.push(consultarDocumentosDependentes(proposta.nrProposta, proposta.TipoDPS, dep.possuiPlano, dep.parentesco, dep.id))
    });
    await Promise.all(promisesDps);

  }
  catch (error) {
    throw error
  }
}
//#endregion

//#region "Consultas"
let consultarQuestionario = async function (nrproposta) {
  try {

    const cql = queriesCql.cql.cqlConsultarQuestionario;
    var questionarios = await db.execute({ cypher: cql, params: { nrProposta: nrproposta } });
    return questionarios.length ? questionarios[0].questoes : [];

  } catch (error) {
    throw error;
  }
}


let consultarParametros = async function () {
  try {

    const cql = queriesCql.cql.cqlConsultarParametros;
    var resposta = await db.execute({ cypher: cql });
    return resposta.length ? resposta[0].validacoes : [];

  } catch (error) {
    throw error;
  }
}

let constultarCalendario = async function (idplano, datavigencia) {
  try {

    const cql = queriesCql.cql.consultarVigencia;
    var resposta = await db_estatica.execute({ cypher: cql, params: { dataVigencia: datavigencia, Filial: config.filial, idPlano: idplano } });

    return resposta.length ? resposta[0].vigencia : {};
  } catch (error) {
    throw error;
  }
}

let constultarProposta = async function (nrProposta) {
  try {
    const cql = queriesCql.cql.consultarProposta;
    var resposta = await db.execute({ cypher: cql, params: { nrProposta: nrProposta } });
    return resposta.length ? resposta[0].proposta : null;

  } catch (error) {
    throw error;
  }
}

let consultarTitular = async function (nrProposta) {
  try {
    const cql = queriesCql.cql.consultarTitular;
    var resposta = await db.execute({ cypher: cql, params: { nrProposta: nrProposta } });
    return resposta[0] && resposta[0].pf ? resposta[0].pf : null;

  } catch (error) {
    throw error;
  }
}

let consultarPendenciasProposta = async function (nrProposta) {
  var cql = queriesCql.cql.consultarPendenciasProposta;
  var resposta = await db.execute({ cypher: cql, params: { nrProposta: nrProposta } });
  let pendencias = resposta ? resposta : []
  return pendencias;
}

let consultarRepresentanteLegal = async function (nrProposta) {
  try {
    const cql = queriesCql.cql.consultarRepresentanteLegal;
    var resposta = await db.execute({ cypher: cql, params: { nrProposta: nrProposta } });
    return resposta[0] && resposta[0].pf ? resposta[0].pf : null;

  } catch (error) {
    throw error;
  }
}

let consultarDependentes = async function (nrProposta) {
  try {
    const cql = queriesCql.cql.consultarDependentes;
    var resposta = await db.execute({ cypher: cql, params: { nrProposta: nrProposta } });
    return resposta && resposta[0].dependentes ? resposta[0].dependentes : [];

  } catch (error) {
    throw error;
  }
}

let consultarSituacaoANS = async function (idplano) {
  try {
    const cql = queriesCql.cql.cqlConsultarSituacaoANS;
    const result = await db_estatica.execute({ cypher: cql, params: { ID: idplano } });
    return result.length ? result[0].situacaoAns : null;

  } catch (error) {
    throw error;
  }
}

let consultarDocumentosTitular = async function (nrProposta, possuiPlano, tipoDPS) {
  try {
    let cql = '';
    let docs = null;
    let titular = await consultarTitular(nrProposta);
    //SELFIE
    cql = queriesCql.cql.consultarDocumentos;
    docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'SelfieTitular', nrProposta: nrProposta } });
    if (!docs[0] || !docs[0].td)
      obterValidacao('selfie-titular');

    //IDENTIFICAÇÃO CIVIL
    cql = queriesCql.cql.consultarDocumentos;
    docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'DocumentoIdentificadorTitular', nrProposta: nrProposta } });
    if (!docs[0] || !docs[0].td)
      obterValidacao('identificacao-titular');

    //COMPROVANTE ENDEREÇO
    cql = queriesCql.cql.consultarDocumentos;
    docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'ComprovanteEnderecoTitular', nrProposta: nrProposta } });
    if (!docs[0] || !docs[0].td)
      obterValidacao('comprovante-endereco-titular');

    //COMPROVANTE FILIAÇÃO
    cql = queriesCql.cql.consultarDocumentos;
    docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'ComprovanteFiliacaoTitular', nrProposta: nrProposta } });
    if (!docs[0] || !docs[0].td)
      obterValidacao('comprovante-filiacao-titular');

    //COMPROVANTE ELEGIBILIDADE
    cql = queriesCql.cql.consultarDocumentos;
    docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'ComprovanteElegibilidadeTitular', nrProposta: nrProposta } });
    if (!docs[0] || !docs[0].td)
      obterValidacao('comprovante-elegibilidade-titular');

    //COMPROVANTE EMANCIPACAO : SE MENOR E EMANCIPADO
    if (titular && titular.emancipado) {
      cql = queriesCql.cql.consultarDocumentos;
      docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'ComprovanteEmancipacaoTitular', nrProposta: nrProposta } });
      if (!docs[0] || !docs[0].td)
        obterValidacao('comprovante-emancipacao-titular');
    }

    //DOCUMENTO REDUÇÃO DE CARÊNCIA : SE POSSUIU PLANO
    if (possuiPlano) {
      cql = queriesCql.cql.consultarDocumentos;
      docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'ReducaoCarenciaTitular', nrProposta: nrProposta } });
      if (!docs[0] || !docs[0].td)
        obterValidacao('reducao-carencia-titular');
    }

    //DOCUMENTO DPS (Declaração Pessoal de Saúde) : SE DpsOperadora OU DpsParticular
    if (tipoDPS && (tipoDPS == "DpsOperadora" || tipoDPS == "DpsParticular")) {
      cql = queriesCql.cql.consultarDocumentos;
      docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'DPSTitular', nrProposta: nrProposta } });
      if (!docs[0] || !docs[0].td)
        obterValidacao('dps-titular');
    }

    return;
  } catch (error) {
    throw error;
  }
}

let consultarDocumentosResponsavelLegal = async function (nrProposta) {
  try {
    let cql = '';
    let docs = null;
    let representante = await consultarRepresentanteLegal(nrProposta);
    if (!representante) return;

    //IDENTIFICAÇÃO CIVIL
    cql = queriesCql.cql.consultarDocumentos;
    docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'DocumentoIdentificadorRepresentanteLegal', nrProposta: nrProposta } });
    if (!docs[0] || !docs[0].td)
      obterValidacao('identificacao-representante-legal');

    if (representante.parentescoResponsavel != 5) {
      //Cópia da Tutela ou Termo de Guarda
      cql = queriesCql.cql.consultarDocumentos;
      docs = await db.execute({ cypher: cql, params: { tipoDocumento: 'TutelaTermoDeGuardaRepresentanteLegal', nrProposta: nrProposta } });
      if (!docs[0] || !docs[0].td)
        obterValidacao('tutela-termo-guarda-representante-legal');
    }

    return;
  } catch (error) {
    throw error;
  }
}

let consultarDocumentosDependentes = async function (nrProposta, tipoDPS, possuiPlano, grauParentesco, id) {
  try {
    let cql = '';
    let docs = null;
    let tipoDocumento = '';

    //IDENTIFICAÇÃO CIVIL
    cql = queriesCql.cql.consultarDocumentos;
    tipoDocumento = 'DocumentoIdentificadorDependente' + id;
    docs = await db.execute({ cypher: cql, params: { tipoDocumento: tipoDocumento, nrProposta: nrProposta } });
    if (!docs[0] || !docs[0].td)
      obterValidacao('identificacao-dependente');

    switch (grauParentesco) {
      case 1:
        //COMPROVANTE ELEGIBILIDADE
        cql = queriesCql.cql.consultarDocumentos;
        tipoDocumento = 'ComprovanteElegibilidadeConjugeDependente' + id;
        docs = await db.execute({ cypher: cql, params: { tipoDocumento: tipoDocumento, nrProposta: nrProposta } });
        if (!docs[0] || !docs[0].td)
          obterValidacao('comprovante-elegibilidade-dependente-conjuge');

        //COMPROVANTE ELEGIBILIDADE
        cql = queriesCql.cql.consultarDocumentos;
        tipoDocumento = 'ComprovanteElegibilidadeConjugeDependente' + id;
        docs = await db.execute({ cypher: cql, params: { tipoDocumento: tipoDocumento, nrProposta: nrProposta } });
        if (!docs[0] || !docs[0].td)
          obterValidacao('comprovante-elegibilidade-dependente-conjuge');

        break;
      case 2:
        //COMPROVANTE ELEGIBILIDADE
        cql = queriesCql.cql.consultarDocumentos;
        tipoDocumento = 'ComprovanteElegibilidadeCompanheiroDependente' + id;
        docs = await db.execute({ cypher: cql, params: { tipoDocumento: tipoDocumento, nrProposta: nrProposta } });
        if (!docs[0] || !docs[0].td)
          obterValidacao('comprovante-elegibilidade-dependente-companheiro');

        break;
      case 3:
        break;
      case 56:
        //CÓPIA LAUDO MEDICO E PERICIA MÉDICA
        cql = queriesCql.cql.consultarDocumentos;
        tipoDocumento = 'LaudoMedicoPericiaMedicaDependente' + id;
        docs = await db.execute({ cypher: cql, params: { tipoDocumento: tipoDocumento, nrProposta: nrProposta } });
        if (!docs[0] || !docs[0].td)
          obterValidacao('laudo-medico-pericia-medica-dependente');
        break;
      case 53:
        //COMPROVANTE ELEGIBILIDADE
        cql = queriesCql.cql.consultarDocumentos;
        tipoDocumento = 'ComprovanteElegibilidadeEnteadoDependente' + id;
        docs = await db.execute({ cypher: cql, params: { tipoDocumento: tipoDocumento, nrProposta: nrProposta } });
        if (!docs[0] || !docs[0].td)
          obterValidacao('comprovante-elegibilidade-dependente-enteado');

        break;
      case 55:
        //Cópia da Tutela ou Termo de Guarda
        cql = queriesCql.cql.consultarDocumentos;
        tipoDocumento = 'TutelaTermoDeGuardaDependente' + id;
        docs = await db.execute({ cypher: cql, params: { tipoDocumento: tipoDocumento, nrProposta: nrProposta } });
        if (!docs[0] || !docs[0].td)
          obterValidacao('tutela-termo-guarda-dependente');

        break;
      case 5:
        break;
      case 10:
        break;
      default:
        break;
    }

    //DOCUMENTO REDUÇÃO DE CARÊNCIA : SE POSSUIU PLANO
    if (possuiPlano) {
      cql = queriesCql.cql.consultarDocumentos;
      tipoDocumento = 'ReducaoCarenciaDependente' + id;
      docs = await db.execute({ cypher: cql, params: { tipoDocumento: tipoDocumento, nrProposta: nrProposta } });
      if (!docs[0] || !docs[0].td)
        obterValidacao('reducao-carencia-dependente');
    }

    //DOCUMENTO DPS (Declaração Pessoal de Saúde) : SE DpsOperadora OU DpsParticular
    if (tipoDPS && (tipoDPS == "DpsOperadora" || tipoDPS == "DpsParticular")) {
      cql = queriesCql.cql.consultarDocumentos;
      tipoDocumento = 'DPSDependente' + id;
      docs = await db.execute({ cypher: cql, params: { tipoDocumento: tipoDocumento, nrProposta: nrProposta } });
      if (!docs[0] || !docs[0].td)
        obterValidacao('dps-dependente');
    }

    return;
  } catch (error) {
    throw error;
  }
}

let atualizaStatusProposta = async function (proposta, novoStatus) {
  try {
    const cql = queriesCql.cql.cqlAtualizarStatusProposta;
    await db.execute({ cypher: cql, params: { nrProposta: proposta.nrProposta, status: novoStatus } });
  } catch (error) {
    throw error;
  }
}

//#endregion

let obterValidacao = function (regra, tituloAceitacao, msgAceitacao) {
  let parametrosTemp = JSON.parse(JSON.stringify(parametros));
  const parametro = parametrosTemp.filter((parametro) => { return parametro.Regra === regra });
  if (!parametro.length) throw `A regra '${regra}' não foi encontrada na relação de validações`;
  delete parametro[0].Regra;

  const regrasExistentes = retorno.filter((r) => { return r.regra === regra && (r.regra !== 'aceitacao-cadastro' && r.regra !== 'aceitacao-documentacao') });
  if (!regrasExistentes.length) {
    retorno.push({
      nomeRota: parametro[0].nomeRota,
      Titulo: tituloAceitacao ? tituloAceitacao : parametro[0].Titulo,
      Mensagem: msgAceitacao ? msgAceitacao : parametro[0].Mensagem,
      regra: regra
    });
  }

}