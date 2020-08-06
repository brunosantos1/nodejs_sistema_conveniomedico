

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
  dadosContratacao: {},
  stages: [],
  formData: {},
  plano: {},
  formStage: {},
  formErrors: {},
  coletaDados: {},
  services: {},
  dependentes: [],
  isFixedHeader: true,
  isLoading: false,
  enderecoCobranca: 'residencial',
  vigencia: {}
}

const getters = {
  getDadosContratacao(state) {
    return state.dadosContratacao;
  },
  getIsFixedHeader(state) {
    return state.isFixedHeader;
  },
  getFormData(state) {
    return state.formData;
  },
  getFormDataCurrent(state) {
    return state.formData[state.formStage.current];
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
  getPlano(state) {
    return state.plano;
  },
  getServices(state) {
    return state.services;
  },
  getDependentes(state) {
    return state.dependentes;
  },
  getLoading(state) {
    return state.dependentes;
  },
  getEnderecoCobranca(state) {
    return state.enderecoCobranca;
  },
  getVigencia(state) {
    return state.vigencia;
  }
}

const mutations = {
  updateDadosContratacao(state, dadosContratacao) {
    state.dadosContratacao = dadosContratacao;
  },
  updateFixedHeader(state, is) {
    state.isFixedHeader = is;
  },
  updateData(state, data) {
    if (state.formStage.current && (data && typeof data === 'object' && data.constructor === Object)) {
      state.formData[state.formStage.current] = data;
    }
    // setCache('Contratacao', state.formData);
  },
  updateDataField(state, data) {
    if (state.formStage.current)
      state.formData[state.formStage.current][data.nameModel][data.index].value = data.value;

    // setCache('Contratacao', state.formData);
  },
  updateOperadoraCongenere(state, data) {
    if (state.formStage.current)
      state.formData[state.formStage.current][data.nameModel][data.index].operadoraCongenere = data.operadoraCongenere;
    state.formData[state.formStage.current][data.nameModel][data.index].aceiteNaoReducaoCarencia = data.aceiteNaoReducaoCarencia;

    // setCache('Contratacao', state.formData);
  },
  updateDataFieldTemplate(state, data) {
    state.formData[state.formStage.current][data.template][data.index] = data.value;
    // setCache('Contratacao', state.formData);
  },
  removeDataFieldTemplate(state, data) {
    delete state.formData[state.formStage.current][data.template][data.index]
    // setCache('Contratacao', state.formData);
  },
  updateStageForm(state, stateForm) {
    const prev = state.formStage.current;
    state.formStage.current = 0;
    setTimeout(() => {
      state.formStage = {
        prev: prev,
        current: stateForm
      };
    });
  },
  updateErrorForm(state, formErrors) {
    state.formErrors = formErrors;
  },
  updateStages(state, stages) {
    state.stages = stages;
  },
  updateService(state, services) {
    state.services = services;
  },
  updateDependentes(state, dependentes) {
    state.dependentes = dependentes;
  },
  addDependentes(state, obj) {
    state.dependentes[obj.index] = state.dependentes[obj.index] ? state.dependentes[obj.index] : {};
    state.dependentes[obj.index].fields = state.dependentes[obj.index].fields ? state.dependentes[obj.index].fields : [];
    state.dependentes[obj.index].id = obj.id;
    state.dependentes[obj.index].value = obj.value;
    obj.model.forEach(el => {
      state.dependentes[obj.index].fields.push(JSON.parse(JSON.stringify(el)))
    });
  },
  updateLoading(state, is) {
    state.isLoading = is;
  },
  updateEnderecoCobranca(state, ec) {
    state.enderecoCobranca = ec;
  },
  removeStoreFields(state, obj) {
    if (state.formData[obj.nextPrev] && state.formData[obj.nextPrev][obj.modelName]) {
      delete state.formData[obj.nextPrev][obj.modelName]
    }
  },
  updateVigencia(state, vigencia) {
    state.vigencia = vigencia;
    setCache("Vigencia", vigencia);
  }
}

const actions = {
  createStoreFields(context, obj) {
    if (state.formStage.current) {
      state.formData[state.formStage.current] = state.formData[state.formStage.current] ? state.formData[state.formStage.current] : {};
      state.formData[state.formStage.current][obj.modelName] = state.formData[state.formStage.current][obj.modelName] ? state.formData[state.formStage.current][obj.modelName] : [];
      obj.model.forEach(el => {
        const indexExist = state.formData[state.formStage.current][obj.modelName].findIndex(f => {
          return f.name == el.name
        });
        if (indexExist < 0) {
          el.value = "",
            state.formData[state.formStage.current][obj.modelName].push(el)
        }
      });
    }
  },
  resetStoreFields(context) {
    state.formData = {};
    state.formStage = {};
  },

  createStoreFieldsDependente(context, obj) {
    state.dependentes[obj.index] = state.dependentes[obj.index] ? state.dependentes[obj.index] : {};
    state.dependentes[obj.index].fields = [];
    state.dependentes[obj.index].id = obj.id;
    state.dependentes[obj.index].value = obj.value;
    obj.model.forEach(el => {
      state.dependentes[obj.index].fields.push(el)
    });
  },
  createStoreFieldsColeta(context, obj) {
    state.coletaDados = obj;
  },
  createStorePlano(context, obj) {
    state.plano = obj;
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

