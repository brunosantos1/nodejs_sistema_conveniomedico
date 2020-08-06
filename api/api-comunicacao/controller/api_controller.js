const config = require("./api_config.js");
const fs = require('fs');
const constantGanchos = require("./api-ganchos-wp.js");
const queriesCql = require("./api_cql");
const validacao = require('./api_validation');
const axios = require("axios");
const moment = require("moment");
const integracao = require("./api_request.js");
const { promisify } = require('util');
const appendAsync = promisify(fs.appendFile);
const readFileAsync = promisify(fs.readFile);


const { db, db_estatica, gravitee, configEnvio } = config;
const { ganchosEmailWP, ganchosSMSWP } = constantGanchos;

let ganchos = [];
let emails = [];
let smss = [];

let emailsEnviados = [];
let smssEnviados = [];
let emails_erros = [];
let smss_erros = [];
let erros_consulta = [];
let erros_genericos = [];
//#region "Manual - Quando for necessário uma chamada manual do serviço"
exports.manual = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    await send();
    res.send(200, {
      emails: {
        totalEnviados: emailsEnviados.length,
        totalErros: emails_erros.length,
        enviados: emailsEnviados,
        erros: emails_erros
      },
      sms: {
        totalEnviados: smssEnviados.length,
        totalErros: smss_erros.length,
        enviados: smssEnviados,
        erros: smss_erros
      },
      errosConsulta: erros_consulta,
      errosGenericos: erros_genericos
    });
  } catch (error) {
    var msg = error.message || error;
    erros_genericos.push(error);
    res.send(400, { message: msg });
  }
}
//#endregion 

//#region "Job - Executado de forma automática de tempos em tempos"
exports.jobs = async function () {
  try {
    // let ganchos = await constultarGancho();
    console.log({
      assunto: 'Início job',
      data: new Date()
    });
    await send();
    console.log({
      assunto: 'Fim job',
      data: new Date()
    });
  } catch (error) {
    erros_genericos.push(error);
    logError();
  }

}
//#endregion

//#region "Default - Função principal responsável por chamar as funções de identificação e de envio"
let send = async function () {
  try {
    emails = [];
    smss = [];

    emailsEnviados = [];
    smssEnviados = [];
    emails_erros = [];
    smss_erros = [];
    erros_consulta = [];
    erros_genericos = [];
    ganchos = await _constultarGancho();

    var promises = [];
    promises.push(criarNoHistorico());

    promises.push(consultarCadastroRealizado());
    promises.push(consultarTokenFiliacao());
    promises.push(consultarDPSOperadora());
    promises.push(consultarDPSParticular());
    promises.push(consultarStatusAnalise());
    promises.push(consultarStatusPendenteAnalise());
    promises.push(consultarStatusAceita());
    promises.push(consultarStatusNegada());
    promises.push(consultarStatusCancelada());
    promises.push(consultarPendenciaPreenchimento());
    promises.push(consultarEmPreenchimento());


    await Promise.all(promises);

    var promisesSend = [];
    promisesSend.push(enviarEmails());
    promisesSend.push(enviarSMSS());
    await Promise.all(promisesSend);

    logError();
  } catch (error) {
    erros_genericos.push(error);
    logError();
    // throw error;
  }
}

let criarNoHistorico = async function () {
  try {
    const cql = queriesCql.cql.criarNoHistorico;
    await db.execute({ cypher: cql, params: {} });
  } catch (error) {
    erros_genericos.push(error);
    // throw error;
  }
}
//#endregion

//#region "Prepara Envio - Funções responsáveis por varrer os emails e smss"
let enviarEmails = async function () {
  try {
    var promises = [];
    emails.forEach(dados => {
      promises.push(_enviarEmail(dados));
    });
    await Promise.all(promises);
  } catch (error) {
    erros_genericos.push(error);
    // throw error;
  }
}

let enviarSMSS = async function () {
  try {
    var promises = [];
    smss.forEach(dados => {
      promises.push(_enviarSMSS(dados));
    });
    await Promise.all(promises);
  } catch (error) {
    erros_genericos.push(error);
    // throw error;
  }
}
//#endregion

