'use strict'
const Moment = require('Moment');

module.exports = {
    existsOrError: existsOrError,
    validarDataNascimento: validarDataNascimento,
}

//
// function para validar se o campo foi preenchido.
//
function existsOrError(value, msg) {
    if (!value) throw msg
    if (Array.isArray(value) && value.length === 0) throw msg
    if (typeof value === 'string' && !value.trim()) throw msg
    if (typeof value === 'object' && Object.entries(value).length === 0) throw msg
}
//
// Validação de Data de Nascimento
//
function validarDataNascimento(data,idademin,idademax,msg)
{
    if(data.length!=10)
    {
        throw msg;
    }
    else
    {
        const dataatual = Moment();
        const datamin = Moment(data, "DD-MM-YYYY").add(idademin, 'year');
        const datamax = Moment(data, "DD-MM-YYYY").add(idademax, 'year');
        if(dataatual.isBefore(datamin) || dataatual.isAfter(datamax))
            throw msg;
    }    
}

