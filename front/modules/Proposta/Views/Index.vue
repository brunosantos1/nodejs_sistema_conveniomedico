<template>
  <div class="page-wrapper receber-proposta-wrapper">
    <Header />
    <PageReceberProposta />
    <Footer />
  </div>
</template>
<script>
import Header from "@/modules/Global/Components/Header.vue";
import Footer from "@/modules/Global/Components/Footer.vue";
import PageReceberProposta from "@/modules/Proposta/Components/PageReceberProposta.vue";

export default {
  name: "Proposta",
  components: {
    PageReceberProposta,
    Header,
    Footer
  }
};
</script>