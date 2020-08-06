<template>
  <div class="card" v-bind:class="[{'card--mb': noMarginBottom}, {'is-responsive': isResponsive}]">
    <div class="card-img">
      <img v-bind:src="cardLogo" class="card-img-top" v-bind:alt="parentData.plano" />
    </div>
    <div class="card-body card-body-responsive">
      <h4 class="card-title">{{parentData.plano}}</h4>
      <div v-if="parentData.precos && parentData.precos.total" class="card-price">
        <span class="price-default">R$</span>
        <span class="price-strong">{{parentData.precos.total.split(".")[0]}}</span>
        <span class="price-default">,{{parentData.precos.total.split(".")[1]}}</span>
        <span class="badge-info" :id="parentData.precos.total + '-info'" v-if="infoPreco">
          <strong>i</strong>
        </span>
        <b-tooltip :target="parentData.precos.total + '-info'" placement="left">{{infoPreco}}</b-tooltip>
      </div>
      <p class="card-text card-text__coparticipacao">
        {{parentData.coparticipacao ? 'Com coparticipação' : 'Sem coparticipação'}} {{parentData.tipo_acomodacao ? ' + acomodação ' + parentData.tipo_acomodacao.toLowerCase() : ''}}
        <span v-if="!visibleDetailPainel">{{parentData.segmentacao ? " + " + parentData.segmentacao.toLowerCase() : ''}}</span>
        <span v-if="visibleDetailPainel && qtdDependentes">+ {{qtdDependentes}} dependente(s)</span>
      </p>
    </div>
    <PrecoPessoa v-if="hasPrices" :hasPrices="hasPrices" />
    <div v-show="visibleDetail && !visibleDetailPainel" class="list-group list-group-flush">
      <div class="list-group-item" v-if="parentData.total_rede_referencia.Hospital">
        <strong class="qtd">{{parentData.total_rede_referencia.Hospital}}</strong>
        <span class="desc">hospitais credenciados</span>
      </div>
      <div class="list-group-item" v-if="parentData.total_rede_referencia.Laboratório">
        <strong class="qtd">{{parentData.total_rede_referencia.Laboratório}}</strong>
        <span class="desc">laboratórios</span>
      </div>
      <div class="list-group-item" v-if="parentData.total_rede_referencia.Maternidade">
        <strong class="qtd">{{parentData.total_rede_referencia.Maternidade}}</strong>
        <span class="desc">maternidades</span>
      </div>
      <div class="list-group-item" v-if="parentData.total_rede_referencia['Pronto Socorro']">
        <strong class="qtd">{{parentData.total_rede_referencia['Pronto Socorro']}}</strong>
        <span class="desc">pronto socorros</span>
      </div>
    </div>

    <div v-if="visibleDetail" class="card-body card-body-responsive">
      <button
         v-if="visibleButtoRoute"
        class="btn btn-primary btn-primary__dark btn-block"
        v-bind:class="{'btn-sm': isResponsive}"
        @click.prevent="abrirPaginaCompraOuProposta(visibleButtoRoute)"
      >{{visibleButtoRoute.name == 'Contratacao' ? 'Quero contratar' : 'Quero receber uma proposta'}}</button>
      
      <div v-if="buttonDetailPainelStyle2">
        <a @click.prevent="abrirDetalhe()" href="" class="detalhe-btn mb-3">Ver mais detalhes</a>
      </div>

      <button
        v-else
        class="btn btn-primary btn-primary__dark btn-block"
        v-bind:class="{'btn-sm': isResponsive}"
        type="button"
        v-on:click="abrirDetalhe()"
      >Ver mais detalhes</button>
     
      

      <div class="custom-control custom-checkbox compare-checkbox" v-if="visibleCompare">
        <input
          type="checkbox"
          class="custom-control-input"
          v-bind:id="'compare-checkbox-'+id"
          v-model="parentData.selecionado"
          @click="compara()"
          :disabled="!compareIsFull && !parentData.selecionado"
        />
        <label class="custom-control-label" v-bind:for="'compare-checkbox-'+id">
          Comparar plano
          <span v-if="countCompare > 0">({{countCompare}})</span>
        </label>
      </div>
    </div>
    <div v-if="visibleDetailPainel" class="card-body card-body-responsive block">
      <button
        class="btn btn-block text-link"
        v-bind:class="{'btn-sm': isResponsive}"
        type="button"
        v-on:click="abrirDetalhe()"
      >Ver detalhes</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";

/**
 * WRAPPER
 */

 * {
   box-sizing: border-box;
 }

