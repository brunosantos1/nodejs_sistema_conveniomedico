<template>
  <div class="page-wrapper comparacao-wrapper">
    <Header visibleBack></Header>
    <PageComparacao></PageComparacao>
    <Footer />
  </div>
</template>

<script>
import Header from "@/modules/Global/Components/Header.vue";
import PageComparacao from "@/modules/Comparacao/Components/PageComparacao.vue";
import Footer from "@/modules/Global/Components/Footer.vue";
import fixHeader from "@/modules/Global/Mixins/fixHeader.js";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";


export default {
  name: "Comparacao",
  mixins: [fixHeader,CacheMixin],
  components: { Header, PageComparacao,Footer },
  created(){
    /*Estrutura responsável pelo cache da Página*/
      let cache = this.getCache("Comparacao") || {};
      this.comparacaoPlanos = this.$route.params.lista || cache;
      this.$store.commit("Planos/createComparacaoCache", this.comparacaoPlanos)
  }
};
</script>