//#region "Envio - Funções responsáveis por enviar os emails e smss em seus devidos provedores"
let _enviarEmail = async function (dados) {
  try {
    var data = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
    let postWP = await _constultarTemplate(dados.gancho);

    if (!postWP || !postWP.acf || !postWP.acf.qlc_comunicacao_template_email) throw 'Template do e-mail não encontrado';
    let body = postWP.acf.qlc_comunicacao_template_email;
    body = body.slice(0, body.lastIndexOf('</p>'));
    body = body.replace('<p>', '');
    let dadosEmail = {
      remetente: configEnvio.email.emailRemetente,
      destino: configEnvio.email.emailPadrao ? configEnvio.email.emailPadrao : dados.email,
      assunto: postWP && postWP.title && postWP.title.rendered ? postWP.title.rendered : configEnvio.email.assuntoPadrao,
      body: mapFields(body, dados)
    }

    await db.transaction(async function (execute, tx) {

      let cqlSQL = queriesCql.cql.sqlInsertTabelaEmails;
      cqlSQL = cqlSQL.split('$email').join(dadosEmail.destino)
      cqlSQL = cqlSQL.split('$remetente').join(dadosEmail.remetente)
      cqlSQL = cqlSQL.split('$assunto').join(dadosEmail.assunto)
      cqlSQL = cqlSQL.split('$body').join(dadosEmail.body)
      if (configEnvio.email.habilitado)
        await execute({ cypher: cqlSQL, params: {} });

      let cqlNEO4J = queriesCql.cql.inserirHistoricoEmail;
      await execute({ cypher: cqlNEO4J, params: { nrProposta: dados.nrProposta, dataHoraEnvio: data + " " + time, email: dadosEmail.destino, telefone: dados.telefone, assunto: dadosEmail.assunto, body: dadosEmail.body, gancho: dados.gancho } })

      await execute({ cypher: queriesCql.cql[dados.cql], params: dados.params });

      emailsEnviados.push(dados);
    });
  } catch (error) {
    emails_erros.push({ dados: dados, error: error });
    // throw error;
  }
}

let _enviarSMSS = async function (dados) {
  try {
    var data = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
    let postWP = await _constultarTemplate(dados.gancho);

    if (!postWP || !postWP.acf || !postWP.acf.qlc_comunicacao_template_sms) throw 'Template do sms não encontrado';

    let telefone = parseInt(dados.telefone.split("(").join("").split(")").join("").split("-").join("").trim())

    let dadosSMS = {
      telefone: configEnvio.sms.telefonePadrao ? configEnvio.sms.telefonePadrao : telefone,
      // mensagem: postWP.content.rendered,
      mensagem:  mapFields(postWP.acf.qlc_comunicacao_template_sms, dados)
    }

    await db.transaction(async function (execute, tx) {
      let cqlXML = queriesCql.cql.xmlSMS;
      cqlXML = cqlXML.split('$usuario').join(configEnvio.sms.header.usuario)
      cqlXML = cqlXML.split('$uid').join(configEnvio.sms.header.uid)
      cqlXML = cqlXML.split('$sistemaHeader').join(configEnvio.sms.header.sistema)
      cqlXML = cqlXML.split('$localidade').join(configEnvio.sms.header.localidade)
      cqlXML = cqlXML.split('$descricaoLote').join(configEnvio.sms.body.descricaoLote)
      cqlXML = cqlXML.split('$loginUsuario').join(configEnvio.sms.body.loginUsuario)
      cqlXML = cqlXML.split('$idModuloOrigem').join(configEnvio.sms.body.idModuloOrigem)
      cqlXML = cqlXML.split('$sistemaOrigem').join(configEnvio.sms.body.sistemaOrigem)
      cqlXML = cqlXML.split('$statusAtivo').join(configEnvio.sms.body.statusAtivo)
      cqlXML = cqlXML.split('$tipoLote').join(configEnvio.sms.body.tipoLote)


      cqlXML = cqlXML.split('$action').join(configEnvio.sms.urlEnviaMensagemAction)
      cqlXML = cqlXML.split('$data').join(moment().format("YYYY-MM-DD"))
      cqlXML = cqlXML.split('$telefone').join(dadosSMS.telefone)
      cqlXML = cqlXML.split('$mensagem').join(dadosSMS.mensagem)
      cqlXML = cqlXML.trim()

      if (configEnvio.sms.habilitado)
        await integracao.sendSMSPlusoft(cqlXML);

      let cqlNEO4J = queriesCql.cql.inserirHistoricoSMS;
      await execute({ cypher: cqlNEO4J, params: { nrProposta: dados.nrProposta, dataHoraEnvio: data + " " + time, email: dados.email, telefone: dadosSMS.telefone, body: dadosSMS.mensagem, gancho: dados.gancho } })

      await execute({ cypher: queriesCql.cql[dados.cql], params: dados.params });
      smssEnviados.push(dados);
    });
  } catch (error) {
    smss_erros.push({ dados: dados, error: error });
    // throw error;
  }
}
//#endregion

