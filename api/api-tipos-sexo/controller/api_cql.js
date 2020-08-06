//
//Query para consulta de Sexo no Neo4j
//
exports.cql = {
  cqlConsultaSexo: 
  `MATCH(D:DetalhesParametro) WHERE D.Type = 'Sexo'
  MATCH(I:ItemParametro)-[ITEM_DE]->(D)
  RETURN COLLECT(properties(I)) as DadosSexo`
};
