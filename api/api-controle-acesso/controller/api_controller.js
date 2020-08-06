var axios = require("axios");
const config = require("./api_config.js");
const validacao = require("./api_validation.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;
const integracao = require("./api_request.js");

//
// Método privado genérico para execução de cypher query.
//
async function executeCypherAsync(cql) {
   try {
    let driver = neo4j.default.driver(
      config.neo4j_driver.url_bold,
      config.neo4j_driver.auth,
      { disableLosslessIntegers: true }
     );
     let session = driver.session();
     var result = await session.run(cql, null);

     session.close();
     driver.close();

     return result.records[0]._fields[0];
   } catch (err) {
     session.close();
     driver.close();
    console.log(err);
  }

   return retorno;
}

async function ValidarUsuarioPlusoft(cpf){
  try {
    var arg0 = '<arg0>@cpf</arg0>';
    var arg2 = '<arg2>@idOrigem</arg2>';

    arg0 = arg0.replace('@cpf',cpf);
    arg2 = arg2.replace('@idOrigem',config.idOrigem);
    
    var xmlRequest =  queriesCql.cql.xmlAcesso;
    xmlRequest = xmlRequest.replace('@arg0',arg0);
    xmlRequest = xmlRequest.replace('@arg1','<arg1 />');
    xmlRequest = xmlRequest.replace('@arg2',arg2);


    var retornoApi = await integracao.LoginPlusoft(xmlRequest, config.urlAutServico);

    var mensagem = "";

    if (retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["mensagem"] != undefined ||
    retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["mensagem"] != null){
          mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["mensagem"][0];
        }
    else{
      mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["erro"][0]["mensagens"][0];
    }

    return {
              codigo: retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["codigo"][0],
              mensagem: mensagem,
              status: retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["sucesso"][0]
          };
  }
  catch (err){
    return {
      codigo: 400,
      mensagem: 'Falha de processamento ' + err,
      status: false
    };
  }
}

async function AutenticarUsuarioPlusoft(reqPlusoft){
  try {
    var arg0 = '<arg0>@cpf</arg0>';
    var arg1 = '';
    var arg2 = '<arg2>@idOrigem</arg2>';

    arg0 = arg0.replace('@cpf',reqPlusoft.cpf);

    if (reqPlusoft.senha == undefined || reqPlusoft.senha == null || reqPlusoft.senha == '')
      arg1 = '<arg1 />';
    else {
      arg1 = '<arg1>@senha</arg1>';
      arg1 = arg1.replace('@senha', reqPlusoft.senha);
    }
    arg2 = arg2.replace('@idOrigem',config.idOrigem);
    
    var xmlRequest =  queriesCql.cql.xmlAcesso;
    xmlRequest = xmlRequest.replace('@arg0',arg0);
    xmlRequest = xmlRequest.replace('@arg1',arg1);
    xmlRequest = xmlRequest.replace('@arg2',arg2);

    var retornoApi = await integracao.LoginPlusoft(xmlRequest, config.urlAutServico);

    var mensagem = "";

    if (retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["mensagem"] != undefined ||
    retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["mensagem"] != null){
          mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["mensagem"][0];
        }
    else{
      mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["erro"][0]["mensagens"][0];
    }

    return {
      codigo: retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["codigo"][0],
      mensagem: mensagem,
      status: retornoApi["S:Envelope"]["S:Body"][0]["ns2:acessoPortalResponse"][0]["return"][0]["sucesso"][0]
    };
  }
  catch (err){
    return {
      codigo: 400,
      mensagem: 'Falha de processamento' + err,
      status: false
    };
  }
}

async function CriarUsuarioPlusoft(reqPlusoft){
  try {
    var arg0 = '<arg0>@idOrigem</arg0>';
    var arg1 = '<arg1 />';
    var arg2 = '<arg2>@senha</arg2>';
    var arg3 = '<arg3>@email</arg3>';
    var arg4 = '<arg4>@cpf</arg4>';
    var arg5 = '<arg5 />';
    var arg6 = '<arg6>@nascimento</arg6>';

    arg0 = arg0.replace('@idOrigem',config.idOrigem);
    arg2 = arg2.replace('@senha',reqPlusoft.senha);
    arg3 = arg3.replace('@email',reqPlusoft.email);
    arg4 = arg4.replace('@cpf',reqPlusoft.cpf);
    arg6 = arg6.replace('@nascimento',reqPlusoft.dataNascimento);
    
    var xmlRequest =  queriesCql.cql.xmlPrimeiroAcesso;
    xmlRequest = xmlRequest.replace('@arg0',arg0);
    xmlRequest = xmlRequest.replace('@arg1',arg1);
    xmlRequest = xmlRequest.replace('@arg2',arg2);
    xmlRequest = xmlRequest.replace('@arg3',arg3);
    xmlRequest = xmlRequest.replace('@arg4',arg4);
    xmlRequest = xmlRequest.replace('@arg5',arg5);
    xmlRequest = xmlRequest.replace('@arg6',arg6);

    var retornoApi = await integracao.LoginPlusoft(xmlRequest, config.urlPrimeiroAcessoServico);

    var mensagem = "";

    if (retornoApi["S:Envelope"]["S:Body"][0]["ns2:primeiroAcessoResponse"][0]["return"][0]["mensagem"] != undefined ||
    retornoApi["S:Envelope"]["S:Body"][0]["ns2:primeiroAcessoResponse"][0]["return"][0]["mensagem"] != null){
          mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:primeiroAcessoResponse"][0]["return"][0]["mensagem"][0];
        }
    else{
      mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:primeiroAcessoResponse"][0]["return"][0]["erro"][0]["mensagens"][0];
    }

    return {
      codigo: retornoApi["S:Envelope"]["S:Body"][0]["ns2:primeiroAcessoResponse"][0]["return"][0]["codigo"][0],
      mensagem: mensagem,
      status: retornoApi["S:Envelope"]["S:Body"][0]["ns2:primeiroAcessoResponse"][0]["return"][0]["sucesso"][0]
    };
  }
  catch (err) {
    return {
      codigo: 400,
      mensagem: 'Falha de processamento ' + err,
      status: false
    };
  }
}

async function EsqueciSenha(reqPlusoft){
  try {
    var arg0 = '<arg0>@cpf</arg0>';
    var arg1 = '<arg1>@dataNascimento</arg1>';
    var arg3 = '<arg3>@idOrigem</arg3>';

    arg0 = arg0.replace('@cpf',reqPlusoft.cpf);
    arg1 = arg1.replace('@dataNascimento', reqPlusoft.senha);
    arg3 = arg3.replace('@idOrigem',config.idOrigem);
    
    var xmlRequest =  queriesCql.cql.xmlEsqueciSenha;
    xmlRequest = xmlRequest.replace('@arg0',arg0);
    xmlRequest = xmlRequest.replace('@arg1',arg1);
    xmlRequest = xmlRequest.replace('@arg2','<arg2 />');
    xmlRequest = xmlRequest.replace('@arg3',arg3);

    var retornoApi = await integracao.LoginPlusoft(xmlRequest, config.urlEsqueciServico);

    var mensagem = "";

    if (retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaResponse"][0]["return"][0]["mensagem"] != undefined ||
    retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaResponse"][0]["return"][0]["mensagem"] != null){
          mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaResponse"][0]["return"][0]["mensagem"][0];
        }
    else{
      mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaResponse"][0]["return"][0]["erro"][0]["mensagens"];
    }

    return {
      codigo: retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaResponse"][0]["return"][0]["codigo"][0],
      mensagem: mensagem,
      status: retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaResponse"][0]["return"][0]["sucesso"][0]
    };
  }
  catch (err){
    return {
      codigo: 400,
      mensagem: 'Falha de processamento ' + err,
      status: false
    };
  }
}

async function AlterarSenha(reqPlusoft){
  try {
    var arg0 = '<arg0>@token</arg0>';
    var arg2 = '<arg2>@novaSenha</arg2>';
    var arg3 = '<arg3>@idOrigem</arg3>';

    arg0 = arg0.replace('@token',reqPlusoft.token);
    arg2 = arg2.replace('@novaSenha', reqPlusoft.novaSenha);
    arg3 = arg3.replace('@idOrigem',config.idOrigem);
    
    var xmlRequest =  queriesCql.cql.xmlAlterarSenha;
    xmlRequest = xmlRequest.replace('@arg0',arg0);
    xmlRequest = xmlRequest.replace('@arg1','<arg1 />');
    xmlRequest = xmlRequest.replace('@arg2',arg2);
    xmlRequest = xmlRequest.replace('@arg3',arg3);

    var retornoApi = await integracao.LoginPlusoft(xmlRequest, config.urlAlterarServico);

    var mensagem = "";

    if (retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaAlteracaoResponse"][0]["return"][0]["mensagem"]  != undefined ||
        retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaAlteracaoResponse"][0]["return"][0]["mensagem"] != null){
          mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaAlteracaoResponse"][0]["return"][0]["mensagem"][0];
        }
    else{
      mensagem = retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaAlteracaoResponse"][0]["return"][0]["erro"][0]["mensagens"][0];
    }

    return {
      codigo: retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaAlteracaoResponse"][0]["return"][0]["codigo"][0],
      mensagem: mensagem,
      status: retornoApi["S:Envelope"]["S:Body"][0]["ns2:esqueciSenhaAlteracaoResponse"][0]["return"][0]["sucesso"][0]
    };
  }
  catch (err){
    return {
      codigo: 400,
      mensagem: 'Erro de processamento ' + err,
      status: false
    };
  }
}

exports.AutenticarUsuario = async function(req, res, next) {
  try {
    var requisicao = req.body;
    if (requisicao == undefined || requisicao == null)
      throw 'Parâmetros não informados.';

    var reqPlusoft = { cpf: requisicao.cpf, senha: requisicao.senha };

    reqPlusoft.cpf = reqPlusoft.cpf.replace('.','');
    reqPlusoft.cpf = reqPlusoft.cpf.replace('.','');
    reqPlusoft.cpf = reqPlusoft.cpf.replace('-','');

    var validacao = await ValidarUsuarioPlusoft(reqPlusoft.cpf);

    if (validacao.codigo == '0' || validacao.codigo == '9006') {
      var autenticacao = await AutenticarUsuarioPlusoft(reqPlusoft);

      if (autenticacao.codigo == '0' && autenticacao.mensagem == "1")
        res.send(200, { message: 'Acesso Permitido' });
      else if (autenticacao.codigo == '9005')
        res.send(404, { message: 'Acesso negado. ' + autenticacao.mensagem });
      else
        res.send(400, { message: 'Acesso negado. ' + autenticacao.mensagem });
    }
    else if (validacao.codigo == '9001' || validacao.codigo == '9002'){
      res.send(404, { message: validacao.mensagem });
    }
    else
      res.send(400, { message: 'Acesso negado.' });

  } catch (err) {
    res.send(400, { message: err });
  }
};

exports.CadastarUsuario = async function(req, res, next) {
  try {
    var requisicao = req.body;

    if (requisicao == undefined || requisicao == null){
      res.send(400, { message: 'Dados não informados.' });
      return;
    }
    
    var reqPlusoft = { cpf: requisicao.cpf, email: requisicao.email, dataNascimento: requisicao.dataNascimento, senha: requisicao.senha };

    reqPlusoft.cpf = reqPlusoft.cpf.replace('.','');
    reqPlusoft.cpf = reqPlusoft.cpf.replace('.','');
    reqPlusoft.cpf = reqPlusoft.cpf.replace('-','');

    var retorno = await CriarUsuarioPlusoft(reqPlusoft);
    
    if (retorno.codigo != "0")
      res.send(400, { message: retorno.mensagem });
    else
      res.send(201, { message: retorno.mensagem });
    } catch (err) {
    res.send(400, { message: err });
  }
};

exports.EsqueciSenhaUsuario = async function(req, res, next) {
  try {
    var requisicao = req.body;

    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    var reqPlusoft = { cpf: requisicao.cpf, senha: requisicao.dataNascimento };

    reqPlusoft.cpf = reqPlusoft.cpf.replace('.','');
    reqPlusoft.cpf = reqPlusoft.cpf.replace('.','');
    reqPlusoft.cpf = reqPlusoft.cpf.replace('-','');

    var retorno = await EsqueciSenha(reqPlusoft);
    
    if (retorno.codigo != "0")
      res.send(400, { message: retorno.mensagem });
    else
      res.send(200, { message: 'Enviado e-mail para ' + retorno.mensagem });
    } catch (err) {
    res.send(400, { message: err });
  }
};

exports.AlterarSenhaUsuario = async function(req, res, next) {
  try {
    var requisicao = req.body;

    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    var reqPlusoft = { token: requisicao.token, novaSenha: requisicao.novaSenha };

    var retorno = await AlterarSenha(reqPlusoft);
    
    if (retorno.codigo != "0")
      res.send(400, { message: retorno.mensagem });
    else
      res.send(200, { message: retorno.mensagem });
    } catch (err) {
    res.send(400, { message: err });
  }
};

// VALIDAÇÕES

exports.ValidarAutenticacao = async function(req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

      validacao.existsOrError(requisicao.cpf, "O CPF deve ser informado.");
      validacao.existsOrError(requisicao.senha, "A Senha deve ser informada.");
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

exports.ValidarCadastro = async function(req, res, next) {
  try {
    var requisicao = req.body;
    if (requisicao != undefined || requisicao != null)
    {
      validacao.existsOrError(requisicao.cpf, "CPF deve ser informado.");
      validacao.existsOrError(requisicao.senha, "Senha deve ser informada.");
      validacao.existsOrError(requisicao.dataNascimento, "Data de Nascimento deve ser informada.");
      validacao.existsOrError(requisicao.email, "E-mail deve ser informado.");
      validacao.validarCPF(requisicao.cpf, 'CPF inválido.');
      validacao.validarDataNascimento(requisicao.dataNascimento,0,100, 'Data de Nascimento inválida.');
      validacao.validarEmail(requisicao.email, "E-mail inválido.");
    }
    else
      throw 'Informe os parâmetros de consulta.'
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

exports.ValidarEsqueciSenha = async function(req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

      validacao.existsOrError(requisicao.cpf, 'CPF deve ser informado.');
      validacao.existsOrError(requisicao.dataNascimento, "Data de Nascimento deve ser informada.");
      validacao.validarCPF(requisicao.cpf, 'CPF inválido.');
      validacao.validarDataNascimento(requisicao.dataNascimento,0,100, 'Data de Nascimento inválida.');

    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};

exports.ValidarAlteracao = async function(req, res, next) {
  try {
    var requisicao = req.body;
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)
       validacao.existsOrError(requisicao.token, "Token deve ser informado.");
       validacao.existsOrError(requisicao.novaSenha, "Nova senha deve ser informada.");
      
    next();
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
};