const config = require("./api_config");
const queriesCqlPlanos = require("../../api-plano/controller/api_cql");
const neo4j = require("neo4j-driver").v1;
const queriesCql = require("./api_cql");
const validacao = require("./api_validation")

//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql, base = config.neo4j_driver) {
  try {

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

  } catch (err) {
    session.close();
    driver.close();
    console.log(err);
  }

  return retorno;
}

//
// Método para listar valores do plano de acordo com as data de vigência e de simulação
//
exports.listarPrecosReajuste = async function (req, res, next) {
  try {

    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    var idplano_sinf = !requisicao.idplano_sinf ? [] : [requisicao.idplano_sinf];
    var retorno = [];
    var reajuste = undefined;

    for (const data of requisicao.datanascimento) {
      var lista_simulacao = await listarPrecoData([requisicao.id], data, requisicao.entidade, requisicao.datasimulacao, idplano_sinf);
      var lista_vigencia = await listarPrecoData([requisicao.id], data, requisicao.entidade, requisicao.datavigencia, idplano_sinf);
      retorno.push({ datanascimento: data, preco_vigencia:lista_vigencia.preco, preco_simulacao: lista_simulacao.preco });
      var idx = retorno.length - 1;

      //Verifica se houve alteracao do valor
      var diferenca = lista_simulacao && lista_simulacao ? lista_vigencia.preco - lista_simulacao.preco : undefined;
      if (diferenca) {
        //Verifica se houve diferença de faixa
        if(parseInt(lista_vigencia.ate) > parseInt(lista_simulacao.ate))
        {
          if(!reajuste) { // Calculo do reajuste com data de referência
            var referencia_simulacao = await listarPrecoData([requisicao.id], requisicao.datasimulacao, requisicao.entidade, requisicao.datasimulacao, idplano_sinf);
            var referencia_vigencia = await listarPrecoData([requisicao.id], requisicao.datasimulacao, requisicao.entidade, requisicao.datavigencia, idplano_sinf);
            reajuste = (referencia_vigencia.preco - referencia_simulacao.preco) / referencia_simulacao.preco;
          }
         if (reajuste > 0)
          {
            let reajuste_faixa = retorno[idx].preco_vigencia / (1 + reajuste);
            retorno[idx].reajuste_faixa = parseFloat(reajuste_faixa - retorno[idx].preco_simulacao).toFixed(2);
            retorno[idx].reajuste_anual = parseFloat(retorno[idx].preco_vigencia - reajuste_faixa).toFixed(2);
          } 
          else
          {
            retorno[idx].reajuste_faixa = parseFloat(diferenca).toFixed(2); 
          }
        }
        else 
        {
          retorno[idx].reajuste_anual = parseFloat(diferenca).toFixed(2);
        }
      }
    }
    res.send(200, retorno);
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

//
// Método para pesquisar preço por data de referência
//
async function listarPrecoData(idplanos, datanascimento, entidade, datareferencia, idplanos_sinf = []) {
  try {

    const idade = obterIdade(datanascimento, datareferencia);
    const lista = await module.exports.listarPrecos(idplanos, [idade], entidade, datareferencia, idplanos_sinf);
    const retorno =  lista.length ? lista[0].precos[0] : [];
    return retorno;

  } catch (error) {
    throw error;
  }
}

exports.BuscaRangePrecos = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);

    var cql = queriesCqlPlanos.cql.cqlListarPlanos;
    cql = cql.replace('@Entidade', requisicao.Entidade);
    cql = cql.replace('@uf', requisicao.UF);
    cql = cql.replace('@cidade', requisicao.Cidade);
    let planos = await executeCypherAsync(cql);

    var idplanos = planos.plano.map(plano => plano.id);
    var idplanos_sinf = planos.plano.map(plano => plano.idplanos[0].identificadorSinf); //Usar o primeiro código do Sinf 

    var idades = [];
    requisicao.DataNascimento.forEach(DataNascimento => {
      var idade = obterIdade(DataNascimento);
      idades.push(idade);
    });

    var data = obterData();
    var retorno = await module.exports.listarPrecos(idplanos, idades, requisicao.Entidade, data, idplanos_sinf);

    var maior = 0;
    var menor = 0;

    retorno.forEach(element => {

      for (x in element.precos) {
        if (parseFloat(element.precos[x].preco) > maior) {
          maior = parseFloat(element.precos[x].preco).toFixed(2);
        }
        if (menor == 0) {
          menor = parseFloat(element.precos[x].preco)
        }
        if (parseFloat(element.precos[x].preco) < menor) {
          menor = parseFloat(element.precos[x].preco).toFixed(2);
        }
      }

    });


    res.send(200, { min: menor, max: maior });
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}

