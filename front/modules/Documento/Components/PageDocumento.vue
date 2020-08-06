<template>
  <div class="row justify-content-center">
    <div class="col-12 col-sm-12 col-md-12 col-lg-5">
      <h1 class="m-2">Anexo de documentos</h1>
      <p class="m-2">
        <span>{{getNome}}</span>, precisamos que você anexe alguns documentos para seguir com a contratação
      </p>

      <div class="row price-table">
        <div
          class="box-marked-line"
          v-for="(item, index) in pessoas"
          :key="index"
          :class="{active: collapseActive == index}"
        >
          <div @click="abreAnexos(index)" class="marked-line">
            <div class="left">
              <span class="price-title">
                <span>{{item.nome}}</span>
                <span class="fi-check check" v-if="validates[index]"></span>
              </span>
              <span
                class="price-desc"
              >{{collapseActive != index ? 'Clique para ver documentos' : 'Clique para esconder documentos'}}</span>
            </div>
            <div class="right">
              <span class="price-link">{{item.tipo}}</span>
            </div>
          </div>

          <CollapseTransition :duration="900">
            <div class="box-files" v-if="collapseActive == index">
              <RelacaoDocumento :dadosCadastro="dadosCadastro" :parentData="item" />
            </div>
          </CollapseTransition>
        </div>
      </div>
      <br />
      <div class="row justify-content-center">
        <div class="col-11 col-sm-11 col-md-11 col-lg-11">
          <button class="btn btn-primary btn-block" type="button" @click="next()">Continuar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";

.justify-content-center {
  margin-bottom: 70px;
}

.price-title {
  display: block;

  font-size: 18px;
  font-weight: bold;
}

.price-desc {
  font-size: 12px;
}
.price-title .check {
  margin-left: 10px;
  color: #91bd83;
}

.price-link {
  font-weight: bold;
}

.box-marked-line {
  width: 100%;
  margin-bottom: 10px;
  @include media-breakpoint-down(md) {
    border-top: none;
  }
  .box-files {
    background-color: white;
    padding: 1.5rem;
  }
}
.box-marked-line.active {
  border-right: 1px solid #f3f3f3;
  border-left: 1px solid #f3f3f3;
  border-bottom: 1px solid #f3f3f3;
}
.marked-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.box-marked-line:nth-child(odd) {
  background-color: var(--quali-gray-blue);
  width: 100%;
}
.box-marked-line:nth-child(even) {
  background-color: white;
  width: 100%;
}

.box-marked-line .left {
  float: left;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 60%;
}
.box-marked-line .right {
  float: right;
  text-align: end;
  color: var(--quali-dark-blue);
  cursor: pointer;
}
</style>

<script>
import Mixin from "@/modules/Documento/Mixins/documentoMixin.js";
import data from "@/modules/Documento/data.json";
import LazyImage from "@/modules/Global/Components/LazyImage.vue";
import documentoService from "@/services/api-documento";
import contratacaoService from "@/services/api-contratacao";
import RelacaoDocumento from "@/modules/Documento/Components/RelacaoDocumento.vue";
import CollapseTransition from "@/modules/Global/Components/CollapseTransition.vue";

