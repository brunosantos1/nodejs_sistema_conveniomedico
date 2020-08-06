exports.cql = {
  criacaoLead:
  `MATCH (P:Pessoa)-[:TEM_INTERESSE]->(S:Simulacao)
  WHERE S.Ativo = TRUE  
  AND NOT ((S)<-[:PROPOSTA_DE]-(:Proposta))
  AND NOT ((S)-[:GEROU_LEAD]->(:LEAD))
  CREATE(L:LEAD{dataInicio:datetime(), idSimulacao: id(S)})<-[:GEROU_LEAD]-(S)
  RETURN S`,

  geraArquivoLead:
  `
  MATCH(L:LEAD)<-[:GEROU_LEAD]-(S:Simulacao)
  MATCH(P:Pessoa)-[:TEM_INTERESSE]->(S)
  WHERE NOT ((L)-[:PERTENCE_AO_ARQUIVO]->(:ArquivoLead))
  OPTIONAL MATCH(S)<-[:DEPENDENTE]-(P1:Pessoa)
  WITH
  {
    ID: id(L),
    Veiculo: S.Veiculo,
    Formato: S.Formato,
    Campanha: S.Campanha,
    DataSimulacao: S.DataSimulacao,
    idSimulacao: id(S), 
    Estado: S.Estado, 
    CEP: S.CEP,
    Profissao: S.Profissao, 
    CodigoEntidade: S.CodigoEntidade, 
    Entidade: S.Entidade, 
    CodigoOperadora: S.CodigoOperadora,
    Operadora: S.Operadora,
    TipoAcomodacao: S.TipoAcomodacao, 
    Reembolso: S.Reembolso,
    Nome: P.Nome,
    Email: P.Email,
    DddTelefone: substring(P.Telefone, 1, 2),
    Telefone: substring(P.Telefone, 5, 18),
    DataNascimento: P.DataNascimento,
    AdicionaDependentes: S.AdicionaDependentes,
    QuantidadeDependentes:S.QuantidadeDependentes,
    DataNascimentoDependentes: collect(P1),
    CodigoPlano: S.CodigoPlano,
    Plano: S.Plano,
    ValorPlanoSimulado: S.ValorPlanoSimulado,
    FiltroRangeValor: S.FiltroRangeValor,
    TipoLead_ContatoNao: S.TipoLead_ContatoNao,
    Hora_ContatoNao: S.Hora_ContatoNao,
    TipoLead_ClickToCall: S.TipoLead_ClickToCall,
    Hora_ClickToCall: S.Hora_ClickToCall,
    TipoLead_Chat: S.TipoLead_Chat,
    Hora_Chat: S.Hora_Chat, 
    TipoLead_DetalhesPlano: S.TipoLead_DetalhesPlano,
    Hora_DetalhesPlano: S.Hora_DetalhesPlano,
    TipoLead_ContatoSim: S.TipoLead_ContatoSim,
    Hora_ContatoSim: S.Hora_ContatoSim,
    TipoLead_PedidoOnline: S.TipoLead_PedidoOnline,
    Hora_PedidoOnline: S.Hora_PedidoOnline,
    TipoLead_MobileSim: S.TipoLead_MobileSim,
    Hora_MobileSim: S.Hora_MobileSim,
    Ativo: S.Ativo,
    CPF: P.CPF
  }AS ARQUIVO
  RETURN ARQUIVO
  `,
  
  criaVinculoArquivo:
    `
    CREATE(A:ArquivoLead {NomeArquivo: '@nomeArquivo', dataArquivo: datetime()})<-[:PERTENCE_AO_ARQUIVO]-(L)
    WITH A
    MATCH(L:LEAD)<-[:GEROU_LEAD]-(S:Simulacao)
    WHERE id(L) IN [@ID]
    MERGE(L)-[:PERTENCE_AO_ARQUIVO]->(A)
    RETURN A`
};