//#region "Consultas WP - Consultas na api do WordPress"

exports.constultarGanchoEmail = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    let lista = await _constultarGancho();
    res.send(200, lista);
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

exports.constultarTemplateEmail = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    ganchos = await _constultarGancho();

    let post = await _constultarTemplate(requisicao.gancho);
    res.send(200, post);
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

let _constultarGancho = async function () {
  try {
    let retorno = await axios.get(gravitee.url + "wp-acf/qlc_templates_email?per_page=1000");
    let retornoGanchos = retorno && retorno.data ? retorno.data : [];
    let lista = [];
    for (let index = 0; index < retornoGanchos.length; index++) {
      const item = retornoGanchos[index];
      if (!item.acf || !item.acf.qlc_email_gancho) break;
      item.acf.qlc_email_gancho.forEach(gancho => {
        let idxGanchos = lista.findIndex(f => {
          return f.nome == gancho
        });
        if (idxGanchos < 0) {
          lista.push({
            postId: item.id,
            nome: gancho
          })
        }
      });
    }
    return lista;
  } catch (error) {
    throw error;
  }
}

let _constultarTemplate = async function (gancho) {
  try {
    let idxExist = ganchos.findIndex(f => {
      return f.nome === gancho;
    })
    if (idxExist >= 0) {
      let id = ganchos[idxExist].postId;
      let retorno = await axios.get(gravitee.url + "wp-post/qlc_templates_email/" + id);
      return retorno && retorno.data ? retorno.data : {};
    }
    else return {};
  } catch (error) {
    throw error;
  }
}
//#endregion

//#region "Consultas NEO4J - Consultas na base de bados"

//•	Cadastro realizado na aplicação (E-Commerce)
let consultarCadastroRealizado = async function () {
  try {
    const cql = queriesCql.cql.consultarCadastro;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    // Filtro por dia
    dados = dados.filter(p => {
      return new Date(p.dataInicio) >= new Date().setDate(new Date().getDate() - configEnvio.quantidadeDiasAnteriores);
    })

    //Ordenação
    dados.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });
    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaCadastro';
      m.params = { nrProposta: m.nrProposta };
      m.gancho = ganchosEmailWP.CadastroRealizadoNaAplicacao;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaCadastro';
      s.params = { nrProposta: s.nrProposta };
      s.gancho = ganchosSMSWP.CadastroRealizadoNaAplicacao;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarCadastroRealizado', error: error });
    // throw error;
  }
}

