import repository from './repository'
import axios from "axios";
const resource = "api-token";

export default {
  gerarToken(tipo,proposta) {
    try {
      //let data = { entidade, uf, cidade, datanascimento }
      return repository.post(`${resource}/gerarToken?tipo=${tipo}&proposta=${proposta}`, {});
    } catch (error) {
      console.log(error)
    }
  },
  validarToken(data) {
    try {
      const retorno = repository.post(`${resource}/validaToken`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  }
}