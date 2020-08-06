<template>
  <div>
    <div>
      <Cabecalho class="w-100">
      </Cabecalho>
    </div>
    <div>
      <PainelPendencia class="w-100">
      </PainelPendencia>
    </div>
    <div class="w-100 p-2 mt-2">
      <button class="btn btn-primary w-100 p-2" :disabled="this.pendente"> {{ this.content.button.next }} </button>
    </div>
  </div>
</template>

<style lang="scss">

  :disabled {
    background-color : var( --quali-medium-gray ) !important;
    border: 1px solid var( --quali-light-gray ) !important;
    color : #FFF !important;
  }

</style>

<script>

  import PainelPendencia from "@/modules/Pendencia/Components/PainelPendencia.vue";
  import Cabecalho from "@/modules/Pendencia/Components/Cabecalho.vue";
  import Info from "@/modules/Pendencia/info.json";

  export default {
    name : "PagePendencia",
    components : {
      Cabecalho,
      PainelPendencia
    },
    data : function(){ return {} },
    computed : {
      pendente : function () {
        let pendencias =  this.$store.getters["Pendencia/listarPendencias"];
        return pendencias.filter( item =>  item.pendente == true ).length > 0;
      },
      content : function(){
        return Info;
      }
    },
    methods : {},
    created : function(){
      console.log( `Created --> PageVigencia...` );
    },
    mounted : function(){
      console.log( `Mounted --> PageVigencia...` );
    },
  }

</script>