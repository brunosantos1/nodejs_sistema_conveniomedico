<template>
  <div class="w-100">
    <div v-show="!isLoading">
      <Pendencia 
        v-for="(pendencia, key) in this.pendencias"
        v-bind:key="key"
        v-bind:source="pendencia"
        class="w-100 zebra">
      </Pendencia>
    </div> 
    <div class="loadingContainer" v-show="isLoading" :class="{ hide : !isLoading, show : isLoading }" >
      <Loader text="" />
    </div>
  </div>
</template>

<style lang="scss">

  .loadingContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20vh;
  }

  .zebra {
    color: #000;
  }

  .zebra:nth-child(even){
    color: #000;
    background-color: var( --quali-light-x-gray );
  }

  .zebra:nth-child(odd){
    color: #000;
    background-color: #fff;
  }

</style>

<script>

  import info from "@/modules/Pendencia/info.json";
  import Pendencia from "@/modules/Pendencia/Components/Pendencia.vue";
  import apiPendencia from "@/services/api-validacao-pendencia.js";
  import Loader from "@/modules/Global/Components/Loader.vue";


  export default {
    name : "PainelPendencia",
    components : {
      Pendencia,
      Loader
    },
    data : function(){ 
      return {
        nrProposta : "",
        isLoading : true
      } 
    },
    methods : {
      processarPendencias( pend ){
        if( !!pend ){
          pend.forEach( p => { p.params = { nrProposta : this.nrProposta }});
        }
        return pend;
      }
    },
    computed : {
      pendencias : function(){
        return this.$store.getters["Pendencia/listarPendencias"]
      }
    },
    created : async function(){
      this.isLoading = true;
      this.nrProposta = this.$route.params.nrProposta;
    
      if( !(!!this.nrProposta) ){
        throw "número da proposta não fornecido.";
        return;
      }

      setTimeout( async () => {
        let pendencias = [];
        let toRoute = "Checkout";

        pendencias = await apiPendencia.listar( this.nrProposta ); 
        pendencias = this.processarPendencias( pendencias );
        
        this.$store.commit( "Pendencia/adicionarPendencias" , pendencias );
        this.isLoading = false;

        if( pendencias.length == 0 ){
          this.$router.push( info.personalidadeTela.transmissao );
        }
      }, 1000 );
      
      console.log( "Created --> PainelPendencia ... " );
    },
    mounted : function(){
      console.log( "Mounted --> PainelPendencia... " );
    }
  }

</script>