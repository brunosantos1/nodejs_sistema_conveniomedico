<template>
  <svg class="btn-icon btn-icon__sm" v-bind:viewBox="viewboxDefault">
    <use v-bind:xlink:href="iconUrl"></use>
  </svg>
</template>

<style scoped lang="scss">
  @import "../../../assets/css/responsive.scss";

  .btn-icon {
    fill: var(--quali-brand);
  }
</style>

<script>
  import svg from 'open-iconic/sprite/open-iconic.svg';
  export default {
    name: 'Ico',
    props: ['icon', 'viewbox'],
    computed: {
      viewboxDefault(){
        let measure = '';
        if (this.viewbox) {
          measure = this.viewbox;
        } else {
          measure = "0 0 8 8";
        }
        return measure;
      },
      iconUrl(){
        return svg + '#' + this.icon;
      }
    }
  }
</script>