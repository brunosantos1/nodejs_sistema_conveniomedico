exports.cql = {
  cqlListarEntidades: `
  MATCH (cc)-[cp:CONVENIADO_POR]->(pj:PessoaJuridica)
  WHERE not pj.cnpj  in ['9180505000150']
  Return COLLECT( DISTINCT {NomeFantasia:pj.nomeFantasia,RazaoSocial:pj.razaoSocial}) AS Entidades`,
  
  cqListarEntidadesPorProfissao: `
  MATCH (gm:GrupoMunicipio {uf: '@uf'})
  WHERE (FILTER(city IN gm.municipios WHERE trim(toUpper(city)) = toUpper('@cidade')))
  WITH distinct gm
  MATCH (gpa:GrupoPublicoAlvo)<-[ppa:POSSUI_PUBLICO_ALVO]-(dr:DetalheRegra)
  MATCH (dr)-[d:DETALHA]->(r:Regra)
  MATCH (r)<-[v:VINCULO]-(pj:PessoaJuridica)
  MATCH (pj)<-[:CONVENIADO_POR]-(cc:ContratoConveniado)
  MATCH (cc)<-[:GERIDO_POR]-(pbs1:ProdutoBemServico)
  MATCH (pbs1)<-[:DERIVADO_DE]-(pbs2:ProdutoBemServico)
  MATCH (pbs2)-[:ABRANGENCIA_COMERCIALIZACAO]->(gm)
  WHERE toLower(gpa.nomePublicoAlvo) = toLower('@Profissao')
  AND NOT pj.cnpj IN ['9180505000150']
  WITH pj
  ORDER BY pj.nomeFantasia
  RETURN COLLECT( DISTINCT {NomeFantasia:pj.nomeFantasia,RazaoSocial:pj.razaoSocial}) AS Entidades
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
