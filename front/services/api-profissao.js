import repository from './repository'
const resource = "/profissao";

export default {
  listar() {
    try {
      return repository.get(`${resource}`);
    } catch (error) {
      console.log(error);
    }
  },
  listarPorEstado(uf,cidade) {
    try {
      return repository.get(`${resource}/` + uf + `/` + cidade);
    } catch (error) {
      console.log(error);
    }
  }
}
