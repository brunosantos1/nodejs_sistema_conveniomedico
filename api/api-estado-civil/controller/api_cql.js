exports.cql = {
 buscaEstadoCivil:`
 MATCH(D:DetalhesParametro) WHERE D.Type = 'EstadoCivil'
 MATCH(I:ItemParametro)-[ITEM_DE]->(D)
 RETURN COLLECT(properties(I)) as DadosEstadoCivil`
};
