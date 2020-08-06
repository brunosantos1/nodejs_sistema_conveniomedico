<template>
  <div class="planos-container">
    <loader v-show="isLoading" text="Carregando Planos" />

    <div v-if="!isLoading">
      <header class="section--header">
        <div class="container">
          <h2 class="section--title" v-html="dadosPagina.titulo"></h2>
          <div class="description">
            <p v-html="dadosPagina.descricao"></p>
            <p><a href="#" class="text-link" @click="tentarNovamente()">Simular novamente</a></p>
          </div>
          <div v-show="dadosPlanoInicial.total > 0" class="btn-options" ref="btnOptions">
            <div class="col-sm-6 col-md-4 col-lg-4">
              <button type="button" class="btn btn-outline-secondary btn-block" :class="{'btn-active': comparar.length > 1}" :disabled="comparar.length <= 1" @click="abrirComparacao()">
                Comparar
                <span v-if="comparar.length > 0">({{comparar.length}})</span>
              </button>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-4">
              <button @click="$emit('toggleFilter')" type="button" class="btn btn-outline-primary__dark btn-block">Filtrar</button>
            </div>
          </div>
        </div>
      </header>
      <div v-if="(dadosPlano && dadosPlano.planos && dadosPlano.planos.length > 0)">
        <div class="container">
          <div class="row">
            <div class="col-12 col-sm-12 col-md-6 col-lg-4" v-for="(item, index) in dadosPlano.planos.slice(0, qtdRegistros)" :key="index">
              <!-- {{item.operadora}} -->
              <Card
              @compara="compara"
              :parentData="item"
              :coletaData="dadosPessoa"
              :countCompare="comparar.length"
              :countMaxCompare="qtdComparacao"
              :id="'card-'+index"
              visibleDetail
              visibleCompare
              :visibleButtoRoute="verificaComprarOuProposta(item.operadora) ? {name: 'Contratacao'} : {name: 'ReceberProposta'}"
              buttonDetailPainelStyle2
              />
            </div>
          </div>
          <!-- botao mostrar mais planos -->
          <div class="col-sm-12 col-md-12 col-lg-12 show-more--wrapper" v-if="this.dadosPlano.planos.length > this.qtdRegistrosDefault">
            <button type="button" class="btn btn-outline-primary btn-block btn-more" @click="mostrarPlanos()">{{this.dadosPagina.verPlanos}}</button>
          </div>
          <!-- botao mostrar mais planos -->

          
        </div>
      </div>
      <div v-else>
        <div class="container error--wrapper">
          <span v-html="dadosPagina.nenhumPlano"></span>
        </div>
      </div>
      <Filtro @filtrarPlanos="filtrarPlanos" @toggleFilter="$emit('toggleFilter')" :parentData="dadosPlanoInicial" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";

.title {
  font-size: 28px;
  text-align: center;
}

.loading {
  text-align: center;
}

.description {
  display: block;
  margin: 15px auto 25px;
  max-width: 300px;

  text-align: center;
  color: var(--quali-medium-gray);

  p {
    padding-bottom: 0;
  }
}

.btn-options {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;

  .btn {
    font-size: 14px;
  }

  &.fixHeader {
    margin-top: 0;
    margin-bottom: 15px;
  }
}

.btn-more {
  margin-top: 10px;
  margin-bottom: 10px;
}

.planos-container {
  margin-top: 60px;
  transition: all .5s linear;
}

.planos-header {
  padding-bottom: 15px;
  margin-bottom: 35px;
  @include media-breakpoint-down(md) {
    box-shadow: 0px 2px 3px var(--quali-light-gray);
  }
}

.show-more--wrapper {
  padding-top: em(30px);
  margin-top: em(30px);

  border-top: solid 2px var(--quali-light-x-gray);
}

.error--wrapper {
  margin-top: 5em;

  text-align: center;
}

</style>

