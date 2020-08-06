

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

/**
 * Definição dos estados
 */

const state = {
  stages: [],
  formData: [],
  formStage: {},
  formErrors: {},
  coletaDados: {},
  services: {}
}

const getters = {
  getFormData(state) {
    return state.formData;
  },
  getFormDataCurrent(state) {
    return state.formData;
  },
  getFormStage(state) {
    return state.formStage;
  },
  getStages(state) {
    return state.stages;
  },
  getFormErrors(state) {
    return state.formErrors;
  },
  getColetaDados(state) {
    return state.coletaDados;
  },
  getServices(state) {
    return state.services;
  }
}

const mutations = {
  updateData(state, data) {
    console.log(state)
    console.log(data)
    //if (state.formStage.current)
      state.formData = data;

    setCache('Filiacao', state.formData);
  },
  updateDataField(state, data) {
    console.log(data)
    //if (state.formStage.current)
      state.formData[data.index].value = data.value;

    setCache('Filiacao', state.formData);
  },
  updateErrorForm(state, formErrors) {
    state.formErrors = formErrors;
  },
  updateService(state, services) {
    state.services = services;
  }
}

const actions = {
  createStoreFields(context, obj) {
    //if (state.formStage.current) {
      state.formData = state.formData ? state.formData : [];
      //state.formData = [];
      obj.forEach(el => {
        state.formData.push(el)
      });
    //}
  },
  createStoreFieldsColeta(context, obj) {
    state.coletaDados = obj;
  },
  createStoreStages(context, arr) {
    state.stages = arr;
  }
}

export default {
  namespaced: true,
  mutations,
  state,
  getters,
  actions
}

