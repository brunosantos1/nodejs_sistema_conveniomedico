<template>
  <div class="sidebar">
    <div class="sidebar-backdrop" @click="closeSidebarPanel()" v-if="isPanelOpen"></div>
    <transition name="slide">
      <div v-if="isPanelOpen" class="sidebar-panel">
        <button
          @click="closeSidebarPanel()"
          type="button"
          class="burger-button text-link"
          title="Fechar"
        >
          <span class="fi-x"></span>
        </button>

        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
          <div class="title">
            <h1>Documentos</h1>
          </div>
          <div class="search-input">
            <div class="form-group">
              <input
                placeholder="Filtrar"
                :type="'text'"
                class="form-control"
                v-model="textSearch"
                v-on:change="filterList($event.target.value)"
              />
              <span v-if="textSearch.length" class="fi-x cursor-pointer" @click="clearFilter()"></span>
            </div>
          </div>
          <br />
          <div class="btn-agrupador" @click="atualizar()">Atualizar</div>
          <div class="documentos" :style="{height: innerHeight + 'px'}">
            <div class="box-files" v-for="(categoria, ic) in documentos" :key="ic">
              <div class="title-doc">
                <h2>{{categoria.title}}</h2>
              </div>
              <div class="list p-2" v-if="(categoria.lista && categoria.lista.length > 0)">
                <div class="item" v-for="(proposta, ip) in categoria.lista" :key="ip">
                  <div class="title-item">
                    <div class="name">
                      <span>Proposta</span>
                      {{proposta.nrProposta}}
                    </div>
                  </div>
                  <div class="sub-list">
                    <div class="sub-item" v-for="(doc, id) in proposta.docs" :key="id">
                      <span
                        class="fi fi-caret-right cursor-pointer"
                        v-if="(doc.lista && doc.lista.length > 1) && !documentos[ic].lista[ip].docs[id].details"
                        @click="viewDetails(ic,ip,id)"
                      ></span>
                      <span
                        class="fi fi-caret-bottom cursor-pointer"
                        @click="viewDetails(ic,ip,id)"
                        v-if="(doc.lista && doc.lista.length > 1) && documentos[ic].lista[ip].docs[id].details"
                      ></span>
                      <div
                        class="file name cursor-pointer"
                        v-if="doc.lista && doc.lista.length == 1"
                        @click="download(doc.lista[0])"
                      >{{doc.tipo}}</div>
                      <div class="name" v-if="doc.lista && doc.lista.length > 1">
                        <span class="cursor-pointer" @click="viewDetails(ic,ip,id)">{{doc.tipo}}</span>
                        <div class="sub-list-file" v-if="documentos[ic].lista[ip].docs[id].details">
                          <div
                            class="file name cursor-pointer"
                            v-for="(file, idf) in doc.lista"
                            :key="idf"
                            @click="download(file)"
                          >Arquivo {{(idf + 1)}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p v-if="(!categoria.lista || categoria.lista.length == 0)">Nenhum arquivo encontrado</p>
            </div>
            <p v-if="(!documentos || documentos.length == 0)">Nenhum arquivo encontrado</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";
button:focus {
  outline: 0;
}
input:focus {
  outline: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
  transition: all 150ms ease-in 0s;
}

.sidebar-backdrop {
  background-color: rgba(0, 0, 0, 0);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  cursor: pointer;
  z-index: 100;
}

.sidebar-panel {
  overflow-y: auto;
  background-color: var(--quali-brand);
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  z-index: 999;
  padding: 1rem 10px 2rem 16px;
  width: 400px;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  color: white;
  overflow-x: hidden;
  overflow-y: hidden;

  .burger-button {
    color: white;
    position: absolute;
    height: 30px;
    left: 10px;
    top: 15px;
    display: block;
    z-index: 1000;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    pointer-events: all;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .title {
    text-align: center;
  }

  .btn-agrupador {
    right: 20px;
    position: absolute;
    top: 85px;
    font-size: 12px;
    cursor: pointer;
  }
  .search-input {
    .form-group {
      display: flex;
      span {
        align-self: center;
        font-size: 12px;
        position: absolute;
        right: 19px;
        padding-left: 5px;
        padding-right: 12px;
        background-color: var(--quali-brand);

        border-radius: 0 20px 20px 0;
      }
    }
    .form-control {
      background-color: transparent;
      border-radius: 20px;
      border-color: var(--quali-dark-blue);
      color: white;
      &:focus {
        box-shadow: none;
      }
    }
  }

  .documentos {
    overflow-y: auto;
    .box-files {
      border-bottom: 1px solid #ffffff30;
      margin-bottom: 10px;
    }
    .list {
      .item {
        margin-bottom: 15px;

        .title-item {
          align-items: baseline;
          display: flex;
          margin-bottom: 5px;
          .fi {
            font-size: 10px;
          }

          .name {
            margin-left: 5px;
          }
        }

        .sub-list {
          .file {
            color: var(--quali-light-blue);
          }
          .sub-item {
            align-items: baseline;
            display: flex;

            padding-left: 10px;
            margin-bottom: 7px;
            .fi {
              font-size: 10px;
            }

            .name {
              margin-left: 5px;
            }
          }

          .sub-list-file {
            .name {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }

  ::-webkit-scrollbar {
    width: 13px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #ffffffe3;
    border-radius: 20px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #18629ae3;
    border-radius: 20px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #296ea2e3;
  }
}

@include media-breakpoint-down(sm) {
  .sidebar-panel {
    width: 100%;
  }
}
</style>
<script>
import Mixin from "@/modules/PainelCliente/Mixins/painelClienteMixin.js";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import contratacaoService from "@/services/api-contratacao";
import documentoService from "@/services/api-documento";
import LoaderShimmer from "@/modules/Global/Components/LoaderShimmer.vue";
export default {
  name: "MenuDocumento",
  mixins: [Mixin, CacheMixin],
  components: {
    LoaderShimmer
  },
  props: {
    isPanelOpen: Boolean,
    cpf: String
  },
  data() {
    return {
      textSearch: "",
      documentos: [],
      documentosTemp: [],
      innerHeight: 0
    };
  },
  computed: {},
  async created() {
    try {
      this.innerHeight = window.innerHeight - 200;
      this.documentos = [];
      let response = await documentoService.getAllDocumentoPainel({
        cpf: this.cpf
      });

      let documentos = response && response.data ? response.data : [];
      await this.loadLists(documentos);
    } catch (error) {
      this.documentos = [];
      this.$forceUpdate();
    }
  },
  methods: {
    closeSidebarPanel() {
      this.$emit("closeMenu");
    },
    filterList(value) {
      if (!value || value.length == 0) return this.clearFilter();
      if (value && value.length < 4) return;
      this.documentosTemp = JSON.parse(JSON.stringify(this.documentos));
      let filtrados = [];
      this.documentos.forEach(doc => {
        doc.lista.forEach(doc1 => {
          doc1.docs.forEach(doc2 => {
            if (doc2.tipo.toLowerCase().indexOf(value.toLowerCase()) >= 0)
              filtrados.push(doc);
          });
        });
      });

      this.documentos = filtrados;
      this.$forceUpdate();
    },
    async download(file) {
      try {
        let response = await documentoService.getDocumentoProposta({
          nrProposta: file.nrProposta,
          identificador: file.identificador,
          tipoDocumento: file.tipoDocumento
        });
        let url = response && response.data ? response.data : [];
        if (!url) return this.alertErrorGeneric("Erro ao baixar arquivo");
        window.open(url);
      } catch (error) {
        this.alertErrorGeneric("Erro ao baixar arquivo");
      }
    },
    clearFilter() {
      this.textSearch = "";
      this.documentos = JSON.parse(JSON.stringify(this.documentosTemp));
      this.documentosTemp = [];
      this.$forceUpdate();
    },
    async loadLists(documentos) {
      await this.loadListTitular(documentos.titular);
      await this.loadListDependentes(documentos.dependentes);
      await this.loadListResponsavel(documentos.responsavel);
      await this.loadListOutros(documentos.outros);
      console.log(this.documentos);
    },
    viewDetails(ic, ip, id) {
      this.documentos[ic].lista[ip].docs[id].details = !this.documentos[ic]
        .lista[ip].docs[id].details;
      this.$forceUpdate();
    },

    async atualizar() {
      try {
        this.documentos = [];
        let response = await documentoService.getAllDocumentoPainel({
          cpf: this.cpf
        });

        let documentos = response && response.data ? response.data : [];
        await this.loadLists(documentos);
      } catch (error) {
        this.documentos = [];
        this.$forceUpdate();
      }
    },
    async loadListTitular(lista) {
      let listaAgrupada = await this.agrupaPorCategoria(lista);
      let data = [
        {
          title: "Titular",
          lista: listaAgrupada
        }
      ];
      this.documentos = this.documentos.concat(data);
    },
    async loadListDependentes(lista) {
      let listaAgrupada = await this.agrupaPorCategoria(lista);
      let data = [
        {
          title: "Dependentes",
          lista: listaAgrupada
        }
      ];
      this.documentos = this.documentos.concat(data);
    },
    async loadListResponsavel(lista) {
      let listaAgrupada = await this.agrupaPorCategoria(lista);
      let data = [
        {
          title: "Responsável Legal",
          lista: listaAgrupada
        }
      ];
      this.documentos = this.documentos.concat(data);
    },
    async loadListOutros(lista) {
      let listaAgrupada = await this.agrupaPorCategoria(lista);
      let data = [
        {
          title: "Outros",
          lista: listaAgrupada
        }
      ];
      this.documentos = this.documentos.concat(data);
    },
    async agrupaPorCategoria(lista) {
      let grupo = [];
      for (let index = 0; index < lista.length; index++) {
        const doc = lista[index];
        let idxExist = grupo.findIndex(f => {
          return f.nrProposta == doc.nrProposta;
        });
        if (idxExist >= 0) {
          grupo[idxExist].docs.push(doc);
        } else {
          grupo = [
            {
              nrProposta: doc.nrProposta,
              docs: [doc]
            }
          ];
        }
      }
      grupo.forEach(item => {
        item.docs = this.agrupaDocumentos(item.docs);
      });
      return grupo;
    },
    agrupaDocumentos(docs) {
      let grupo = [];
      for (let index = 0; index < docs.length; index++) {
        const doc = docs[index];
        let idxExist = grupo.findIndex(f => {
          return (
            f.tipo ==
            doc.tipoDocumento
              .replace(/([A-Z])/g, " $1")
              .trim()
              .replace(/([0-9])/g, " $1")
              .trim()
          );
        });
        if (idxExist >= 0) {
          grupo[idxExist].lista.push(doc);
        } else {
          grupo = [
            {
              tipo: doc.tipoDocumento
                .replace(/([A-Z])/g, " $1")
                .trim()
                .replace(/([0-9])/g, " $1")
                .trim(),
              lista: [doc]
            }
          ];
        }
      }
      return grupo;
    }
  }
};
</script>