.card {
  display: block;
  margin: em(10px) em(10px) em(60px) em(10px);
  padding-bottom: 0;
  // max-height: 480px; // original é 320px

  box-shadow: 2px 2px 12px rgba(216, 216, 216, 0.504152);
  border-radius: 4px;
  border: none;
  text-align: center;

  &--mb{
    margin-bottom: em(10px);
}
}

.card-body {
  padding: em(20px) 1rem;
  &.block{
    border-top: 1px solid #f3f3f3;
    padding: 10px;
  }
}

/**
 * IMAGE
 */

.card-img {
  padding-top: 20px;
}

.card-img-top {
  max-height: 100px;
  width: auto;
}

/**
 * TEXTS
 */

.card-text {
  color: var(--quali-dark-gray);
  font-weight: 400;
}

.card-text__coparticipacao {
  margin: 0 auto;
  max-width: 250px;
}

.card-title {
  margin-bottom: 0;
  min-height: 42px;

  font-size: 18px;

  @include media-breakpoint-down(sm) {
    min-height: 70px;
  }
}

/**
 * PRICE
 */

.card-price {
  padding: 18px 0;

  line-height: 1;
}

.price-default {
  font-size: 21px;
  color: var(--quali-dark-blue);
  font-weight: 300;
  padding-right: 3px;
}

.price-strong {
  font-size: 42px;
  color: var(--quali-dark-blue);
  font-weight: 700;
}

.price-table {
  margin-top: 1em;
}

/**
 * CHEKBOX
 */

.compare-checkbox {
  padding-top: 10px;

  color: --var(quali-dark-blue);
  font-size: 14px;
  font-weight: bold;
}

.compare-checkbox .custom-control-label {
  color: var(--quali-medium-blue);
}

.list-group-item .desc {
  padding-left: 5px;

  font-size: 15px;
  font-weight: 300;
}

.detalhe-btn {
    color: var(--quali-medium-blue);
    font-size: 14px;
    font-weight: bold;
    display: block;
    margin-top: 15px
   
}
/**
 * MODIFIERS
 * (especificação de estilos globais)
 */

.btn {
  font-size: 14px;
  font-weight: bold;
}
</style>

<script>
import PrecoPessoa from "@/modules/DetalhePlano/Components/PrecoPessoa.vue";
import infosJson from "@/modules/DetalhePlano/infos.json";
export default {
  name: "Card",
  data() {
    return {};
  },
  components: {
    PrecoPessoa
  },
  computed: {
    cardLogo() {
      let img = "";
      if (this.parentData.operadoraLogo.match(/(jpg)$/gi)) {
        img = this.parentData.operadoraLogo;
      } else {
        img = "https://placehold.it/100x100";
      }
      return img;
    },
    infoPreco() {
      return infosJson && infosJson["infoPreco"] ? infosJson["infoPreco"] : "";
    },
    qtdDependentes() {
      let qtd = this.parentData.precos &&  this.parentData.precos.precos && this.parentData.precos.precos.length && this.parentData.precos.precos.length > 1 ? (this.parentData.precos.precos.length - 1) : 0;
      return qtd;
    },
    compareIsFull(){
      return this.countCompare < this.countMaxCompare;
    }
  },
  props: {
    noMarginBottom: Boolean,
    parentData: Object,
    coletaData: { type: Object, value: {} },
    visibleDetail: Boolean,
    visibleCompare: Boolean,
    visibleDetailPainel: Boolean,
    buttonDetailPainelStyle2: Boolean,
    visibleButtoRoute: Object,
    hasPrices: Array,
    isResponsive: Boolean,
    countCompare: { type: Number, value: 0 },
    countMaxCompare: { type: Number, value: 0 },
    id: String
  },
  methods: {
    abrirPaginaCompraOuProposta(route){
        this.$emit("selected");
        this.$store.commit("Planos/createDetalhePlanoCache", this.parentData);
         this.$router.push({
            name: route.name,
            params: { plano: this.parentData }
          });
      console.log(this.parentData)
      console.log(route)
    },
    compara(el) {
        this.parentData.selecionado = !this.parentData.selecionado;
        this.$emit("compara", this.parentData);
      
      // if (this.countCompare + 1 > this.countMaxCompare) {
      //   setTimeout(() => {
      //     this.parentData.selecionado = false;
      //     return this.countCompare == this.countMaxCompare
      //       ? this.$emit("compara", this.parentData)
      //       : false;
      //   });
      // } else {
      //   this.parentData.selecionado = !this.parentData.selecionado;
      //   this.$emit("compara", this.parentData);
      // }
    },

    abrirDetalhe() {
      this.$emit("selected");
      this.$router.push({
        name: "DetalhePlano",
        params: { plano: this.parentData }
      });
    },
    abrirContrato() {
      console.log("contrato :", this.parentData);
    }
  }
};
</script>
