import repository from './repository'
const resource = "dps";

export default {
  getByProposta(nomeOperadora) {
    try {
      const retorno = repository.get(`${resource}`, {
        params: {
          NumeroProposta: nomeOperadora
        }
      });
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  put(data) {
    try {
      const retorno = repository.put(`${resource}`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  //   post(data) {
  //     try {
  //       const retorno = repository.post(`${resource}`, data);
  //       return retorno
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   },
  //   updateSequencia(data) {
  //     try {
  //       const retorno = repository.put(`${resource}/atualizarSequencia`, data);
  //       return retorno
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
}
