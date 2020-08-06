<template>
  <div class="app-wrapper">
    <Header />
    <div class="no row justify-content-center">
      <div class="col-12 col-sm-12 col-md-8 col-lg-5">
        <FunctionalFormConfig></FunctionalFormConfig>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  width: 100%;
}
</style>

<script>
import Header from "@/modules/Global/Components/Header.vue";
import FunctionalFormConfig from "@/modules/ColetaInicial/Components/Functionals/FunctionalFormConfig.vue";

export default {
  name: "ColetaInicial",
  components: {
    FunctionalFormConfig,
    Header
  }
};
</script>