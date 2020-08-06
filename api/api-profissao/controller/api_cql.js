exports.cql = {
  cqlListarProfissao: `
  match(gpa:GrupoPublicoAlvo)
  WITH gpa
  ORDER BY gpa.nomePublicoAlvo 
  RETURN COLLECT( DISTINCT {profissao: gpa.nomePublicoAlvo}) AS Profissoes
  `,
  cqlListarProfissaoPorCidadeEstado: `
  MATCH (gm:GrupoMunicipio {uf: '@uf'})
  WHERE (FILTER(city IN gm.municipios WHERE trim(toUpper(city)) = toUpper('@cidade')))
  WITH DISTINCT gm 
  MATCH (gm)<-[:ABRANGENCIA_COMERCIALIZACAO]-(pbs1:ProdutoBemServico)
  MATCH (pbs1:ProdutoBemServico)-[:DERIVADO_DE]->(pbs2:ProdutoBemServico)
  MATCH (pbs2:ProdutoBemServico)
  MATCH (cc:ContratoConveniado)<-[:GERIDO_POR]-(pbs2)
  MATCH (cc)-[:CONVENIADO_POR]->(pj:PessoaJuridica)
  MATCH (pj)-[:VINCULO]->(r:Regra)
  MATCH (dr:DetalheRegra)-[:DETALHA]->(r)
  MATCH (gpa:GrupoPublicoAlvo)<-[:POSSUI_PUBLICO_ALVO]-(dr)
  WITH gpa
  ORDER BY gpa.nomePublicoAlvo
  RETURN COLLECT( DISTINCT {profissao: gpa.nomePublicoAlvo}) AS ProfissoesPorEstado
  `,

  cqlBuscarParametrizacao: `MATCH (p:Parametrizacao {Type:'Parametrização'})
  MATCH (tp:TipoParametro)-[:PARAMETRIZACAO_DE]->(p)
  WHERE tp.Type = 'Entidade'
  MATCH (dp:DetalhesParametro)-[:DETALHES_DE]->(tp)
  WITH
  {
      Entidade: dp.Type,
      Profissao: dp.Profissao
  } AS parametro
  RETURN parametro`
};
