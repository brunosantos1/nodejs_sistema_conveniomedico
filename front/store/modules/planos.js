/**
 * Cache Functions
 */
function setCache(section, data) {
  if (sessionStorage) {
    sessionStorage.setItem(section, JSON.stringify(data));
    return true;
  } else {
    return false;
  }
}

const state = {
  plano: {},
  planos: {},
  comparacaoPlanos: {},
  filtro: {data:{}}
};

const mutations = {
  createPlano(state, payload){
    state.plano = payload;
  },
  createPlanoCache(state, payload){
    state.planos = payload;
    setCache('Planos', state.planos);
  },
  createDetalhePlanoCache( state, payload ){
    state.plano = payload;
    setCache('Plano', payload);
  },
  createComparacaoCache(state, payload){
    state.comparacaoPlanos = payload;
    setCache('Comparacao', payload);
  },
  updatePlanoFilter(state, payload){
    if (!state.filtro) {
      state.filtro = {data:{}}
    }
    const payloadKeys = Object.keys(payload);
    for(let key of payloadKeys) {
      if (key == "valor") {
        state.filtro.data[key] = payload[key];
      } else {
        state.filtro[key] = payload[key];
      }
    }
  },
  clearPlanoFilter(state){
    state.filtro = {data:{}};
  },
  resetState(state){
    state.plano = {},
    state.planos = {},
    state.filtro = {data: {}};
  }
};

const actions = {

};

const getters = {
  getPlanoFilter(state){
    return state.filtro;
  },
  getPlano: (state) => (planoKey) => {
    const plano = state.planos.planos.filter((item) => item.id == planoKey);
    return plano;
  },
  getPlanoDetalhe(){
    return state.plano;
  }
};

export default {
  namespaced: true,
  mutations,
  state,
  getters,
  actions
}