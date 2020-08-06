import Vue from 'vue'
import Router from 'vue-router'
import ColetaDados from './modules/ColetaInicial/Views/Index.vue'
import Planos from './modules/Planos/Views/Index.vue'
import DetalhePlano from './modules/DetalhePlano/Views/Index.vue'
import Comparacao from './modules/Comparacao/Views/Index.vue'
import ReceberProposta from './modules/Proposta/Views/Index.vue'
import Documento from './modules/Documento/Views/Index.vue'
import Contratacao from './modules/Contratacao/Views/Index.vue'
import LoginContratacao from './modules/LoginContratacao/Views/Index.vue'
import LoginAnonimo from './modules/LoginContratacao/Components/LoginAnonimo.vue'
import AlterarSenha from './modules/LoginContratacao/Components/AlterarSenha.vue'
import Filiacao from './modules/Filiacao/Views/Index.vue'
import DeclaracaoPessoalSaude from './modules/DeclaracaoPessoalSaude/Views/Index.vue'
import PageCadastro from './modules/Contratacao/Views/PageCadastro.vue'
import CartaAnsDps from './modules/DeclaracaoPessoalSaude/Components/CartaAnsDps.vue'
import CadastroDps from './modules/DeclaracaoPessoalSaude/Components/CadastroDps.vue'
import AgendamentoDps from './modules/DeclaracaoPessoalSaude/Components/AgendamentoDps.vue'
import Vigencia from './modules/Vigencia/Views/Index.vue'
import Pagamento from './modules/Pagamento/Views/Index.vue'
import EmailDps from './modules/DeclaracaoPessoalSaude/Components/EmailDps.vue'
import PainelCliente from './modules/PainelCliente/Views/Index.vue'
import ListaProposta from './modules/PainelCliente/Views/ListaProposta.vue'
import DetalheProposta from './modules/PainelCliente/Views/DetalheProposta.vue'
import Pendencia from './modules/Pendencia/Views/Index.vue'

import Tracker from "@/modules/Global/Mixins/tracker.js";

Vue.use(Router)

let routeVue = new Router({
  // mode: 'history',
  routes: [
    {
      path: '*',
      redirect: { name: 'ColetaDados' },
    },
    {
      path: '/',
      name: 'ColetaDados',
      component: () => import(/* webpackChunkName: "coletaDados" */ './modules/ColetaInicial/Views/Index.vue')
    },
    {
      path: '/planos',
      name: 'Planos',
      component: Planos
    },
    {
      path: '/detalhe-plano',
      name: 'DetalhePlano',
      component: DetalhePlano,
      props: true
    },
    {
      path: '/comparacao',
      name: 'Comparacao',
      component: Comparacao,
      props: true
    },
    {
      path: '/receber-proposta',
      name: 'ReceberProposta',
      component: ReceberProposta,
      props: true
    },
    {
      path: '/login-anonimo',
      name: 'LoginAnonimo',
      component: LoginAnonimo
    },
    {
      path: '/alterar-senha/:token',
      name: 'AlterarSenha',
      component: AlterarSenha
    },
    {
      path: '/contratacao',
      name: 'Contratacao',
      component: Contratacao,
      redirect: { name: 'LoginContratacao' },
      children: [
        {
          path: 'login',
          name: 'LoginContratacao',
          component: LoginContratacao
        },
        {
          path: ':nrProposta/cadastro',
          name: 'ContratacaoCadastro',
          component: PageCadastro
        },
        {
          path: ':nrProposta/filiacao',
          name: 'Filiacao',
          component: Filiacao
        },
        {
          path: ':nrProposta/documento',
          name: 'ContratacaoDocumento',
          component: Documento
        },
        {
          path: ':nrProposta/pagamento',
          name: 'Pagamento',
          component: Pagamento
        },
        {
          path: ':nrProposta/vigencia',
          name: 'Vigencia',
          component: Vigencia
        },
        {
          path: ':nrProposta/declaracao-pessoal-saude',
          name: 'DeclaracaoPessoalSaude',
          component: DeclaracaoPessoalSaude,
          redirect: { name: 'CartaAnsDps' },
          children: [
            {
              path: '',
              name: 'CartaAnsDps',
              component: CartaAnsDps
            },
            {
              path: 'cadastro',
              name: 'CadastroDps',
              component: CadastroDps
            },
            {
              path: 'agendamento',
              name: 'AgendamentoDps',
              component: AgendamentoDps
            },
            {
              path: 'confirmacao',
              name: 'EmailDps',
              component: EmailDps
            },
          ]
        },
        {
          path: '/painel-cliente/:cpf',
          name: 'PainelCliente',
          component: PainelCliente,
          redirect: { name: 'ListaProposta' },
          children: [
            {
              path: 'lista',
              name: 'ListaProposta',
              component: ListaProposta
            },
            {
              path: 'detalhe',
              name: 'DetalheProposta',
              component: DetalheProposta,
              props: true
            }
          ]
        },
      ]
    },
    {
      path: '/:nrProposta/pendencia',
      name: 'Pendencia',
      component: Pendencia
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // return { x: 0, y: 0 }

    if (savedPosition) {
      return savedPosition
    } else {
      // return { x: 0, y: 0 }
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
    }
  }
});

routeVue.beforeEach(function (to, from, next) {
  let result = Tracker.methods.track(to, from);

  if (result.name != to.name)
    next(result);
  else
    next();

  Tracker.methods.lastRoute(from);
});

export default routeVue;   