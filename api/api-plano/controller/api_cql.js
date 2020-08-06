exports.cql = {
  cqlListarPlanos: `
  MATCH (gm:GrupoMunicipio {uf: '@uf'})
  WHERE (FILTER(city IN gm.municipios WHERE trim(toUpper(city)) = '<<TODOS>>' OR trim(toUpper(city)) = toUpper('@cidade')))
  WITH distinct gm
  MATCH (pbs:ProdutoBemServico)-[:ABRANGENCIA_COMERCIALIZACAO]->(gm)
  MATCH (pbs)-[:GERIDO_POR]->(ft:Fatura)
  MATCH (ft)-[:OPERACIONALIZA]->(cc:ContratoConveniado)
  MATCH (cc)-[:CONVENIADO_POR]->(ent:PessoaJuridica {nomeFantasia: '@Entidade'})
  MATCH (cc)-[:ATENDIDO_POR]->(cf:ContratoFornecedor)
  MATCH (cf)-[:FORNECIDO_POR]->(pj:PessoaJuridica)
  WHERE NOT pj.cnpj  IN ['9180505000150']
  MATCH (pbs)-[:DERIVADO_DE]->(pbs1:ProdutoBemServico)
  MATCH (pbs)-[:DE_PARA]->(c:Convivencia)
  MATCH (pbs1)-[:DERIVADO_DE]->(pbs2:ProdutoBemServico)
  MATCH (pbs2)-[:DERIVADO_DE]->(pbs3:ProdutoBemServico)
  MATCH (pbs3)-[:REGULADO_POR]->(bs:BemServico)
  WHERE NOT EXISTS(pbs3.dataFimComercializacao)
  MATCH (pbs3)-[:REGULADO_POR]->(bs:BemServico)
  WHERE bs.tipo IN ['SAÚDE']
  MATCH (bs:BemServico)-[:CLASSIFICADO_COMO]->(pa:PlanoAssistencial {situacaoAns: 'ATIVO'})
  WHERE bs.tipo IN ['SAÚDE'] AND pa.segmentacaoAns <> 'ODONTOLÓGICO'
  OPTIONAL MATCH (pj)-[:CLASSIFICADA_COMO]->(o:Operadora)-[:POSSUI_LOGO]->(l:Logotipo)
  WHERE o.tipoClassificacao IN ['Operadora de Planos de Saúde', 'Seguradora']
  OPTIONAL MATCH (pj)-[:CLASSIFICADA_COMO]->(s:Seguradora)-[:POSSUI_LOGO]->(l1:Logotipo)
  WHERE s.tipoClassificacao IN ['Operadora de Planos de Saúde', 'Seguradora']
  OPTIONAL MATCH (pj)-[:CLASSIFICADA_COMO]->(og:OdontologiadeGrupo)-[:POSSUI_LOGO]->(l2:Logotipo)
  WHERE og.tipoClassificacao IN ['Operadora de Planos de Saúde', 'Seguradora']
  WITH  
    {
      id: id(pbs3),
      idPJ: id(pj),
      nome: pbs3.nome,
      nome_amigavel: pbs3.nomeAmigavel,
      reembolso: pbs.multiploReembolso,
      coparticipacao: pa.coparticipacao,
      codigoans: pa.codigoPlanoAssistencial,
      nomePlanoAns: pa.nomePlanoAssistencial,
      operadora: pj.nomeFantasia,
      operadoraOrdem: null,
      operadoraLogo: pj.cnpj,
      abrangencia: pa.tipoAbrangenciaAnd,
      acomodacao: pa.acomodacao,
      segmentacao: CASE pa.segmentacaoAns WHEN 'HOSP C/ OBST' THEN 'Internação c/ Parto' ELSE
				   CASE pa.segmentacaoAns WHEN 'HOSP S/ OBST' THEN 'Internação s/ Parto' ELSE
				   CASE pa.segmentacaoAns WHEN 'AMB + HOSP C/ OBST' THEN 'Ambulatorial + Internação c/ Parto' ELSE
           CASE pa.segmentacaoAns WHEN 'AMB + HOSP S/ OBST' THEN 'Ambulatorial + Internação s/ Parto' ELSE
           CASE pa.segmentacaoAns WHEN 'AMBULATORIAL' THEN 'Ambulatorial' ELSE 
           CASE pa.segmentacaoAns WHEN 'ODONTOLÓGICO' THEN 'Odontológico' ELSE pa.segmentacaoAns
           END END END END END END,
      nivel: pbs3.nivel,
      idplanos: collect (DISTINCT c{.identificadorSinf})
    } AS planos 
  RETURN
    {plano: collect(DISTINCT planos), total: COUNT(planos)}
   `,
cqlListarVigencias: `
match (pj:PessoaJuridica)-[v:VINCULO]-(r:Regra{ tipo: "REGRA_CALENDARIO_ACEITACAO" })-[:DETALHA]-(dr:DetalheRegra)
match (dr)-[:CALENDARIO_ACEITACAO_APLICADO_PARA]->(f:Filial{ nomeFilial: "@FILIAL"})
match (pj)-[:FORNECIDO_POR]-(cf:ContratoFornecedor)
match (cf)-[:GERIDO_POR]-(pbs:ProdutoBemServico)
match (pbs)-[:DERIVADO_DE]-(pbs2:ProdutoBemServico)
match (pbs2)-[:GERIDO_POR]-(pf:PacoteFornecedor)
where id(pbs2) = @ID
and dr.dataFechamentoAceitacao >= @DATA_ATUAL
with distinct(dr) as detalhe
order by dr.dataVigencia 
limit @QUANTIDADE
with 
{
   datavigencia: toString(date(datetime({epochmillis:detalhe.dataVigencia}))),
   datafechamentoaceitacao: toString(datetime({epochmillis:detalhe.dataFechamentoAceitacao})),
   datafechamentoreapresentacao: toString(datetime({epochmillis:detalhe.dataFechamentoReapresentacao}))
} as vigencias
return collect(vigencias)
`,
cqlConsultarSituacaoANS: `
MATCH (pbs:ProdutoBemServico)-[:REGULADO_POR]-(bs:BemServico) 
MATCH (bs)-[:CLASSIFICADO_COMO]-(pa:PlanoAssistencial)
WHERE id(pbs) = @ID 
return pa.situacaoAns
`,

cqlOrdenacaoOperadoras: `MATCH (dp:DetalhesParametro)
MATCH (dp)-[:DETALHES_DE]->(tp:TipoParametro)
WHERE tp.Type = 'OrdenacaoOperadora'
MATCH (tp)-[:PARAMETRIZACAO_DE]->(p:Parametrizacao)
WITH
{
	nomeFantasia: dp.nomeFantasia,
  ordem: dp.Ordem 
} as ordenacao
ORDER BY ordenacao.Ordem
RETURN collect(ordenacao)`
};
