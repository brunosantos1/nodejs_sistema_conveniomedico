var axios = require("axios");
const config = require("./api_config.js");
const queriesCql = require("./api_cql");
const neo4j = require("neo4j-driver").v1;

//
// Método privado genérico para execução de cypher query.
//

async function executeCypherAsync(cql) {
  let driver = neo4j.default.driver(
    config.neo4j_driver.url_bold,
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

function validaParametrosObrigatorios(payload) {
  if (
    payload.FORNECEDOR != null && payload.FORNECEDOR != ''
    && payload.CONVENIADO != null && payload.CONVENIADO != ''
    && payload.UF != null && payload.UF != ''
    && payload.MUNICIPIO != null && payload.MUNICIPIO != ''
    && payload.DIA_VIGENCIA_FATURA != null && payload.DIA_VIGENCIA_FATURA.toString() != ''
    && payload.DESCRICAO_PLANO != null && payload.DESCRICAO_PLANO != ''
    && payload.DATA_REFERENCIA != null && payload.DATA_REFERENCIA != ''
    && payload.IDADE_TIT_OU_DEP != null && payload.IDADE_TIT_OU_DEP.toString() != ''
  )
    return true;

  return false;
}

function retornaVinculo(vinculos) {
  for (var key in vinculos) {
    if (vinculos[key] != null && vinculos[key].vinculo != null)
      return vinculos[key].vinculo;
  }
  return null;
}

function removeAcento(text) {
  text = text.toLowerCase();
  text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
  text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
  text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
  text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
  text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
  text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
  return text;
}

exports.elegibilidade = async function (req, res, next) {
  try {
    var requisicao = req.body
    if (typeof requisicao === 'string')
      requisicao = JSON.parse(requisicao)

    if (validaParametrosObrigatorios(requisicao)) {

      if (requisicao.DATA_REFERENCIA) requisicao.DATA_REFERENCIA = Number(new Date(requisicao.DATA_REFERENCIA));
      if (requisicao.DATA_ASSINATURA) requisicao.DATA_ASSINATURA = Number(new Date(requisicao.DATA_ASSINATURA ? requisicao.DATA_ASSINATURA : "9999-12-31"));

      var cql = queriesCql.cql.cqlidplanofatura(requisicao);
      let id = await executeCypherAsync(cql);
      if (!isNaN(id)) {
        cql = queriesCql.cql.cqlgetparametro
          .replace('@ID', id)
          .replace('@DATAREFERENCIA', requisicao.DATA_REFERENCIA)
          .replace('@DATAASSINATURA', requisicao.DATA_ASSINATURA);

        let vinculos = await executeCypherAsync(cql);

        var vinculo = {};
        vinculo.elegibilidade = retornaVinculo(vinculos.arvore);

        if (vinculo.elegibilidade != null) {
          vinculo.elegibilidade = Object.assign(vinculo.elegibilidade, vinculo.elegibilidade.detalheRegra);

          var validaCNAE = true;
          if (vinculo.elegibilidade.cnaeEmpresaOperacional && vinculo.elegibilidade.municipioEmpresaOperacional && vinculo.elegibilidade.ufEmpresaOperacional) {
            if (requisicao.CNAE) {
              for (var ix in vinculo.elegibilidade.municipioEmpresaOperacional)
                vinculo.elegibilidade.municipioEmpresaOperacional[ix] = removeAcento(vinculo.elegibilidade.municipioEmpresaOperacional[ix]).toUpperCase();
              for (var ix in vinculo.elegibilidade.ufEmpresaOperacional)
                vinculo.elegibilidade.ufEmpresaOperacional[ix] = removeAcento(vinculo.elegibilidade.ufEmpresaOperacional[ix]).toUpperCase();

              if (!(vinculo.elegibilidade.cnaeEmpresaOperacional.indexOf(requisicao.CNAE) > -1 && vinculo.elegibilidade.municipioEmpresaOperacional.indexOf(removeAcento(requisicao.MUNICIPIO_CNAE).toUpperCase()) > -1 && vinculo.elegibilidade.ufEmpresaOperacional.indexOf(removeAcento(requisicao.UF_CNAE).toUpperCase()) > -1))
                validaCNAE = false;
            }
            else
              validaCNAE = false;
          }

          if (vinculo.elegibilidade.idadeAteOperacional * 1 < requisicao.IDADE_TIT_OU_DEP * 1) {
            if (!validaCNAE)
              res.send({ status: "NÃO ACEITO", mensagem: "Idade e CNAE não permitidos para esta regra.", contexto: requisicao });
            else
              res.send({ status: "NÃO ACEITO", mensagem: "Idade não permitida para esta regra.", contexto: requisicao });
          }
          else {
            if (!validaCNAE)
              res.send({ status: "NÃO ACEITO", mensagem: "CNAE não permitido para esta regra.", contexto: requisicao });
            else {
              vinculo.status = "ACEITO";
              vinculo.mensagem = "Contexto aceito para Regra de Elegibilidade.";
              res.send(vinculo);
            }
          }
        }
        else {
          res.send({ status: "NÃO ACEITO", mensagem: "Não foi encontrado uma Regra de Elegibilidade válida para o contexto informado.", contexto: requisicao });
        }
      }
      else {
        res.send({ status: "NÃO ACEITO", mensagem: "Não foi encontrado uma Fatura para o contexto informado.", contexto: requisicao });
      }
    }
    else {
      res.status(400);
      res.send({ error: true, status: "ERRO", mensagem: "Parâmetros obrigatórios não preenchidos!" });
    }
  }
  catch (err) {
    next(err);

  }

  next();
};
