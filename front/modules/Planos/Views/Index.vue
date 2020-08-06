<template>
  <div class="page-wrapper planos-wrapper" :class="{showFilter: showFilter}">
    <Header />
    <PagePlanos @toggleFilter="toggleFilter" :prevRoute="prevRoute"></PagePlanos>
    <Footer />
  </div>
</template>

<style lang="scss">
@import "../../../assets/css/responsive.scss";

.site--header,
.btn-options,
.planos-wrapper {
  transition: all .25s ease-in-out;
}

.planos-wrapper {
  &.showFilter {
    width: 75vw;
    .fixHeader {
      &.site--header,
      &.btn-options {
        width: 75vw;
      }
    }
  }
}



.showFilter {
  .filtro-wrapper {
    transform: translateX(0);
  }
}
</style>

<style scoped lang="scss">
.planos-wrapper {
  .fixHeader {
    &.btn-options {
      left: 0;
      top: 0;
      width: 100%;
    }
  }
}
</style>
<script>
import Header from "@/modules/Global/Components/Header.vue";
import Footer from "@/modules/Global/Components/Footer.vue";
import PagePlanos from "@/modules/Planos/Components/PagePlanos.vue";

export default {
  name: "Planos",
  data() {
    return {
      showFilter: false,
      prevRoute: null
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  },
  methods: {
    toggleFilter(){
      this.showFilter = !this.showFilter;
    }
  },
  components: {
    PagePlanos,
    Header,
    Footer
  }
};
</script>