import repository from './repository'
const resource = "/controle";

export default {
  cadastrar(data) {
    try {
      return repository.post(`${resource}/cadastro`, data);
    } catch (error) {
      throw error
    }
  },
  logar(data) {
    try {
      return repository.post(`${resource}/autenticar`, data);
    } catch (error) {
      throw error
    }
  },
  solicitarSenha(data) {
    try {
      return repository.post(`${resource}/esqueci`, data);
    } catch (error) {
      throw error
    }
  },
  alterarSenha(data) {
    try {
      return repository.post(`${resource}/alterar`, data);
    } catch (error) {
      throw error
    }
  }
}
