exports.cql = {
  sqlConsultaDpsSinf: `CALL apoc.load.jdbc('sinf_integracao',"SELECT DISTINCT
	DPS.IDQUESTIONARIO AS CodigoQuestionario,
	QI.IDQUESTIONARIOITEM AS CodigoPergunta,
	QI.ORDEM AS Ordem,
	TR.Descricao AS TipoResposta,
	REPLACE(QI.DESCRICAO,':','') AS Pergunta,
	CASE WHEN TR.IdTipoResposta = 1 THEN '' ELSE '' END AS Resposta,
	'' AS Especificacoes,
	'' AS DataEvento
FROM (SELECT MAX (Q.IDQUESTIONARIO) IDQUESTIONARIO
FROM QSAUDE.dbo.Questionarios Q
	INNER JOIN QSAUDE.dbo.TiposProduto_Questionarios TPQ ON TPQ.IdQuestionario = Q.IDQUESTIONARIO
	INNER JOIN QSAUDE.dbo.Produtos P ON P.IdTpProduto = TPQ.IdTpProduto 
	INNER JOIN QSAUDE.dbo.Operadoras O ON O.IdOperadora = P.IdOperadora 
WHERE LOWER(O.NomeFantasia) LIKE LOWER(LTRIM(RTRIM('%@NOME_FANTASIA_OPERADORA%')))
	AND TPQ.dtFimVinculo IS NULL
	AND Q.ATIVO = 1
	AND Q.DTFIM IS NULL ) AS DPS
	INNER JOIN QSAUDE.dbo.QuestionarioItens QI ON QI.IDQUESTIONARIO = DPS.IDQUESTIONARIO 
	INNER JOIN QSAUDE.dbo.TiposResposta TR ON TR.IdTipoResposta = QI.IdTipoResposta
ORDER BY QI.ORDEM ASC") YIELD row RETURN COLLECT(row)`,


  cqlBaseEstaticaBuscarOperadoraPorPlano: `MATCH (c:Convivencia)
  WHERE c.identificadorSinf = @planoIdSinf
  MATCH (pbs:ProdutoBemServico)-[:DE_PARA]->(c)
  MATCH (pbs)-[:GERIDO_POR]->(ft:Fatura)
  MATCH (ft)-[:OPERACIONALIZA]->(cc:ContratoConveniado)
  MATCH (cc)-[:ATENDIDO_POR]->(cf:ContratoFornecedor)
  MATCH (cf)-[:FORNECIDO_POR]->(pj:PessoaJuridica)
  WHERE NOT pj.cnpj  IN ['9180505000150']
  RETURN pj.nomeFantasia`,
  
  cqlConsultarDpsProposta: `MATCH (p:Proposta {nrProposta: "@nrProposta"})
  MATCH (ps:Pessoa)-[:TITULAR]->(p)
  OPTIONAL MATCH (dpsT:DPS)-[:DPS_PERTENCE]->(ps)
  OPTIONAL MATCH (dpsT)-[:DPS_PROPOSTA]->(p)
  OPTIONAL MATCH (dpsT)<-[:RESPONDEU]-(pt:Pergunta)
  OPTIONAL MATCH (p)<-[:DEPENDENTE]-(d:Dependente)
  OPTIONAL MATCH (dpsD:DPS)-[:DPS_PERTENCE]->(d)
  OPTIONAL MATCH (d)-[:DPS_PROPOSTA]->(p)
  OPTIONAL MATCH (dpsD)<-[:RESPONDEU]-(pd:Pergunta)
  OPTIONAL MATCH (doc:Documento)-[:DOCUMENTO_DE]->(p)
  WITH  
  {
    idPlanoSinf: p.planoIdSinf,
    TipoDPS: p.TipoDPS,
    titular: 
      {
        id: id(ps),
        beneficiario: ps,
        codigoDps: dpsT,
        dps: pt
      },
    dependentes: COLLECT( 
      {
        id: id(d),
        dependente: d,
        codigoDps: dpsD,
        dps: pd
      }
    )
  } as questionarios
  RETURN questionarios`,
  titular: `MATCH (ps:Pessoa)-[:TITULAR]->(pr)`,
  dependente: `MATCH (ps:Dependente)-[:DEPENDENTE]->(pr)`,
  perguntaAtualizar: `p.Pergunta@Ordem="@Pergunta", p.Resposta@Ordem="@Resposta", p.CodigoPergunta@Ordem="@idPergunta", p.Especificacoes@Ordem="@Especificacoes", p.DataEvento@Ordem="@DataEvento", d.CodigoQuestionario=@questionario, p.TipoResposta@Ordem="@TipoResposta"`,
  cqlIncluirAtualizarDPS: `MATCH (pr:Proposta {nrProposta: "@nrProposta"})
  @nivelBeneficiario
  WHERE id(ps) = @idPessoa
  MERGE (p:Pergunta)-[:RESPONDEU]->(d:DPS)-[:DPS_PERTENCE]->(ps)
  MERGE (d)-[:DPS_PROPOSTA]->(pr)
  SET pr.TipoDPS = '@TipoDPS', @perguntaAtualizar
  RETURN p,d,pr,ps`,

  cqlAtualizarProposta: `MERGE (pr:Proposta {nrProposta: "@NumeroProposta"})
  SET pr.TipoDPS = '@TipoDPS',
  pr._sendDPS = false
  RETURN pr`,

  cqlIncluirDPS: `MATCH (pr:Proposta {NumeroProposta: "@NumeroProposta"})
  MATCH (p:Pessoa)
  WHERE id(p) = @idPessoa
  CREATE (d:DeclaracaoSaude { Operadora: "@NmOperadora", DataPreenchimento: "@DataPreenchimento"})
  CREATE (n:Pergunta {  
    Questionario: "@Questionario", @Perguntas
    })
  CREATE (n)-[:RESPONDEU]->(d)
  CREATE (d)-[:DPS_PESSOA]->(p)
  CREATE (d)-[:DPS_PROPOSTA]->(pr)
  RETURN n,d,pr,p`,

};


