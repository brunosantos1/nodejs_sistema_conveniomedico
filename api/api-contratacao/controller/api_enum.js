var Enum = require('enum');

exports.statusProposta = new Enum({
    'EM_PREENCHIMENTO': 1, //Quando usuário ainda não chegou ao final do processo de cadastro
    'PENDENTE_PREENCHIMENTO': 2, // Quando usuário chegou até o final processo mas ao validar encontra pendência no cadastro
    'PREENCHIDO': 8, // Quando usuário chegou até o final processo mas ao validar e não encontra pendência no cadastro
    'EM_ANALISE': 3, // Quando usuário está sem nenhuma pendência e finaliza processo
    'PENDENTE_ANALISE': 4, //Quando volta da análise com alguma pendência
    'ACEITA' : 5, //Quando proposta é aceita
    'CANCELADA':6, //Quando proposta é cancelada
    'NEGADA': 7 //Quando proposta é negada
});