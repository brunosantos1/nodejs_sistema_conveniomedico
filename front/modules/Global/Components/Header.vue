<template>
  <header class="site--header" v-bind:class="{'site--header--fixed': isFixed}">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="btn-back" v-if="visibleBack" @click="back()">
            <ico icon="chevron-left" class="btn-blue" />
          </div>
          <div class="box-btn-back" v-if="visibleBackHome" @click="home()">
            <ico icon="home" class="btn-blue" />
            <span>Home</span>
          </div>
        </div>
        <div class="col">
          <h1 class="logo" title="Qualicorp - sempre do seu lado">
            <img src="../../../assets/logo.svg" alt="Logo da Qualicorp" />
          </h1>
        </div>
        <div class="col">
          <slot></slot>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";

.box-btn-back {
  display: flex;
  align-items: flex-end;
  font-size: smaller;
  color: var(--quali-brand);
}
.box-btn-back span {
  line-height: normal;
  margin-left: 4px;
}

@include media-breakpoint-up(xs) {
  .btn-back {
    cursor: pointer !important;
  }
}

@include media-breakpoint-down(md) {
  .btn-back {
    margin-left: 15px;
    margin-top: 15px;
  }
}

@include media-breakpoint-up(md) {
  .btn-back {
    margin-top: 3px;
  }
}

.site--header {
  padding: 10px 0;
  position: relative;

  background-color: #fff;

  & > .row {
    width: 100%;
  }
}

.site--header--fixed {
  position: fixed;
  width: 100%;
  z-index: 100;
}

.logo {
  display: flex;
  margin: 0;
  height: 100%;
  padding: 0;

  text-align: center;

  img {
    display: block;
    max-width: 100%;
    margin: 0 auto;
    width: 45px;
  }
}
</style>

<script>
import Ico from "@/modules/Global/Components/Icon.vue";

export default {
  name: "Header",
  components: {
    Ico
  },
  props: {
    visibleBack: Boolean,
    visibleBackHome: Boolean,
    hasStage: Boolean,
    isFixed: { type: Boolean, value: false }
  },
  methods: {
    back() {
      if (this.hasStage) this.$emit("changeStage");
      else this.$router.back();
    },

    home() {
      this.$router.push({ name: "ColetaDados" });
    }
  }
};
</script>