//•	Envio de Token – na Filiação, enviar apenas SMS
let consultarTokenFiliacao = async function () {
  try {
    const cql = queriesCql.cql.consultarTokenFiliacao;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    //Ordenação
    dados.sort((a, b) => {
      return new Date(b.dataGeracao) - new Date(a.dataGeracao);
    });

    // Filtro por dia
    dados = dados.filter(p => {
      let dataGeracao = moment(p.dataGeracao);
      let dataAtual = moment(moment().format('YYYY-MM-DD')).subtract(configEnvio.quantidadeDiasAnteriores, 'days');
      let horaGeracao = moment(p.horaGeracao);
      let horaLimite = moment(p.horaLimite);

      let diferencaHoraLimite = horaLimite.diff(horaGeracao, 'minutes');
      diferencaHoraLimite = Math.abs(diferencaHoraLimite);
      let dataGeracaoHora = dataGeracao.set({ 'hour': horaGeracao.get('hour'), 'minute': horaGeracao.get('minute'), 'second': horaGeracao.get('second') });
      let dataValidade = dataGeracaoHora.add(diferencaHoraLimite, 'minutes')
      let dataAtualHora = moment();
      p.dataValidadeToken = dataValidade.format('DD/MM/YYYY hh:mm:ss');
      return dataGeracao >= dataAtual && dataValidade >= dataAtualHora;
    });

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarTokenFiliacao';
      s.params = { token: s.token };
      s.gancho = ganchosSMSWP.FiliacaoEnvioDeToken;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarTokenFiliacao', error: error });
    // throw error;
  }
}

//•	Opção de preenchimento por médico da Operadora
let consultarDPSOperadora = async function () {
  try {
    const cql = queriesCql.cql.consultarDPSOperadora;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    dados.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaDPS';
      m.params = { nrProposta: m.nrProposta };
      m.gancho = ganchosEmailWP.DPSPreenchimentoPorMedicoOperadora;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaDPS';
      s.params = { nrProposta: s.nrProposta };
      s.gancho = ganchosSMSWP.DPSPreenchimentoPorMedicoOperadora;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarDPSOperadora', error: error });
    // throw error;
  }
}

//•	Opção de preenchimento por médico próprio 
let consultarDPSParticular = async function () {
  try {
    const cql = queriesCql.cql.consultarDPSParticular;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    // Filtro por dia
    dados.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaDPS';
      m.params = { nrProposta: m.nrProposta };
      m.gancho = ganchosEmailWP.DPSPreenchimentoPorMedicoProprio;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaDPS';
      s.params = { nrProposta: s.nrProposta };
      s.gancho = ganchosSMSWP.DPSPreenchimentoPorMedicoProprio;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarDPSParticular', error: error });
    // throw error;
  }
}

//•	Pendência de preenchimento
let consultarPendenciaPreenchimento = async function () {
  try {
    const cql = queriesCql.cql.consultarPendenciaPreenchimento;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    // Ordenação
    dados.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

    // Filtro por dia
    dados = dados.filter(p => {
      return new Date(p.dataInicio) >= new Date().setDate(new Date().getDate() - configEnvio.quantidadeDiasAnteriores);
    })

    // Filtro por dia
    dados = dados.filter(p => {
      let isValid = false;

      if ((p._sendProximaDataPendenciaPreenchimento && !p._countSendProximaDataPendenciaPreenchimento) || (p._countSendProximaDataPendenciaPreenchimento && p._countSendProximaDataPendenciaPreenchimento <= configEnvio.quantidadeLimiteIntervalo)) {
        let dataProximoEnvio = moment(p._sendProximaDataPendenciaPreenchimento);
        let dataAtual = moment();
        let dia = dataProximoEnvio.get('date');
        let mes = dataProximoEnvio.get('month');
        let ano = dataProximoEnvio.get('year');
        let hora = dataProximoEnvio.get('hour');
        let minuto = dataProximoEnvio.get('minute');
        let diaAtual = moment().get('date');
        let mesAtual = moment().get('month');
        let anoAtual = moment().get('year');
        let horaAtual = moment().get('hour');
        let minutoAtual = moment().get('minute');
        isValid = (ano == anoAtual && mes == mesAtual && diaAtual == dia && hora == horaAtual) ? true : false;
        if (!isValid && dataProximoEnvio < dataAtual) {
          isValid = true;
        }
      }
      else {
        isValid = true;
      }

      return isValid;
    });

    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaPendenciaPreenchimento';
      m.params = {
        nrProposta: m.nrProposta,
        data: moment().add(configEnvio.intervalo, configEnvio.tipoIntervalo).format('YYYY-MM-DD HH:mm:ss'),
        qtdEnvio: m._countSendProximaDataPendenciaPreenchimento + 1
      };
      m.gancho = m.dataVigencia ? ganchosEmailWP.PendenciaDePreenchimentoComVigencia : ganchosEmailWP.PendenciaPreenchimento;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaPendenciaPreenchimento';
      s.params = {
        nrProposta: s.nrProposta,
        data: moment().add(configEnvio.intervalo, configEnvio.tipoIntervalo).format('YYYY-MM-DD hh:mm:ss'),
        qtdEnvio: s._countSendProximaDataPendenciaPreenchimento + 1
      };
      s.gancho = s.dataVigencia ? ganchosSMSWP.PendenciaDePreenchimentoComVigencia : ganchosSMSWP.PendenciaPreenchimento;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarPendenciaPreenchimento', error: error });
    // throw error;
  }
}

