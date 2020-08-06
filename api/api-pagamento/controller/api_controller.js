var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const validacao = require('./api_validation');

//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql) {
  let driver = neo4j.default.driver(
    config.neo4j_driver.url_bolt,
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
    return {}
}

exports.listarFormasPagamento = async function (req, res, next) {
  try {
	  console.log('formas')
    //O retorno não está considerando a forma de Folha de Pagamento  
    var retorno = await buscarFormasPagamento();
    res.send(200, retorno);
  } catch (err) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

async function buscarFormasPagamento() {
  var cql = queriesCql.cql.cqllistarFormasPagamento;
  var retorno = await executeCypherAsync(cql);
  return retorno;
}

async function desativarFormasPagamentoPropostaAnterior(NrProposta) {
  var data = new Date().toLocaleDateString();
  var time = new Date().toLocaleTimeString();
  var cql = queriesCql.cql.cqlDesativarFormaPagamentoProposta;
  
  cql = cql.replace('@NrProposta',NrProposta)
  
  cql = cql.replace('@DataAlteracao',data + ' ' + time)
  
  var retorno = await executeCypherAsync(cql);
  
  return retorno;
}

async function desativarReembolsoProposta(NrProposta) {
  var data = new Date().toLocaleDateString();
  var time = new Date().toLocaleTimeString();
  var cql = queriesCql.cql.cqlDesativarReembolsoProposta;
  cql = cql.replace('@NrProposta',NrProposta)
  cql = cql.replace('@DataAlteracao',data + ' ' + time)
  var retorno = await executeCypherAsync(cql);
  return retorno;
}

exports.CarregarDadosPagamento = async function(req,res,next) {
	try {
		let nrProposta = req.params.nrProposta
		
		var cql = queriesCql.cql.cqlCarregarFormaPagamentoProposta;
		cql = cql.replace("@NrProposta",nrProposta);
		console.log(cql)
		let retorno = await executeCypherAsync(cql);
		
		var cql2 = queriesCql.cql.cqlCarregarReembolsoProposta;
		cql2 = cql2.replace("@NrProposta",nrProposta);
		console.log(cql2)
		let retorno2 = await executeCypherAsync(cql2);
		
		var jsonResult = {
			"pagamento": retorno,
			"reembolso": retorno2
		}
		console.log('retorno carregar dados pagamento');
		console.log(jsonResult);
		res.send(201, { data: jsonResult });
	} catch (e) {
		
	}
}

exports.IncluirFormaPagamentoProposta = async function (req, res, next) {
	var retorno = true
	var retorno2 = true
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)
    
	
	let nrProposta = requisicao.NrProposta
		
	var cqlPg = queriesCql.cql.cqlCarregarFormaPagamentoProposta;
	cqlPg = cqlPg.replace("@NrProposta",nrProposta);
	console.log(cqlPg)
	let retornoPg = await executeCypherAsync(cqlPg);
	
	var cqlRb = queriesCql.cql.cqlCarregarReembolsoProposta;
	cqlRb = cqlRb.replace("@NrProposta",nrProposta);
	console.log(cqlRb)
	let retornoRb = await executeCypherAsync(cqlRb);
	
	var jsonResult = {
		"pagamento": retornoPg,
		"reembolso": retornoRb
	}
	
	// Verifica se os dados informados pelo usuário são diferentes dos anterioes. Só atualiza se forem diferentes
	let alterarPagamento = false
	if(jsonResult && jsonResult.pagamento && jsonResult.pagamento.properties) {
		let ultDadosPag = jsonResult.pagamento.properties
		if(ultDadosPag.Forma != requisicao.Forma || ultDadosPag.Banco != requisicao.Banco || ultDadosPag.Agencia != requisicao.Agencia || ultDadosPag.ContaCorrente != requisicao.ContaCorrente) {
			alterarPagamento = true
		}
	} else {
		// Não encontrou pagamento anterior
		alterarPagamento = true
	}
	
	if(alterarPagamento) {
		console.log("......... DEVE ALTERAR PAGAMENTO ...................")
		//desativa as formas de pagamento anterior
		await desativarFormasPagamentoPropostaAnterior(requisicao.NrProposta);
		var cql = queriesCql.cql.cqlIncluirFormaPagamentoProposta;
		cql = cql.replace("@NrProposta",requisicao.NrProposta)
		cql = cql.replace("@Forma",requisicao.Forma)
		cql = cql.replace("@Banco",requisicao.Banco)
		cql = cql.replace("@Agencia",requisicao.Agencia)
		cql = cql.replace("@ContaCorrente",requisicao.ContaCorrente)
		retorno = await executeCypherAsync(cql);
	} else {
		console.log("......... NÃO deve alterar pagamento ...................")
	}
    
	
	let alterarReembolso = false
	if(jsonResult && jsonResult.reembolso && jsonResult.reembolso.properties) {
		let ultDadosReb = jsonResult.reembolso.properties
		if(ultDadosReb.Banco != requisicao.ReembolsoBanco || ultDadosReb.Agencia != requisicao.ReembolsoAgencia || ultDadosReb.ContaCorrente != requisicao.ReembolsoContaCorrente) {
			alterarReembolso = true
		}
	} else {
		alterarReembolso = true
	}
	if(alterarReembolso) {
		console.log("......... DEVE ALTERAR REEMBOLSO ...................")
		await desativarReembolsoProposta(requisicao.NrProposta);
		if(requisicao.ReembolsoBanco || requisicao.ReembolsoAgencia || requisicao.ReembolsoContaCorrente ) {
			var cql2 = queriesCql.cql.cqlIncluirReembolsoProposta;
			cql2 = cql2.replace("@NrProposta",requisicao.NrProposta)
			cql2 = cql2.replace("@ReembolsoBanco",requisicao.ReembolsoBanco)
			cql2 = cql2.replace("@ReembolsoAgencia",requisicao.ReembolsoAgencia)
			cql2 = cql2.replace("@ReembolsoContaCorrente",requisicao.ReembolsoContaCorrente)
			
			retorno2 = await executeCypherAsync(cql2);
		}
	} else {
		console.log("......... NÃO deve alterar reembolso ...................")
	}
	
	
	
	  if (retorno == undefined || retorno == null){
		  res.send(201, { message: "Forma de Pagamento não cadastrada.", success: false });
	  } else {  
		res.send(201, { message: "Forma de Pagamento cadastrada com sucesso.", success: true });
	  }
  } catch (err) {
    var msg = err.message || err;
    res.send(201, { message: msg });
  }
};

