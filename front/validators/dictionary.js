const dictionary = {
  "pt_BR": {
    messages: {
      cpf: () => 'CPF inválido',
      required: (field) => `O campo ${field} é obrigatório.`,
      nome: (field) => `O campo ${field} não pode conter caracter especial ou número`,
      nascimento: (('Por favor, informe uma data superior a 1900 e inferior a data atual')),
      date_format: (field, args) => `Data inválida. Informe uma data no formato DD/MM/AAAA.`,
      phoneValid: () => 'O telefone informado deve ter pelo menos 10 digitos teste.',
      phone: () => 'O telefone informado não é válido.',   
      emailValid: () => 'O campo email deve ser um email válido.',   
      dependenteValid: ()=>'Para o tipo de plano "família" informe ao menos um dependente',
      menorIdade: () => `Está pessoa deve ser maior de idade.`,
      alturaEpeso: () => `Valor inválido`,
      senhaValid: () => `A senha deve conter pelo menos 6 caracteres.`,
    },
    custom: {
      banco: {
         required: 'O campo "banco" é obrigatório.'
      },
      agencia: {
        required: 'O campo "agência" é obrigatório'
      },
      contaCorrente: {
        required: 'O campo "conta corrente" é obrigatório'
      },
      tipoConta: {
        required: 'O campo "tipo da conta" é obrigatório'
      },
      nomeEscola: {
        required: 'O campo "Nome da Escola" é obrigatório'
      },
      serie: {
        required: 'O campo "Série" é obrigatório'
      },
      tipoCurso: {
        required: 'O campo "Tipo do curso" é obrigatório'
      },
      taxa: {
        required: 'O campo "Taxa" é obrigatório'
      },
      nomeCurso: {
        required: 'O campo "Nome do Curso" é obrigatório'
      }
    }
  }
}
export default dictionary