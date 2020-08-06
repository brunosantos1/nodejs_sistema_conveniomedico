import repository from './repository'
const resource = "/validacao";
import mock from "@/modules/Pendencia/info.json";

export default {
  async listar(nrProposta) {
    try {
      return (await repository.get(`${resource}/${nrProposta}`)).data;
    } catch (error) {
      console.error(error);
    }
  },
}
