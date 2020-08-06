//
//Módulo para que as outras classes enxerguem esses métodos
//
module.exports = {
    requestExistsOrError: requestExistsOrError,
    notRequiredField: notRequiredField
}

//
//Método de validação de campos
//
function requestExistsOrError(value) {
    var msg = [];
    for (var key in value) {
        if (notRequiredField(key)) {
            if (!value[key]) {
                msg.push(key + ' não preenchido')
            } 
        }
    }
    if (msg.length > 0) throw msg
}

//
//Método de NãoPriorização de campos
//
function notRequiredField(field) {
    try {

        switch (field) {
            case 'codCarteirinha': return false;
            case 'latitude': return false;
            case 'longitude': return false;
            case 'categoria': return false;
            case 'especialidade': return false;
            case 'redes': return false;
            case 'subpadrao': return false;
            case 'listaUf': return false;
            case 'tipoProd': return false;
            case 'prestador': return false;
            case 'qualificacoes': return false;
            default: return true;
        }

    } catch (error) {
        throw error;
    }
}
