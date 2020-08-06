import repository from './repository'
const resource = "/catalogo/operadoras";

export default {
    listarCatalogo(parametros) {
        try {
            let queryString = [];
            let data = "";

            for (const key in parametros) {
                if (parametros.hasOwnProperty(key)) {
                    const q = `${key}=${encodeURIComponent(parametros[key])}`;
                    queryString.push(q);
                }
            }
            
            data = `/catalogo/operadoras?${queryString.join("&")}`;
            return repository.get(data);
        } catch (error) {
            console.log(error);
            
        }
    }
}

