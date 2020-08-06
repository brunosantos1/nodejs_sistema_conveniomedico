exports.cql = {
 salvarToken:`
 MATCH(P:Proposta) WHERE P.nrProposta = '@PROPOSTA'
 CREATE(T:Token{Token:'@TOKEN', Ativo:true, DataGeracao: date({ timezone: 'America/Sao_Paulo' }), HoraLimite: time({ timezone: 'America/Sao_Paulo' })+ duration({ @PARAM }), HoraGeracao:  time({ timezone: 'America/Sao_Paulo' }), Tipo:'@TIPO', Check: false, Enviado: false, DataValidacao:'' , HoraValidacao:'' , IP:'' , Localizacao:'' })-[:TOKEN_CRIADO_PARA]->(P)
 RETURN COLLECT(properties(T)) as DadosToken`,

 validaToken:`
 MATCH(P:Proposta) where P.nrProposta = '@Proposta'
 MATCH(T:Token) where T.Token = '@TOKEN' AND T.Ativo=true AND T.Check = false AND T.DataGeracao = date({ timezone: 'America/Sao_Paulo' }) AND T.HoraLimite > time({ timezone: 'America/Sao_Paulo' })
 MATCH(T)-[TOKEN_CRIADO_PARA]->(P)
 SET T.Check = true, T.Ativo= false, T.DataValidacao= date({ timezone: 'America/Sao_Paulo' }), T.HoraValidacao = time({ timezone: 'America/Sao_Paulo' }), T.IP= '@IP', T.Localizacao = '@Localizacao'
 RETURN T`,

 existeToken:`
 MATCH(T:Token) where T.Token = '@TOKEN' AND T.Date = date({ timezone: 'America/Sao_Paulo' })
 RETURN T`,

 existeTokenProposta:`
 MATCH(P:Proposta {nrProposta: '@PROPOSTA'})<-[TOKEN_CRIADO_PARA]-(T:Token{Tipo: '@TIPO', Check: false, Ativo: true}) 
 SET T.Ativo = false
 RETURN T
 `

};
