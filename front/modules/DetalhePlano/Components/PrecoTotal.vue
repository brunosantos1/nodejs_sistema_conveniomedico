<template>
  <div>
    <h3 class="price-title">Preço total</h3>
    <div class="price-wrapper text-center">
      <span class="price-default">R$</span>
      <span class="price-strong">{{preco.split(".")[0]}}</span>
      <span class="price-default">,{{preco.split(".")[1]}}</span>
      <span class="badge-info" :id="preco + '-info'" v-if="infoPreco">
        <strong>i</strong>
      </span>
      <b-tooltip :target="preco + '-info'" placement="left">{{infoPreco}}</b-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import infosJson from "@/modules/DetalhePlano/infos.json";
export default {
  name: "PrecoTotal",
  props: {
    selectedPlano: Object
  },
  computed: {
    ...mapGetters({
      getPlano: "Planos/getPlano"
    }),
    preco() {
      return this.selectedPlano.precos.total;
    },
    infoPreco() {
      return infosJson && infosJson['infoPreco'] ? infosJson['infoPreco'] : ''
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";

.price-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.price-wrapper {
  margin: em(20px);
}

.price-default {
  font-size: 32px;
  color: var(--quali-medium-blue);
  font-weight: 500;
  padding-right: 3px;
}
.price-strong {
  font-size: 64px;
  color: var(--quali-dark-blue);
  font-weight: 700;
}
</style>