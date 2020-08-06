import repository from './repository'
const resource = "/rede-resumida";

export default {
  listarPorPrestador(tipo, idPlano, prestador) {
    try {
      return repository.get(`${resource}/` + tipo + `/` + idPlano + `/`+ prestador);
    } catch (error) {
      console.log(error);
    }
  } 
}