export default {
  name: "PageDocumento",
  mixins: [Mixin],
  components: { LazyImage, RelacaoDocumento, CollapseTransition },
  data() {
    return {
      dadosCadastro: {},
      pessoas: [],
      validates: {},
      collapseActive: -1
    };
  },
  computed: {
    getNome() {
      return this.dadosCadastro &&
        this.dadosCadastro.titular &&
        this.dadosCadastro.titular.nome
        ? this.dadosCadastro.titular.nome
        : "";
    }
  },
  async created() {
    let nrProposta = this.$route.params.nrProposta;
    let response = await contratacaoService.get(nrProposta);
    if (!response || !response.data) {
      this.$router.push({ name: "LoginContratacao" });
      return this.alertWarningGeneric("Proposta não encontrada");
    }
    this.dadosCadastro = response.data;
    console.log(this.dadosCadastro);
    await this.carregarListaPessoas();
  },
  methods: {
    async carregarListaPessoas() {
      let lista = [];

      if (this.dadosCadastro && this.dadosCadastro.titular) {
        let isEmancipado = this.dadosCadastro.titular.emancipado;
        let isPossuiPlano = this.dadosCadastro.proposta.possuiPlano;

        let tipoDPS =
          this.dadosCadastro.proposta.tipoDPS ||
          this.dadosCadastro.proposta.TipoDPS;
        let isDPS =
          tipoDPS && (tipoDPS == "DpsOperadora" || tipoDPS == "DpsParticular")
            ? true
            : false;
        lista.push({
          nome: this.dadosCadastro.titular.nome,
          tipo: "Titular",
          cpf: this.dadosCadastro.titular.cpf,
          relacaoDocumentos: await this.carregarRelacaoDocumentos(
            isEmancipado,
            isPossuiPlano,
            isDPS
          )
        });
      }

      if (this.dadosCadastro && this.dadosCadastro.responsavelLegal) {
        let grauParentesco = this.dadosCadastro.responsavelLegal
          .parentescoResponsavel;
        lista.push({
          nome: this.dadosCadastro.responsavelLegal.nomeResponsavel,
          tipo: "Representante Legal",
          cpf: this.dadosCadastro.responsavelLegal.cpfResponsavel,
          relacaoDocumentos: await this.carregarRelacaoDocumentosParaRepresentante(
            grauParentesco
          )
        });
      }

      if (this.dadosCadastro && this.dadosCadastro.dependentes) {
        this.dadosCadastro.dependentes.forEach(d => {
          let grauParentesco = d.parentesco;
          let isPossuiPlano = d.possuiPlano;
          let tipoDPS =
            this.dadosCadastro.proposta.tipoDPS ||
            this.dadosCadastro.proposta.TipoDPS;
          let isDPS =
            tipoDPS && (tipoDPS == "DpsOperadora" || tipoDPS == "DpsParticular")
              ? true
              : false;

          lista.push({
            nome: d.nome,
            tipo: "Dependente",
            cpf: d.cpf,
            relacaoDocumentos: this.carregarRelacaoDocumentosParaDependente(
              grauParentesco,
              isPossuiPlano,
              isDPS,
              d.id
            )
          });
        });
      }

      this.pessoas = lista;
    },
    async carregarRelacaoDocumentos(emancipado, possuiPlano, dps) {
      let listaTemp = [];
      let lista = [];
      listaTemp = [
        data.relacaoDocumento.selfie,
        data.relacaoDocumento.documento_identificador,
        data.relacaoDocumento.comprovante_endereco,
        data.relacaoDocumento.comprovante_filiacao,
        data.relacaoDocumento.comprovante_elegibilidade
      ];
      if (emancipado)
        listaTemp.push(data.relacaoDocumento.comprovante_emancipacao);

      if (possuiPlano) listaTemp.push(data.relacaoDocumento.reducao_carencia);

      if (dps) listaTemp.push(data.relacaoDocumento.dps);

      listaTemp.push(data.relacaoDocumento.outros);
      lista = JSON.parse(JSON.stringify(listaTemp));
      lista.forEach(item => {
        item.tipoDocumento += "Titular";
      });
      return lista;
    },
    async carregarRelacaoDocumentosParaRepresentante(grau) {
      let listaTemp = [];
      let lista = [];

      switch (grau) {
        case 5:
          listaTemp = [data.relacaoDocumento.documento_identificador];
          break;

        default:
          listaTemp = [
            data.relacaoDocumento.documento_identificador,
            data.relacaoDocumento.tutela_termo_de_guarda
          ];
          break;
      }
      lista = JSON.parse(JSON.stringify(listaTemp));
      lista.forEach(item => {
        item.tipoDocumento += "RepresentanteLegal";
      });
      return lista;
    },
    carregarRelacaoDocumentosParaDependente(grau, possuiPlano, dps, id) {
      let listaTemp = [];
      let lista = [];

      switch (grau) {
        case 1:
          listaTemp = [
            data.relacaoDocumento.documento_identificador,
            data.relacaoDocumento.comprovante_elegibilidade_conjuge
          ];
          break;
        case 2:
          listaTemp = [
            data.relacaoDocumento.documento_identificador,
            data.relacaoDocumento.comprovante_elegibilidade_companheiro
          ];
          break;
        case 3:
          listaTemp = [data.relacaoDocumento.documento_identificador];
          break;
        case 56:
          listaTemp = [
            data.relacaoDocumento.documento_identificador,
            data.relacaoDocumento.laudo_medico_pericia_medica
          ];
          break;
        case 53:
          listaTemp = [
            data.relacaoDocumento.documento_identificador,
            data.relacaoDocumento.comprovante_elegibilidade_enteado
          ];
          break;
        case 55:
          listaTemp = [
            data.relacaoDocumento.documento_identificador,
            data.relacaoDocumento.tutela_termo_de_guarda
          ];
          break;
        case 5:
          listaTemp = [data.relacaoDocumento.documento_identificador];
          break;
        case 10:
          listaTemp = [data.relacaoDocumento.documento_identificador];
          break;
        default:
          listaTemp = [data.relacaoDocumento.documento_identificador];
          break;
      }
      if (possuiPlano) listaTemp.push(data.relacaoDocumento.reducao_carencia);

      if (dps) listaTemp.push(data.relacaoDocumento.dps);

      listaTemp.push(data.relacaoDocumento.outros);
      lista = JSON.parse(JSON.stringify(listaTemp));
      lista.forEach(item => {
        item.tipoDocumento += "Dependente" + id;
      });
      return lista;
    },

    //MÉTODOS AUXILIARES
    abreAnexos(index) {
      if (this.collapseActive == index) this.collapseActive = -1;
      else this.collapseActive = index;
    },
    next() {
      this.$router.push({
        name: "Pendencia",
        params : this.$route.params
      });
    }
  }
};
</script>