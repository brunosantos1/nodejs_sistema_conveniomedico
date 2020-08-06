import repository from './repository'
const resource = "contratacao";

export default {
  get(nrProposta) {
    try {
      const retorno = repository.get(`${resource}/${nrProposta}`);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  update(data) {
    try {
      const retorno = repository.put(`${resource}`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  post(data) {
    try {
      const retorno = repository.post(`${resource}`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  cancel(nrProposta, justificativa) {
    try {
      const retorno = repository.post(`${resource}/cancelarProposta`, { nrProposta: nrProposta, justificativa: justificativa });
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  updateSequencia(data) {
    try {
      const retorno = repository.put(`${resource}/atualizarSequencia`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  getPropostas(cpf) {
    try {
      const retorno = repository.get(`${resource}/propostas/${cpf}`);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
}
