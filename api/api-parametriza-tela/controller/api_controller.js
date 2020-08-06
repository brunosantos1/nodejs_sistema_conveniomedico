var axios = require("axios");
const config = require("./api_config");
const {db} = config;
const queriesCql = require("./api_cql");

//Variavel Global
var retorno;

async function trataRetorno(dados, tela){
  retorno = [];
  var itemParametro;
  var contador = 0;
  var telaAnteriror = '';
  if(tela == 'Cadastro'){
    for (let index = 0; index < dados.records.length; index++) {
      const element = dados.records[index]._fields[0];


      for(x in element.Propriedade){    
        try {
          element.Propriedade[x] = JSON.parse(element.Propriedade[x].toString())
        } catch (error) { }

      }

      if(!telaAnteriror){
        telaAnteriror = element.Tela
        itemParametro = Object.assign(element.Propriedade)
        Object.assign(itemParametro,{id:element.id})
        retorno[contador] = {[element.Tela] : [itemParametro]}
      }else{
        if(element.Tela == telaAnteriror){
          itemParametro = Object.assign(element.Propriedade)
          Object.assign(itemParametro,{id:element.id})
          retorno[contador][telaAnteriror].push(Object.assign(itemParametro))
        }else{
          telaAnteriror = element.Tela
          contador = contador + 1;
          itemParametro = Object.assign(element.Propriedade)
          Object.assign(itemParametro,{id:element.id})
          retorno[contador] = {[element.Tela] : [itemParametro]}
        }
      }
    }
  } else{
    for (let index = 0; index < dados.records.length; index++) {
      const element = dados.records[index]._fields[0];
      try {
          for(y in element.Propriedade[0]){
              try {
                element.Propriedade[0][y] = JSON.parse(element.Propriedade[0][y].toString())
              } catch (error) { }
          }
      } catch (error) { }
      retorno.push(Object.assign(element.Propriedade[0], {id:element.id}));
    }
    
    retorno.sort(function(a,b) {
      return a.Order < b.Order ? -1 : a.Order > b.Order ? 1 : 0;
    });
  }


}

