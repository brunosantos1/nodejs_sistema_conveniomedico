import repository from './repository'
//  const resource = "http://localhost:9023/documento";
 const resource = "documento";

import axios from "axios";

export default {
  createBucket(data) {
    try {
      const retorno = repository.post(`${resource}/balde`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  getDocumentoProposta(data) {
    try {
      const retorno = repository.post(`${resource}/proposta/visualizar`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  getDocumento(data) {
    try {
      const retorno = repository.post(`${resource}/visualizar`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  getDocumentoDetalhe(data) {
    try {
      const retorno = repository.post(`${resource}/proposta/detalhe`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  getAllDocumento(data) {
    try {
      const retorno = repository.post(`${resource}/proposta/lista`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  getAllDocumentoPainel(data) {
    try {
      const retorno = repository.post(`${resource}/pessoa/lista`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  uploadImage(data) {
    try {
      const retorno = repository.post(`${resource}/upload`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
  deleteImage(data) {
    try {
      const retorno = repository.post(`${resource}/excluir`, data);
      return retorno
    } catch (error) {
      console.log(error)
    }
  },
}
