var axios = require("axios");
const config = require("./api_config.js");
const {db} = config;
const queriesCql = require("./api_cql");
const querieSql = require("./api_sql");
const sql = require('mssql')


exports.importarPrecadastro = async function(req, res, next) {
  try {

    var requisicao = req.body
    if (typeof requisicao === 'string')
     requisicao = JSON.parse(requisicao)

    var cqlQuery = queriesCql.cql.cqlBuscaDadosEcommerce;
    cqlQuery = cqlQuery.replace("@PARAM",requisicao.evento.dados.idproposta); 

    var dadosProposta = await db.execute(cqlQuery);

    await Processar(dadosProposta[0].DadosProposta);

    //console.log("ID DA PROPOSTA", requisicao.evento.dados.idproposta); 
    //TODO: Realizar a execução da Importação para Precadastro
    
    
    //Chamar para seguir o fluxo do evento
    //await callBackCoreFinalizar(requisicao);
    
    res.send(200, 'Processado com sucesso!');
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

async function Processar(dadosProposta){
  try {
      await sql.connect(config.dbSQL);
      const transaction = new sql.Transaction()
      await transaction.begin();
      const request = new sql.PreparedStatement(transaction)

      //Executar SQL
      try {

          var idPreCadastro = await buscarIdSequencia(request, config.idSequencia.ID_SEQ_PRE_CADASTRO);

          // Buscar idTipoCobranca
          var idTipoCobranca = await ConsultarTipoCobranca(/*IDPRODUTO NÃO SALVA EM NENHUM NÓ*/ 123, DadosProposta.DadosTitular.FormaPagamento.Forma);

          // Definir Produtor
          // Definir Supervisor externo

          //Inserir PreCadastro
          await inserirTelefoneTitular(request, 2, 3, '4137029593', null, 1);



          await transaction.commit();
      } catch (error) {
          await transaction.rollback();
          throw error
      } finally {
        await sql.close();
      }
  } catch (error) {
    throw error;
  }
};

async function buscarIdSequencia(requests, idSequencia){
  try {
    await requests.input('idSequencia', sql.Int)
    await requests.prepare(querieSql.sql.buscaIdSequencia);
    var id = await requests.execute({idSequencia: idSequencia})
    return id.recordsets[0][0].ID;
  } catch (error) {
    throw error;
  } finally {
    await requests.unprepare();
  }
};

async function ConsultarTipoCobranca(idProduto, tipoCobranca) {
  try {
    var TipoCobranca = '';

    if (idProduto == undefined || idProduto == null || idProduto == 0){
      throw 'Informe um Produto.';
    }
    
    if (tipoCobranca == undefined || tipoCobranca == null || tipoCobranca == 0){
      throw 'Informe um Tipo de Cobrança.';
    }
    else {
      if (!((tipoCobranca.toUpperCase() == 'DÉBITO' || tipoCobranca.toUpperCase() == 'DEBITO') || tipoCobranca.toUpperCase() == 'BOLETO')){
        throw 'Tipo de Cobrança inválido.';
      }
    }

    if (tipoCobranca.toUpperCase() == 'BOLETO'){
      TipoCobranca = 'BMA';
    }
    else{
      TipoCobranca = 'DEB';
    }

    var cqlQuery = queriesCql.cql.sqlBuscarTipoCobrancaSinf;
    cqlQuery = cqlQuery.replace("@idProduto",requisicao.idProduto); 
    cqlQuery = cqlQuery.replace("@TpCobranca",TipoCobranca); 

    var retornoTipoCobranca = await db.execute(cqlQuery);

    if (retornoTipoCobranca == undefined || retornoTipoCobranca == null || retornoTipoCobranca == 0){
      throw 'Tipo de cobrança não disponível.';
    }
    else {
      return retornoTipoCobranca[0].row.IdTpCobranca;
    }
  } catch (err) {
    throw err;
  }
};

async function inserirPreCadastro(requests){
  try {
    await requests.input('idPreCadastro', sql.Int)
    await requests.input('tipo', sql.Int)
    await requests.input('numero', sql.VarChar(50))
    await requests.input('complemento', sql.VarChar(50))
    await requests.input('telefonePrincipal', sql.Bit)
    await requests.prepare(querieSql.sql.inserirPreCadastro);
    await requests.execute({idPreCadastro: idPreCadastro})
  } catch (error) {
    throw error;
  } finally {
    await requests.unprepare();
  }
};

async function inserirTelefoneTitular(requests, idPreCadastro, tipo, numero, complemento, telefonePrincipal){
  try {
    await requests.input('idPreCadastro', sql.Int)
    await requests.input('tipo', sql.Int)
    await requests.input('numero', sql.VarChar(50))
    await requests.input('complemento', sql.VarChar(50))
    await requests.input('telefonePrincipal', sql.Bit)
    await requests.prepare(querieSql.sql.inserirTelefoneTitular);
    var Result = await requests.execute({idPreCadastro: idPreCadastro, tipo: tipo, numero: numero, complemento: complemento, telefonePrincipal: telefonePrincipal})
  } catch (error) {
    throw error;
  } finally {
    await requests.unprepare();
  }
};

async function Generico(requests){
  try {
    await requests.input('idPreCadastro', sql.Int)
    await requests.input('tipo', sql.Int)
    await requests.input('numero', sql.VarChar(50))
    await requests.input('complemento', sql.VarChar(50))
    await requests.input('telefonePrincipal', sql.Bit)
    await requests.prepare();
    await requests.execute({idPreCadastro: idPreCadastro})
  } catch (error) {
    throw error;
  } finally {
    await requests.unprepare();
  }
};


//Chamar pra segui o fluxo do evneto
async function callBackCoreFinalizar(body) {
  await axios({
    method: 'PUT',
    baseURL: `${config.core.http_server}${config.core.resource_uri}`,
    url: `${config.core.http_server}${config.core.resource_uri}`,
    data: body,
    headers: {
      'Accept': 'application/json; charset=UTF-8',
      'Content-Type': 'application/json; charset=UTF-8',
    }
  })
}