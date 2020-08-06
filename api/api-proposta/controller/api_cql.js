exports.cql = {
  cqlcadastrarproposta: `MATCH (n) RETURN n LIMIT 10`,
  cqlConsultarPropostas: `
  MATCH (p:Proposta)
  WHERE p.statusProposta = 3 OR p.statusProposta = '3'
  WITH p{.*} as dados
  RETURN dados
  `,
  cqlConsultarPropostasAceitacao: `
  CALL apoc.load.jdbc('sinf_integracao',"
   SELECT DISTINCT 
     PRE.NroProposta, 
     PRE.statusGerencial, 
     IRP.dtIni, 
     IRP.dtFim, 
     IRR.descricao, 
     TIRR.DS_TIPO_RETORNO_IRREGULARIDADE, 
     TRP.DS_TIPO_RESPONSAVEL_PENDENCIA 
   FROM QSAUDE.DBO.PRECADASTRO PRE 
    INNER JOIN QSAUDE.DBO.IRREGULARIDADEPRECADASTRO IRP ON IRP.idPreCadastro = PRE.id 
    INNER JOIN QSAUDE.DBO.Irregularidades IRR ON IRR.id = IRP.idIrregularidade 
    LEFT JOIN QSAUDE.DBO.TIPO_RETORNO_IRREGULARIDADE TIRR ON TIRR.ID_TIPO_RETORNO_IRREGULARIDADE = IRR.ID_TIPO_RETORNO_IRREGULARIDADE 
    LEFT JOIN QSAUDE.DBO.TIPO_RESPONSAVEL_PENDENCIA TRP ON TRP.ID_TIPO_RESPONSAVEL_PENDENCIA = IRR.ID_TIPO_RESPONSAVEL_PENDENCIA 
   WHERE PRE.NroProposta = $nrProposta AND PRE.statusGerencial not in ('Em Análise', 'Em Análise Externa', 'Prévia em Análise', 'Prévia em Análise Externa')
   ORDER BY 1 DESC
  ") YIELD row as dados
  RETURN dados
  `,
  cqlAtualizarStatusProposta: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p.statusProposta = $status
  return p as proposta`,
  cqlIncluirStatusHistorico: `MATCH (p:Proposta {nrProposta: $nrProposta})
  MERGE (h:HistoricoStatus {nrProposta: $nrProposta})
  MERGE (h)-[:HISTORICO_DE]->(p)
  MERGE (s:Status {nrProposta: $nrProposta, dataInclusao: $dataInclusao, dataFormatada: $dataFormatada, status: $status})
  CREATE (s)-[:STATUS_DE]->(h)
  return s`,
  cqlCriaNoDevolutivasProposta: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  MERGE (da:DevolvidoAceitacao)
  MERGE (da)-[:DEVOLVIDOS_DE]->(p)
  return da
  `,
  cqlDeletaDevolutivasProposta: `
  MATCH (ida:ItemDevolvidoAceitacao { nrProposta: $nrProposta})-[r:ITEM_DE]->(da) DETACH DELETE r, ida
  `,
  cqlInsereDevolutivasProposta: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  MATCH (da:DevolvidoAceitacao)-[:DEVOLVIDOS_DE]-(p)
  MERGE (idan:ItemDevolvidoAceitacao {nrProposta: $nrProposta, descricao: $descricao, dataInicio: $dataInicio, dataFim: $dataFim, responsavel: $responsavel, tipo: $tipo, ativo: $ativo})-[r:ITEM_DE]->(da)
  return idan
  `,
};
