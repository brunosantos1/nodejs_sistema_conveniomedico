exports.cql = {
  sqlConsultaTabelaPrecos: `CALL apoc.load.jdbc('sinf_integracao',"SELECT VW_IDADES.IdadeBeneficiario idade ,PLA.IdPlano idplano, PV.Valor0 preco, PV.IdadeDe de, PV.IdadeAte ate FROM QSAUDE.DBO.PlanosValores PV INNER JOIN QSAUDE.DBO.PLANOS PLA ON PLA.IdPlano = PV.IdPlano INNER JOIN QSAUDE.DBO.PRODUTOS P ON P.IdProduto = PLA.IdProduto INNER JOIN QSAUDE.DBO.Tipos_Planos TP ON TP.idTipo_Plano = PLA.idTipo_Plano INNER JOIN QSAUDE.DBO.CLIENTES C ON C.IdCliente = P.IdCliente INNER JOIN (SELECT SplitValue AS IdadeBeneficiario FROM QSAUDE.DBO.FN_SPLIT('@IDADES',',')) AS VW_IDADES ON VW_IDADES.IdadeBeneficiario BETWEEN PV.IdadeDe AND PV.IdadeAte WHERE @Periodo BETWEEN PV.AMCoberturaDe AND PV.AMCoberturaAte AND PLA.IdPlano IN (@IdPlano)") YIELD row RETURN COLLECT(row{.*})`,
  cqlConstultaPrecos: `
  match(vtp:ValorTabelaPreco)-[:VALOR_PERIODO]-(cv:ConfiguracaoValor)
  match(cv)-[:CONFIGURACAO_VALOR]-(dr:DetalheRegra)-[:DETALHA]-(r:Regra { tipo: "REGRA_TABELA_PRECO" })
  match(r)-[:VINCULO]-(pbs1:ProdutoBemServico)
  match(pbs1)-[:DERIVADO_DE]-(pbs:ProdutoBemServico)-[:GERIDO_POR]-(pf:PacoteFornecedor)
  match(pbs1)-[:DERIVADO_DE]-(pbs2:ProdutoBemServico)-[:GERIDO_POR]-(cc:ContratoConveniado)
  match(cc)-[:CONVENIADO_POR]-(pj:PessoaJuridica)
  WHERE id(pbs) in [@PLANOS]
  and pj.nomeFantasia ='@ENTIDADE'
  and dr.periodoDe <= @PERIODO <= dr.periodoAte
  with pbs,vtp
  order by id(pbs), vtp.idadeDe
  WITH  
  {
    idplano: id(pbs),
    precos: collect( vtp {.idadeDe, .idadeAte, .valorContratual})
  } as planos
return collect(DISTINCT planos)
  `
};
