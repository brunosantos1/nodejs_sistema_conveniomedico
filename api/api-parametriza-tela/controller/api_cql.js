exports.cql = {
  buscarCadastro:`
  MATCH(P:Parametrizacao)<-[:PARAMETRIZACAO_DE]-(TP:TipoParametro) where TP.Type = 'ParamTelas'
  MATCH(D:DetalhesParametro)-[:DETALHES_DE]->(TP) where D.Type = 'Cadastro'
  MATCH(D2:DetalhesParametro)-[:DETALHES_DE]->(D) @ParamTela
  WITH D2
  MATCH(I:ItemParametro)-[ITEM_DE]->(D2) @PARAM
  WITH 
  {
     Tela: D2.Type, id: id(I), Propriedade: properties(I) 
  } AS PARAM
  RETURN PARAM ORDER BY PARAM.Type DESC`,

  buscarParametrizacao:`
  MATCH(P:Parametrizacao)<-[:PARAMETRIZACAO_DE]-(TP:TipoParametro) where TP.Type = 'ParamTelas'
  MATCH(D:DetalhesParametro)-[:DETALHES_DE]->(TP) where D.Type = '@Tela'
  WITH D
  MATCH(I:ItemParametro)-[ITEM_DE]->(D) @PARAM
  RETURN {id: id(I), Propriedade: COLLECT(properties(I))}as parametrizacao`,

 alterarItem:`
 MATCH(I:ItemParametro) where id(I) = @ID
 @PARAM
 RETURN {id: id(I), Propriedade: COLLECT(properties(I))} as itemParametro`,

 alteraOrdemPergunta:`
 MATCH(P:Pergunta) where @ID
 @ORDEM
 RETURN {id: id(P), propriedade: COLLECT(properties(P))} as pergunta`,

 maiorOrdem:"MATCH(P:Pergunta) return max(P.Order)",

 inclusaoPergunta:`MATCH(Q:Questionario)
                   CREATE(Q)<-[:PERGUNTA_DE]-(P:Pergunta {@PARAM})
                   return {id: id(P), propriedade: COLLECT(properties(P))} as pergunta`,

 deletarPergunta:`MATCH(P:Pergunta) where id(P) = @ID DETACH DELETE P`,

};
