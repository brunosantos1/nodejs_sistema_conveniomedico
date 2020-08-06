'use strict'
const Moment = require('Moment');

module.exports = {
    existsOrError: existsOrError,
    notExistsOrError: notExistsOrError,
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
// Valida se existe ou não.
//
function notExistsOrError(value, msg) {
    try {
        existsOrError(value, msg)
    } catch (msg) {
        return
    }
    throw msg
}


