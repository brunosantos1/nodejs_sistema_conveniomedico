import repository from './repository'
const resource = "/precoplano/buscaRange";

export default {
    listar(entidade, uf, cidade, datanascimento) {
    try {
        let data = {
          "Entidade": entidade,
          "UF": uf,
          "DataNascimento": datanascimento,
          "Cidade": cidade
        }
      return repository.post(`${resource}`, data);
    } catch (error) {
      console.log(error);
    }

  },  
}  
  