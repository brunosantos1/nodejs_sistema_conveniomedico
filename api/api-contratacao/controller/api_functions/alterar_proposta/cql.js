'use strict';
const _enum = require("../../api_enum")
exports.cql = {
  cqlConsultarProposta: `MATCH (p:Proposta {nrProposta:'@NrProposta'}) RETURN p{.*}`,
  cqlDesvincularTitular: `
  MATCH (p:Pessoa {cpf: '@CPF'})-[r:TITULAR]->(PT:Proposta {nrProposta:'@NrProposta'})
  delete p,r`,
  cqlAtualizarTitular: `
    MATCH 
    (pt:Proposta {nrProposta:'@NrProposta'})
    CREATE(pn:Pessoa @body)
    CREATE (pn)-[:TITULAR]->(pt)
    RETURN pn{.*}`,
  cqlDesvincularEnderecoResidencial: `
    MATCH (e:Endereco)-[r:ENDERECO_RESIDENCIAL]->(pt:Proposta {nrProposta:'@NrProposta'})
    delete e,r`,
  cqlAtualizarEnderecoResidencial: `
    MATCH 
    (pt:Proposta {nrProposta:'@NrProposta'})
    CREATE(e:Endereco @body)
    CREATE (e)-[:ENDERECO_RESIDENCIAL]->(pt)
    RETURN e{.*}`,
  cqlDesvincularEnderecoComercial: `
    MATCH (e:Endereco)-[r:ENDERECO_COMERCIAL]->(pt:Proposta {nrProposta:'@NrProposta'})
    delete e,r`,
  cqlAtualizarEnderecoComercial: `
    MATCH 
    (pt:Proposta {nrProposta:'@NrProposta'})
    CREATE(e:Endereco @body)
    CREATE (e)-[:ENDERECO_COMERCIAL]->(pt)
    RETURN e{.*}`,
  cqlDesvincularResponsavelLegal: `
    MATCH (p:Pessoa)-[r:RESPONSAVEL_LEGAL]->(PT:Proposta {nrProposta:'@NrProposta'})
    delete p,r`,
  cqlAtualizarResponsavelLegal: `
      MATCH 
      (pt:Proposta {nrProposta:'@NrProposta'})
      CREATE(pn:Pessoa @body)
      CREATE (pn)-[:RESPONSAVEL_LEGAL]->(pt)
      RETURN pn{.*}`,
  cqlAtualizarSequencia:
    `MATCH (pt:Proposta {nrProposta:'@NrProposta'})
     SET pt.sequencia = @Sequencia, pt.dataAlteracao = '@DataAlteracao'
     RETURN pt.Sequencia`,
  cqlAtualizarEnderecoCobranca:
    `MATCH (pt:Proposta {nrProposta:'@NrProposta'})
      SET pt.enderecoCobranca = '@EnderecoCobranca', pt.dataAlteracao = '@DataAlteracao'
      RETURN pt{.*}`,
  cqlAtualizarOperadoraCongenere:
    `MATCH (pt:Proposta {nrProposta:'@NrProposta'})
        SET pt.possuiPlano = @PossuiPlano,
        pt.operadoraCongenere = '@OperadoraCongenere',
        pt.aceiteNaoReducaoCarencia = @AceiteNaoReducaoCarencia,
        pt.dataAlteracao = '@DataAlteracao'
        RETURN pt{.*}`,
  cqlDesvincularDependente: `
        MATCH (d:Dependente)-[r:DEPENDENTE]->(PT:Proposta {nrProposta:'@NrProposta'})
        delete d,r`,
  cqlAtualizarDependente: `
        MATCH 
        (pt:Proposta {nrProposta:'@NrProposta'})
        CREATE(dn:Dependente @body)
        CREATE (dn)-[:DEPENDENTE]->(pt)
        RETURN dn{.*}`,
};