//•	Em de preenchimento
let consultarEmPreenchimento = async function () {
  try {
    const cql = queriesCql.cql.consultarEmPreenchimento;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    //Ordenação
    dados.sort((a, b) => {
      return new Date(b.dataAlteracao) - new Date(a.dataAlteracao);
    });

    // Filtro por dia
    dados = dados.filter(p => {
      return p.dataAlteracao && new Date(p.dataAlteracao) >= new Date().setDate(new Date().getDate() - 1);
    });

    // Filtro com logíca de intervalo
    dados = dados.filter(p => {
      let isValid = false;

      if ((p.dataAlteracao && !p._countSendProximaDataEmPreenchimento) || (p.dataAlteracao && p._countSendProximaDataEmPreenchimento <= configEnvio.quantidadeLimiteIntervalo)) {
        let dataProximoEnvio = moment(p.dataAlteracao).add(configEnvio.intervalo, configEnvio.tipoIntervalo);
        let dataAtual = moment();
        let dia = dataProximoEnvio.get('date');
        let mes = dataProximoEnvio.get('month');
        let ano = dataProximoEnvio.get('year');
        let hora = dataProximoEnvio.get('hour');
        let minuto = dataProximoEnvio.get('minute');
        let diaAtual = moment().get('date');
        let mesAtual = moment().get('month');
        let anoAtual = moment().get('year');
        let horaAtual = moment().get('hour');
        let minutoAtual = moment().get('minute');
        isValid = (ano == anoAtual && mes == mesAtual && diaAtual == dia && hora == horaAtual) ? true : false;
        // if (!isValid && dataProximoEnvio < dataAtual) {
        //   isValid = true;
        // }
      }

      return isValid;
    });

    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaEmPreenchimento';
      m.params = {
        nrProposta: m.nrProposta,
        data: moment().add(configEnvio.intervalo, configEnvio.tipoIntervalo).format('YYYY-MM-DD HH:mm:ss'),
        qtdEnvio: m._countSendProximaDataEmPreenchimento + 1
      };
      m.gancho = ganchosEmailWP.ContinuarPreenchimentoProposta;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaEmPreenchimento';
      s.params = {
        nrProposta: s.nrProposta,
        data: moment().add(configEnvio.intervalo, configEnvio.tipoIntervalo).format('YYYY-MM-DD hh:mm:ss'),
        qtdEnvio: s._countSendProximaDataEmPreenchimento + 1
      };
      s.gancho = ganchosSMSWP.ContinuarPreenchimentoProposta;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarPendenciaPreenchimento', error: error });
    // throw error;
  }
}

//•	Proposta em análise pela Aceitação
let consultarStatusAnalise = async function () {
  try {
    const cql = queriesCql.cql.consultarStatusAnalise;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    dados.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaStatusAnalise';
      m.params = { nrProposta: m.nrProposta };
      m.gancho = ganchosEmailWP.PropostaEmAnalisePelaAceitacao;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaStatusAnalise';
      s.params = { nrProposta: s.nrProposta };
      s.gancho = ganchosSMSWP.PropostaEmAnalisePelaAceitacao;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarStatusAnalise', error: error });
    // throw error;
  }
}

//•	Devolução da proposta pela Aceitação
let consultarStatusPendenteAnalise = async function () {
  try {
    const cql = queriesCql.cql.consultarStatusPendenteAnalise;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    dados.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaStatusPendenteAnalise';
      m.params = { nrProposta: m.nrProposta };
      m.gancho = ganchosEmailWP.PropostaDevolvidaPelaAceitacao;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaStatusPendenteAnalise';
      s.params = { nrProposta: s.nrProposta };
      s.gancho = ganchosSMSWP.PropostaDevolvidaPelaAceitacao;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarStatusPendenteAnalise', error: error });
    // throw error;
  }
}

