'use strict'
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const validacao = require('./api_validation');

const precosController = require("../../api-precos/controller/api_controller");
const redeController = require("../../api-rede-resumida/controller/api_controller");

//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql, base = config.neo4j_driver) {

  let driver = neo4j.default.driver(
    base.url_bolt,
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
    return null;

}

//#region "Validações"
exports.validarVigencias = async function (req, res, next) {
  try {
    const requisicao = req.params;
    validacao.existsOrError(requisicao.id, "É necessário informar o ID do Produto.");
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}
exports.validarPlanos = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);
    validacao.existsOrError(requisicao.entidade, "A entidade de classe deve ser informada.");
    validacao.existsOrError(requisicao.uf, "A sigla do Estado deve ser informada.");
    validacao.existsOrError(requisicao.cidade, "A Cidade deve ser informada.");
    requisicao.datanascimento.forEach(function (data, index) {
      validacao.validarDataNascimento(data, 0, 101, "Data de Nascimento do dependente " + (index + 1) + " é inválida.");
    });
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}
//#endregion


exports.listarVigencias = async function (req, res, next) {
  try {
    var data = new Date();
    var cql = queriesCql.cql.cqlListarVigencias;
    cql = cql.replace('@ID', req.params.id)
      .replace('@FILIAL', config.filial)
      .replace('@DATA_ATUAL', data.getTime())
      .replace('@QUANTIDADE', config.quantidade);

    var result = await executeCypherAsync(cql, config.neo4j_driver_estatica);

    if (result.length == 0)
      res.send(404, 'Não foram encontradas datas de vigência para o plano informado.');

    res.send(200, result);
  }
  catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

exports.listarPlanos = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    var cql = queriesCql.cql.cqlListarPlanos;
    cql = cql.replace('@Entidade', requisicao.entidade);
    cql = cql.replace('@uf', requisicao.uf);
    cql = cql.replace('@cidade', requisicao.cidade);
    let planos = await executeCypherAsync(cql, config.neo4j_driver_estatica);

    var caminhoImagens = config.caminhoImagens;

    if (planos.total != 0) {

      var idplanos = planos.plano.map(plano => plano.id);
      var idplanos_sinf = planos.plano.map(plano => plano.idplanos[0].identificadorSinf); //Usar o primeiro código do Sinf 
      var codigos_ans = planos.plano.map(plano => plano.codigoans);

      var idades = [];
      requisicao.datanascimento.forEach(datanascimento => {
        idades.push(obterIdade(datanascimento));
      });

      let data = obterData();
      planos = await ConsultarOrdenacaoOperadora(planos);
      var precos = await precosController.listarPrecos(idplanos, idades, requisicao.entidade, data, idplanos_sinf);
      var rede_referencia = await redeController.listarRedePorPlanos(idplanos);
      const retorno = criarRetorno(planos, precos, rede_referencia, caminhoImagens);

      res.send(200, retorno);
    }
    else {
      res.send(404, { message: 'Não foram encontrados planos com a pesquisa informada.' });
    }
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

exports.listarPlanoProposta = async function (requisicao) {
  try {

    var cql = queriesCql.cql.cqlListarPlanos;
    cql = cql.replace('@Entidade', requisicao.entidade);
    cql = cql.replace('@uf', requisicao.uf);
    cql = cql.replace('@cidade', requisicao.cidade);
    let planos = await executeCypherAsync(cql, config.neo4j_driver_estatica);

    var caminhoImagens = config.caminhoImagens;

    if (planos.total == 0 || !planos.plano) return [];

    planos.plano = planos.plano.filter(p => {
      return p.id == requisicao.planoId && p.idplanos[0].identificadorSinf == requisicao.planoIdSinf
    });

    if (planos.plano.length == 0) return [];

    var idplanos = planos.plano.map(plano => plano.id);
    var idplanos_sinf = planos.plano.map(plano => plano.idplanos[0].identificadorSinf); //Usar o primeiro código do Sinf 
    var codigos_ans = planos.plano.map(plano => plano.codigoans);

    var idades = [];
    requisicao.datanascimento.forEach(datanascimento => {
      idades.push(obterIdade(datanascimento));
    });

    let data = obterData();
    var precos = await precosController.listarPrecos(idplanos, idades, requisicao.entidade, data, idplanos_sinf);
    var rede_referencia = await redeController.listarRedePorPlanos(codigos_ans);
    const retorno = criarRetorno(planos, precos, rede_referencia, caminhoImagens, true);

    return retorno && retorno.planos && retorno.planos[0] ? retorno.planos[0] : null;
  } catch (error) {
    throw error;
  }
};
//
// Função para integrar as informações calculadas
//
let criarRetorno = function (planos, precos, redes_referencia, caminhoImagens, isPainelCliente) {
  var retorno = [];
  planos.plano.forEach(plano => {
    var preco_selecionado = [];
    precos.forEach(preco => {
      if (plano.id == preco.idplano) {
        var preco_total = 0.0;
        preco.precos.forEach(valor => {
          valor.preco = parseFloat(valor.preco).toFixed(2);
          preco_total += parseFloat(valor.preco);
        });
        preco_selecionado = { total: preco_total.toFixed(2), precos: preco.precos };
      }
    });

    var rede_referencia;
    var total_rede_referencia = [];
    redes_referencia.forEach(rede => {
      if (rede.IdPlano == plano.id) {
        rede_referencia = rede.RedeReferenciada;
        var total = {};
        Object.assign(total, { Total: rede.totalRedeReferenciada.total })
        Object.assign(total, { 'Hospital': rede.totalRedeReferenciada.lista.Hospital })
        Object.assign(total, { 'Laboratório': rede.totalRedeReferenciada.lista.Laboratório })
        Object.assign(total, { 'Maternidade': rede.totalRedeReferenciada.lista.Maternidade })
        Object.assign(total, { 'Pronto Socorro': rede.totalRedeReferenciada.lista.Pronto_Socorro })

        total_rede_referencia.push(total);
      }

    });

    retorno.push(
      {
        id: plano.id,
        idplano_sinf: plano.idplanos[0].identificadorSinf, //Usar o primeiro idplano para consultar no SINF
        plano: plano.nome_amigavel == '' ? plano.nome : plano.nome_amigavel,
        coparticipacao: plano.coparticipacao,
        reembolso: plano.reembolso ? true : false,
        codigo_ans: plano.codigoans,
        nome_plano_ans: plano.nomePlanoAns ? plano.nomePlanoAns : '',
        operadora: plano.operadora,
        operadoraOrdem: plano.operadoraOrdem,
        operadoraLogo: caminhoImagens + plano.operadoraLogo + '_logo.jpg',
        abrangencia: plano.abrangencia,
        tipo_acomodacao: plano.acomodacao,
        segmentacao: plano.segmentacao,
        nivel: plano.nivel,
        precos: preco_selecionado,
        rede_referencia: rede_referencia,
        total_rede_referencia: total_rede_referencia[0]
      }
    );
  });


  if (!isPainelCliente) {
    var sortedList = [];
    var x, s, si;

    for (x = 0; x < retorno.length; x++) {
      if (retorno.filter(p => p.operadoraOrdem == x).length > 0)
        sortedList.push(retorno.filter(p => p.operadoraOrdem == x).sort((a, b) => (Number(a.precos.total) > Number(b.precos.total)) ? 1 : -1));
    }

    retorno = [];

    for (s = 0; s < sortedList.length; s++) {
      for (si = 0; si < sortedList[s].length; si++) {
        retorno.push(sortedList[s][si]);
      }
    }
  }


  return { total: planos.total, planos: retorno };
}

// 
// Método para verificar se o plano está suspenso
//
exports.validarSituacaoPlano = async function (req, res, next) {
  try {

    const cql = queriesCql.cql.cqlConsultarSituacaoANS
      .replace('@ID', req.params.id);

    const result = await executeCypherAsync(cql, config.neo4j_driver_estatica);

    if (!result)
      res.send(404, { message: 'Não foi encontrada situação para o plano informado.' });

    res.send(200, { situacao: result });

  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

// 
// Função para calcular a idade a partir de uma data: '2018-07-18'
//
let obterIdade = function (data) {
  var hoje = new Date();
  var aniversario = new Date(data);
  var age = hoje.getFullYear() - aniversario.getFullYear();
  var m = hoje.getMonth() - aniversario.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < aniversario.getDate())) {
    age--;
  }
  return age;
}

let obterData = function () {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  return [year, month, day].join('-');
}

// função para ordenar os planos
async function ConsultarOrdenacaoOperadora(lstPlanos) {
  var lstPlanosOrdenada = [];
  var query = queriesCql.cql.cqlOrdenacaoOperadoras;
  var ordenacao = await executeCypherAsync(query, config.neo4j_driver);
  var p, o;

  if (!(ordenacao == undefined || ordenacao == null || ordenacao.length == 0)) {
    for (p = 0; p < lstPlanos.plano.length; p++) {
      for (o = 0; o < ordenacao.length; o++) {
        if (lstPlanos.plano[p].operadora.toUpperCase() == ordenacao[o].nomeFantasia.toUpperCase()) {
          lstPlanos.plano[p].operadoraOrdem = ordenacao[o].ordem;
          break;
        }
      }
    }
  }

  return lstPlanos;
}