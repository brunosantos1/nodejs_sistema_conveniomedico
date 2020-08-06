import repository from './repository'
import axios from "axios";
const resource = "pagamento";
const resource2 = "contacorrente"

export default {
  listarFormas() {
    try {
      //const retorno = axios.post(`http://localhost:9909/${resource}/criarFiliacao`, data);
    const retorno = repository.get(`${resource}/formas`);

      //const retorno = repository.get(`http://localhost:9012/${resource}/formas`)


    //const retorno = axios.get(`http://localhost:9012/${resource}/formas`);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  incluirFormaProposta(data) {
    try { 
      
      const retorno = repository.post(`${resource}/formas`, data);
      //const retorno = axios.post(`http://localhost:9012/${resource}/formas`, data);

    
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  validarConta(banco,ag,cc) {
    try {
      const retorno = repository.get(`${resource}/validar/${banco}/${ag}/${cc}`, {});
      //const retorno = axios.get(`http://localhost:9012/${resource}/validar/${banco}/${ag}/${cc}`);
	  //const retorno = axios.get(`http://sinfservicosrest.grupo.qualicorp/Financeiro/bancos.svc/validardgconta/${banco}/${ag}/${cc}`);
	  return retorno
    } catch (error) {
      console.log(error)
    }
  },
  carregarDados(nrProposta) {
    try {
      const retorno = repository.get(`${resource}/consultar/${nrProposta}`);
      //const retorno = axios.get(`http://localhost:9012/${resource}/consultar/${nrProposta}`);
      return retorno
    } catch (error) {
      console.log(error)
    }
  }
}