//•	Proposta aceita (Sucesso/Boas Vindas)
let consultarStatusAceita = async function () {
  try {
    const cql = queriesCql.cql.consultarStatusAceita;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    dados.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaStatusAceita';
      m.params = { nrProposta: m.nrProposta };
      m.gancho = ganchosEmailWP.PropostaAceitaPelaAceitacao;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaStatusAceita';
      s.params = { nrProposta: s.nrProposta };
      s.gancho = ganchosSMSWP.PropostaAceitaPelaAceitacao;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarStatusAceita', error: error });
    // throw error;
  }
}

//•	Proposta negada
let consultarStatusNegada = async function () {
  try {
    const cql = queriesCql.cql.consultarStatusNegada;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    dados.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaStatusNegada';
      m.params = { nrProposta: m.nrProposta };
      m.gancho = ganchosEmailWP.PropostaNegadaPelaAceitacao;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaStatusNegada';
      s.params = { nrProposta: s.nrProposta };
      s.gancho = ganchosSMSWP.PropostaNegadaPelaAceitacao;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarStatusNegada', error: error });
    // throw error;
  }
}


//•	Proposta cancelada
let consultarStatusCancelada = async function () {
  try {
    const cql = queriesCql.cql.consultarStatusCancelada;
    var resposta = await db.execute({ cypher: cql, params: {} });
    let dados = resposta.length ? resposta[0].dados : [];

    dados.sort((a, b) => {
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

    let _emails = JSON.parse(JSON.stringify(dados));
    _emails.forEach(m => {
      m.cql = 'AtualizarPropostaStatusCancelada';
      m.params = { nrProposta: m.nrProposta };
      m.gancho = ganchosEmailWP.PropostaCanceladaEmPreVigencia;
    });
    emails = emails.concat(_emails);

    let _smss = JSON.parse(JSON.stringify(dados));
    _smss.forEach(s => {
      s.cql = 'AtualizarPropostaStatusCancelada';
      s.params = { nrProposta: s.nrProposta };
      s.gancho = ganchosSMSWP.PropostaCanceladaEmPreVigencia;
    });
    smss = smss.concat(_smss);
  } catch (error) {
    erros_consulta.push({ consulta: 'consultarStatusCancelada', error: error });
    // throw error;
  }
}
//#endregion

let mapFields = function (text, obj) {
  for (let prop in obj) {
    let propLower = prop.toLocaleLowerCase();
    let propUpper = prop.toLocaleUpperCase();
    text = text.split(`[${propLower}]`).join(obj[prop]).split(`[${propUpper}]`).join(obj[prop]);
    text = text.split(`{{${propLower}}}`).join(obj[prop]).split(`{{${propUpper}}}`).join(obj[prop]);
  }
  return text.trim();
}


let logError = async function () {
  try {
    let errors = emails_erros.concat(smss_erros).concat(erros_consulta).concat(erros_genericos);
    let dataHora = moment().format("hh:mm:ss");

    let texto = `---> ${dataHora}\t`;
    for (let index = 0; index < errors.length; index++) {
      const err = errors[index];
      texto += `
        INÍCIO - ERRO ${(index + 1)} \t
        ${JSON.stringify(err)}\t
        FIM - ERRO ${(index + 1)}
      `;
      texto += '\r\n';
    }
    if (!errors.length) return;
    let dir = 'log/'
    let filename = `${dir}${moment().format("YYYYMMDD")}-ERRORS.log`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    if (!fs.existsSync(filename)) {
      appendAsync(filename, texto, { enconding: 'utf-8', flag: 'a' });

    }
    else {
      readFileAsync(filename, 'utf8', function (err, data) {
        if (err) throw err;
        data += '\r\n';
        data += texto;
        fs.writeFileSync(filename, data, { enconding: 'utf-8', flag: 'a' });
      });
    }
  } catch (err) {
    console.log(err)
  }
}