<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="section--header text-center">
          <img class="cta-image" :src="'/static/' + content.infos.lead.icone" alt="">
          <h1>{{titulo}}</h1>
          <p v-html="conteudo"></p>
          <router-link to="/planos" class="text-link">{{content.button.text}}</router-link>
        </div>
      </div>
      <div class="row dados-pessoa-proposta">
        <div class="col-12 col-md-6">
          <DadosPessoa />
        </div>
        <div class="col-12 col-md-6">
          <Card :parentData="plano" :hasPrices="plano.precos.precos" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .section--header {
    margin: 2em 0;
  }

  .cta-image {
    margin-bottom: 2em;
  }

  .dados-pessoa-proposta {
    align-items: center;
    margin: 0 auto;
    max-width: 700px; 
    width: 100%;
  }
</style>
<script>
  import infosJson from "@/modules/DetalhePlano/infos.json";
  import Botao from "@/modules/DetalhePlano/Components/Botao.vue";
  import Card from "@/modules/Global/Components/Card.vue";
  import DadosPessoa from "@/modules/Global/Components/DadosPessoa.vue";
  import fixHeader from "@/modules/Global/Mixins/fixHeader.js";

  import contentMixin from "@/modules/Global/Mixins/contentMixin.js";
  import LeadMixin from "@/modules/Global/Mixins/leadMixin.js";

  
  export default {
    name: 'PageReceberProposta',
    mixins: [contentMixin, LeadMixin],
    components: {
      Botao,
      Card,
      DadosPessoa
    },
    data(){
      return {
        plano: '',
        pessoa: '',
        content: {}
      }
    },
    computed: {
      titulo(){
        return this.checkPlaceholder(this.content.infos.lead.titulo);
      },
      conteudo(){
        return this.checkPlaceholder(this.content.infos.lead.texto);
      }
    },
    created() {
      const infoBtn = infosJson.botao.find(item => item.action === "sucessoLead");
      this.plano = this.$store.getters["Planos/getPlanoDetalhe"];
      this.pessoa = this.$store.state['ColetaDados'].formData;
      
      if (infosJson.sucesso) {
        this.content.infos = infosJson.sucesso;
      }

      if (infoBtn) {
        this.content.button = infoBtn;
      }
      
      this.atualizarSimulacao();
    }
  }
</script>