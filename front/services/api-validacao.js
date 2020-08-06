import repository from './repository'
const resource = "/validacao";

export default {
    listar(proposta) {
      try {
        return repository.get(`${resource}/${proposta}`);
      } catch (error) {
         console.log(error)
      }
    }
}  
  