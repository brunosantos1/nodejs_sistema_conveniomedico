exports.cql = {
  cqlidplanofatura:  function(parametroplanofatura){ 
                  return `MATCH(pbs_fat:ProdutoBemServico)-[:GERIDO_POR]->(fat:Fatura)
                  WHERE (fat.dataInicioComercializacao <= `+ parametroplanofatura.DATA_REFERENCIA +` AND COALESCE(fat.dataFimComercializacao, 253402214400000) >= `+ parametroplanofatura.DATA_REFERENCIA +` AND COALESCE(fat.limiteAssinatura, 253402214400000) >=`+ parametroplanofatura.DATA_ASSINATURA +`) `
                  + ` AND (pbs_fat.dataInicioComercializacao <= `+ parametroplanofatura.DATA_REFERENCIA +` AND COALESCE(pbs_fat.dataFimComercializacao, 253402214400000) >= `+ parametroplanofatura.DATA_REFERENCIA +` AND COALESCE(pbs_fat.limiteAssinatura, 253402214400000) >=`+ parametroplanofatura.DATA_ASSINATURA +`) `

                 +` MATCH(pbs_fat)-[:DERIVADO_DE]->(pbs_cc:ProdutoBemServico)-[:DERIVADO_DE]->(pbs_cf:ProdutoBemServico)-[:DERIVADO_DE]->(pbs_pct:ProdutoBemServico)-[:REGULADO_POR]->(bs:BemServico)
                    MATCH(pbs_fat)-[:ABRANGENCIA_COMERCIALIZACAO]->(gm:GrupoMunicipio)
                    MATCH(fat)-[:OPERACIONALIZA]->(cc:ContratoConveniado)-[:ATENDIDO_POR]->(cf:ContratoFornecedor)-[:FORNECIDO_POR]->(forn:PessoaJuridica)
                    MATCH(cc)-[:CONVENIADO_POR]->(conv:PessoaJuridica)
                    WHERE toUpper(bs.nome) = toUpper('`+ parametroplanofatura.DESCRICAO_PLANO +`')
                    AND toUpper(forn.nomeFantasia) = toUpper('`+ parametroplanofatura.FORNECEDOR +`')
                    AND toUpper(conv.nomeFantasia) = toUpper('`+ parametroplanofatura.CONVENIADO +`')`

                    +(parametroplanofatura.REEMBOLSO ? ` AND pbs_fat.multiploReembolso = ` + parametroplanofatura.REEMBOLSO : ``)
                    
                    +(parametroplanofatura.MUNICIPIO ? ` AND (filter(x IN gm.municipios WHERE trim(toUpper(x)) = '<<TODOS>>' OR trim(toUpper(x)) = toUpper('`+ parametroplanofatura.MUNICIPIO +`'))` : ``) + `) `

                    +(parametroplanofatura.UF ? ` AND toUpper(gm.uf) = toUpper('`+ parametroplanofatura.UF +`')` : ``)
                    
                    +(parametroplanofatura.DIA_VIGENCIA_FATURA ? ` AND fat.diaInicioVigencia = ` + parametroplanofatura.DIA_VIGENCIA_FATURA : ``)

                    +` WITH pbs_fat, bs
                     OPTIONAL MATCH (bs)-[:CLASSIFICADO_COMO]->(pa:PlanoAssistencial) `
                    +(parametroplanofatura.COPARTICIPACAO ? ` WHERE pa.coparticipacao = ` + (parametroplanofatura.COPARTICIPACAO == 1 ? true : false ) : ``)

                    +` WITH pbs_fat
                    RETURN 
                      id(pbs_fat)
                    `},
cqlgetparametro: 
               `WITH @ID AS pID, @DATAREFERENCIA AS pDATAREFERENCIA, @DATAASSINATURA AS pDATAASSINATURA 
               
               MATCH(pbs_fat: ProdutoBemServico) WHERE id(pbs_fat) =  pID 
               OPTIONAL MATCH(pbs_fat)-[v:VINCULO]-(r1:Regra{ tipo: "REGRA_ELEGIBILIDADE" })-[:DETALHA]-(dr1:DetalheRegra)-[:POSSUI_PUBLICO_ALVO]-(pa:GrupoPublicoAlvo)  where v.inicioVigencia <= pDATAREFERENCIA AND COALESCE(v.fimVigencia, 253402214400000) >= pDATAREFERENCIA AND COALESCE(v.limiteAssinatura, 253402214400000) >= pDATAASSINATURA 
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_CONTRATUAL]-(gdc:GrupoDocumento)
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_OPERACIONAL]-(gdo:GrupoDocumento)
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, r1, pa{ .*,documentoContratual:collect(distinct gdc{.*}), documentoOperacional:collect(distinct gdo{.*})} as pa, v, dr1
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, r1{.tipo, .nomeRegra, .observacao, inicioVigencia: v.inicioVigencia, fimVigencia: v.fimVigencia, limiteAssinatura: v.limiteAssinatura, detalheRegra: dr1{.*, publicoAlvo:collect(pa{.*})}}
                              
               MATCH(pbs_fat)-[:GERIDO_POR]->(fat:Fatura)
               OPTIONAL MATCH(fat)-[v:VINCULO]-(r2:Regra{ tipo: "REGRA_ELEGIBILIDADE" })-[:DETALHA]-(dr2:DetalheRegra)-[:POSSUI_PUBLICO_ALVO]-(pa:GrupoPublicoAlvo)  where v.inicioVigencia <= pDATAREFERENCIA AND COALESCE(v.fimVigencia, 253402214400000) >= pDATAREFERENCIA AND COALESCE(v.limiteAssinatura, 253402214400000) >= pDATAASSINATURA 
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_CONTRATUAL]-(gdc:GrupoDocumento)
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_OPERACIONAL]-(gdo:GrupoDocumento)
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, r1, r2, pa{ .*,documentoContratual:collect(distinct gdc{.*}), documentoOperacional:collect(distinct gdo{.*})} as pa, v,dr2
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, r1, r2{.tipo, .nomeRegra, .observacao, inicioVigencia: v.inicioVigencia, fimVigencia: v.fimVigencia, limiteAssinatura: v.limiteAssinatura, detalheRegra: dr2{.*, publicoAlvo:collect(pa{.*})}}
                              
               MATCH(pbs_fat)-[:DERIVADO_DE]->(pbs_cc:ProdutoBemServico)
               OPTIONAL MATCH(pbs_cc)-[v:VINCULO]-(r3:Regra{ tipo: "REGRA_ELEGIBILIDADE" })-[:DETALHA]-(dr3:DetalheRegra)-[:POSSUI_PUBLICO_ALVO]-(pa:GrupoPublicoAlvo)  where v.inicioVigencia <= pDATAREFERENCIA AND COALESCE(v.fimVigencia, 253402214400000) >= pDATAREFERENCIA AND COALESCE(v.limiteAssinatura, 253402214400000) >= pDATAASSINATURA 
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_CONTRATUAL]-(gdc:GrupoDocumento)
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_OPERACIONAL]-(gdo:GrupoDocumento)
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, r1, r2, r3, pa{ .*,documentoContratual:collect(distinct gdc{.*}), documentoOperacional:collect(distinct gdo{.*})} as pa, v, dr3
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, r1, r2, r3{.tipo, .nomeRegra, .observacao, inicioVigencia: v.inicioVigencia, fimVigencia: v.fimVigencia, limiteAssinatura: v.limiteAssinatura, detalheRegra: dr3{.*, publicoAlvo:collect(pa{.*})}}
                              
               MATCH(fat)-[:OPERACIONALIZA]->(cc:ContratoConveniado)
               OPTIONAL MATCH(cc)-[v:VINCULO]-(r4:Regra{ tipo: "REGRA_ELEGIBILIDADE" })-[:DETALHA]-(dr4:DetalheRegra)-[:POSSUI_PUBLICO_ALVO]-(pa:GrupoPublicoAlvo)  where v.inicioVigencia <= pDATAREFERENCIA AND COALESCE(v.fimVigencia, 253402214400000) >= pDATAREFERENCIA AND COALESCE(v.limiteAssinatura, 253402214400000) >= pDATAASSINATURA 
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_CONTRATUAL]-(gdc:GrupoDocumento)
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_OPERACIONAL]-(gdo:GrupoDocumento)
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, r1, r2, r3, r4, pa{ .*,documentoContratual:collect(distinct gdc{.*}), documentoOperacional:collect(distinct gdo{.*})} as pa, v, dr4
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, r1, r2, r3, r4{.tipo, .nomeRegra, .observacao, inicioVigencia: v.inicioVigencia, fimVigencia: v.fimVigencia, limiteAssinatura: v.limiteAssinatura, detalheRegra: dr4{.*, publicoAlvo:collect(pa{.*})}}
                              
               MATCH(cc)-[:CONVENIADO_POR]->(conv:PessoaJuridica)
               OPTIONAL MATCH(conv)-[v:VINCULO]-(r5:Regra{ tipo: "REGRA_ELEGIBILIDADE" })-[:DETALHA]-(dr5:DetalheRegra)-[:POSSUI_PUBLICO_ALVO]-(pa:GrupoPublicoAlvo)  where v.inicioVigencia <= pDATAREFERENCIA AND COALESCE(v.fimVigencia, 253402214400000) >= pDATAREFERENCIA AND COALESCE(v.limiteAssinatura, 253402214400000) >= pDATAASSINATURA 
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_CONTRATUAL]-(gdc:GrupoDocumento)
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_OPERACIONAL]-(gdo:GrupoDocumento)
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, conv, r1, r2, r3, r4, r5, pa{ .*,documentoContratual:collect(distinct gdc{.*}), documentoOperacional:collect(distinct gdo{.*})} as pa, v, dr5
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, conv, r1, r2, r3, r4, r5{.tipo, .nomeRegra, .observacao, inicioVigencia: v.inicioVigencia, fimVigencia: v.fimVigencia, limiteAssinatura: v.limiteAssinatura, detalheRegra: dr5{.*, publicoAlvo:collect(pa{.*})}}
                              
               MATCH(pbs_cc)-[:DERIVADO_DE]->(pbs_cf:ProdutoBemServico)
               OPTIONAL MATCH(pbs_cf)-[v:VINCULO]-(r6:Regra{ tipo: "REGRA_ELEGIBILIDADE" })-[:DETALHA]-(dr6:DetalheRegra)-[:POSSUI_PUBLICO_ALVO]-(pa:GrupoPublicoAlvo)  where v.inicioVigencia <= pDATAREFERENCIA AND COALESCE(v.fimVigencia, 253402214400000) >= pDATAREFERENCIA AND COALESCE(v.limiteAssinatura, 253402214400000) >= pDATAASSINATURA 
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_CONTRATUAL]-(gdc:GrupoDocumento)
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_OPERACIONAL]-(gdo:GrupoDocumento)
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, conv, pbs_cf, r1, r2, r3, r4, r5, r6, pa{ .*,documentoContratual:collect(distinct gdc{.*}), documentoOperacional:collect(distinct gdo{.*})} as pa, v, dr6
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, conv, pbs_cf, r1, r2, r3, r4, r5, r6{.tipo, .nomeRegra, .observacao, inicioVigencia: v.inicioVigencia, fimVigencia: v.fimVigencia, limiteAssinatura: v.limiteAssinatura, detalheRegra: dr6{.*, publicoAlvo:collect(pa{.*})}}
                              
               MATCH(cc)-[:ATENDIDO_POR]->(cf:ContratoFornecedor)
               OPTIONAL MATCH(cf)-[v:VINCULO]-(r7:Regra{ tipo: "REGRA_ELEGIBILIDADE" })-[:DETALHA]-(dr7:DetalheRegra)-[:POSSUI_PUBLICO_ALVO]-(pa:GrupoPublicoAlvo)  where v.inicioVigencia <= pDATAREFERENCIA AND COALESCE(v.fimVigencia, 253402214400000) >= pDATAREFERENCIA AND COALESCE(v.limiteAssinatura, 253402214400000) >= pDATAASSINATURA 
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_CONTRATUAL]-(gdc:GrupoDocumento)
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_OPERACIONAL]-(gdo:GrupoDocumento)
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, conv, pbs_cf, cf, r1, r2, r3, r4, r5, r6, r7, pa{ .*,documentoContratual:collect(distinct gdc{.*}), documentoOperacional:collect(distinct gdo{.*})} as pa, v, dr7
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, conv, pbs_cf, cf, r1, r2, r3, r4, r5, r6, r7{.tipo, .nomeRegra, .observacao, inicioVigencia: v.inicioVigencia, fimVigencia: v.fimVigencia, limiteAssinatura: v.limiteAssinatura, detalheRegra: dr7{.*, publicoAlvo:collect(pa{.*})}}
                              
               MATCH(pbs_cf)-[:DERIVADO_DE]->(pbs_pct:ProdutoBemServico)-[:REGULADO_POR]->(bs:BemServico)
               OPTIONAL MATCH(bs)-[v:VINCULO]-(r8:Regra{ tipo: "REGRA_ELEGIBILIDADE" })-[:DETALHA]-(dr8:DetalheRegra)-[:POSSUI_PUBLICO_ALVO]-(pa:GrupoPublicoAlvo)  where v.inicioVigencia <= pDATAREFERENCIA AND COALESCE(v.fimVigencia, 253402214400000) >= pDATAREFERENCIA AND COALESCE(v.limiteAssinatura, 253402214400000) >= pDATAASSINATURA 
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_CONTRATUAL]-(gdc:GrupoDocumento)
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_OPERACIONAL]-(gdo:GrupoDocumento)
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, conv, pbs_cf, cf, bs, r1, r2, r3, r4, r5, r6, r7, r8, pa{ .*,documentoContratual:collect(distinct gdc{.*}), documentoOperacional:collect(distinct gdo{.*})} as pa, v, dr8
               WITH pDATAREFERENCIA, pDATAASSINATURA, pbs_fat, fat, pbs_cc, cc, conv, pbs_cf, cf, bs, r1, r2, r3, r4, r5, r6, r7, r8{.tipo, .nomeRegra, .observacao, inicioVigencia: v.inicioVigencia, fimVigencia: v.fimVigencia, limiteAssinatura: v.limiteAssinatura, detalheRegra: dr8{.*, publicoAlvo:collect(pa{.*})}}
                              
               MATCH(cf)-[:FORNECIDO_POR]->(forn:PessoaJuridica)
               OPTIONAL MATCH(forn)-[v:VINCULO]-(r9:Regra{ tipo: "REGRA_ELEGIBILIDADE" })-[:DETALHA]-(dr9:DetalheRegra)-[:POSSUI_PUBLICO_ALVO]-(pa:GrupoPublicoAlvo)  where v.inicioVigencia <= pDATAREFERENCIA AND COALESCE(v.fimVigencia, 253402214400000) >= pDATAREFERENCIA AND COALESCE(v.limiteAssinatura, 253402214400000) >= pDATAASSINATURA 
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_CONTRATUAL]-(gdc:GrupoDocumento)
               OPTIONAL MATCH(pa)-[:POSSUI_DOCUMENTACAO_OPERACIONAL]-(gdo:GrupoDocumento)
               WITH pbs_fat, fat, pbs_cc, cc, conv, pbs_cf, cf, bs, forn, r1, r2, r3, r4, r5, r6, r7, r8, r9, pa{ .*,documentoContratual:collect(distinct gdc{.*}), documentoOperacional:collect(distinct gdo{.*})} as pa, v, dr9
               WITH pbs_fat, fat, pbs_cc, cc, conv, pbs_cf, cf, bs, forn, r1, r2, r3, r4, r5, r6, r7, r8, r9{.tipo, .nomeRegra, .observacao, inicioVigencia: v.inicioVigencia, fimVigencia: v.fimVigencia, limiteAssinatura: v.limiteAssinatura, detalheRegra: dr9{.*, publicoAlvo:collect(pa{.*})}}
                              
               RETURN 
               {
                 arvore:[
                     {idNivel:1, nivel:"PRODUTO_FATURA", vinculo:r1}, 
                     {idNivel:2, nivel:"FATURA", vinculo:r2},
                     {idNivel:3, nivel:"PRODUTO_CONTRATO_CONVENIADO", vinculo:r3}, 
                     {idNivel:4, nivel:"CONTRATO_CONVENIADO", vinculo:r4}, 
                     {idNivel:5, nivel:"CONVENIADO", vinculo:r5}, 
                     {idNivel:6, nivel:"PRODUTO_CONTRATO_FORNECEDOR", vinculo:r6}, 
                     {idNivel:7, nivel:"CONTRATO_FORNECEDOR", vinculo:r7}, 
                     {idNivel:8, nivel:"PRODUTO_PACOTE", vinculo:r8}, 
                     {idNivel:9, nivel:"FORNECEDOR", vinculo:r9}
                 ]
               }`

                      
};
