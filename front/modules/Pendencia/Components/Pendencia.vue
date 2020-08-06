<template>
  <div class="d-flex w-100" :class="{ resolvido : !this.source.pendente }">
    <div class="flex-grow-1 pl-3">
      <h2 class="mt-3 mb-0"> {{ this.titulo }} </h2>
      <p class=""> {{ this.mensagem }} </p>
    </div>
    <div class="bg-secondary d-flex justify-content-center px-3">
      <a v-if="this.source.pendente" href="#" @click="resolverPendencia" class="align-self-center not-link"> {{this.content.resolver.text}} </a>
      <span v-if="!this.source.pendente" class="align-self-center not-link"> {{this.content.resolvido.text}} </span>
    </div> 
  </div>
</template>


<style lang="scss">
  
  .not-link {
    color : var( --quali-dark-blue );
    font-weight: bolder;
  }
  
  .not-link:hover, .not-link:active {
    text-decoration: none;
    cursor : pointer;
  }

  .resolvido {
    background-color: var( --quali-blue ) !important;
    border-bottom: 1px solid #FFF;
    color : #FFF !important;
  }

  .resolvido .not-link {
    color: inherit;
  }

</style>

<script>

  import tracker from "@/modules/Global/Mixins/tracker.js";
  import InfoJson from "@/modules/Pendencia/info.json";

  export default {
    name : "Pendencia",
    mixins : [ tracker ],
    components : {},
    data : function(){
      return {}
    },
    props : [ "source" ],
    methods : {
      resolverPendencia : function() {
        let toTrack = {};
        let track;

        toTrack.where = this.source.nomeRota == "DeclaracaoPessoalSaude" ? "CadastroDps|AgendamentoDps|EmailDps" : this.source.nomeRota;
        toTrack.then = "Pendencia";
        toTrack.params = this.$route.params;
        
        this.clearAll();
        track = this.trackerRoute(toTrack);
        this.$router.push( { name : this.source.nomeRota, params : this.source.params } );

        window.event.returnValue = false;
      }
    },
    computed : {
      titulo : function () {
        return this.source.Titulo;
      },
      mensagem : function () {
        return this.source.Mensagem;
      },
      content : function(){
        return InfoJson;
      }
    },
    created : function(){
      console.log( "Created --> Pendencia ... " );
    },
    moutend : function(){
      console.log( "Mounted --> Pendencia ... " );
    }
  }

</script>