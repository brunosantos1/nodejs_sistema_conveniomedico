<template>
  <div class="app-wrapper">
    <Header visibleBack />
    <PageDocumento></PageDocumento>
    <!-- <Footer /> -->
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  width: 100%;
}
</style>
<script>
import Header from "@/modules/Global/Components/Header.vue";
import PageDocumento from "@/modules/Documento/Components/PageDocumento.vue";
import Footer from "@/modules/Global/Components/Footer.vue";
export default {
  name: "Documento",
  components: {
    PageDocumento,
    Header,
    Footer
  }
};
</script>