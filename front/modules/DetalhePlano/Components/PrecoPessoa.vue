<template>
  <div class="row price-table" v-if="precos && precos.length && precos.length > 1">
    <div class="marked-line" v-for="(item, index) in precos" :key="index">
    <div class="left">
        <span class="price-title">{{index == 0 ? 'Titular' : 'Dependente'}} {{item.idade && item.idade == 1 ? item.idade + ' ano' : item.idade + ' anos' }}</span>
        <span class="faixa-etaria">Faixa etária de {{item.de + ' à'}} {{item.ate + ' anos'}}</span>
      </div>
      <div class="right">
        <span class="price-link">{{formatMoney(item.preco, 2, ",", ".",true)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Mixin from "@/modules/DetalhePlano/Mixins/detalhePlanoMixin.js";

  export default {
    name: "PrecoPessoa",
    props: ['selectedPlano', 'hasPrices'],
    mixins: [Mixin],
    computed: {
      ...mapGetters({
        getPlano: "Planos/getPlano"
      }),
      precos() {
        let objPreco = [];
        if (this.hasPrices) {
          objPreco = this.hasPrices;
        } else {
          objPreco = this.selectedPlano.precos.precos;
        }
        return objPreco;
      }
    }
  };
</script>

<style scoped lang="scss">
  .price-table {
    margin: 0 auto;
    max-width: 610px;
  }

  .price-title {
    display: block;

    font-size: 18px;
    font-weight: bold;
  }

  .faixa-etaria {
    font-size: 14px;
    font-weight: 300;
  }

  .price-link {
    font-weight: bold;
  }

  .marked-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .marked-line:nth-child(odd) {
    background-color: var(--quali-gray-blue);
    width: 100%;
    padding: 20px;
    font-size: 14px;
    font-weight: 500;
  }

  .marked-line:nth-child(even) {
    background-color: white;
    width: 100%;
    padding: 20px;
    font-size: 14px;
    font-weight: 500;
  }

  .marked-line .left {
    float: left;
  }

  .marked-line .right {
    float: right;
    color: var(--quali-dark-blue);
  }
</style>