<template>
  <div class="app-wrapper">
    <Header visibleBack />
      <div class="container">
        <PageDeclaracaoPessoalSaude></PageDeclaracaoPessoalSaude>
      </div>
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
import PageDeclaracaoPessoalSaude from "@/modules/DeclaracaoPessoalSaude/Components/PageDeclaracaoPessoalSaude.vue";
import Footer from "@/modules/Global/Components/Footer.vue";

export default {
  name: "DeclaracaoPessoalSaude",
  components: {
    PageDeclaracaoPessoalSaude,
    Header,
    Footer
  },
};
</script>