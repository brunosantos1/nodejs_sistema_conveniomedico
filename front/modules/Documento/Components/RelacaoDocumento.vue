<template>
  <div class>
    <LoaderShimmer :type="'titleTextContentRound'" :qtd="2" v-if="loading" />
    <div v-if="!loading">
      <div v-for="(item, index) in parentData.relacaoDocumentos" :key="index">
        <section>
          <div class="box-description">
            <h2 class="no-margin">{{item.titulo}}</h2>
            <p v-if="item.descricao" v-html="item.descricao.split('\n').join('<br/>')"></p>
            <b-tooltip
              :target="'dus'"
              placement="bottom"
            >Declaração de União Estável registrada e feita em cartório (documento público), contendo o número do RG e do CPF do(a) companheiro(a), endereço, tempo de convívio, número de RG e assinatura de 2 (duas) testemunhas, firma reconhecida do titular e do(a) companheiro(a)</b-tooltip>
            <div class="total-files">{{documentos[item.tipoDocumento].images.length}} arquivo(s)</div>
          </div>
          <div class="box-carousel">
            <transition name="fade" mode="out-in">
              <carousel
                :navigationEnabled="true"
                :paginationEnabled="false"
                :navigationNextLabel="btnNext"
                :navigationPrevLabel="btnPrev"
                :perPageCustom="[[300, 1],[360, 2],[500, 3],[680, 4],[830, 5],[992, 2],[1220, 3],[1600, 4],[1700, 5]]"
                v-if="documentos[item.tipoDocumento] && documentos[item.tipoDocumento].images && documentos[item.tipoDocumento].images.length > 0 && !parentData.relacaoDocumentos[index].optin"
              >
                <slide
                  class="slide-fixed"
                  v-if="item.limite && item.limite > documentos[item.tipoDocumento].images.length"
                >
                  <div class="icon-plus" @click="showOptin(index)">
                    <span class="fi-plus"></span>
                  </div>
                </slide>

                <slide v-for="(img, indexP) in documentos[item.tipoDocumento].images" :key="indexP">
                  <div class="card-image">
                    <img v-if="img.extensao !== '.pdf'" v-bind:src="img.src || img.thumb" />
                    <img v-if="img.extensao === '.pdf'" src="../../../assets/images/pdf.svg" />
                    <div class="container">
                      <div class="option option-left" @click="openDialog(index, indexP)">
                        <span class="fi-pencil"></span>
                      </div>
                      <div class="option option-center" @click="showLightbox(index,img)">
                        <span class="fi-zoom-in"></span>
                      </div>
                      <div
                        class="option option-right"
                        @click="deleteFile(item.tipoDocumento, img.identificador)"
                      >
                        <span class="fi-trash"></span>
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    v-bind:ref="'fileInputOnly-' + index + '-'+ indexP"
                    v-bind:id="'file-'+ index + '-'+ indexP"
                    v-bind:name="'file-'+ index + '-'+ indexP"
                    class="file-input"
                    accept=".jpg, .jpeg, .png, .pdf"
                    @change="convertToBase64Edit($event, index,indexP, item.tipoDocumento, img.identificador)"
                  />
                </slide>

                <input
                  type="file"
                  v-bind:ref="'fileInput-'+index"
                  v-bind:id="'file-'+ index"
                  v-bind:name="'file-'+ index"
                  class="file-input"
                  accept=".jpg, .jpeg, .png, .pdf"
                  @change="convertToBase64($event, index, item.tipoDocumento, item.identificador)"
                  multiple
                />
              </carousel>

              <div
                v-if="parentData.relacaoDocumentos[index].optin || (!documentos[item.tipoDocumento] || !documentos[item.tipoDocumento].images || documentos[item.tipoDocumento].images.length == 0)"
                class="optin-box"
              >
                <div
                  v-if="(!documentos[item.tipoDocumento] || !documentos[item.tipoDocumento].images || documentos[item.tipoDocumento].images.length == 0) && !parentData.relacaoDocumentos[index].optin"
                >
                  <div class="content">
                    <button
                      class="btn btn-outline-primary btn-block"
                      type="button"
                      @click="showOptin(index)"
                    >
                      <i class="fi-data-transfer-upload"></i> Adicionar arquivo
                    </button>
                  </div>
                </div>

                <div v-if="parentData.relacaoDocumentos[index].optin">
                  <div class="btn-close" @click="showOptin(index)">
                    <span class="fi-x"></span>
                  </div>
                  <div class="content">
                    <button
                      class="btn btn-outline-primary btn-block"
                      type="button"
                      @click="openCamera(index)"
                    >
                      <i class="fi-camera-slr"></i> Tirar foto
                    </button>
                    <button
                      class="btn btn-primary btn-block"
                      type="button"
                      @click="openDialog(index)"
                    >
                      <i class="fi-cloud-upload"></i> Escolher arquivo
                    </button>
                  </div>
                </div>

                <input
                  type="file"
                  v-bind:ref="'fileInput-'+index"
                  v-bind:id="'file-'+ index"
                  v-bind:name="'file-'+ index"
                  class="file-input"
                  accept=".jpg, .jpeg, .png, .pdf"
                  @change="convertToBase64($event, index, item.tipoDocumento, item.identificador)"
                  multiple
                />
              </div>
            </transition>
          </div>
        </section>
        <LightBox
          v-if="documentos[item.tipoDocumento] && documentos[item.tipoDocumento].images"
          :id="'boxImages-' + index"
          :ref="'boxImages-' + index"
        />
        <CameraBox
          @convertToBase64Canva="convertToBase64Canva"
          :id="'cameraImages-' + index"
          :ref="'cameraImages-' + index"
          :index="index"
          :tipoDocumento="item.tipoDocumento"
          :identificador="item.identificador"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
