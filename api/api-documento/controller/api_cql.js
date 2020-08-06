'use strict';
exports.cql = {
  cqlConsultarBaldeProposta: `
    MATCH (d:Documento {nrProposta:'@NrProposta'})
    return d{.*}`,
  cqlCriarBalde: `
    MERGE (d:Documento 
      { 
        nrProposta : '@NrProposta'
      }
    ) RETURN d{.*}`,
  cqlVincularProposta: `
    MATCH 
    (p:Proposta {nrProposta: '@NrProposta'}),
    (d:Documento {nrProposta: '@NrProposta'})

    CREATE (d)-[:DOCUMENTO_DE]->(p)

    RETURN d{.*}`,
  cqlDesvincularProposta: `
    MATCH (d:Documento {nrProposta:'@NrProposta'})-[r:DOCUMENTO_DE]->(p:Proposta {nrProposta: '@NrProposta'})
    delete r`,
  cqlCriarDocumento: `
    MATCH (d:Documento {nrProposta:'@NrProposta'})
    MERGE (td: @TipoDocumento {
      url : '@Url',
      identificador: '@Identificador',
      nrProposta: '@NrProposta',
      tipoDocumento: '@TipoDocumento',
      cpfPessoa: '@CPF',
      ativo : true
    })

    CREATE (td)-[:TIPO_DOCUMENTO_DE]->(d)
    RETURN td{.*}`,
  cqlDesvincularDocumento: `
    MATCH (t:@TipoDocumento {identificador: '@Identificador'})-[r:TIPO_DOCUMENTO_DE]->(d:Documento {nrProposta:'@NrProposta'})
    delete r,t`,

  cqlbBuscarPermissoes: `
    MATCH ((dp:DetalhesParametro {Type: 'Credencial'})-[r:DETALHES_DE]->(tp:TipoParametro {Type:'ServidorAWS'})),
     (ip:ItemParametro {User: '@User'})-[r2:ITEM_DE]->(dp)
    return ip{.*}`,
  cqlbBuscarDocumento: `
    MATCH (t:@TipoDocumento {identificador: '@Identificador'})-[r:TIPO_DOCUMENTO_DE]->(d:Documento {nrProposta:'@NrProposta'})
    return t{.*}`,
  cqlbBuscarDocumentos: `
    MATCH (t)-[r:TIPO_DOCUMENTO_DE]->(d:Documento {nrProposta:'@NrProposta'})
    return COLLECT(t{.*})`,
  cqlbBuscarDocumentosPropostas: `
    MATCH (p:Pessoa {cpf: '@CPF'})-[r:TITULAR]->(pt:Proposta {ativo:true}) 
    MATCH (d)-[:DOCUMENTO_DE]-(pt)
    MATCH (tp)-[rtp:TIPO_DOCUMENTO_DE]-(d) WHERE tp.cpfPessoa = p.cpf

    OPTIONAL MATCH (dp:Dependente)-[r2:DEPENDENTE]-(pt) 
    OPTIONAL MATCH (td)-[rtd:TIPO_DOCUMENTO_DE]-(d) WHERE td.cpfPessoa = dp.cpf

    OPTIONAL MATCH (pr:Pessoa)-[r3:RESPONSAVEL_LEGAL]-(pt) 
    OPTIONAL MATCH (tr)-[rtr:TIPO_DOCUMENTO_DE]-(d) WHERE tr.cpfPessoa = pr.cpfResponsavel

    OPTIONAL MATCH (to)-[rto:TIPO_DOCUMENTO_DE]-(d) WHERE to.cpfPessoa IS NULL
    WITH {
       titular: COLLECT(distinct(tp{.*})),
       dependentes: COLLECT(distinct(td{.*})),
       responsavel: COLLECT(distinct(tr{.*})),
       outros: COLLECT(distinct(to{.*}))
    } as dados
    return dados
    `,
};
