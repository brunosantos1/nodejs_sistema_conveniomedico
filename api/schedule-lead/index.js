const config = require("./controller/api_config");
const {db} = config;
const queriesCql = require("./controller/api_cql");
const axios = require("axios");
var CronJob = require('cron').CronJob;
const fs = require('fs');
const { promisify } = require('util');
const createFileAsync = promisify(fs.appendFile)
const writeFileAsync = promisify(fs.writeFile)

const job = new CronJob('*/10 * * * *', function () {
  gerarLead()
}, null, true, 'America/Sao_Paulo');


async function gerarLead(){
  try {
    await db.execute(queriesCql.cql.criacaoLead); 
    await gerarArquivos()

  } catch (error) {
    console.log("Error: " + error)
  }

}

async function gerarArquivos() {
  try {
    var retorno = await db.execute(queriesCql.cql.geraArquivoLead); 
    var ids = " ";
    var data = new Date();
    var caminho = config.security_schedule.localPath;
    var nomeArquivo = data.getFullYear() + ("00" + (data.getMonth() + 1)).slice(-2) + ("00" + (data.getDate())).slice(-2) +  '_CadastroSimuladorWeb_' + ("00" + (data.getHours())).slice(-2) + ("00" + (data.getMinutes() + 1)).slice(-2) + '.txt';
     if(retorno.length > 0){
      //cria o arquivo
      await createFileAsync(caminho+nomeArquivo , '', {enconding:'utf-8',flag: 'a'});
  
      for (let index = 0; index < retorno.length; index++) {
        var linha = await geralinha(retorno[index].ARQUIVO);
        ids = ids + retorno[index].ARQUIVO.ID + ','
        await writeFileAsync(caminho+nomeArquivo, linha, {enconding:'utf-8',flag: 'a'});
      }
      var query = queriesCql.cql.criaVinculoArquivo;
      var id =  ids.substr(1,(ids.length - 2));
      query = query.replace("@ID", id);
      query = query.replace("@nomeArquivo", nomeArquivo);
  
      await db.execute(query);
   }
  } catch (error) {
    console.log("Error: " + error)
  }
}

async function geralinha(dados){
  var dependentes =  '';
  for(x in dados){
    if(dados[x] == null){
      dados[x] = '';
    }
    if(dados.Ativo == true){
      dados.Ativo = 1
    } else if(dados.Ativo == false){
      dados.Ativo = 0
    } 
  }

  if(dados.DataNascimentoDependentes.length){
    for (let index = 0; index < 10; index++) {
      if(dados.DataNascimentoDependentes[index]){
        dependentes = dependentes + dados.DataNascimentoDependentes[index].DataNascimento + '|'
      }else{
        dependentes = dependentes + '|'
      }
    }
  }

  var linha = 
    dados.Veiculo +'|'+ 
    dados.Formato +'|'+ 
    dados.Campanha +'|'+ 
    dados.DataSimulacao +'|'+ 
    dados.idSimulacao +'|'+ 
    dados.Estado +'|'+ 
    dados.CEP +'|'+ 
    dados.Profissao +'|'+ 
    dados.CodigoEntidade +'|'+ 
    dados.Entidade +'|'+ 
    dados.CodigoOperadora +'|'+ 
    dados.Operadora +'|'+ 
    dados.TipoAcomodacao +'|'+ 
    dados.Reembolso +'|'+ 
    dados.Nome +'|'+
    dados.Email +'|'+ 
    dados.DddTelefone +'|'+ 
    dados.Telefone +'|'+ 
    dados.DataNascimento +'|'+ 
    dados.AdicionaDependentes +'|'+ 
    dados.QuantidadeDependentes +'|'+ 
    dependentes +
    dados.CodigoPlano +'|'+
    dados.Plano +'|'+
    dados.ValorPlanoSimulado +'|'+
    dados.FiltroRangeValor +'|'+
    dados.TipoLead_ContatoNao +'|'+
    dados.Hora_ContatoNao +'|'+
    dados.TipoLead_ClickToCall +'|'+
    dados.Hora_ClickToCall +'|'+
    dados.TipoLead_Chat +'|'+
    dados.Hora_Chat +'|'+
    dados.TipoLead_DetalhesPlano +'|'+
    dados.Hora_DetalhesPlano +'|'+
    dados.TipoLead_ContatoSim +'|'+
    dados.Hora_ContatoSim +'|'+
    dados.TipoLead_PedidoOnline +'|'+
    dados.Hora_PedidoOnline +'|'+
    dados.TipoLead_MobileSim +'|'+
    dados.Hora_MobileSim +'|'+
    dados.Ativo +'|'+
    dados.CPF +
    //TODO: ESSES CAMPOS ESTÃO PREVISTOS PARA SEREM INCLUIDOS EM DEZEMBRO DE 2019. LEMBRAR DE INCLUIR TAMBÉM NO AQUIVO CQL.
    // dados.TipoLead_HOME_LOGIN_DESISTENCIA +'|'+
	  // dados.hora_HOME_LOGIN_DESISTENCIA +'|'+
	  // dados.TipoLead_LOGIN_DESISTENCIA +'|'+
	  // dados.hora_LOGIN_DESISTENCIA +'|'+
	  // dados.TipoLead_CADASTRO_DESISTENCIA +'|'+
	  // dados.hora_CADASTRO_DESISTENCIA +'|'+
	  // dados.LEAD_ACEITA_CONTATO +'|'+
    '\r\n';
  return linha;
  
}