//
// Método para pesquisar preços primeiramente na base Qualitech e no Sinf caso não seja encontrado 
//
exports.listarPrecos = async function (planos, idades, entidade, data, planos_sinf = []) {
  try {

    data = data.substr(0, 7).replace('-', '');

    var cql = queriesCql.cql.cqlConstultaPrecos
      .replace('@PLANOS', planos.join())
      .replace('@ENTIDADE', entidade)
      .replace('@PERIODO', data);

    let retorno = await executeCypherAsync(cql,config.neo4j_driver_estatica); //config.neo4j_driver_core

    //Obter os valores por idade
    var lista = [];
    retorno.forEach(idplanos => {
      var precos = [];
      idades.forEach(idade => {
        let valor = idplanos.precos.filter(function (idplano) {
          return idplano.idadeDe <= idade && idade <= idplano.idadeAte;
        });
        precos.push({ idade: idade, preco: valor[0].valorContratual, de: valor[0].idadeDe, ate: valor[0].idadeAte });
      });
      lista.push({ idplano: idplanos.idplano, precos: precos });
    });

    //Lista os que não foram encontrados na base do Core
    let preenchidos = lista.map(plano => plano.idplano);
    let faltantes = planos.filter(x => !preenchidos.includes(x));

    //Atualiza lista com os dados do SINF
    if (faltantes.length && planos_sinf.length) {
      var lista_sinf = await listarPrecoSINF(planos_sinf, idades, data);
      lista_sinf.forEach(plano => {
        plano.idplano = planos[planos_sinf.indexOf(plano.idplano)];
      });
      lista = lista.concat(lista_sinf);
    }

    //Posiciona o titular como primeiro na relação de preços
    lista.forEach(plano => {
      var idx_titular = 0;
      plano.precos.forEach((preco, idx) => {
        if (preco.idade == idades[0])
          idx_titular = idx;
      });
      if (idx_titular > 0) {
        var item = plano.precos[0];
        plano.precos[0] = plano.precos[idx_titular];
        plano.precos[idx_titular] = item;
      }
    });

    return lista;

  } catch (error) {
    throw error
  }
}

/// Método para listar preços, de acordo com planos e idades, no SINF
async function listarPrecoSINF(planos, idades, periodo) {
  try {
    var retorno = [];
    var cQuery = queriesCql.cql.sqlConsultaTabelaPrecos;
    cQuery = cQuery.replace("@IdPlano", planos.join());
    cQuery = cQuery.replace("@IDADES", idades.join());
    cQuery = cQuery.replace("@Periodo", periodo);

    let lista = await executeCypherAsync(cQuery);

    const planos_sinf = Array.from(new Set(lista.map(plano => plano.idplano)));

    planos_sinf.forEach(plano => {
      let precos = lista.filter(function (preco) {
        return preco.idplano == plano;
      });
      precos.forEach(function (preco) { delete preco.idplano });
      retorno.push({ idplano: plano, precos: precos });
    });

    return retorno;

  } catch (err) {
    throw err;
  }
}

exports.validarReajuste = async function (req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao);
    validacao.existsOrError(requisicao.entidade, "A entidade de classe deve ser informada.");
    validacao.existsOrError(requisicao.id, "O ID do plano deve ser informado.");
    validacao.existsOrError(requisicao.datasimulacao, "A data da simulação deve ser informada.");
    validacao.existsOrError(requisicao.datavigencia, "A data da vigência deve ser informada.");

    requisicao.datanascimento.forEach(function (data, index) {
      validacao.validarDataNascimento(data, 0, 101, "Data de Nascimento do dependente " + (index + 1) + " é inválida.");
    });
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
}


// 
// Função para calcular a idade a partir de uma data de referência: '2018-07-18'
//
let obterIdade = function (datanascimento, datareferencia = null) {
  var data = datareferencia != null ? new Date(datareferencia) : new Date();
  var aniversario = new Date(datanascimento);
  var age = data.getFullYear() - aniversario.getFullYear();
  var m = data.getMonth() - aniversario.getMonth();
  if (m < 0 || (m === 0 && data.getDate() < aniversario.getDate())) {
    age--;
  }
  return age;
}

//
// Função para obter a data atual no formato: '2018-07-18'
//
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
