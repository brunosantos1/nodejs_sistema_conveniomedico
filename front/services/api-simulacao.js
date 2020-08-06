import repository from './repository'
const resource = "/simulacao";

export default {
    incluir(data) {
      try {
        const retorno = repository.post(`${resource}`, data);
        return retorno
      } catch (error) {
         console.log(error)
      }
    }, 
    alterar(data) {
        try {
          const endereco = repository.put(`${resource}`,data);
          return endereco.data
        } catch (error) {
            console.log(error)
        }
      },   
}  
  