import repository from './repository'
const resource = "/endereco";

export default {
    listar(cep) {
      try {
        const endereco = repository.get(`${resource}/Enderecos/${cep}`);
        return endereco
      } catch (error) {
         throw error
      }
    },  
}  
  