
/**
 * Definição dos estados
 */

const state = {
    dadosContratacao: {},
    formData: [],
    acceptAns: false,
}


const mutations = {
    updateDadosContratacao(state, dadosContratacao) {
        state.dadosContratacao = dadosContratacao;
    },
    updateFormData(state, formData) {
        state.formData = formData;
    },
    updateTipoDps(state, tipoDps) {
        state.tipoDps = tipoDps;
    },
    updateAcceptAns(state, acceptAns) {
        state.acceptAns = acceptAns;
    },
}

const actions = {
    updateTipoDps({ commit }, payload) {
        commit('updateTipoDps', payload)
    },
    updateDadosContratacao({ commit }, payload) {
        commit('updateDadosContratacao', payload)
    },
    updateFormData({ commit }, payload) {
        commit('updateFormData', payload)
    }
}

const getters = {
    getDadosContratacao(state) {
        return state.dadosContratacao;
    },
    getDataTitular(state) {
        let titular = null;
        for (const pessoa of state.formData) {
            if (pessoa.titular) {
                titular = pessoa;
                break
            }
        }
        return titular
    },
    getFormData(state) {
        return state.formData;
    },
    getTipoDps(state) {
        if (!!state.dadosContratacao.proposta) {
            if (!!state.dadosContratacao.proposta.TipoDPS) {
                return state.dadosContratacao.proposta.TipoDPS
            }
            return "DpsOnline"
        }
        return null
    },
    getAcceptAns(state) {
        return state.acceptAns;
    },
    // getNrProposta(state) {
    //     return !!state.dadosContratacao.proposta ? state.dadosContratacao.proposta.nrProposta : ''
    // },
}



export default {
    namespaced: true,
    mutations,
    state,
    getters,
    actions
}

