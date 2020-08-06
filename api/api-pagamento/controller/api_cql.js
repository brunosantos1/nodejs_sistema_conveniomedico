exports.cql = {
  cqllistarFormasPagamento: `
  CALL apoc.load.jdbc(
    'sinf_integracao',
    "Exec QSaude..PR_FORMAPAGAMENTO"
    ) 
  YIELD row 
  WHERE row.CODIGO is not NULL
  WITH   
  {
    forma: row.DS_FORMA_PAGAMENTO,
    bancos: collect (distinct row{.CODIGO,.IDBANCO})
  } as forma
  RETURN COLLECT(forma)`,
  cqlIncluirFormaPagamentoProposta: `
  MATCH (p:Proposta {nrProposta: "@NrProposta"})
  CREATE (f:FormaPagamento {Forma: "@Forma", Banco: "@Banco",Agencia: "@Agencia",ContaCorrente: "@ContaCorrente"})
  CREATE (p)<-[:FORMA_PAGAMENTO]-(f)
  return p,f`,
  cqlDesativarFormaPagamentoProposta: `MATCH (p:Proposta {nrProposta:"@NrProposta"})<-[:FORMA_PAGAMENTO]-(n:FormaPagamento)
  REMOVE n:FormaPagamento
  SET n:FormaPagamento_Inativo, n.DataAlteracao = "@DataAlteracao"
  RETURN n`,
  cqlCarregarFormaPagamentoProposta:`
	MATCH (p:Proposta {nrProposta:"@NrProposta"})<-[:FORMA_PAGAMENTO]-(n:FormaPagamento)
	RETURN n
  `,
  cqlCarregarReembolsoProposta:`
	MATCH (p:Proposta {nrProposta:"@NrProposta"})<-[:REEMBOLSAR]-(n:DadosReembolso)
	RETURN n
  `,
  cqlIncluirReembolsoProposta: `
  MATCH (p:Proposta {nrProposta: "@NrProposta"})
  CREATE (r:DadosReembolso {Banco: "@ReembolsoBanco",Agencia: "@ReembolsoAgencia",ContaCorrente: "@ReembolsoContaCorrente"})
  CREATE (p)<-[:REEMBOLSAR]-(r)
  return p,r`,
  cqlDesativarReembolsoProposta: `MATCH (p:Proposta {nrProposta:"@NrProposta"})<-[:REEMBOLSAR]-(r:DadosReembolso)
  REMOVE r:DadosReembolso
  SET r:DadosReembolso_Inativo, r.DataAlteracao = "@DataAlteracao"
  RETURN r`,
};