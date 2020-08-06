import Vue from 'vue'
import Vuex from 'vuex'
import ColetaDados from './modules/coletaDadosInicial.js'
import Planos from './modules/planos.js'
import Contratacao from './modules/contratacao.js'
import Filiacao from './modules/filiacao.js'
import DeclaracaoPessoalSaude from './modules/declaracaoPessoalSaude'
import Pendencia from './modules/pendencia.js';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ColetaDados,
    Planos,
    Contratacao,
    Filiacao,
    DeclaracaoPessoalSaude,
    Pendencia
  },
});