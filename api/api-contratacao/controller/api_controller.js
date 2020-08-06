'use strict';
var axios = require("axios");
const moment = require('moment');
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const validacao = require('./api_validation');
const _enum = require("./api_enum");
const criar_proposta = require("./api_functions/criar_proposta");
const alterar_proposta = require("./api_functions/alterar_proposta");
const planoController = require("../../api-plano/controller/api_controller");
moment.locale("pt-br")
//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql, base = config.neo4j_driver) {
  let driver = neo4j.default.driver(
    base.url_bold,
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
    return null
}

//#region "Métodos de Proposta"

exports.ConsultarProposta = async function (req, res, next) {
  try {

    validacao.existsOrError(req.params, "O Número da proposta deve ser informado.");
    validacao.existsOrError(req.params.nrProposta, "O Número da proposta deve ser informado.");
    const nrProposta = req.params.nrProposta;

    var cql = queriesCql.cql.cqlConsultarDadosProposta
      .replace('@NrProposta', nrProposta)

    let proposta = await executeCypherAsync(cql);

    res.send(200, proposta);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

exports.ConsultarPropostaPessoa = async function (req, res, next) {
  try {

    validacao.existsOrError(req.params, "O CPF do titular deve ser informado.");
    validacao.existsOrError(req.params.cpf, "O CPF do titular deve ser informado.");
    const cpf = req.params.cpf;

    var cql = queriesCql.cql.cqlConsultarPropostasPessoa
      .replace('@CPF', cpf)

    let propostas = await executeCypherAsync(cql);
    var promises = [];
    propostas.forEach(pt => {
      let datasNascimento = [];
      datasNascimento.push(pt.nascimentoTitular);
      pt.dependentes.forEach(dp => {
        datasNascimento.push(dp.nascimento);
      });
      let data = { planoId: pt.planoId, planoIdSinf: pt.planoIdSinf, entidade: pt.entidade, uf: pt.uf, cidade: pt.cidade, datanascimento: datasNascimento };
      promises.push(planoController.listarPlanoProposta(data));
    });
    let lista = await Promise.all(promises)

    var promisesStatus = [];
    var listaStatus = [];
    propostas.forEach(pt => {
      promisesStatus.push(obterDescricaoAcaoStatus(pt.nrProposta, pt.statusProposta))
    });
    listaStatus = await Promise.all(promisesStatus);

    let listaFormatada = [];
    propostas.forEach(pt => {
      for (let index = 0; index < lista.length; index++) {
        const item = lista[index];
        if (item.id == pt.planoId) {
          listaFormatada.push({
            nrProposta: pt.nrProposta,
            statusProposta: pt.statusProposta,
            justificativa: pt.justificativa,
            detalheStatus: {},
            dataInicio: pt.dataInicio,
            totalDependentes: pt.dependentes ? pt.dependentes.length : 0,
            plano: item
          })
          break;
        }
      }
    });

    listaFormatada.forEach(ls => {
      listaStatus.forEach(status => {
        if (ls.nrProposta == status.nrProposta) {
          ls.detalheStatus = status
        }
      });
    });

    listaFormatada.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

    res.send(200, listaFormatada);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

exports.CriarProposta = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    var data = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();

    var cql = queriesCql.cql.cqlCriarProposta
      .replace('@NrProposta', requisicao.contratacao.nrProposta)
      .replace('@PlanoId', requisicao.contratacao.planoId)
      .replace('@PlanoIdSinf', requisicao.contratacao.planoIdSinf)
      .replace('@FluxoId', requisicao.contratacao.fluxoId)
      .replace('@DataInicio', data + ' ' + time)


    let proposta = await executeCypherAsync(cql);
    validacao.existsOrError(proposta, "Erro ao criar proposta.");

    let titular = await criar_proposta.CriarTitular(requisicao);
    validacao.existsOrError(titular, "Erro ao criar nó de titular.");

    let endereco = await criar_proposta.CriarEndereco(requisicao);
    validacao.existsOrError(endereco, "Erro ao criar nó de endereço.");

    let profissao = await criar_proposta.CriarProfissao(requisicao);
    validacao.existsOrError(profissao, "Erro ao criar nó de profissão.");

    let dependentes = await criar_proposta.CriarDependentes(requisicao);

    let simulacao = await criar_proposta.VincularSimulacao(requisicao);
    validacao.existsOrError(simulacao, "Erro ao vincular a simulação.");

    await inserirStatus(requisicao.contratacao.nrProposta, _enum.statusProposta.EM_PREENCHIMENTO.value);

    res.send(200, {
      Simulacao: simulacao,
      Titular: titular,
      Endereco: endereco,
      Profissao: profissao,
      Proposta: proposta
    });
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

exports.AtualizarProposta = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    //valida proposta
    validacao.existsOrError(requisicao.cpf, "O CPF deve ser informado.");
    validacao.existsOrError(requisicao.nrProposta, "O Número da proposta deve ser informado.");
    validacao.existsOrError(requisicao.sequencia, "O Número da sequência deve ser informado.");
    const proposta = await alterar_proposta.ConsultarProposta(requisicao);
    validacao.existsOrError(proposta, "Proposta não encontrada");


    let dadosPessoaisTitular = requisicao.campos[requisicao.sequencia] && requisicao.campos[requisicao.sequencia]['dadosPessoaisTitular'] ? requisicao.campos[1]['dadosPessoaisTitular'] : null;
    let dadosPessoaisMenor = requisicao.campos[requisicao.sequencia] && requisicao.campos[requisicao.sequencia]['dadosPessoaisMenor'] ? requisicao.campos[1]['dadosPessoaisMenor'] : null;

    let dadosComplementares = requisicao.campos[requisicao.sequencia] && requisicao.campos[requisicao.sequencia]['dadosComplementares'] ? requisicao.campos[requisicao.sequencia]['dadosComplementares'] : null;
    let dadosPossuiPlano = requisicao.campos[requisicao.sequencia] && requisicao.campos[requisicao.sequencia]['dadosPossuiPlano'] && requisicao.campos[requisicao.sequencia]['dadosPossuiPlano'][0] ? requisicao.campos[requisicao.sequencia]['dadosPossuiPlano'][0] : null;
    let dadosProfissionais = requisicao.campos[requisicao.sequencia] && requisicao.campos[requisicao.sequencia]['dadosProfissionais'] ? requisicao.campos[requisicao.sequencia]['dadosProfissionais'] : null;
    let dadosEndereco = requisicao.campos[requisicao.sequencia] && requisicao.campos[requisicao.sequencia]['dadosEndereco'] ? requisicao.campos[requisicao.sequencia]['dadosEndereco'] : null;
    let dadosEnderecoComercial = requisicao.campos[requisicao.sequencia] && requisicao.campos[requisicao.sequencia]['dadosEnderecoComercial'] ? requisicao.campos[requisicao.sequencia]['dadosEnderecoComercial'] : null;
    let dadosEnderecoCobranca = requisicao.campos[requisicao.sequencia] && requisicao['enderecoCobranca'];

    let dadosResponsavel = requisicao.campos[requisicao.sequencia] && requisicao.campos[requisicao.sequencia]['dadosRepresentanteLegal'] ? requisicao.campos[requisicao.sequencia]['dadosRepresentanteLegal'] : null;

    let dependente = requisicao.campos[requisicao.sequencia] && requisicao.campos[requisicao.sequencia]['dependente'] ? requisicao.campos[requisicao.sequencia]['dependente'] : null;

    if (dadosPessoaisMenor && dadosComplementares) {
      let titular = await alterar_proposta.AtualizarTitular(requisicao.cpf, requisicao.nrProposta, dadosPessoaisMenor, dadosComplementares)
      validacao.existsOrError(titular, "Ocorreu um erro ao salvar nó de titular");
    }

    if (dadosPessoaisTitular && dadosComplementares) {
      let titular = await alterar_proposta.AtualizarTitular(requisicao.cpf, requisicao.nrProposta, dadosPessoaisTitular, dadosComplementares)
      validacao.existsOrError(titular, "Ocorreu um erro ao salvar nó de titular");
    }

    if (dadosEndereco) {
      let endereco = await alterar_proposta.AtualizarEnderecoResidencial(requisicao.nrProposta, dadosEndereco)
      validacao.existsOrError(endereco, "Ocorreu um erro ao salvar nó de endereço");
    }

    if (dadosEnderecoComercial) {
      let enderecoComercial = await alterar_proposta.AtualizarEnderecoComercial(requisicao.nrProposta, dadosEnderecoComercial)
      validacao.existsOrError(enderecoComercial, "Ocorreu um erro ao salvar nó de endereço comercial");
    }
    else {
      await alterar_proposta.DesvincularEnderecoComercial(requisicao.nrProposta);
    }

    if (dadosEnderecoCobranca) {
      let enderecoCobranca = await alterar_proposta.AtualizarEnderecoCobranca(requisicao.nrProposta, dadosEnderecoCobranca)
    }

    if (dadosPossuiPlano) {
      let possuiPlano = await alterar_proposta.AtualizarOperadoraCongenere(requisicao.nrProposta, dadosPossuiPlano)
    }

    if (dadosResponsavel) {
      let responsavelLegal = await alterar_proposta.AtualizarResponsavelLegal(requisicao.nrProposta, dadosResponsavel)
      validacao.existsOrError(responsavelLegal, "Ocorreu um erro ao salvar nó de responsável legal");
    }

    if (dependente) {
      let dependentes = await alterar_proposta.AtualizarDependente(requisicao.nrProposta, dependente)
      validacao.existsOrError(dependentes, "Ocorreu um erro ao salvar nós de dependentes");
    }


    res.send(204);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}



exports.AtualizarSequencia = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    var sequencia = await alterar_proposta.AtualizarSequencia(requisicao.nrProposta, requisicao.sequencia);
    validacao.existsOrError(sequencia, "Erro ao atualizar sequência do cadastro");
    res.send(204)
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

exports.AtualizarStatus = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);
    let newStatus = await _atualizarStatus(requisicao);
    validacao.existsOrError(newStatus, "Erro ao atualizar status da proposta");
    await inserirStatus(requisicao.nrProposta, requisicao.novoStatus);
    res.send(204)
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

async function _atualizarStatus(requisicao) {
  var data = new Date().toLocaleDateString();
  var time = new Date().toLocaleTimeString();
  let arrStatus = [];
  for (let el in _enum.statusProposta._enumMap) {
    arrStatus.push(_enum.statusProposta._enumMap[el]);
  }

  let stIndex = arrStatus.findIndex(s => {
    return s == requisicao.novoStatus;
  })

  if (stIndex < 0)
    throw "Status inválido";

  var cql = queriesCql.cql.cqlAtualizarStatusProposta
    .replace('@NrProposta', requisicao.nrProposta)
    .replace('@NovoStatus', requisicao.novoStatus)
    .replace('@DataAlteracao', data + ' ' + time);

  return await executeCypherAsync(cql);
}
//#endregion


//###########################################################################
// Função que valida os Parâmetros de Entrada de Responsável Financeiro #
//###########################################################################
exports.validarResponsavelFinanceiro = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)
    validacao.existsOrError(requisicao.NrProposta, "O Número da Proposta deve ser informado.");
    validacao.existsOrError(requisicao.Nome, "O Nome Completo do Responsável Financeiro deve ser informado.");
    validacao.existsOrError(requisicao.cpf, "O CPF deve ser informado.");
    validacao.existsOrError(requisicao.telefone, "O telefone de contato do Responsável Financeiro deve ser informado.");
    validacao.validarCPF(requisicao.cpf, 'CPF inválido.');
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

exports.IncluirResponsavelFinanceiro = async function (req, res, next) {
  try {
    var requisicao = req.body;

    await desativarResponsavelFinanceiroProposta(requisicao.NrProposta);

    var cql = queriesCql.cql.cqlIncluirResponsavelFinanceiro
      .replace('@NrProposta', requisicao.NrProposta)
      .replace('@Nome', requisicao.Nome)
      .replace('@cpf', requisicao.cpf)
      .replace('@telefone', requisicao.telefone)
    var retorno = await executeCypherAsync(cql);

    if (retorno == undefined || retorno == null || retorno == "")
      res.send(400, { message: "Responsável Financeiro não cadastrado!" });
    else
      res.send(204);
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

async function desativarResponsavelFinanceiroProposta(NrProposta) {
  var data = new Date().toLocaleDateString();
  var time = new Date().toLocaleTimeString();
  var cql = queriesCql.cql.cqlDesativarResponsavelFinanceiroProposta;
  cql = cql.replace('@NrProposta', NrProposta)
  cql = cql.replace('@DataAlteracao', data + ' ' + time)
  var retorno = await executeCypherAsync(cql);
  return retorno;
}


//#region "Métodos para inclusão de vigência na proposta "
exports.validarVigencia = async function (req, res, next) {
  try {

    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    validacao.existsOrError(requisicao.nrProposta, "O número da proposta deve ser informado.");
    validacao.existsOrError(requisicao.dataVigencia, "A data da vigência deve ser informada.");
    validacao.validarDataISO(requisicao.dataVigencia, "Formato de data incorreto. Exemplo: 2019-09-27");

    next();
  } catch (err) {
    var msg = err.message || err;
    res.send(400, { message: msg });
  }
}

exports.atualizarVigencia = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    var cql = queriesCql.cql.cqlIncluirVigencia
      .replace('@nrProposta', requisicao.nrProposta)
      .replace('@dataVigencia', requisicao.dataVigencia);

    const retorno = await executeCypherAsync(cql);
    if (retorno)
      res.send(201, { message: "Data de vigência incluída na proposta com sucesso." });
    else
      throw "Não foi possível incluir a data de vigência na proposta."

  } catch (error) {
    res.send(400, { message: error });
  }

}

// 
// Função para calcular a idade a partir de uma data: '2018-07-18'
//
let obterDescricaoAcaoStatus = async function (nrProposta, status) {
  let descricao = '';
  let acao = '';
  let historico = [];

  let _historico = await consultarHistoricoStatusProposta(nrProposta);
  let _pendencias = await consultarPendenciasProposta(nrProposta);

  _historico.forEach(h => {
    switch (parseInt(h.status)) {
      case _enum.statusProposta.EM_PREENCHIMENTO.value:
        historico.push({
          titulo: _historico.length > 1 ? "Formulário preenchido" : "Formulário em preenchimento",
          descricao: "",
          data: h.dataInclusao,
          dataFormatado: h.dataFormatada,
          status: h.status
        })
        break;
      case _enum.statusProposta.PENDENTE_PREENCHIMENTO.value:
        historico.push({
          titulo: "Informações pendentes",
          descricao: "Clique no botão abaixo e veja as pendências necessárias para prosseguir",
          data: h.dataInclusao,
          dataFormatado: h.dataFormatada,
          status: h.status
        });
        break;
      case _enum.statusProposta.EM_ANALISE.value:
        historico.push({
          titulo: "Em análise",
          descricao: "Estamos verificando as informações. Fique atento(a) ao seu email para qualquer atualização",
          data: h.dataInclusao,
          dataFormatado: h.dataFormatada,
          status: h.status
        });
        break;
      case _enum.statusProposta.PENDENTE_ANALISE.value:

        let listaDescricoes = `Após análise, identificamos os seguintes itens:\n`;
        listaDescricoes += `<ul>`;
        _pendencias.forEach(pen => {
          if (pen.descricao)
            listaDescricoes += `<li>${pen.descricao.toLowerCase()}</li>`
        });
        listaDescricoes += `</ul>`;
        historico.push({
          titulo: "Informações pendentes",
          descricao: listaDescricoes,
          data: h.dataInclusao,
          dataFormatado: h.dataFormatada,
          status: h.status
        });
        break;
      case _enum.statusProposta.ACEITA.value:
        historico.push({
          titulo: "Pedido aceito", descricao: `
          <p style="margin: 0;">Links úteis para você:</p>
          <ul>
           <li><a style="color: #004071;" href="/" target="_blank">Contrato</a></li>
           <li><a style="color: #004071;" href="/" target="_blank">Contrato</a></li>
           <li><a style="color: #004071;" href="/" target="_blank">GLC (Guia de Leitura Contratual)</a></li>
           <li><a style="color: #004071;" href="/" target="_blank">Manual do Beneficiário</a></li>
          </ul>
          `,
          infos: [
            { titulo: "Guia de boas-vindas", descricao: `A partir de questionamentos comuns de nossos novos clientes, desenvolvemos um guia com informações práticas. <a style="color: #004071;" href="/" target="_blank">Acesse aqui</a>` },
            { titulo: "", descricao: `Caso deseje falar sobre a sua proposta, acesse o <a style="color: #004071;" href="/" target="_blank">Portal do Cliente</a>` }
          ], data: h.dataInclusao,
          dataFormatado: h.dataFormatada,
          status: h.status
        });

        break;
      case _enum.statusProposta.CANCELADA.value:
        historico.push({
          titulo: "Proposta cancelada",
          descricao: "",
          data: h.dataInclusao,
          dataFormatado: h.dataFormatada,
          status: h.status
        });
        break;
      case _enum.statusProposta.NEGADA.value:
        historico.push({
          titulo: "Proposta cancelada",
          descricao: "Favor entrar em contato com os nosso consultores para mais informações.",
          data: h.dataInclusao,
          dataFormatado: h.dataFormatada,
          status: h.status
        });
        break;
      default:
        break;
    }
  });

  switch (parseInt(status)) {
    case _enum.statusProposta.EM_PREENCHIMENTO.value:
      descricao = 'Em preenchimento';
      acao = "Finalizar Preenchimento";
      break;
    case _enum.statusProposta.PENDENTE_PREENCHIMENTO.value:
      descricao = 'Pendente';
      acao = "Resolver Pendência";
      break;
    case _enum.statusProposta.EM_ANALISE.value:
      descricao = 'Em Análise';
      acao = "Detalhes da Proposta";
      break;
    case _enum.statusProposta.PENDENTE_ANALISE.value:
      descricao = 'Devolvida (Pendente)';
      acao = "Resolver Pendência";
      break;
    case _enum.statusProposta.ACEITA.value:
      descricao = 'Aceita';
      acao = "Detalhes da Proposta";
      break;
    case _enum.statusProposta.CANCELADA.value:
      descricao = 'Cancelada';
      acao = "Detalhes da Proposta";
      break;
    case _enum.statusProposta.CANCELADA.value:
      descricao = 'Cancelada';
      acao = "Detalhes da Proposta";
      break;
    case _enum.statusProposta.CANCELADA.value:
      descricao = 'Negada';
      acao = "Detalhes da Proposta";
      break;
    default:
      descricao = 'Indefinido';
      acao = 'Indefinido';
      break;
  }

  return { nrProposta: nrProposta, descricao: descricao, acao: acao, historico: historico };
}

async function inserirStatus(nrProposta, status) {
  var cql = queriesCql.cql.cqlIncluirStatusHistorico;
  cql = cql.split('@nrProposta').join(nrProposta)
  cql = cql.split('@status').join(status)
  cql = cql.split('@dataInclusao').join(moment().format())
  let data = moment().format('lll');
  cql = cql.replace('@dataFormatada', data)
  return await executeCypherAsync(cql);
}
async function consultarHistoricoStatusProposta(nrProposta) {
  var cql = queriesCql.cql.cqlConsultarStatusProposta;
  cql = cql.split('@nrProposta').join(nrProposta)
  let status = await executeCypherAsync(cql);
  status = status ? status : [];
  status.sort((a, b) => {
    return new Date(a.dataInclusao) - new Date(b.dataInclusao);
  });
  return status;
}

async function consultarPendenciasProposta(nrProposta) {
  var cql = queriesCql.cql.cqlConsultarPendenciasProposta;
  cql = cql.split('@nrProposta').join(nrProposta)
  let pendencias = await executeCypherAsync(cql);

  return pendencias;
}

exports.CancelarProposta = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    if (!requisicao.nrProposta)
      return res.send(400, { message: 'Número da proposta não informada.' });

    if (!requisicao.justificativa)
      return res.send(400, { message: 'Justificativa não informada.' });

    var cql = queriesCql.cql.cqlCancelarProposta
      .replace('@nrProposta', requisicao.nrProposta)
      .replace('@justificativa', requisicao.justificativa);
    const proposta = await executeCypherAsync(cql);
    validacao.existsOrError(proposta, "Erro ao proposta");

    requisicao.novoStatus = _enum.statusProposta.CANCELADA.value;
    let newStatus = await _atualizarStatus(requisicao);
    validacao.existsOrError(newStatus, "Erro ao atualizar status da proposta");
    await inserirStatus(requisicao.nrProposta, requisicao.novoStatus);

    res.send(201, { message: "Proposta cancelada" });
  } catch (error) {
    res.send(400, { message: error });
  }

}
//#endregion