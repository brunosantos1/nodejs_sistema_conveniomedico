import repository from './repository'
const resource = "/pessoas";

export default {
    incluir(data) {
      try {
        return repository.post(`${resource}`,data);
      } catch (error) {
        console.log(error);
      }
    },  
}  
  