section {
  margin-bottom: 10px;
  .lead {
    font-size: 11.4px;
  }
  .box-description {
    -webkit-box-shadow: 0px 3px 5px -6px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 3px 5px -6px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 3px 5px -6px rgba(0, 0, 0, 0.75);
    padding-bottom: 10px;
    position: relative;

    h2 {
      color: var(--quali-brand);
    }
    p {
      color: var(--quali-dark-blue);
    }

    .total-files {
      float: right;
      margin-bottom: 14px;
      position: absolute;
      right: 8px;
      text-align: right;
      bottom: -15px;
      font-size: 11px;
      font-family: monospace;
      color: var(--quali-brand);
    }

    .more {
      font-size: 11px;
      cursor: pointer;
    }
  }
  .box-carousel {
    margin: 20px;
    .VueCarousel-slide {
      height: 140px;
      text-align: center;
      padding-right: 10px;
      .card-image {
        margin-top: 15px;
        border-radius: 10px 10px 0px 0px;
        border: 1px solid var(--quali-gray-blue);
        -webkit-box-shadow: 0px 3px 5px -5px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0px 3px 5px -5px rgba(0, 0, 0, 0.75);
        box-shadow: 0px 3px 5px -5px rgba(0, 0, 0, 0.75);
        .container {
          padding: 2px 16px;
          background-color: var(--quali-gray-blue);
          display: flex;
          justify-content: space-between;

          .option {
            margin: 0.5rem;
            cursor: pointer;
            color: var(--quali-medium-gray);
          }
          .option:hover {
            color: var(--quali-dark-blue);
          }
          .option-right:hover {
            color: red;
          }
        }
      }

      img {
        height: 65px;
        margin-top: 5px;
        max-width: 115px;
      }

      &.slide-fixed {
        .icon-plus {
          width: 80px;
          display: inline-block;
          padding: 29px 29px;
          background-color: var(--quali-gray-blue);
          border-radius: 60px;
          margin-top: 30px;
          cursor: pointer;
        }
        .icon-x {
          width: 80px;
          display: inline-block;
          padding: 29px 29px;
          background-color: var(--quali-dark-blue);
          border-radius: 60px;
          margin-top: 30px;
          cursor: pointer;
          color: white;
        }
      }
    }
  }

  .optin-box {
    top: 0;
    left: 0;
    height: 140px;
    width: 100%;
    background-color: #ffffff;
    position: relative;
    .btn-close {
      position: absolute;
      top: 0;
      right: 0;
      color: var(--quali-dark-blue);
      cursor: pointer;
      z-index: 99;
      padding: 10px 30px;
    }
    .content {
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      color: var(--quali-dark-blue);

      .btn i {
        vertical-align: middle;
      }
    }
  }
  .file-input {
    display: none;
  }
  .fade-leave-active,
  .fade-leave-active,
  .fade-enter-active {
    transition: all 0.1s ease;
  }

  .fade-enter-active {
    transition-delay: 0.1s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>

<script>
import Mixin from "@/modules/Documento/Mixins/documentoMixin.js";
import data from "@/modules/Documento/data.json";
import LazyImage from "@/modules/Global/Components/LazyImage.vue";
import documentoService from "@/services/api-documento";
import contratacaoService from "@/services/api-contratacao";
import { Carousel, Slide } from "vue-carousel";
import LightBox from "@/modules/Global/Components/LightBox.vue";
import CameraBox from "@/modules/Global/Components/CameraBox.vue";
import LoaderShimmer from "@/modules/Global/Components/LoaderShimmer.vue";
import { isAndroid } from "mobile-device-detect";

export default {
  name: "RelacaoDocumento",
  mixins: [Mixin],
  components: {
    LazyImage,
    Carousel,
    Slide,
    LightBox,
    CameraBox,
    LoaderShimmer
  },
  props: {
    parentData: Object,
    dadosCadastro: Object
  },
  data() {
    return {
      documentos: {},
      loading: false,
      isAccessCamera: isAndroid ? true : false
    };
  },
  computed: {
    btnNext() {
      return '<i class="fi-chevron-right"></i>';
    },
    btnPrev() {
      return '<i class="fi-chevron-left"></i>';
    }
  },
  async created() {
    this.documentos = {};
    this.loading = true;
    for (
      let index = 0;
      index < this.parentData.relacaoDocumentos.length;
      index++
    ) {
      const rel = this.parentData.relacaoDocumentos[index];
      this.documentos[rel.tipoDocumento] = {};
      this.documentos[rel.tipoDocumento].titulo = rel.titulo;
      this.documentos[rel.tipoDocumento].images = [];
    }
    await this.carregarImagens();
  },
  methods: {
    showLightbox(index, img) {
      if (img.extensao == ".png" || img.extensao == ".jpeg") {
        let boxName = "boxImages-" + index;
        this.$refs[boxName][0].show(img.src || img.thumb, img.caption);
      } else {
        if (img.thumb) {
          let pdfWindow = window.open("");

          let thumb = img.thumb.replace("data:application/pdf;", "");
          pdfWindow.document.write(
            "<object data='" +
              encodeURI(thumb) +
              "' type='application/pdf'><embed type='application/pdf' title='" +
              img.identificador +
              "' width='100%' height='100%' style='border:none;' src='data:application/pdf;" +
              encodeURI(thumb) +
              "'></embed></object>"
          );
        } else {
          window.open(img.src || img.thumb);
        }
      }
    },
    showOptin(index, padrao) {
      if (this.isAccessCamera) {
        this.parentData.relacaoDocumentos[index].optin =
          padrao != undefined
            ? padrao
            : !this.parentData.relacaoDocumentos[index].optin;
        this.$forceUpdate();
      } else {
        this.openDialog(index);
      }
    },

    openDialog(i, indexParent) {
      let tagName =
        indexParent != null || indexParent != undefined
          ? "fileInputOnly-" + i + "-" + indexParent
          : "fileInput-" + i;
      var input = this.$refs[tagName];
      if (input && input[0]) {
        setTimeout(() => {
          input[0].click();
        }, 100);
      }
    },
    async convertToBase64(event, index, tipo, identificador) {
      try {
        let files = event.target.files;
        var promises = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          var reader = new FileReader();
          reader.onload = e => {
            if (e.target.result) {
              let base64 = e.target.result;
              promises.push(
                this.uploadFile(
                  base64,
                  index,
                  this.documentos[tipo].images.length,
                  tipo,
                  identificador
                )
              );
            }
          };

          reader.onerror = error => {
            this.alertErrorGeneric(
              files.length > 1
                ? "Erro ao ler um dos arquivos. Tente novamente."
                : "Erro ao ler arquivo. Tente novamente."
            );
          };

          reader.readAsDataURL(file);
        }
        await Promise.all(promises);
        this.alertSuccessGeneric(
          files.length > 1
            ? "Arquivos salvos com sucesso"
            : "Arquivo salvo com sucesso"
        );
      } catch (error) {
        console.log(error);
      }
    },
    convertToBase64Edit(
      event,
      indexParent,
      indexEdit,
      tipoDocumento,
      identificador
    ) {
      let file = event.target.files;
      var reader = new FileReader();
      reader.onload = e => {
        if (e.target.result) {
          let base64 = e.target.result;
          this.uploadFile(
            base64,
            indexParent,
            indexEdit,
            tipoDocumento,
            identificador,
            true
          );
        }
      };
      reader.onerror = error => {
        console.log(error);
      };

      if (file && file[0]) reader.readAsDataURL(file[0]);
      else console.log("erro");
    },
    convertToBase64Canva(data) {
      this.uploadFile(
        data.base64,
        data.index,
        this.documentos[data.tipo].images.length,
        data.tipo,
        data.identificador
      );
    },
    async uploadFile(
      base64,
      indexParent,
      index,
      tipoDocumento,
      identificador,
      isEdit
    ) {
      try {
        const nrProposta = this.dadosCadastro.proposta.nrProposta;
        let id = isEdit
          ? identificador
          : this.generateId(tipoDocumento, identificador, nrProposta, index);
        let param = {
          nrProposta: this.dadosCadastro.proposta.nrProposta,
          tipoDocumento: tipoDocumento,
          identificador: id,
          cpf: this.parentData.cpf,
          arquivoStream: base64 ? this.validaBase(base64) : "",
          extensao: await this.validaExtensao(base64)
        };
        if (isEdit) {
          let indexFile = this.documentos[tipoDocumento].images.findIndex(f => {
            return f.identificador === identificador;
          });
          this.documentos[tipoDocumento].images[indexFile] = {
            thumb: base64,
            identificador: id,
            caption: this.documentos[tipoDocumento].titulo,
            extensao: param.extensao
          };
        } else {
          this.documentos[tipoDocumento].images.unshift({
            thumb: base64,
            identificador: id,
            caption: this.documentos[tipoDocumento].titulo,
            extensao: param.extensao
          });
        }
        this.parentData.relacaoDocumentos[indexParent].optin = false;
        this.$forceUpdate();
        // alert("param: " + JSON.stringify(param))
        await documentoService.uploadImage(param);
        if (isEdit) this.alertSuccessGeneric("Arquivo alterado com sucesso");
      } catch (error) {
        this.alertErrorGeneric("Desculpe, ocurreu um erro");
        console.log(error);
      }
    },
    generateId(tipoDocumento, identificador, nrProposta, index) {
      let newId = identificador + "_" + nrProposta + "_" + index;
      let existId = this.documentos[tipoDocumento].images.findIndex(f => {
        return f.identificador === newId;
      });
      if (existId >= 0)
        return this.generateId(
          tipoDocumento,
          identificador,
          nrProposta,
          index + 1
        );
      else return newId;
    },
    validaBase(base) {
      let newBase = base.replace("data:application/pdf;base64,", "");
      newBase = newBase.replace("data:image/png;base64,", "");
      newBase = newBase.replace("data:image/jpeg;base64,", "");
      return newBase;
    },
    async validaExtensao(base, url) {
      let isPdf = !url
        ? base.indexOf("data:application/pdf;base64,")
        : url.indexOf(".pdf");
      let isPng = !url
        ? base.indexOf("data:image/png;base64,")
        : url.indexOf(".png");
      let isJpg = !url
        ? base.indexOf("data:image/jpeg;base64,")
        : url.indexOf(".jpeg");
      let extensao = "";
      if (isPdf >= 0) {
        extensao = ".pdf";
      } else if (isPng >= 0) {
        extensao = ".png";
      } else if (isJpg >= 0) {
        extensao = ".jpeg";
      }
      return extensao;
    },
    async carregarImagens() {
      try {
        let docResponse = await documentoService.getAllDocumento({
          nrProposta: this.dadosCadastro.proposta.nrProposta
        });
        let docs = docResponse.data || [];

        var promises = [];
        for (let index = 0; index < docs.length; index++) {
          const doc = docs[index];
          promises.push(documentoService.getDocumentoDetalhe(doc));
        }
        let docBaseResponse = await Promise.all(promises);
        let docBase = docBaseResponse.map(m => {
          return m.data;
        });

        for (let index = 0; index < docBase.length; index++) {
          const doc = docBase[index];
          for (let obj in this.documentos) {
            if (obj === doc.tipoDocumento) {
              this.documentos[obj].images.push({
                src: doc.url,
                identificador: doc.identificador,
                caption: this.documentos[obj].titulo,
                extensao: await this.validaExtensao(null, doc.url)
              });
            }
          }
        }

        setTimeout(() => {
          this.loading = false;
        }, 800);
      } catch (error) {
        setTimeout(() => {
          this.loading = false;
        }, 800);
      }
    },

    openCamera(index) {
      let boxName = "cameraImages-" + index;
      this.$refs[boxName][0].show();
    },
    async deleteFile(tipoDocumento, identificador) {
      try {
        this.alertConfimarExclusao().then(result => {
          if (result.value) {
            this._deleteFile(tipoDocumento, identificador);
          }
        });
      } catch (error) {
        this.alertErrorGeneric("Desculpe, ocurreu um erro");
      }
    },
    async _deleteFile(tipoDocumento, identificador) {
      try {
        let param = {
          nrProposta: this.dadosCadastro.proposta.nrProposta,
          tipoDocumento: tipoDocumento,
          identificador: identificador
        };
        let res = await documentoService.deleteImage(param);
        let indexFile = this.documentos[tipoDocumento].images.findIndex(f => {
          return f.identificador === identificador;
        });
        this.documentos[tipoDocumento].images.splice(indexFile, 1);
        this.$forceUpdate();
        this.alertSuccessGeneric("Arquivo deletado");
      } catch (error) {
        this.alertErrorGeneric("Desculpe, ocurreu um erro");
      }
    }
  }
};
</script>