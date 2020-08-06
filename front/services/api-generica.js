import repository from './repository'
const base = "/";
export default {
  get(endpoint, route) {
    try {
      let url = `${base}${endpoint}` + (route ? '/' + route : '');
      return repository.get(url);
    } catch (error) {
      console.log(error);
    }
  },
  post(endpoint, route, param) {
    try {
      let url = `${base}${endpoint}` + (route ? '/' + route : ''), param;
      return repository.post(url);
    } catch (error) {
      console.log(error);
    }
  }
}
