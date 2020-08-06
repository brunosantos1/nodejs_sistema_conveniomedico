var axios = require("axios");
const queriesCql = require("./api_cql");
const config = require("./api_config.js");
const { db, core } = config;
const _enum = require("../../api-contratacao/controller/api_enum");
const moment = require('moment');
moment.locale("pt-br");
//
// Método privado genérico para execução de cypher query.
//
// async function executeCypherAsync(cql) {
//     let driver = neo4j.default.driver(
//       config.neo4j_driver.url_bold,
//       config.neo4j_driver.auth,
//       { disableLosslessIntegers: true }
//     );
//     let session = driver.session();
//     var result = await session.run(cql, null);

//     session.close();
//     driver.close();
// 	if (result && result.records && result.records.length > 0 && result.records[0]._fields && result.records[0]._fields.length > 0)
// 		return result.records[0]._fields[0];
// 	else
// 		return {}
// }

exports.importarProposta = async function (req, res, next) {
  try {
    var payload =
    {
      evento:
      {
        o_que: "E-commerce Integrar Propostas",
        dados: { idproposta: 101012 }
      }
    }
    //TODO: Enviar o ID da Proposta
    const ret = await criarEventoCore(payload);
    res.send(ret.statusText);
  } catch (err) {
    res.send(err);
  }
}

async function criarEventoCore(payload) {
  try {
    return await axios({
      method: 'POST',
      baseURL: `${core.http_server}${core.resource_uri}`,
      url: `${core.http_server}${core.resource_uri}`,
      data: payload,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });

  } catch (err) {
    throw err;
  }
}

exports.statusAceitacao = async function () {
  try {
    let cql = '';
    cql = queriesCql.cql.cqlConsultarPropostas;
    let propostasEcommerce = await db.execute({ cypher: cql, params: {} });

    var promises = [];
    propostasEcommerce.forEach(p => {
      let nrProposta = p.dados && p.dados.nrProposta && !isNaN(parseInt(p.dados.nrProposta)) ? parseInt(p.dados.nrProposta) : null;
      cql = queriesCql.cql.cqlConsultarPropostasAceitacao;
      cql = cql.split('$nrProposta').join(nrProposta)
      promises.push(db.execute({ cypher: cql, params: {} }));
    });
    let propostasAceitacao = await Promise.all(promises);
    let propostas = await _mapPropostas(propostasAceitacao);
    await _atualizaPropostas(propostas);
  } catch (err) {
    console.log(err)
  }
}

let _mapPropostas = async function (propostasAceitacao) {
  try {
    let propostas = [];
    let cql = '';
    propostasAceitacao.forEach(n1 => {
      n1.forEach(n2 => {
        let idxExist = propostas.findIndex(f => {
          return f.nrProposta == n2.dados.NroProposta
        });
        if (idxExist >= 0) {
          propostas[idxExist].descricoes.push(n2.dados)
        }
        else {
          propostas.push({
            nrProposta: n2.dados.NroProposta,
            statusAceitacao: n2.dados.statusGerencial,
            descricoes: [n2.dados]
          });
        }
      });
    });
    return propostas;
  } catch (error) {
    throw error;
  }
}

