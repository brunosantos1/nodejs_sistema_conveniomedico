<template>
  <div>
    <!-- LOGO -->
    <figure class="plano--logo">
      <img :src="plano.operadoraLogo" :alt="plano.plano" />
    </figure>
    <!-- DESCRIÇÃO -->
    <div class="plano-nome--wrapper">
      <h2 class="plano--title">{{plano.plano}}</h2>
      <div class="plano--description">
        <p>{{plano.tipo_acomodacao ? 'Acomodação ' + plano.tipo_acomodacao.toLowerCase() : ''}}{{coleta.dependentes && coleta.dependentes.length > 0 ? ' + ' + coleta.dependentes.length + ' dependente' + (coleta.dependentes.length > 1 ? 's' : '') : ''}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";

  export default {
    name: "PlanoLogoDescricao",
    props: {
      selectedPlano: Object
    },
    data() {
      return {
        planoData: {},
        coleta: CacheMixin.methods.getCache( "ColetaDados" )
      }
    },
    computed: {
      ...mapGetters({
        getPlano: "Planos/getPlano"
      }),
      plano(){
        return this.selectedPlano || {};
      }
    }
  }
</script>

<style lang="scss">

.plano--logo {
  img {
    max-width: 100%;
    height: 100px;
  }
}

.plano-image {
  margin-top: em(80px);
  margin-bottom: em(80px);

  text-align: center;
}

.plano--title {
  display: inline-block;
  padding-left: em(10px, 24px);
  padding-right: em(10px, 24px);
  
  font-size: 24px;
  font-weight: bold;
  line-height: em(31px, 24px);
}

</style>