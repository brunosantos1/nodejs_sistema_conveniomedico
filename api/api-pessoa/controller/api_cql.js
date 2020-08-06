exports.cql = {
  cqlIncluirPessoa: `
    CREATE (p:Pessoa {
    CPF: '@CPF',
    Email: '@Email',
    Telefone: '@Telefone',
    Nome: '@Nome',
    DataNascimento: '@DataNascimento',
    Ativo: true
 })`,
  cqlAlterarPessoa: `
    MATCH(p:Pessoa) 
    WHERE p.CPF='@CPF'
    SET 
    p.Nome ='@Nome', 
    p.DataNascimento ='@DataNascimento', 
    p.Email = '@Email',
    p.Telefone: '@Telefone',
    p.Ativo = true 
    RETURN p`,
  cqlInativarPessoa: `
    MATCH(p:Pessoa) 
    WHERE p.CPF='@CPF'
    SET 
    p.Ativo = false 
    RETURN p`,
  cqlConsultarPessoa: `
    MATCH(p:Pessoa) 
    WHERE p.CPF='@CPF'
    RETURN p{.*}`,
  cqlIncluirDependente: `
    MATCH (s:Simulacao)
    WHERE ID(s) = @IdSimulacao
    CREATE (p:Pessoa {DataNascimento:'@DataNascimento'})-[:DEPENDENTE]->(s)
    return p
  `  
};
