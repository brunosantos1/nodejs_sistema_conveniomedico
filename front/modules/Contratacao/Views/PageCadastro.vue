<template>
  <div class="app-wrapper" ref="pageContratacao">
    <Header visibleBack hasStage @changeStage="back" :isFixed="isFixedHeader" />
    <div class="container" v-bind:style="isFixedHeader ? 'margin-top: 60px;' : 'margin-top: 0;'">
      <transition name="fade" mode="out-in">
        <FormCadastro v-if="formStage.current > 0" @onInit="onInitForm" />
      </transition>
    </div>
    <div id="loader" v-if="isLoading"></div>
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
}
.container {
  margin-bottom: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#loader {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

#loader::after {
  content: "";
  display: block;
  position: absolute;
  left: 48%;
  top: 40%;
  width: 40px;
  height: 40px;
  border-style: solid;
  border-color: var(--quali-dark-blue);
  border-top-color: transparent;
  border-width: 4px;
  border-radius: 50%;
  -webkit-animation: spin 0.8s linear infinite;
  animation: spin 0.8s linear infinite;
}
</style>
<script>
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import ContratacaoMixin from "@/modules/Contratacao/Mixins/contratacaoMixin.js";
import Header from "@/modules/Global/Components/Header.vue";
import FormCadastro from "@/modules/Contratacao/Components/FormCadastro.vue";
import questoesService from "@/services/api-parametriza-tela";
import { mapMutations, mapGetters, mapActions } from "vuex";
import contratacaoService from "@/services/api-contratacao";

export default {
  name: "Contratacao",
  mixins: [CacheMixin, ContratacaoMixin],
  components: {
    Header,
    FormCadastro
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      formData: "Contratacao/getFormData",
      dadosContratacao: "Contratacao/getDadosContratacao",
      dadosColeta: "Contratacao/getColetaDados",
      formStage: "Contratacao/getFormStage",
      stages: "Contratacao/getStages",
      isFixedHeader: "Contratacao/getIsFixedHeader",
      enderecoCobranca: "Contratacao/getEnderecoCobranca"
    }),
    isLoading() {
      return this.$store.state["Contratacao"].isLoading;
    }
  },
  async created() {
    this.$store.dispatch("Contratacao/resetStoreFields");

    let nrProposta = this.$route.params.nrProposta;
    let response = await contratacaoService.get(nrProposta);

    if (!response || !response.data) {
      this.$router.push({ name: "LoginContratacao" });
      return this.alertWarningGeneric("Proposta não encontrada");
    }
    console.log(response.data);
    this.$store.commit("Contratacao/updateDadosContratacao", response.data);

    this.loadServices();

    const enderecoCobranca = this.dadosContratacao.proposta.enderecoCobranca
      ? this.dadosContratacao.proposta.enderecoCobranca
      : this.enderecoCobranca;
    this.$store.commit("Contratacao/updateEnderecoCobranca", enderecoCobranca);

    const hasFormStage = this.dadosContratacao.proposta.sequencia;

    let coleta = {};
    const titular = this.dadosContratacao.titular;
    for (let el in titular) {
      coleta[el] = titular[el];
    }
    const endereco = this.dadosContratacao.endereco;
    for (let el in endereco) {
      coleta[el] = endereco[el];
    }
    const enderecoComercial = this.dadosContratacao.enderecoComercial;
    for (let el in enderecoComercial) {
      coleta[el] = enderecoComercial[el];
    }
    const profissao = this.dadosContratacao.profissao;
    for (let el in profissao) {
      coleta[el] = profissao[el];
    }

    const proposta = this.dadosContratacao.proposta;
    for (let el in proposta) {
      coleta[el] = proposta[el];
    }

    const responsavelLegal = this.dadosContratacao.responsavelLegal;
    for (let el in responsavelLegal) {
      coleta[el] = responsavelLegal[el];
    }

    coleta["dependentes"] = this.dadosContratacao.dependentes;

    const plano = {
      id: this.dadosContratacao.proposta.planoId,
      idplano_sinf: this.dadosContratacao.proposta.planoIdSinf
    };

    this.$store.dispatch("Contratacao/createStoreFieldsColeta", coleta);
    this.$store.dispatch("Contratacao/createStorePlano", plano);

    let flow = await this.loadFlow(proposta.fluxoId);
    let etapas = flow[proposta.fluxoId].etapas; //TEMPORÁRIO
    this.$store.dispatch("Contratacao/createStoreStages", etapas);

    const stage = hasFormStage ? hasFormStage : 1;
    this.$store.commit("Contratacao/updateStageForm", stage, {
      root: false
    });
  },
  methods: {
    async loadFlow(fluxoId) {
      const parametrizacaoResponse = await questoesService.getTelaEspecifica(
        "Cadastro",
        "flow"
      );
      let parametrizacao = parametrizacaoResponse.data || [];
      let flowList = parametrizacao[0] ? parametrizacao[0].flow : [];
      let flowActive = flowList.find(f => {
        return Object.keys(f)[0] && Object.keys(f)[0] == fluxoId;
      });
      return flowActive;
    },
    loadServices() {
      const dadosColeta = this.$store.state["Contratacao"].coletaDados;
      let listaOperadoraCongenere = [
        { label: "Amil", code: 1 },
        { label: "Unimed", code: 2 },
        { label: "Bradesco Saúde", code: 3 },
        { label: "Nenhuma dessas", code: -1 }
      ];
      this.$store.commit("Contratacao/updateService", {
        listaOperadoraCongenere: listaOperadoraCongenere
      });
    },
    onInitForm() {
      this.$refs.pageContratacao.scrollTop = 0;
      this.$store.commit("Contratacao/updateFixedHeader", true);
    }
  }
};
</script>