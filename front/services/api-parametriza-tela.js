import repository from './repository'
const resource = "/parametriza-tela";
export default {
  getTelaEspecifica(tela, secao) {
    try {
      return repository.get(`${resource}?propriedade=tela&valor=${secao}&tela=${tela}`);
    } catch (error) {
      console.log(error);
    }
  },
  getTela(tela) {
    try {
      return repository.get(`${resource}?tela=${tela}`);
    } catch (error) {
      console.log(error);
    }
  },
}
