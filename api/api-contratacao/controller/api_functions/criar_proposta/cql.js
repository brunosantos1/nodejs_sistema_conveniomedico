'use strict';
const _enum = require("../../api_enum")
exports.cql = {
  cqlConsultarOperadora:`MATCH (pbs1:ProdutoBemServico)-[:GERIDO_POR]->(pf1:PacoteFornecedor)-[:FORNECIDO_POR]->(pj:PessoaJuridica)
  MATCH (pbs2:ProdutoBemServico)-[:DERIVADO_DE]->(pbs1)-[g:GERIDO_POR]->(pf1)
  MATCH (pbs3:ProdutoBemServico)-[:DERIVADO_DE]->(pbs2)-[:DERIVADO_DE]->(pbs1)-[g:GERIDO_POR]->(pf1)
  MATCH (pbs4:ProdutoBemServico)-[:DERIVADO_DE]->(pbs3)-[:DERIVADO_DE]->(pbs2)-[:DERIVADO_DE]->(pbs1)-[g:GERIDO_POR]->(pf1)
  WHERE
  id(pbs1) = @pbsId
  OR id(pbs2) = @pbsId
  OR id(pbs3) = @pbsId
  OR id(pbs4) = @pbsId
  RETURN DISTINCT {nomeFantasia: pj.nomeFantasia}`,
  cqlConsultarSimulacao: `
  MATCH (p:Pessoa {CPF: '@CPF'})-[r:TEM_INTERESSE]->(s:Simulacao {Ativo:true})
  RETURN s{.*}`,
  cqlConsultarProposta: `MATCH (p:Proposta {nrProposta:'@NrProposta'}) RETURN p{.*}`,
  cqlDesvincularTitular: `
  MATCH (p:Pessoa {cpf: '@CPF'})-[r:TITULAR]->(PT:Proposta {nrProposta:'@NrProposta'})
  delete p,r`,
  cqlVincularSimulacao: `
    MATCH 
     ((p:Pessoa {CPF: '@CPF'})-[r:TEM_INTERESSE]->(s:Simulacao {Ativo:true})),
     (pt:Proposta {nrProposta: '@NrProposta', ativo: true})

      CREATE (s)-[:GEROU]->(pt)

    RETURN s{.*}`,
  cqlCriarTitular: `
    MATCH (pt:Proposta {nrProposta:'@NrProposta'})

    CREATE(pn:Pessoa {
      cpf: '@cpf',
      nome: '@nome',
      email: '@email',
      nascimento: '@nascimento',
      telefone: '@telefone'
    })
    CREATE (pn)-[:TITULAR]->(pt)

    RETURN pn{.*}`,
  cqlCriarEndereco: `
    MATCH 
    (pt:Proposta {nrProposta:'@NrProposta'})

    CREATE(e:Endereco {
      cep: '@cep',
      estado: '@estado',
      cidade: '@cidade'
    })
    CREATE (e)-[:ENDERECO_RESIDENCIAL]->(pt)

    RETURN e{.*}`,
  cqlDesvincularEndereco: `
    MATCH (e:Endereco {cep: '@cep'})-[r:ENDERECO_RESIDENCIAL]->(PT:Proposta {nrProposta:'@nrProposta'})
    delete e,r`,
  cqlCriarProfissao: `
    MATCH 
    (pt:Proposta {nrProposta:'@NrProposta'})

    CREATE(p:Profissao {
      profissao: '@profissao',
      entidade: '@entidade'
    })
    CREATE (p)-[:PROFISSAO_DA]->(pt)

    RETURN p{.*}`,
  cqlDesvincularProfissao: `
    MATCH (p:Profissao {profissao: '@profissao', entidade: '@entidade'})-[r:PROFISSAO_DA]->(PT:Proposta {nrProposta:'@nrProposta'})
    delete p,r`,
  cqlCriarDependente: `
    MATCH 
    (pt:Proposta {nrProposta:'@NrProposta'})

    CREATE(d:Dependente {
      id: '@Id',
      nascimento: '@Nascimento'
    })
    CREATE (d)-[:DEPENDENTE]->(pt)

    RETURN d{.*}`,
  cqlDesvincularDependente: `
    MATCH (d:Dependente {id: '@Id'})-[r:DEPENDENTE]->(PT:Proposta {nrProposta:'@NrProposta'})
    delete d,r`,
};
