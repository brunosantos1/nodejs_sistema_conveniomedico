import precoPlano from "@/services/api-precoplano";
/**
 * Separa o campo por espaço. No caso de Nomes informados com sobrenomes (Rhamses Alexandre)
 * @param  {[type]} value [string]
 * @return {[type]}       [string]
 */
function filterName(value) {
  if (value.match(/([A-z].+?\s)/gi)) {
    value = value.trim().split(' ')[0];
  }
  return value;
}

/**
 * Retorna um campo especifico do Date()
 * @param  {[type]} value   [date from vuex]
 * @param  {[type]} pattern [(string) year | month | day]
 * @return {[type]}         [string]
 */
function filterDate(value, pattern) {
  value = value.split('/').reverse().join('-');
  let data = new Date(value);
  data.setTime(data.getTime() + data.getTimezoneOffset()*60*1000);
  let response = '';
  switch(pattern){
    case "year":
      response = data.getFullYear();
    break;
    case "day":
      response = data.getDate();
    break;
    case "month":
      response = data.getMonth();
    break;
  }
  return response;
}

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

const rawState = {
  formData: {},
  blipValues: {extras:{}}
}

const state = rawState;

const getters = {
  getPlaceholder: (state) => (filteredKey) => {
    let stateField = state.formData[filteredKey];
    if (stateField.length > 0 || typeof(stateField) === "object") {
      switch(filteredKey) {
        case 'nome':
          stateField = filterName(stateField);
        break;
        case 'nascimento':
          stateField = filterDate(stateField, 'year');
        break;
        default:
        break;
      }
    }
    return stateField;
  },
  getProfissao(state){
    return state.formData['profissao'];
  },
  getQuestao(state){
    return state.formData['questao'];
  },
  getTotalFormData(state) {
    return state.formData.length;
  },
  getEntidades(state) {
    return state.formData.listaEntidades;
  },
  getColetaDados(state) {
    return state.formData;
  },
  getDataNascimentoPadrao: (state) => (key) => {
    let years = state.formData[key];
    let results = [];
    if (typeof(years) == "string") {
      results.push(`${years.split('/')[2]}-${years.split('/')[1]}-${years.split('/')[0]}`);
    } else {
      for (var i = 0; i < years.length; i++) {
        let years = years[i].value;
        results.push(`${years.split('/')[2]}-${years.split('/')[1]}-${years.split('/')[0]}`);
      }
    }
    return results;
  },
  getValorTotal(state){
    return state.formData.valor;
  },
  getValorMinimo(state) {
    return state.formData.valorMinimo;
  },
  getValorMaximo(state) {
    return state.formData.valorMaximo;
  }
}

const mutations = {
  updateField(state, payload) {
    state.formData[payload.key] = payload.value;
    setCache('ColetaDados', state.formData);
  },
  updateBlipField(state, payload) {
    state.blipValues[payload.key] = payload.value;
  },
  updateFieldCache(state, payload) {
    const keys = Object.keys(payload);
    for(let key of keys) {
      state.formData[key] = payload[key];
    }
    setCache('ColetaDados', state.formData);
  },
  resetState(state){
    state.formData = {},
    state.blipValues = {extras:{}}
  }
}

const actions = {
  updateAddressField(context, obj) {
    let payload ={};
    const entries = Object.entries(obj);
    for( let [key, value] of entries) {
      if (key === "ESTADO_SIGLA" || key === "CIDADE_NOME") {
        key = key.split('_')[0].toLowerCase();
        payload = {key, value};
        if (!context.state.formData[key]) {
          context.state.formData[key] = '';
        }
        context.commit('updateField', payload);
      }
    }
  },
  createStoreFields(context, obj){
    obj.forEach((field) => {
      if (field.hasOwnProperty("min")) {
        const label = field.name + 'Minimo';
        state.formData[label] =  field.min;
      }

      if (field.hasOwnProperty("max")) {
        const label = field.name + 'Maximo';
        state.formData[label] = field.max;
      }
      
      if (field.childs) {
        field.childs.forEach(child => {
          state.formData[child.name] = '';
        });
      }

      state.formData[field.name] = '';
    });
  },
  updatePriceRange(context, obj){
    const uf = context.state.formData.estado;
    const datanascimento = context.getters.getDataNascimentoPadrao(obj.ano);
    const entidade = obj.entidade;
    const cidade = context.state.formData.cidade;

    precoPlano.listar(entidade, uf, cidade, datanascimento).then(response => {
      if(response.status === 200) {
        context.commit('updateField', {key: 'valorMinimo', value: Math.floor(response.data.min)});
        context.commit('updateField', {key: 'valorMaximo', value: Math.ceil(response.data.max)});
      }
    });
  }
}

export default {
  namespaced: true,
  mutations,
  state,
  getters,
  actions
}

