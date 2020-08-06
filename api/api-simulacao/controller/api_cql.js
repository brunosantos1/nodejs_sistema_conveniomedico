exports.cql = {
  cqlConsultarSimulacoesPorCPF: `MATCH (p:Pessoa {CPF:'@CPF'})-[r:TEM_INTERESSE]->(s:Simulacao)
  RETURN
  {
    Simulacoes:p
    {
      Pessoa:(p{.*}),
      Simulacao:COLLECT(s{.*})
    }
  }`,
  cqlCriarSimulacao:
  `CREATE
    (
      s:Simulacao
        {

          Veiculo: '@Veiculo',
          Formato: '@Formato',
          Campanha :'@Campanha',
          DataSimulacao: '@DataSimulacao',
          Estado: '@Estado',
          CEP: '@CEP',
          Profissao :'@Profissao',
          CodigoEntidade :'@CodigoEntidade',
          Entidade :'@Entidade',
          CodigoOperadora :'@CodigoOperadora',
          Operadora :'@Operadora',
          TipoAcomodacao :'@TipoAcomodacao',
          Reembolso :'@Reembolso',
          AdicionaDependentes: '@AdicionaDependentes',
          QuantidadeDependentes: '@QuantidadeDependentes',
          CodigoPlano :'@CodigoPlano',
          Plano :'@Plano',
          ValorPlanoSimulado :'@ValorPlanoSimulado',
          FiltroRangeValor: '@FiltroRangeValor',
          TipoLead_ContatoNao :'@TipoLead_ContatoNao',
          Hora_ContatoNao :'@Hora_ContatoNao',
          TipoLead_ClickToCall: '@TipoLead_ClickToCall',
          Hora_ClickToCall: '@Hora_ClickToCall',
          TipoLead_Chat: '@TipoLead_Chat',
          Hora_Chat: '@Hora_Chat',
          TipoLead_DetalhesPlano: '@TipoLead_DetalhesPlano',
          Hora_DetalhesPlano: '@Hora_DetalhesPlano',
          TipoLead_ContatoSim: '@TipoLead_ContatoSim',
          Hora_ContatoSim: '@Hora_ContatoSim',
          TipoLead_PedidoOnline: '@TipoLead_PedidoOnline',
          Hora_PedidoOnline: '@Hora_PedidoOnline',
          TipoLead_MobileSim: '@TipoLead_MobileSim',
          Hora_MobileSim: '@Hora_MobileSim',
          Ativo: true
        }
    )
    RETURN id(s)`,
  cqlCriarRelacaoSimulacaoPessoa:
  `MATCH (p:Pessoa),(s:Simulacao)
   WHERE p.CPF = '@CPF' AND id(s) = @idSimulacao
   CREATE (p)-[:TEM_INTERESSE]->(s)`,
    
  cqlAtualizarSimulacao:
  `MATCH (p:Pessoa {CPF:'@CPF'})-[r:TEM_INTERESSE]->(s:Simulacao {Ativo:true})
   SET s.AdicionaDependentes = '@AdicionaDependentes',
   s.QuantidadeDependentes = '@QuantidadeDependentes',
   s.Veiculo = '@Veiculo',
   s.Formato = '@Formato',
   s.Campanha ='@Campanha',
   s.Profissao = '@Profissao',
   s.CodigoEntidade ='@CodigoEntidade',
   s.Entidade = '@Entidade',
   s.CodigoOperadora ='@CodigoOperadora',
   s.Operadora ='@Operadora',
   s.TipoAcomodacao ='@TipoAcomodacao',
   s.Reembolso ='@Reembolso',
   s.CodigoPlano ='@CodigoPlano',
   s.Plano ='@Plano',
   s.ValorPlanoSimulado ='@ValorPlanoSimulado',
   s.FiltroRangeValor = '@FiltroRangeValor',
   s.TipoLead_ContatoNao ='@TipoLead_ContatoNao',
   s.Hora_ContatoNao ='@Hora_ContatoNao',
   s.TipoLead_ClickToCall = '@TipoLead_ClickToCall',
   s.Hora_ClickToCall = '@Hora_ClickToCall',
   s.TipoLead_Chat = '@TipoLead_Chat',
   s.Hora_Chat = '@Hora_Chat',
   s.TipoLead_ContatoSim = '@TipoLead_ContatoSim',
   s.Hora_ContatoSim = '@Hora_ContatoSim',
   s.TipoLead_DetalhesPlano = '@TipoLead_DetalhesPlano',
   s.Hora_DetalhesPlano = '@Hora_DetalhesPlano',
   s.TipoLead_PedidoOnline = '@TipoLead_PedidoOnline',
   s.Hora_PedidoOnline = '@Hora_PedidoOnline',
   s.TipoLead_MobileSim = '@TipoLead_MobileSim',
   s.Hora_MobileSim = '@Hora_MobileSim'
   RETURN {
    Atualizado:p
    {
      Pessoa:p{.*},
      SimulacaoId:id(s),
      Simulacao:s{.*}
    }
  }`,

  cqlAtualizarStatusSimulacao:
  `MATCH (p:Pessoa {CPF:'@CPF'})-[r:TEM_INTERESSE]->(s:Simulacao {Ativo:true})
   SET s.Ativo = false
   RETURN s`,

  cqlBuscaExisteCPF: `MATCH (p:Pessoa {CPF:'@CPF'}) RETURN id(p)`
};
