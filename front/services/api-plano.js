import repository from './repository'
const resource = "/plano";

export default {
    listar(entidade,uf,cidade,datanascimento) {
      try {
        let data = { entidade, uf, cidade, datanascimento }
        return repository.post(`${resource}`, data);
      } catch (error) {
        console.log(error);
      }

    },  
}  
  