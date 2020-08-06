exports.cql = {
  cqlimportarprecadastro: `MATCH (n) RETURN n LIMIT 10`,

cqlBuscaDadosEcommerce:`
MATCH (Prop:Proposta) where Prop.nrProposta = '@PARAM'
  MATCH (Prop)<-[:TITULAR]-(P:Pessoa)
  MATCH (Prop)<-[:ENDERECO_RESIDENCIAL]-(E:Endereco)
  MATCH (Prop)<-[:PROFISSAO_DA]-(Prof:Profissao)
  MATCH (Prop)<-[:GEROU]-(S:Simulacao)
  MATCH (Prop)<-[:FILIACAO_PERTENCE]-(F:Filiacao)
  MATCH (Prop)<-[:DEPENDENTE]-(D:Dependente)
  MATCH (Prop)<-[:FORMA_PAGAMENTO_DE]-(FP:FormaPagamento)
  MATCH (Prop)<-[:DADOS_REEMBOLSO_DE]-(R:DadosReembolso)
  WITH 
  {
    Pessoa: COLLECT(properties(P)), 
    Endereco: COLLECT(properties(E)),
    Profissao:COLLECT(properties(Prof)), 
    Simulacao: COLLECT(properties(S)), 
    Filiacao: COLLECT(properties(F)),
    FormaPagamento:COLLECT(properties(FP)),
    Reembolso: COLLECT(properties(R))
  } AS DadosTitular, D
  RETURN  {DadosTitular: DadosTitular, DadosDependentes: COLLECT(properties(D))}as DadosProposta
  `,

  sqlBuscarTipoCobrancaSinf: `CALL apoc.load.jdbc(
    'sinf_integracao',
    "SELECT TOP 1 P.IdTpCobranca 
    FROM QSAUDE.DBO.Produtos_TpCobranca P
    INNER JOIN QSAUDE.DBO.TiposCobranca TC on P.IdTpCobranca = TC.IdTpCobranca 
    INNER JOIN QSAUDE.DBO.Bancos B on TC.IdBanco = B.IdBanco
    WHERE 
    P.idProduto= @idProduto AND
    (TC.Codigo LIKE '@TpCobranca_%' AND TC.Codigo NOT LIKE 'FOL_%')
    AND P.BloqueadoAdesao = 0"
    ) 
  YIELD row
  RETURN row`
};
