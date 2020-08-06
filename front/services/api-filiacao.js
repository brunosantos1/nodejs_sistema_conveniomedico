import repository from './repository'
import axios from "axios";
const resource = "api-filiacao";

export default {
  criarFiliacao(data) {
    try {
      //const retorno = axios.post(`http://localhost:9024/${resource}/criarFiliacao`, data);
	  const retorno = repository.post(`${resource}/criarFiliacao`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  gerarPdf(data) {
    try {
      //const retorno = axios.post(`http://localhost:9024/${resource}/pdf`, data);
	  const retorno = repository.post(`${resource}/pdf`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  }
}