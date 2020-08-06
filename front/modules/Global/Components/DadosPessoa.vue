<template>
  <div class="dados-pessoa--wrapper">
    <dl class="dados-pessoa--list">
      <span class="dados-pessoa--list__item" v-for="(dado, key) in dadosPessoa" :class="'dados-pessoa--list__item--'+key">
        <dt class="dados-pessoa--list__title">{{key}}:</dt>
        <dd class="dados-pessoa--list__data">{{dado}}</dd>
      </span>
    </dl>
  </div>
</template>

<style scoped lang="scss">
  @import "../../../assets/css/responsive.scss";

  @include media-breakpoint-down(md) {
    .dados-pessoa--list {
      display: flex;
      flex-wrap: wrap;

      &__item {
        display: block;
        flex-basis: 50%;
        width: 50%;
      }

      &__item--email,
      &__item--nome {
        flex-basis: 100%;
        width: 100%;
      }
    }
  }

  .dados-pessoa--list__title {
    text-transform: capitalize;
  }
</style>

<script>
  export default {
    name: 'DadosPessoa',
    data(){
      return {
        dadosPessoa: {}
      }
    },
    created(){
      if (this.$store.state['ColetaDados'].formData) {
        const dados = this.$store.state['ColetaDados'].formData;
        const {nome, email, telefone, cidade, estado, profissao, entidade} = {...dados};
        this.dadosPessoa = {
          nome,
          email,
          telefone,
          cidade,
          estado,
          profissao,
          entidade
        }
      }
    }
  }
</script>