let _atualizaPropostas = async function (propostas) {
  try {
    var promises = [];
    propostas.forEach(p => {
      let status = p.statusAceitacao.toLowerCase();
      switch (status) {
        case 'Aceita com Intercorrência'.toLowerCase():
        case 'Aceita com Pendência'.toLowerCase():
        case 'Aceita sem Intercorrência'.toLowerCase():
        case 'Aceita sem Pendência'.toLowerCase():
          cql = queriesCql.cql.cqlAtualizarStatusProposta;
          promises.push(db.execute({ cypher: cql, params: { nrProposta: p.nrProposta.toString(), status: _enum.statusProposta.ACEITA.value.toString() } }));
          break;

        case 'Cancelada'.toLowerCase():
        case 'Cancelado'.toLowerCase():
          cql = queriesCql.cql.cqlAtualizarStatusProposta;
          promises.push(db.execute({ cypher: cql, params: { nrProposta: p.nrProposta.toString(), status: _enum.statusProposta.CANCELADA.value.toString() } }));
          break;

        case 'Devolvida ao Produtor'.toLowerCase():
        case 'Prévia Devolvida ao Produtor'.toLowerCase():
          let pendencias = [];
          let resolvidos = [];
          pendencias = p.descricoes.filter(f => {
            return f.dtFim == null || f.dtFim == undefined || f.dtFim == '';
          });
          resolvidos = p.descricoes.filter(f => {
            return f.dtFim != null && f.dtFim != undefined && f.dtFim != '';
          });

          pendencias.forEach(pendencia => {
            cql = queriesCql.cql.cqlInsereDevolutivasProposta;
            promises.push(db.execute({
              cypher: cql, params: {
                nrProposta: p.nrProposta.toString(),
                descricao: pendencia.descricao || '',
                dataInicio: pendencia.dtIni ? pendencia.dtIni.toString() : '',
                dataFim: pendencia.dtFim ? pendencia.dtFim.toString() : '',
                responsavel: pendencia.DS_TIPO_RESPONSAVEL_PENDENCIA || '',
                tipo: pendencia.DS_TIPO_RETORNO_IRREGULARIDADE || '',
                ativo: true
              }
            }));
          });

          resolvidos.forEach(pendencia => {
            cql = queriesCql.cql.cqlInsereDevolutivasProposta;
            promises.push(db.execute({
              cypher: cql, params: {
                nrProposta: p.nrProposta.toString(),
                descricao: pendencia.descricao || '',
                dataInicio: pendencia.dtIni ? pendencia.dtIni.toString() : '',
                dataFim: pendencia.dtFim ? pendencia.dtFim.toString() : '',
                responsavel: pendencia.DS_TIPO_RESPONSAVEL_PENDENCIA || '',
                tipo: pendencia.DS_TIPO_RETORNO_IRREGULARIDADE || '',
                ativo: false
              }
            }));
          });

          cql = queriesCql.cql.cqlCriaNoDevolutivasProposta;
          promises.push(db.execute({ cypher: cql, params: { nrProposta: p.nrProposta.toString() } }));
          cql = queriesCql.cql.cqlDeletaDevolutivasProposta;
          promises.push(db.execute({ cypher: cql, params: { nrProposta: p.nrProposta.toString() } }));

          let novoStatus = _enum.statusProposta.PENDENTE_ANALISE.value.toString();

          cql = queriesCql.cql.cqlAtualizarStatusProposta;
          promises.push(db.execute({ cypher: cql, params: { nrProposta: p.nrProposta.toString(), status: novoStatus } }));

          cql = queriesCql.cql.cqlIncluirStatusHistorico;
          let dataFormatada = moment().format('lll');
          let dataInclusao = moment().format();
          promises.push(db.execute({ cypher: cql, params: { nrProposta: p.nrProposta.toString(), status: novoStatus, dataInclusao: dataInclusao, dataFormatada: dataFormatada } }));
          break;

        case 'Não Recomendada'.toLowerCase():
        case 'Não Recomendada Adm'.toLowerCase():
        case 'Não Recomendada Técnica'.toLowerCase():
        case 'Prévia Não Recomendada'.toLowerCase():
        case 'Prévia Não Recomendada Adm'.toLowerCase():
        case 'Prévia Não Recomendada Técnica'.toLowerCase():
          cql = queriesCql.cql.cqlAtualizarStatusProposta;
          promises.push(db.execute({ cypher: cql, params: { nrProposta: p.nrProposta.toString(), status: _enum.statusProposta.NEGADA.value.toString() } }));
          break;
        default:
          break;
      }
    });
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
}