'use strict';
const _enum = require("./api_enum")
exports.cql = {
  cqlConsultarPropostasPessoa: `
  MATCH (p:Pessoa {cpf: '@CPF'})-[r:TITULAR]->(pt:Proposta {ativo:true}) 
  MATCH (pf:Profissao)-[r2:PROFISSAO_DA]->(pt) 
  MATCH (e:Endereco)-[r3:ENDERECO_RESIDENCIAL]->(pt) 
  OPTIONAL MATCH (d:Dependente)-[r4:DEPENDENTE]->(pt)
  WITH  
    {
      planoIdSinf: pt.planoIdSinf,
      planoId: pt.planoId,
      ativo: pt.ativo,
      nrProposta: pt.nrProposta,
      statusProposta: pt.statusProposta,
      entidade: pf.entidade,
      nascimentoTitular: p.nascimento,
      dataInicio: pt.dataInicio,
      uf: e.estado,
      cidade: e.cidade,
      justificativa: pt.justificativa,
      dependentes: COLLECT(DISTINCT d{.*})
    } AS planos
  RETURN collect(DISTINCT planos)
  `,
  cqlConsultarProposta: `MATCH (p:Proposta {nrProposta:'@NrProposta'}) RETURN p{.*}`,
  cqlConsultarDadosProposta: `
  MATCH (pt:Proposta {nrProposta:'@NrProposta'})
  OPTIONAL MATCH ((t:Pessoa)-[r:TITULAR]->(pt))
  OPTIONAL MATCH ((e:Endereco)-[r2:ENDERECO_RESIDENCIAL]->(pt))
  OPTIONAL MATCH ((ec:Endereco)-[r3:ENDERECO_COMERCIAL]->(pt))
  OPTIONAL MATCH ((p:Profissao)-[r4:PROFISSAO_DA]->(pt))
  OPTIONAL MATCH ((d:Dependente)-[r5:DEPENDENTE]->(pt))
  OPTIONAL MATCH ((rl:Pessoa)-[r6:RESPONSAVEL_LEGAL]->(pt))
  RETURN {
    proposta: pt{.*},
    titular: t{.*},
    endereco: e{.*},
    enderecoComercial: ec{.*},
    profissao: p{.*},
    dependentes: COLLECT(d{.*}),
    responsavelLegal: rl{.*}
  }`,
  cqlCriarProposta: `
    CREATE(p:Proposta 
     { 
       nrProposta : '@NrProposta',
       fluxoId: '@FluxoId',
       sequencia: 1,
       planoId: '@PlanoId',
       planoIdSinf: '@PlanoIdSinf',
       dataInicio : '@DataInicio',
       statusProposta: `+ _enum.statusProposta.EM_PREENCHIMENTO.value + `,
       ativo : true
      }
    ) RETURN p{.*}`,
  cqlIncluirResponsavelFinanceiro: `MATCH (p:Proposta {nrProposta: @NrProposta})
  CREATE (r:ResponsavelFinanceiro {Nome: "@Nome", cpf: "@cpf",telefone: "@telefone"})
  CREATE (r)-[:RESPONSAVEL_FINANCEIRO_POR]->(p)
  return r,p`,
  cqlDesativarResponsavelFinanceiroProposta: `MATCH (p:Proposta {nrProposta:@NrProposta})<-[:RESPONSAVEL_FINANCEIRO_POR]-(r:ResponsavelFinanceiro)
  REMOVE r:ResponsavelFinanceiro
  SET r:ResponsavelFinanceiro_Inativo, r.DataAlteracao = "@DataAlteracao"
  RETURN r`,
  cqlIncluirVigencia: `
  MATCH(p:Proposta {nrProposta: '@nrProposta'})
  SET p.dataVigencia = '@dataVigencia'
  RETURN p.dataVigencia
  `,
  cqlAtualizarStatusProposta: `
  MATCH(p:Proposta {nrProposta: '@NrProposta'})
  SET p.statusProposta = '@NovoStatus',
  p.dataAlteracao = '@DataAlteracao'
  RETURN p.statusProposta
  `,
  cqlIncluirStatusHistorico: `MATCH (p:Proposta {nrProposta: '@nrProposta'})
  MERGE (h:HistoricoStatus {nrProposta:'@nrProposta'})
  MERGE (h)-[:HISTORICO_DE]->(p)
  MERGE (s:Status {nrProposta:'@nrProposta', dataInclusao: '@dataInclusao', dataFormatada: '@dataFormatada', status: "@status"})
  CREATE (s)-[:STATUS_DE]->(h)
  return s`,
  cqlConsultarStatusProposta: `
  OPTIONAL MATCH (s:Status)-[r:STATUS_DE]->(h:HistoricoStatus {nrProposta: '@nrProposta'}) 
  WITH s AS  status
  return COLLECT(status{.*})`,
  cqlConsultarPendenciasProposta: `
  OPTIONAL MATCH (ida:ItemDevolvidoAceitacao { nrProposta: '@nrProposta'})
  WHERE ida.ativo = true AND (ida.responsavel = 'Cliente' OR ida.responsavel IS NULL OR ida.responsavel = '')
  WITH ida AS  pendencias
  return COLLECT(pendencias{.*})`,
  cqlCancelarProposta: `
  MATCH(p:Proposta {nrProposta: '@nrProposta'})
  SET p.justificativa = '@justificativa'
  RETURN p
  `,
};
