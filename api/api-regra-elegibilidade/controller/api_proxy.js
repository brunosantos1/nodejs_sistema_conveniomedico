exports.payload = {
    validaPayload: function(payload){
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
}