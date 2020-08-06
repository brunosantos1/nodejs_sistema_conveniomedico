<template>
  <div class="app-wrapper">
    <Header visibleBackHome />

    <div id="burger" @click.prevent="toggle">
      <slot>
        <button type="button" class="burger-button text-link" title="Documentos">
          <span class="fi-folder"></span>
        </button>
      </slot>
    </div>
    <MenuDocumento :cpf="cpf" :isPanelOpen="isBurgerActive" @closeMenu="toggle">
    </MenuDocumento>
    <div class="row justify-content-center">
      <div class="col-12 col-sm-12 col-md-12 col-lg-5">
        <h1 class="m-3">Minhas propostas</h1>
        <div class="m-3" v-if="loading">
          <LoaderShimmer :type="'propostas'" :qtd="3" />
        </div>

        <div class="card" v-for="(item, index) in propostas" :key="index">
          <div class="card-body">
            <div class="line-top">
              <div class="img">
                <img
                  v-bind:src="item.plano.operadoraLogo"
                  class="card-img-top"
                  v-bind:alt="item.plano.operadora"
                />
              </div>
              <div class="status">
                <div class="badge status-descricao">
                  <div class="fi" :class="getIcon(item.statusProposta)"></div>
                  <div class="texto">{{item.detalheStatus.descricao.toUpperCase()}}</div>
                </div>
              </div>
            </div>
            <div class="line-center">
              <p class="nrProposta">
                <b>Proposta Nº {{item.nrProposta}}</b>
              </p>
              <p class="nomePlano">
                <strong>{{item.plano.plano}}</strong>
              </p>
              <p class="descricao">
                <span>{{item.coparticipacao ? 'Com coparticipação' : 'Sem coparticipação'}}</span>
                <span>{{item.plano.tipo_acomodacao ? ' + acomodação ' + item.plano.tipo_acomodacao.toLowerCase() : ''}}</span>
                <span>{{item.totalDependentes ? ' + ' + item.totalDependentes + ' Dependente(s)' : ''}}</span>
              </p>
            </div>
            <div class="line-bottom">
              <div class="link-acao text-link" @click="detail(item)">
                {{item.detalheStatus.acao}}
                <span class="fi fi-chevron-right"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";
.app-wrapper {
  width: 100%;

  .hidden {
    visibility: hidden;
  }

  button {
    cursor: pointer;
  }

  /* remove blue outline */
  button:focus {
    outline: 0;
  }

  .burger-button {
    position: absolute;
    height: 30px;
    right: 10px;
    top: 15px;
    display: block;
    z-index: 999;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    pointer-events: all;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .card {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
    // @include media-breakpoint-down(md) {
    //   border-top: none;
    //   border-left: none;
    //   border-right: none;
    // }

    .line-top {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .img {
        width: 110px;
      }
      .status {
        float: right;
        text-align: right;
        .status-descricao {
          display: flex;
          background-color: var(--quali-gray-blue);
          color: var(--quali-dark-blue);
          border-radius: 10px;
          padding: 0;

          .fi {
            background-color: var(--quali-brand);
            color: white;
            border-radius: 48%;
            height: 25px;
            width: 25px;
          }
          .fi:before {
            margin-top: 6px !important;
            margin-left: 2px !important;
          }

          .texto {
            align-self: center;
            margin-left: 5px;
            padding-right: 8px;
            font-size: 11px;
          }
        }
      }
    }
    .line-center {
      p {
        margin-bottom: 0;
      }

      .nrProposta {
        font-size: 11px;
        color: var(--quali-medium-gray);
      }
      .descricao {
        font-size: 12px;
        color: var(--quali-medium-gray);
      }
    }
    .line-bottom {
      width: 100%;
      .link-acao {
        margin-top: 10px;
        float: right;
        .fi {
          font-size: 10px;
        }
      }
    }
  }
  // .card:nth-child(odd) {
  //   border-bottom: none;
  // }
}
</style>
<script>
import Header from "@/modules/Global/Components/Header.vue";
import Mixin from "@/modules/PainelCliente/Mixins/painelClienteMixin.js";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import contratacaoService from "@/services/api-contratacao";
import { isArray } from "util";
import LoaderShimmer from "@/modules/Global/Components/LoaderShimmer.vue";
import MenuDocumento from "@/modules/PainelCliente/Components/MenuDocumento.vue";
export default {
  name: "ListaProposta",
  mixins: [Mixin, CacheMixin],
  components: {
    Header,
    LoaderShimmer,
    MenuDocumento
  },
  data() {
    return {
      propostas: [],
      loading: false,
      isBurgerActive: false,
      cpf: ''
    };
  },
  computed: {},
  async created() {
    let cpf = this.$route.params.cpf;
    this.cpf = cpf;
    const listaCache = this.$route.params.propostas;
    if (isArray(listaCache)) {
      this.propostas = listaCache;
    } else {
      try {
        this.loading = true;
        let response = await contratacaoService.getPropostas(
          cpf || "742.013.190-24"
        );
        this.propostas = response.data;
        this.setCache("propostas", this.propostas);
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    }
  },
  methods: {
    detail(proposta) {
      this.$router.push({
        name: "DetalheProposta",
        params: { proposta: proposta }
      });
    },
    toggle() {
      this.isBurgerActive = !this.isBurgerActive;
      this.$forceUpdate();
    }
  }
};
</script>