exports.cql = {
  cqlListarGrauParentesco: `
  CALL apoc.load.jdbc(
    'sinf_integracao', 
    "SELECT 
    GP.IdGParentesco
    ,GP.Descricao
    from QSaude..GParentescos GP
    inner join QSaude..Produtos_GParentescos PGP on PGP.IdGParentesco = GP.IdGParentesco
    inner join QSaude..Planos P on P.IdProduto = PGP.IdProduto where 
    p.IdPlano = @IdPlano"
    ) YIELD row  RETURN COLLECT(row)
  `,
  
  cqlListarGrauParentescoRepresentante: `
  CALL apoc.load.jdbc(
    'sinf_integracao', 
    "SELECT 
	G.IdGParentesco,
	G.Descricao 
	FROM QSAUDE..PLANOS PL 
		   INNER JOIN QSAUDE..PRODUTOS PR ON PR.IDPRODUTO = PL.IDPRODUTO
		   INNER JOIN QSAUDE..GPARENTESCO_RESP_FIN PARENTESCO ON PARENTESCO.ID_OPERADORA = PR.IdOperadora
		   INNER JOIN QSAUDE..GParentescos G ON G.IdGParentesco = PARENTESCO.ID_GPARENTESCO
	WHERE
	PL.IDPLANO = @IdPlano"
    ) YIELD row  RETURN COLLECT(row)
  `,
  cqlListarGrauParentescoDependente: `
  CALL apoc.load.jdbc(
    'sinf_integracao', 
    "SELECT 
    GP.IdGParentesco
    ,GP.Descricao
    from QSaude..GParentescos GP
    inner join QSaude..Produtos_GParentescos PGP on PGP.IdGParentesco = GP.IdGParentesco
    inner join QSaude..Planos P on P.IdProduto = PGP.IdProduto where 
    p.IdPlano = @IdPlano and GP.Descricao  not like 'Titular'"
    ) YIELD row  RETURN COLLECT(row)
  `
  
  
  
};