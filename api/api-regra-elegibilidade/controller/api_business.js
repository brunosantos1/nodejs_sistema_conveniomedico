const utils = require("./api_utils");

exports.BLL = {
    makeQueryParameter: function (qry, requisicao, id) {
        return qry
            .replace('@ID', id)
            .replace('@DATAREFERENCIA', requisicao.DATA_REFERENCIA)
            .replace('@DATAASSINATURA', requisicao.DATA_ASSINATURA);
    },
    retornaVinculo: function (vinculos) {
        for (var key in vinculos) {
            if (vinculos[key] != null && vinculos[key].vinculo != null)
                return vinculos[key].vinculo;
        }
        return null;
    },
    validaCNAE: function(requisicao, vinculo){
        if (vinculo.elegibilidade.cnaeEmpresaOperacional && vinculo.elegibilidade.municipioEmpresaOperacional && vinculo.elegibilidade.ufEmpresaOperacional) {
            if (requisicao.CNAE) {
              for (var ix in vinculo.elegibilidade.municipioEmpresaOperacional)
                vinculo.elegibilidade.municipioEmpresaOperacional[ix] = utils.functions.removeAcento(vinculo.elegibilidade.municipioEmpresaOperacional[ix]).toUpperCase();
              for (var ix in vinculo.elegibilidade.ufEmpresaOperacional)
                vinculo.elegibilidade.ufEmpresaOperacional[ix] = utils.functions.removeAcento(vinculo.elegibilidade.ufEmpresaOperacional[ix]).toUpperCase();

              if (!(vinculo.elegibilidade.cnaeEmpresaOperacional.indexOf(requisicao.CNAE) > -1 && vinculo.elegibilidade.municipioEmpresaOperacional.indexOf(utils.functions.removeAcento(requisicao.MUNICIPIO_CNAE).toUpperCase()) > -1 && vinculo.elegibilidade.ufEmpresaOperacional.indexOf(utils.functions.removeAcento(requisicao.UF_CNAE).toUpperCase()) > -1))
                return false;
            }
            else
              return false;
          }
          return true;
    },
    checaIdadeInvalida: function(requisicao, vinculo){
        return vinculo.elegibilidade.idadeAteOperacional * 1 < requisicao.IDADE_TIT_OU_DEP * 1;
    }
}