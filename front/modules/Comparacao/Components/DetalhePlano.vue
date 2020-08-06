<template>
  <div class="detail-compare">
    <div
      class="detail-compare__item"
      v-for="(prestadores,idx_prestadores) in dadosPrestadores[idx_plano]"
      :key="idx_prestadores"
    >
      <h2
        class="detail-compare__item--title"
        v-bind:class="{'hide': idx_plano > 0}"
      >{{ prestadores.tipoprestador}}</h2>
      <h3
        class="detail-compare__item--highlight"
      >{{dadosPrestadores[idx_plano][idx_prestadores].prestadores.length}}</h3>
      <ul class="detail-compare__list">
        <li
          class="detail-compare__list--item"
          v-for="(prestador, idx_prestador) in prestadores.prestadores.slice(0, 5)"
          :key="idx_prestador"
        >{{prestador}}</li>
        <li
          v-if="prestadores.prestadores.length > 5"
        >Mais {{(prestadores.prestadores.length - 5)}} {{getTipo(prestadores.tipoprestador)}}</li>
      </ul>
      <a
        v-if="prestadores.prestadores.length > 5"
        href="#"
        class="text-link more"
        @click.prevent="openModal(prestadores)"
      >Ver lista completa</a>
    </div>

    <div class="detail-compare__item detail-compare__item--sub">
      <h2 class="detail-compare__item--title" v-bind:class="{'hide': idx_plano > 0}">Coparticipação</h2>
      <p class="detail-compare__item--highlight">{{plano.coparticipacao ? "Sim" : "Não" }}</p>
    </div>
    <div class="detail-compare__item detail-compare__item--sub">
      <h2 class="detail-compare__item--title" v-bind:class="{'hide': idx_plano > 0}">Reembolso</h2>
      <p class="detail-compare__item--highlight">{{plano.reembolso ? "Sim" : "Não"}}</p>
    </div>
    <div class="detail-compare__item detail-compare__item--sub">
      <h2 class="detail-compare__item--title" v-bind:class="{'hide': idx_plano > 0}">Abrangência</h2>
      <p class="detail-compare__item--highlight">{{plano.abrangencia}}</p>
    </div>
    <div class="detail-compare__item detail-compare__item--sub">
      <h2
        class="detail-compare__item--title"
        v-bind:class="{'hide': idx_plano > 0}"
      >O que o plano oferece</h2>
      <p class="detail-compare__item--highlight">{{plano.segmentacao}}</p>
    </div>
    <div class="detail-compare__item detail-compare__item--sub">
      <h2
        class="detail-compare__item--title"
        v-bind:class="{'hide': idx_plano > 0}"
      >Tipo de quarto na internação</h2>
      <p class="detail-compare__item--highlight">{{plano.tipo_acomodacao}}</p>
    </div>
    <div class="detail-compare__item detail-compare__item--sub">
      <p class="detail-compare__item--highlight">
        <b>ANS: {{plano.codigo_ans}}</b>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@import "../../../assets/css/responsive.scss";

@include media-breakpoint-down(lg) {
  .btn-mobile {
    bottom: 0;
    display: block;
    left: 0;
    position: fixed;
    width: 100%;
    z-index: 10;

    & > div {
      padding: 0;
    }

    .btn-block {
      button {
        width: 100%;
      }
    }

    .btn {
      padding-bottom: 1em;
      padding-top: 1em;
      width: 100%;

      border-radius: 0;
    }
  }

  .btn-desktop {
    display: none;
  }
}

.text-link.more {
  text-align: left;
}
</style>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";

.detail-compare {
  &__item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: em(12px);
    height: 300px;

    border-top: solid 2px var(--quali-light-x-gray);
  }

  &__item--sub {
    padding-bottom: em(23px);
    padding-top: em(30px);
    height: auto;
  }

  &__item--title {
    font-size: 21px;
    line-height: em(24px, 21px);
  }

  &__item--highlight {
    color: var(--quali-brand);
    font-size: 28px;
    font-weight: 600;
    line-height: normal;
  }

  &__list {
    margin-left: 1em;
    padding-left: 0;

    list-style-type: none;
  }

  &__list--item {
    &::before {
      content: "\2022";
      color: var(--quali-light-gray);
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }

  @include media-breakpoint-down(md) {
    &__item {
      padding-left: em(15px);
      padding-right: em(15px);
    }

    &__item--title {
      font-size: 18px;
    }

    &__item--highlight {
      font-size: 22px;
    }
  }
}
</style>

<script>
import redeService from "@/services/api-rede-resumida";
import infosJson from "@/modules/DetalhePlano/infos.json";
export default {
  name: "DetalhePlano",
  components: {},
  props: {
    idx_plano: { type: Number, value: 0 },
    plano: { type: Object, value: [] },
    dadosPrestadores: { type: Array, value: [] }
  },
  data() {
    return {
      prestadores: {},
      modalTitle: "",
      modalInput: "",
      modalList: [],
      modalListDefault: [],
      tipoprestador: ""
    };
  },
  computed: {
    conteudo: () => {
      return infosJson;
    }
  },
  methods: {
    openModal(p) {
      this.$emit("verMaisRedeReferenciada", {
        tipoprestador: p.tipoprestador,
        title: (this.modalTitle = this.conteudo[
          p.tipoprestador.toLowerCase()
        ].titulo_modal),
        list: p.prestadores
      });
    },
    getTipo(tipo) {
      let txt = "";
      switch (tipo) {
        case "Hospital":
          txt = "hospitais";
          break;
        case "Laboratório":
          txt = "laboratórios";
          break;
        case "Pronto Socorro":
          txt = "pronto socorros";
          break;
        default:
          txt = "";
          break;
      }
      return txt;
    }
  }
};
</script>
