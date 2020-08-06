<template>
  <datepicker :value="value" :language="lang" @selected="val => $emit('input', val)" v-bind:placeholder="placeholder"></datepicker>
</template>

<script>
  import Datepicker from 'vuejs-datepicker';
  import { ptBR } from 'vuejs-datepicker/dist/locale'
  
  export default {
    props: ['placeholder', 'value', 'name'],
    data(){
      return {
        lang: ptBR
      }
    },
    mounted(){
      if (this.$store.state.ColetaDados.formData[this.name].length > 0) {
        this.value = this.$store.state.ColetaDados.formData[this.name];
      }
    },
    components: {
      Datepicker
    }
  }
</script>