<script>
  import planoService from "./../../../services/api-plano";
  import Card from "@/modules/Global/Components/Card.vue";
  import Loader from "@/modules/Global/Components/Loader.vue";
  import Mixin from "@/modules/Planos/Mixins/planosMixin.js";
  import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
  import Filtro from "@/modules/Global/Components/Filtro.vue";
  import fixHeader from "@/modules/Global/Mixins/fixHeader.js";
    import planoServiceCatalogo from "@/services/api-catalogo";

  export default {
    name: "PagePlanos",
    mixins: [Mixin, CacheMixin, fixHeader],
    components: { 
      Card,
      Loader,
      Filtro
    },
    props: {
      prevRoute: Object
    },
    data() {
      return {
        isLoading: true,
        qtdRegistrosDefault: 6,
        planosDiponiveisParaCompra: null,
        qtdRegistros: 6,
        // windowSize: 0,
        // qtdComparacao: 2,
        checkRefsItem: '',
        ["dadosPagina"]: {
          titulo: "Veja seus planos",
          descricao: "",
          nenhumPlano: "",
          verPlanos: "Mostrar todos os planos" 
        },
        ["dadosPlano"]: {},
        dadosPlanoInicial: {},
        ["dadosPessoa"]: {},
        ["comparar"]: []
      };
    },
    computed: {
      qtdComparacao() {
        if(this.$mq.slarge){
          return 3
        }
        return 2
      }
    },
    created() {
      // window.addEventListener('resize', () => this.windowSize = window.innerWidth);
      /*
        Testa se o objeto de cache é vazio
        */
        const hasColetaDados = this.getCache("ColetaDados");
        if (hasColetaDados) {
          this.dadosPessoa = hasColetaDados;
        } else {
          this.dadosPessoa = this.$store.state["ColetaDados"].formData;
          if (
            !this.dadosPessoa ||
            !this.dadosPessoa.nome ||
            !this.dadosPessoa.entidade ||
            !this.dadosPessoa.nascimento ||
            !this.dadosPessoa.cep
            ) {
            return this.$router.push({ name: "ColetaDados" });
        }
      }
      this.dadosPessoa.pessoas = this.tratarData(this.dadosPessoa);
      this.$store.commit('ColetaDados/updateFieldCache', this.dadosPessoa, {root: true});
      this.listarPlanos();
      this.getPlanosDisponiveisParaCompra();
    },
    watch: {
      isLoading(newValue){
        if (!newValue) {
          this.checkRefsItem = setInterval(() => {
            if (this.$refs.btnOptions) {
              this.checkRefs();
            }
          }, 10);
        }
      },
      // windowSize(newValue){
      //   if (this.windowSize >= 1024) {
      //     this.qtdComparacao = 3;
      //   } else {
      //     this.qtdComparacao = 2;
      //     this.comparar.pop();
      //   }
      // }
    },
    methods: {
      verificaComprarOuProposta(operadora){
          for (const index in this.planosDiponiveisParaCompra) {
             if(this.planosDiponiveisParaCompra[index].operadora == operadora){
               return true
               break
             }
             return false
          }
           
      },
      async getPlanosDisponiveisParaCompra(){
        let operadora = CacheMixin.methods.getCache( "Plano" ).operadora;
        let hasEntity = CacheMixin.methods.getCache( "ColetaDados" );
         if (hasEntity && operadora.length != 0) {
           let { data } = await planoServiceCatalogo.listarCatalogo( {
              entidade: hasEntity.entidade,
              profissao : hasEntity.profissao,
              dtNascimento : hasEntity.nascimento
            });

            this.planosDiponiveisParaCompra = [{"operadora":"AMIL SAÚDE SA"},{"operadora":"SulAmérica Saúde"}]
         }
      },
      async listarPlanos() {
        try {
          let dados = "";
          let dadosInicial = "";
          const hasPlanos = this.getCache("Planos");
          if (hasPlanos) {
            dadosInicial = hasPlanos;
          } else {
            const res = await planoService.listar(
              this.dadosPessoa.entidade,
              this.dadosPessoa.estado,
              this.dadosPessoa.cidade,
              this.dadosPessoa.pessoas
              );

            dadosInicial = res.data ? res.data : {};
          }
          this.$store.commit('Planos/createPlanoCache', dadosInicial, {root: true});
          // this.$store.commit("Planos/createDetalhePlanoCache", item);
          this.dadosPlano = this.filtrarPorPrecos(dadosInicial);
          this.dadosPlanoInicial = dadosInicial;
          await this.carregarDescricao();
        } catch (error) {
          console.log("error --> ", error);
          await this.carregarErro();
        }
        await this.carregarErro();
      },
      async carregarDescricao() {
        this.dadosPagina.descricao = `${
          this.dadosPessoa.nome.trim().split(" ")[0]
        }, com base nas suas informações encontramos <strong style="color: var(--quali-dark-x-gray);">${
          this.dadosPlano.planos.length
        }</strong> planos de saúde.`;

        this.isLoading = false;
      },
      async carregarErro() {
        this.dadosPagina.nenhumPlano = `<p><strong>${
          this.dadosPessoa.nome.split(" ")[0]
        }</strong>, infelizmente não encontramos nenhum plano para seu perfil.</p>`;
        this.isLoading = false;
      },
      filtrarPlanos(lista) {
        this.dadosPlano = lista;
        this.carregarDescricao();
      },
      compara(item) {
        if (item.selecionado) this.comparar.push(item);
        else {
          for (var i = 0; i < this.comparar.length; i++) {
            if (this.comparar[i].id === item.id) {
              this.comparar.splice(i, 1);
            }
          }
        }
      },
      scrollToTop(){
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      },
      abrirComparacao() {
        if (this.comparar.length <= 1) return;
        this.$router.push({
          name: "Comparacao",
          params: { lista: this.comparar }
        });
      },
      mostrarPlanos() {
        if(this.qtdRegistros == this.dadosPlano.planos.length) {
          this.qtdRegistros = this.qtdRegistrosDefault;
          this.dadosPagina.verPlanos = "Mostrar todos os planos";
          this.scrollToTop();
        }
        else
        { 
          this.qtdRegistros = this.dadosPlano.planos.length;
          this.dadosPagina.verPlanos = "Ver menos planos";
        }
      },
      tratarData(dados) {
        let dts = [];
        if (dados.nascimento) {
          let dt = dados.nascimento.split("/");
          let i = dt[2] + "-" + dt[1] + "-" + dt[0];
          dts.push(i);
        }
        if (dados.dependentes && dados.dependentes.length) {
          dados.dependentes.forEach(i => {
            let dt = i.value.split("/");
            i = dt[2] + "-" + dt[1] + "-" + dt[0];
            dts.push(i);
          });
        }

        return dts;
      },
      tentarNovamente() {
        this.clearCache("ColetaDados");
        this.clearCache("Planos");
        this.$router.push("/");
      },
      filtrarPorPrecos(dadosFiltrado) {
        const dados = {};
        dados.planos = dadosFiltrado.planos.filter(p => {
          return (
            parseFloat(p.precos.total) >= this.dadosPessoa.valor[0] &&
            parseFloat(p.precos.total) <= this.dadosPessoa.valor[1]
            );
        });
        dados.total = dadosFiltrado.planos.length;
        return dados;
      },
      checkRefs(){
        clearInterval(this.checkRefsItem);
        this.fixHeader([document.querySelector(".btn-options")]);
        if (window.innerWidth >= 1024 && this.prevRoute.name != "ColetaDados") {
          this.$emit('toggleFilter');
        }
      },
    }
  };
</script>