<template>
  <div>
    <div class="alert-area" v-show="(this.alertas.length > 0)">
      <div v-for="(alerta, key) in this.alertas" v-bind:key="key" :class="alerta.class" role="alert">
        <span v-html="alerta.message"></span>
      </div>
    </div>

    <!-- com pendencias -->
    <PageDescritivo class="text-center" v-if="!this.pendente" :source="this.content.positivo"> 
    </PageDescritivo>

    <!-- sem pendencias -->
    <PageDescritivo class="text-center" v-if="this.pendente" :source="this.content.negativo">
    </PageDescritivo>

  </div>
</template>

<style lang="scss">
</style>

<script>

  import info from "@/modules/Pendencia/info.json";
  import PageDescritivo from "@/modules/Global/Components/PageDescritivo.vue";

  export default {
    name: "Cabecalho",
    components: {
      PageDescritivo
    },
    data: function () {
      return {
        alertas: []
      }
    },  
    computed: {
      content: function () {
        return info;
      },
      pendencias : function () {
        return this.$store.state.Pendencia.pendencias;
      },
      pendente : function () {
        let pendencias =  this.pendencias;
        return pendencias.filter( item =>  item.pendente == true ).length > 0;
      }
    },
    watch : {
      pendencias : function(){
        this.configurarMsgTempo();
      }
    },
    methods: {
      configurarMsgTempo(){
        this.alertas = [];
        if( this.pendente ){
          let diaEmMilesegundos = 1000 * 60 * 60 * 24;
          let dataLimite = new Date( Date.now() + (diaEmMilesegundos * 3) );
          let dataDiferenca = new Date( dataLimite.getTime() - Date.now());
          let mensagem = `Você tem <span class="text-bold"> ${Math.floor(dataDiferenca.getTime() / diaEmMilesegundos)} </span> dias até <span class="text-bold"> ${dataLimite.toLocaleDateString( "pt-BR" ).replace(/-/gi, "/") } </span> para resolver as pendências.`
          
          this.alertas.push( {
            message : mensagem,
            class : [ "alert" , "alert-danger" ]
          });  
        }
      }
    },
    created: function () {
      console.log("Created --> Cabecalho...");
    },
    mounted: function () {
      console.log("Mounted --> Cabecalho...");
    },
  }

</script>