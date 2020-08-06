exports.cql = {
  BuscaRedeReferenciada: `MATCH(pbs:ProdutoBemServico)
  WHERE id(pbs) = @IDPLANO
  MATCH (pbs)-[:VINCULO]->(r:Regra {tipo: 'REGRA_REDE_REFERENCIADA'}) 
  MATCH (r)<-[D:DETALHA]-(p:Prestador)
  WITH
  {
    Prestador: p.Nome, 
      TipoPrestador: p.TipoPrestador,
      TipoAtendimento: D.TIPO_ATENDIMENTO,
      Top: p.Top
  } AS RET
  RETURN collect(DISTINCT RET{.*})`,
};

exports.cql.BuscaRedeReferenciadaId = function (parametros) {
  var cql = `
  MATCH(pbs:ProdutoBemServico)
  WHERE id(pbs) = `+ parametros.id + `
  MATCH (pbs)-[:VINCULO]->(r:Regra {tipo: 'REGRA_REDE_REFERENCIADA'}) 
  MATCH (r)<-[D:DETALHA]-(p:Prestador)
WHERE
toLower(p.TipoPrestador) = '`+ parametros.tipo.toLowerCase() + `' `;
  if (parametros.prestador)
    cql += `AND toLower(p.Nome) =~ '.*` + parametros.prestador.toLowerCase() + `.*' `;
  cql +=`
  WITH
  {
    Prestador: p.Nome, 
      TipoPrestador: p.TipoPrestador,
      TipoAtendimento: D.TIPO_ATENDIMENTO,
      Top: p.Top
  } AS RET
  RETURN collect(DISTINCT RET{.*})`;
  return cql;
}
