const state = {
  pendencias : []
}

const mutations = {
  adicionarPendencias : function( state, listaPendencias ){
    if( listaPendencias ){
      let arrayPendencias = [];
      let storedPendencias = state.pendencias;
      let updatedPendencias = [];
      let mapPendencias = new Map();

      storedPendencias.forEach( pendencia => {
        pendencia.pendente = false;
      });

      listaPendencias.forEach( item => {
        if( !item.hasOwnProperty("Titulo") || !item.hasOwnProperty("Mensagem") || !item.hasOwnProperty("nomeRota") ){
          throw "Objeto nao possui as seguintes propriedades 'Titulo', 'Mensagem' e/ou 'nomeRota'";
        }
      
        let instanciaPendencia = new Pendencia();
        let id = Pendencia.makeID();

        storedPendencias.forEach( pendencia => { 
          if( pendencia.Titulo == item.Titulo && pendencia.Mensagem == item.Mensagem && pendencia.nomeRota == item.nomeRota ){
            id = pendencia.id;
          }
        });

        // PROPS OPCIONAIS
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            instanciaPendencia[ key ] = item[ key ];            
          }
        }

        // PROPS OBRIGATORIAS
        instanciaPendencia.id = id;
        instanciaPendencia.Titulo = item.Titulo;
        instanciaPendencia.Mensagem = item.Mensagem;
        instanciaPendencia.nomeRota = item.nomeRota;

        arrayPendencias.push( instanciaPendencia );
      });

      storedPendencias.forEach( pendencia => {
        mapPendencias.set( pendencia.id , pendencia );
      });

      arrayPendencias.forEach( pendencia => {
        mapPendencias.set( pendencia.id , pendencia );
      });

      for (var [key, value] of mapPendencias){
        updatedPendencias.push( value );
      } 

      state.pendencias = updatedPendencias;
    }
  }
};

const actions = {

};

const getters = {
  listarPendencias : function(){
    return state.pendencias;
  }
};

class Pendencia{
  constructor(){
    this.Titulo = "";
    this.Mensagem = "";
    this.nomeRota = "";
    this.id = "";
    this.pendente = true;
  }

  static makeID(){
    let generator = function() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }
    return generator();
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};