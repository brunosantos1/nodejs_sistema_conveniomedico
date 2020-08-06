<template>
  <div class="section--container">
    <header class="section--header">
      <h1 class="section--title" v-html="dadosPagina.titulo"></h1>
      <a href="#" @click="back()" class="text-link d-inline">Voltar e ver todos os planos</a>
    </header>
    <div v-if="!isLoading" class="description">
      <a href="#" @click="back()">{{dadosPagina.descricao}}</a>
    </div>

    <div class="slider">
      <div class="slider__content">

        <div class="slider__content__item" v-for="(plano, idx_plano) in dadosPlano" :key="idx_plano">
          <Card noMarginBottom :parentData="plano" visibleDetail isResponsive />
          <DetalhePlano
            class="comparacao--item"
            :idx_plano="idx_plano"
            :plano="plano"
            :dadosPrestadores="dadosPrestadores"
            @verMaisRedeReferenciada="verMaisRedeReferenciada"
          />
        </div>

      </div>
    </div>

    <b-modal centered :title="dadosModal.title" id="modal-detalhe-comparacao" :hide-footer="true">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span
            class="input-group-text"
            :id="'basic-addon-' + dadosModal.tipoprestador"
          >Procure aqui</span>
        </div>
        <input
          @input="modalFilter"
          type="text"
          class="form-control"
          placeholder="Digite um termo por aqui"
          aria-label="Digite um termo por aqui"
          :aria-describedby="'basic-addon-' + dadosModal.tipoprestador"
          v-model="dadosModal.input"
        />
      </div>
      <div class="modal-body__wrapper">
        <ul v-for="(item, key) in dadosModal.listFilter" :key="key">
          <li>{{item}}</li>
        </ul>
      </div>
    </b-modal>
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";


.slider {
  display: flex;
    justify-content: center;

  &__content {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    padding: 0 10px;
    &::-webkit-scrollbar { width: 0 !important }
     overflow: -moz-scrollbars-none;
     -ms-overflow-style: none;
    

    &__item {
      width: 280px;
      flex-shrink: 0;
      @media (min-width: 992px){
         width: 320px;
      }
    }
  }
}

// .row-center {
//   justify-content: center;

//   & > div {
//     padding: 0;
//   }

//   @include media-breakpoint-down(sm) {
//     .card {
//       min-width: 170px;
//       width: 48vw;
//     }

//     & > div {
//       padding: 0;

//       .card {
//         margin-left: auto;
//         margin-right: 0;
//       }

//       &:first-child {
//         .card {
//           margin-right: auto;
//           margin-left: 0;
//         }
//       }
//     }
//   }
// }
.loading {
  text-align: center;
}
.description {
  text-align: center;
  color: var(--quali-medium-gray);
}
// .btn-options {
//   display: flex;
//   justify-content: center;
// }
// .btn-more {
//   margin-top: 10px;
//   margin-bottom: 10px;
// }

.comparacao--item .detail-compare__item {
  border-top: solid 2px var(--quali-light-x-gray);
}
.modal-body__wrapper {
  height: 300px;
  overflow-y: scroll;
}
</style>

<script>
import Card from "@/modules/Global/Components/Card.vue";
import DetalhePlano from "@/modules/Comparacao/Components/DetalhePlano.vue";
import fixHeader from "@/modules/Global/Mixins/fixHeader.js";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";

export default {
  name: "PageComparacao",
  mixins: [fixHeader,CacheMixin],
  data() {
    return {
      comparacaoPlanos: {},
      isLoading: false,
      dadosPlano: [],
      ["dadosPrestadores"]: [],
      ["dadosPagina"]: {
        titulo: "Compare os planos"
      },
      dadosModal: {}
    };
  },
  components: { Card, DetalhePlano },
  created() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      let lista = this.$route.params.lista;
      if (!lista) return this.$router.push({ name: "Planos" });
      this.dadosPlano = lista;
      this.dadosPrestadores = this.extrairPrestadores(lista);
    },
    extrairPrestadores(planos) {
      var retorno = [];
      planos.forEach(plano => {
        var tipoprestador = [];
        plano.rede_referencia.forEach(prestador => {
          if (!tipoprestador.includes(prestador.TipoPrestador))
            tipoprestador.push(prestador.TipoPrestador);
        });

        var prestadores_plano = [];
        tipoprestador.forEach(tipo => {
          var prestadores = [];
          plano.rede_referencia.forEach(prestador => {
            if (
              prestador.TipoPrestador == tipo &&
              !prestadores.includes(prestador.Prestador)
            )
              prestadores.push(prestador.Prestador);
          });
          prestadores_plano.push({
            tipoprestador: tipo,
            prestadores: prestadores
          });
        });
        retorno.push(prestadores_plano);
      });
      return retorno;
    },
    verMaisRedeReferenciada(dadosModal) {
      this.dadosModal = dadosModal;
      this.dadosModal.listFilter = this.dadosModal.list;
      this.dadosModal.input = "";
      this.$bvModal.show("modal-detalhe-comparacao");
    },
    modalFilter() {
      this.dadosModal.listFilter = this.dadosModal.list.filter(f => {
        let r = f.toLowerCase().indexOf(this.dadosModal.input.toLowerCase());
        return r >= 0;
      });
      this.$forceUpdate();
    },
    back() {
      this.$router.push({ name: "Planos" });
    }
  }
};
</script>