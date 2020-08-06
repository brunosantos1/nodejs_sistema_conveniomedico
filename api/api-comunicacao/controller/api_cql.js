exports.cql = {
  sqlConsultaTabelaEmails: `CALL apoc.load.jdbc('sinf_integracao',"SELECT * FROM QSAUDE.DBO.MAILSAIDA") YIELD row RETURN row`,
  sqlInsertTabelaEmails: `CALL apoc.load.jdbcUpdate('sinf_integracao',"INSERT INTO QSAUDE.DBO.MAILSAIDA VALUES ('$email', '$remetente', '$assunto', '$body', null, null, 0, getdate(), 0, null, null, 0, 0, getdate())") YIELD row`,
  criarNoHistorico: `
  MERGE (h:HistoricoComunicacao)
  MERGE (e:HistoricoEmail)-[:EMAIL_ENVIADO_DE]->(h)
  MERGE (s:HistoricoSMS)-[:SMS_ENVIADO_DE]->(h)
  `,
  inserirHistoricoEmail: `
  MATCH (h:HistoricoComunicacao)
  MATCH (e:HistoricoEmail)-[:EMAIL_ENVIADO_DE]->(h)
  MERGE (i:ItemHistorico {nrProposta: $nrProposta, dataHoraEnvio: $dataHoraEnvio, gancho: $gancho, telefone: $telefone, email: $email, assunto: $assunto, body: $body, type: 'Comunicacao'})
  CREATE (i)-[:EMAIL_DE]->(e)
  return i`,
  inserirHistoricoSMS: `
  MATCH (h:HistoricoComunicacao)
  MERGE (s:HistoricoSMS)-[:SMS_ENVIADO_DE]->(h)
  MERGE (i:ItemHistorico {nrProposta: $nrProposta, dataHoraEnvio: $dataHoraEnvio, gancho: $gancho, email: $email, telefone: $telefone, body: $body, type: 'Comunicacao'})
  CREATE (i)-[:SMS_DE]->(s)
  return i`,
  AtualizarPropostaCadastro: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p._sendCadastro = true
  return p`,
  AtualizarTokenFiliacao: `
  MATCH (tk:Token { Token: $token})
  SET tk.DataEnvio = dateTime(),
  tk.Enviado = true
  return tk`,
  AtualizarPropostaDPS: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p._sendDPS = true
  return p`,
  AtualizarPropostaPendenciaPreenchimento: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p._sendProximaDataPendenciaPreenchimento = $data,
  p._countSendProximaDataPendenciaPreenchimento = $qtdEnvio
  return p`,
  AtualizarPropostaEmPreenchimento: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p._sendProximaDataEmPreenchimento = $data,
  p._countSendProximaDataEmPreenchimento = $qtdEnvio
  return p`,
  consultarCadastro: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE p._sendCadastro IS NULL OR p._sendCadastro = false
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  consultarTokenFiliacao: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  MATCH (tk:Token)-[tc:TOKEN_CRIADO_PARA]->(p)
  WHERE tk.Ativo = true and tk.Enviado = false and tk.Check = false
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf,
    token: tk.Token,
    dataGeracao: tk.DataGeracao,
    horaGeracao: tk.HoraGeracao,
    horaLimite: tk.HoraLimite
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  consultarDPSOperadora: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE (p.TipoDPS = 'DpsOperadora') AND (p._sendDPS IS NULL OR p._sendDPS = false)
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  consultarDPSParticular: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE (p.TipoDPS = 'DpsParticular') AND (p._sendDPS IS NULL OR p._sendDPS = false)
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  consultarEmPreenchimento: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE p.statusProposta = 1 OR p.statusProposta = '1'
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataAlteracao: p.dataAlteracao,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf,
    _countSendProximaDataEmPreenchimento: p._countSendProximaDataEmPreenchimento
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  consultarPendenciaPreenchimento: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE p.statusProposta = 2 OR p.statusProposta = '2'
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf,
    _sendProximaDataPendenciaPreenchimento: p._sendProximaDataPendenciaPreenchimento,
    _countSendProximaDataPendenciaPreenchimento: p._countSendProximaDataPendenciaPreenchimento
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  consultarStatusAnalise: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE 
  (p.statusProposta = 3 OR p.statusProposta = '3') AND p._sendStatusAnalise IS NULL
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf,
    _sendStatusAnalise: p._sendStatusAnalise
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  AtualizarPropostaStatusAnalise: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p._sendStatusAnalise = true
  return p`,
  consultarStatusPendenteAnalise: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE 
  (p.statusProposta = 4 OR p.statusProposta = '4') AND p._sendStatusPendenteAnalise IS NULL
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf,
    _sendStatusPendenteAnalise: p._sendStatusPendenteAnalise
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  AtualizarPropostaStatusPendenteAnalise: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p._sendStatusPendenteAnalise = true
  return p`,
  consultarStatusAceita: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE 
  (p.statusProposta = 5 OR p.statusProposta = '5') AND p._sendStatusAceita IS NULL
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf,
    _sendStatusAceita: p._sendStatusAceita
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  AtualizarPropostaStatusAceita: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p._sendStatusAceita = true
  return p`,
  consultarStatusNegada: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE 
  (p.statusProposta = 7 OR p.statusProposta = '7') AND p._sendStatusNegada IS NULL
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf,
    _sendStatusNegada: p._sendStatusNegada
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  AtualizarPropostaStatusNegada: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p._sendStatusNegada = true
  return p`,
  consultarStatusCancelada: `
  MATCH (p:Proposta { ativo: true})
  MATCH ((t:Pessoa)-[rt:TITULAR]-(p))
  WHERE 
  (p.statusProposta = 6 OR p.statusProposta = '6') AND p._sendStatusCancelada IS NULL
  WITH {
    nrProposta: p.nrProposta,
    dataInicio: p.dataInicio,
    dataVigencia: p.dataVigencia,
    statusProposta: p.statusProposta,
    planoId: p.planoId,
    email: t.email,
    nome: t.nome,
    telefone: t.telefone,
    cpf: t.cpf,
    _sendStatusCancelada: p._sendStatusCancelada
  } as dados
  RETURN distinct(Collect(dados)) as dados
  `,
  AtualizarPropostaStatusCancelada: `
  MATCH (p:Proposta { nrProposta: $nrProposta})
  SET p._sendStatusCancelada = true
  return p`,
  xmlSMS: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:qual="http://www.qualicorp.com.br/qualicorp/">
  <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
    <wsa:Action>$action</wsa:Action>
    <qual:Usuario>$usuario</qual:Usuario>
    <qual:Uid>$uid</qual:Uid>
    <qual:Sistema>$sistemaHeader</qual:Sistema>
    <qual:Localidade>$localidade</qual:Localidade>
    <qual:Data>$data</qual:Data>
   </soap:Header>
 <soap:Body>
   <qual:RequisicaoDTOOf_MensagemEnvioDTO>
   <qual:Dados>
      <qual:DataCriacao>$data</qual:DataCriacao>
      <qual:DescricaoLote>$descricaoLote</qual:DescricaoLote>
      <qual:LoginUsuario>$loginUsuario</qual:LoginUsuario>
      <qual:Mensagens>
         <qual:MensagemDTO>
            <qual:IdModuloOrigem>$idModuloOrigem</qual:IdModuloOrigem>
            <qual:Mensagem>$mensagem</qual:Mensagem>
            <qual:NomePessoa></qual:NomePessoa>
            <qual:Telefone>$telefone</qual:Telefone>
         </qual:MensagemDTO>
      </qual:Mensagens>
      <qual:NomePessoa></qual:NomePessoa>
      <qual:SistemaOrigem>$sistemaOrigem</qual:SistemaOrigem>
      <qual:StatusAtivo>$statusAtivo</qual:StatusAtivo>
      <qual:TipoLote>$tipoLote</qual:TipoLote>
   </qual:Dados>
  </qual:RequisicaoDTOOf_MensagemEnvioDTO>
 </soap:Body>
</soap:Envelope>`
}