exports.ValidarConta = async function (req,res,next) {
	try {
		const banco = req.params.banco;
		const ag = req.params.ag; //agencia
		const cc = req.params.cc; //número da conta corrente
		
		axios.get(`http://sinfservicosrest.grupo.qualicorp/Financeiro/bancos.svc/validardgconta/${banco}/${ag}/${cc}`).then(function(response){
			console.log(response);
			res.send(response.data);
		});
	} catch(e) {
		console.log(e);
		res.send(e);
	}
}


//##################################################################
// Função que valida os Parâmetros de Entrada de Responsável Legal #
//##################################################################
exports.validarFormaPagamentoProposta = async function (req, res, next) {
	console.log('valid1')
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

      validacao.existsOrError(requisicao.NrProposta, "O Número da Proposta deve ser informado.");
      validacao.existsOrError(requisicao.Forma, "Forma de Pagamento deve ser informada.");
      
      var fPgto = await buscarFormasPagamento();
      var formaValid = false;
      var bancoValid = false;

      var i,b;
      for (i = 0; i < fPgto.length; i++) { 
        if (fPgto[i].forma == requisicao.Forma){
          formaValid = true;
          break;
        }
      }

      if (!formaValid)
        throw "Forma de Pagamento inválida.";

      if (requisicao.Forma == "Débito")
      {
		  if(!requisicao.Banco && !requisicao.Agencia && !requisicao.ContaCorrente) {
			  
		  } else {
			  validacao.existsOrError(requisicao.Banco, "O Banco deve ser informado.");

				for (i = 0; i < fPgto.length; i++) { 
				  if (fPgto[i].forma == "Débito"){
					for (b = 0; b < fPgto[i].bancos.length; b++){
					  if (fPgto[i].bancos[b].IDBANCO == requisicao.Banco){
						bancoValid = true;
						break;
					  }
					}
				  }
				}

				if (!bancoValid)
				  throw "Banco inválido.";

				validacao.existsOrError(requisicao.Agencia, "A Agencia deve ser informada.");
				validacao.existsOrError(requisicao.ContaCorrente, "A ContaCorrente deve ser informada.");
		  }
		  
        
        
      }
		
      //validacao.existsOrError(requisicao.Vigencia, "Data de Vigencia deve ser informado.");
      //validacao.validarData(requisicao.Vigencia, 'Data de Vigencia inválida.');
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(201, { message: msg });
  }
}