async function verificaJson(dados){
  var retornar = false;
    const regex = /(((["])*([a-zA-Z]+)(["])*(:))){1}(\s)*(((?:[\[])?(?:["])?((.)*)(?:["])?(?:[\]]?))?)?([,]?)/g;
    while ((m = regex.exec(dados)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        retornar = true;
    }
  return retornar;
}

//
// Metodo para montar parametro de alteração0
//
async function montaParamAlteracao(dados) {
  var parametro = 'SET I = {';
  for (x in dados) {

    switch (x) {
      case "id":
        break;
      case "Order":
          parametro = parametro + "" + x + ": " + dados[x] + ", "
        break;
      default:
          if (typeof dados[x] === 'string'){
            parametro = parametro + "" + x + ": '" + dados[x] + "', "
          }else{
            parametro = parametro + "" + x + ": '" +JSON.stringify(dados[x]) + "', "
        }
        break;
    } 
  }
  parametro= parametro.substr(0,(parametro.length - 2)) + " }"
  return parametro;
}

//
// Metodo para montar parametro de busca
//
async function montaParamBusca(dados) {
  var parametro = "WHERE ";
  for (x in dados) {
    switch (x) {
      case "id":
        break;
      case "Order":
        break;
      default:
          parametro = parametro + "I." + x + "= '" + dados[x] + "' and "
        break;
    } 
  }
  parametro= parametro.substr(0,(parametro.length - 4))
  return parametro;
}

//
// Metodo para montar parametro de Inclusão
//
async function montaParamInclusao(dados, ordem) {
  var parametro = "";
  if(ordem){
    parametro = "Order: " + ordem + ", ";
  }
  for (x in dados) {
      parametro = parametro + "" + x + ": '" + dados[x] + "', "
    } 
  parametro= parametro.substr(0,(parametro.length - 2))
  return parametro;
}

exports.buscarPergunta = async function (req, res, next) {
  try {
    var cqlQuery;

    if(req.query.tela == 'Cadastro'){
      cqlQuery = queriesCql.cql.buscarCadastro;
    }else {
      cqlQuery = queriesCql.cql.buscarParametrizacao;
    }

    if(req.query.propriedade){
      if(!req.query.valor){ 
        res.send(404, { message: 'Nenhuma parametrização encontrada.' });
        return;
      };
      if(!(req.query.propriedade == "tela")){
        if(req.query.propriedade == "Order"){
          cqlQuery = cqlQuery.replace("@PARAM", " where I." + req.query.propriedade + " = " + req.query.valor);  
        } else if(req.query.propriedade == "id") {
          cqlQuery = cqlQuery.replace("@PARAM", " where id(I) = " + req.query.valor);  
        }else {
          cqlQuery = cqlQuery.replace("@PARAM", " where I." + req.query.propriedade + " = '" + req.query.valor +"'");
        }
        cqlQuery = cqlQuery.replace("@ParamTela", "")
      }else{
        cqlQuery = cqlQuery.replace("@ParamTela", " where D2.Type = '" + req.query.valor + "'");
        cqlQuery = cqlQuery.replace("@PARAM", "")
      }
    } else {
      cqlQuery = cqlQuery.replace("@PARAM", "")
      cqlQuery = cqlQuery.replace("@ParamTela", "")
    }
    cqlQuery = cqlQuery.replace("@Tela", req.query.tela);  
    await trataRetorno(await  db.execute(cqlQuery), req.query.tela);

    if(retorno.length){
      res.send(200, retorno);
    } else {
      res.send(404, { message: 'Nenhuma parametrização encontrada.' });
    }
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
  next();
};

exports.alterarPergunta = async function (req, res, next){
  try {
    var cqlQuery = '';
    if(!req.body.id){
      res.send(400, { message: 'Por favor, informar o ID' });
      return;
    }
    if(req.body.Order == 0){
      res.send(400, { message: 'O valor da Propriedade Order deve ser maior que Zero!' });
      return;
    }
    // if(!req.body.Order){
    //   res.send(400, { message: 'Por favor, Informar o Order' });
    //   return;
    // }
    // for (x in req.body) {
    //   if(x == " " || req.body[x] == " "){
    //     res.send(400, { message: 'Não é permitido valores vazios!' });
    //     return;
    //   }
    // }
    var id = req.body.id

    var param = await montaParamAlteracao(req.body);

    // if(retorno[0].Order !=  req.body.Order){
    //   var maior;
    //   var menor;
    //   cqlQuery = queriesCql.cql.alteraOrdemPergunta;

    //   if(req.body.Order > retorno[0].Order){
    //       maior = req.body.Order;
    //       menor = retorno[0].Order;
    //       cqlQuery = cqlQuery.replace("@ID",  'I.Order > '+ menor + ' and I.Order <= ' + maior);
    //       cqlQuery = cqlQuery.replace("@ORDEM",  'SET I.Order = I.Order -1');
    //   }else{
    //     maior = retorno[0].Order;
    //     menor = req.body.Order;
    //     cqlQuery = cqlQuery.replace("@ID",  'I.Order >= '+ menor + ' and I.Order < ' + maior);
    //     cqlQuery = cqlQuery.replace("@ORDEM",  'SET I.Order = I.Order +1');   
    //   }
    //   trataRetorno(await db.execute(cqlQuery));
    // }

    cqlQuery = queriesCql.cql.alterarItem;
    cqlQuery = cqlQuery.replace("@ID", id); 
    cqlQuery = cqlQuery.replace("@PARAM", param);
    trataRetorno(await db.execute(cqlQuery), req.query.tela);

    if(retorno.length > 0){
      res.send(200, { message: 'Alteração com Sucesso!' });
    } else {
      res.send(400, { message: 'Alteração não realizada!' });
    }
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
  next();
};

exports.inclusaoPergunta = async function (req, res, next) {
  try {
    var cqlQuery = '';
    if(req.query.tela == 'Cadastro'){
      cqlQuery = queriesCql.cql.buscarCadastro;
    }else {
      cqlQuery = queriesCql.cql.buscarParametrizacao;
    }

    var param = await montaParamBusca(req.body);
    cqlQuery = cqlQuery.replace("@PARAM", param); 
    trataRetorno(await db.execute(cqlQuery));

    if(retorno.length > 0){
      res.send(200, {message:'Registro já existente na base!'});
    } 
    else 
    {
      if(req.body.Order){

        cqlQuery = queriesCql.cql.alteraOrdemPergunta;
        cqlQuery = cqlQuery.replace("@ID",  'P.Order >= '+ req.body.Order);
        cqlQuery = cqlQuery.replace("@ORDEM",  'SET P.Order= P.Order +1');
        await db.execute(cqlQuery)

        cqlQuery = queriesCql.cql.inclusaoPergunta;
        cqlQuery = cqlQuery.replace("@PARAM", await montaParamInclusao(req.body));

      }else{

        cqlQuery = queriesCql.cql.maiorOrdem;
        var result = await db.execute(cqlQuery);
        cqlQuery = queriesCql.cql.inclusaoPergunta;
        cqlQuery = cqlQuery.replace("@PARAM", await montaParamInclusao(req.body, result.records[0]._fields[0] +1));
      }
    trataRetorno(await db.execute(cqlQuery));
    if(retorno.length > 0){
      res.send(200, retorno);
    } else {
      res.send(404, { message: 'Inclusão não realizada!' });
    }
    }
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
  next();
}

exports.deletarPergunta = async function (req, res, next) {
  try {
    if(!req.body.id || req.body.id == 0){
      res.send(200, {message:"Por favor, informar o ID da Pergunta!"});
      return;
    }
    cqlQuery = queriesCql.cql.deletarPergunta;
    cqlQuery = cqlQuery.replace("@ID",  req.body.id);
    await db.execute(cqlQuery);
    res.send(200, {message:"Deletado com sucesso!"});
  } catch (error) {
    var msg = error.message || error;
    res.send(400, { message: msg });
  }
  next();
}




