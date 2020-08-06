import repository from './repository'
const resource = "/entidade";

export default {
  listar(profissao) {
    try {
      return repository.get(`${resource}/${profissao}`);
    } catch (error) {
      console.log(error);
    }
  },
  listarPorEstado(profissao, uf, cidade) {
    try {
      return repository.get(`${resource}/${profissao}/${uf}/${cidade}`);
    } catch (error) {
      console.log(error);
    }
  },
}
