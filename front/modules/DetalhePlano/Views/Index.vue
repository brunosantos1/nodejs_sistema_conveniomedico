<template>
  <div class="page-wrapper detalhe-wrapper">
    <Header visibleBack>
      <Botao id="btnDesktopHeader" :text="btnText.text" :action="btnText.action" />
    </Header>
    <PageDetalhePlano :conteudo="conteudo" :btnText="btnText" :planoProp="plano"></PageDetalhePlano>
    <Footer />
  </div>
</template>
<style scoped lang="scss">
  @import "../../../assets/css/responsive.scss";

  #btnDesktopHeader {
    opacity: 0;
    transition: all .2s ease-in;
  }

  @include media-breakpoint-down(lg) {
    #btnDesktopHeader {
      display: none;
    }

    .detalhe-wrapper {
      padding-bottom: 5em;
    }
  }
</style>
<script>
  import infosJson from "@/modules/DetalhePlano/infos.json";
  import PageDetalhePlano from "@/modules/DetalhePlano/Components/PageDetalhePlano.vue";
  import planoServiceCatalogo from "./../../../services/api-catalogo";
  import Botao from "@/modules/DetalhePlano/Components/Botao.vue";
  import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
  import Header from "@/modules/Global/Components/Header.vue";
  import Footer from "@/modules/Global/Components/Footer.vue";

  export default {
    name: "DetalhePlano",
    mixins: [CacheMixin],
    components: {
      PageDetalhePlano,
      Header,
      Footer,
      Botao
    },
    data() {
      return {
        plano: {},
        btnText: {
            text : "",
            action : "",
            setButton : function( escopo ){
              let btn = infosJson.botao.find((btn) => btn.action === escopo );
              this.text = btn.text;
              this.action = btn.action;
              return btn;
            }
        }
      }
    },
    created() {
      let cache = this.getCache("Plano") || {};
      let planoAtualiza = this.$route.params.plano || cache;
      this.$store.commit("Planos/createDetalhePlanoCache", planoAtualiza);
      this.plano = this.$store.state[ "Planos" ].plano;
      this.catalogoPlano();  
    },
    methods: {
      async catalogoPlano() {
        try {
          let status = false;
          let hasEntity = "";
          let operadora = "";
          let escopo = "";
          let dados = "";
          let res = "";

          operadora = CacheMixin.methods.getCache( "Plano" ).operadora;
          hasEntity = CacheMixin.methods.getCache( "ColetaDados" );
          // console.log("hasEntity:", hasEntity)
          // console.log("operadora:", operadora)
          if (hasEntity && operadora.length != 0) {

            res = await planoServiceCatalogo.listarCatalogo( {
              entidade: hasEntity.entidade,
              profissao : hasEntity.profissao,
              dtNascimento : hasEntity.nascimento
            } );
            
            for (let operator of res.data) {
             
              if( operator.operadora === operadora ){
                status = true;
                break;
              }              
            }

          } 

          if( status ){
            escopo = "/contratacao";
          } else {
            escopo = "simulacao";
          }

          this.plano.escopo = escopo; 
          this.btnText.setButton( escopo );
          
        } catch (e) {
          throw e;
        }
      }
    },
    computed: {
      conteudo: () => {
        return infosJson;
      }
    }
  };
</script>
