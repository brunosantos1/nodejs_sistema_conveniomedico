exports.cql = {
  cqlListarEntidades: `MATCH(e:Entidade {Comercializado: true}) RETURN COLLECT(e{.*})`,
  cqlListarOperadoras: `MATCH(e:Entidade {Comercializado: true}) RETURN COLLECT(e{.*})`
};
