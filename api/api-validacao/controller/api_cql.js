exports.cql = {
  consultarTitular: `MATCH (p:Proposta{nrProposta: $nrProposta})-[:TITULAR]-(pf:Pessoa) Return pf`,
  consultarFiliacao: `MATCH (p:Proposta{nrProposta: $nrProposta})-[:FILIACAO_PERTENCE]-(f:Filiacao) Return f`,
  consultarRepresentanteLegal: `MATCH (p:Proposta{nrProposta: $nrProposta})-[:RESPONSAVEL_LEGAL]-(pf:Pessoa) Return pf`,
  consultarDependentes: `MATCH (pt:Proposta {nrProposta: $nrProposta}) OPTIONAL MATCH (d:Dependente)-[r:DEPENDENTE]->(pt)  WITH COLLECT(DISTINCT d) AS dependentes return dependentes`,
  consultarPropostaPorTitular: `MATCH (p:Proposta)-[:TITULAR]-(pf:Pessoa {cpf: $cpf}) WHERE p.statusProposta = 2 OR p.statusProposta = 4 Return p`,
  consultarProposta: `MATCH (p:Proposta{nrProposta: $nrProposta}) RETURN p as proposta`,
  consultarVigencia: `
  match (pj:PessoaJuridica)-[v:VINCULO]-(r:Regra{ tipo: "REGRA_CALENDARIO_ACEITACAO" })-[:DETALHA]-(dr:DetalheRegra)
  match (dr)-[:CALENDARIO_ACEITACAO_APLICADO_PARA]->(f:Filial{ nomeFilial: $Filial})
  match (pj)-[:FORNECIDO_POR]-(cf:ContratoFornecedor)
  match (cf)-[:GERIDO_POR]-(pbs:ProdutoBemServico)
  match (pbs)-[:DERIVADO_DE]-(pbs2:ProdutoBemServico)
  match (pbs2)-[:GERIDO_POR]-(pf:PacoteFornecedor)
  where id(pbs2) = toInt($idPlano)
  and substring(toString(datetime({epochmillis:dr.dataVigencia})),0,10)  = $dataVigencia
  with distinct(dr) as vigencia
  return vigencia`,
  cqlConsultarSituacaoANS: `
  MATCH (pbs:ProdutoBemServico)-[:REGULADO_POR]-(bs:BemServico) 
  MATCH (bs)-[:CLASSIFICADO_COMO]-(pa:PlanoAssistencial)
  WHERE id(pbs) = toInt($ID)
  return pa.situacaoAns
   `,
  cqlAtualizarStatusProposta: `
   MATCH (p:Proposta { nrProposta: $nrProposta})
   SET p.statusProposta = $status
   return p as proposta`,
  cqlConsultarParametros: `
  MATCH(tp:TipoParametro {Type:'Validacoes'})-[:DETALHES_DE]-(dp:DetalhesParametro)
  return collect(dp) as validacoes
  `,
  cqlConsultarQuestionario: `
  Match(pe:Pergunta)-[:RESPONDEU]-(dps:DPS)-[:DPS_PROPOSTA]-(pr:Proposta {nrProposta: $nrProposta})
  return Collect(pe) as questoes
  `,
  consultarDocumentos: `MATCH (td)-[:TIPO_DOCUMENTO_DE]->(d:Documento{nrProposta: $nrProposta}) WHERE td.tipoDocumento = $tipoDocumento AND td.url IS NOT NULL  return td`,
  consultarPendenciasProposta: `
  OPTIONAL MATCH (ida:ItemDevolvidoAceitacao { nrProposta: $nrProposta})
  WHERE ida.ativo = true AND (ida.responsavel = 'Cliente' OR ida.responsavel IS NULL OR ida.responsavel = '')
  return ida AS dados`,
}
