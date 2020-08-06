<template>
  <div class="app-wrapper">
    <Header visibleBack hasStage @changeStage="back" />
    <div class="row justify-content-center">
      <div class="col-12 col-sm-12 col-md-12 col-lg-6">
        <div class="img">
          <img
            v-bind:src="proposta.plano.operadoraLogo"
            class="card-img-top"
            v-bind:alt="proposta.plano.operadora"
          />
        </div>
        <div class="detail-body">
          <div class="row col-12 col-sm-12 col-md-12 col-lg-12">
            <div class="col-12 col-sm-12 col-md-12 col-lg-6">
              <h2 class="nomePlano">{{proposta.plano.plano}}</h2>
              <h3 class="nrProposta">Proposta Nº {{proposta.nrProposta}}</h3>
              <div class="historico">
                <div class="line">
                  <ul class="box-icon">
                    <li
                      v-for="(item, index) in proposta.detalheStatus.historico"
                      :key="index"
                      :class="{'only': proposta.detalheStatus.historico.length == 1, 'last':proposta.detalheStatus.historico.length == (index + 1), 'first': index== 0 }"
                    >
                      <div
                        class="icon"
                        :class="{'active':proposta.detalheStatus.historico.length == (index + 1)}"
                      >
                        <div class="fi" :class="getIcon(item.status)"></div>
                      </div>
                    </li>
                  </ul>
                  <ul class="box-text">
                    <li v-for="(item, index) in proposta.detalheStatus.historico" :key="index">
                      <div
                        class="texto badge"
                        :class="{'active':proposta.detalheStatus.historico.length == (index + 1)}"
                      >{{item.titulo}}</div>
                      <div
                        class="descricao"
                        v-if="proposta.detalheStatus.historico.length == (index + 1) && (!statusActive && item.status != '6')"
                        v-html="item.descricao"
                      ></div>

                      <!-- Justificativa -->
                      <div
                        class="descricao"
                        v-if="proposta.detalheStatus.historico.length == (index + 1) && !statusActive && item.status == '6'"
                      >
                        <b>Justificativa:</b>
                        {{proposta.justificativa}}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-12 col-md-12 col-lg-6">
              <div v-if="statusActive" class="statusActive">
                <div class="descricao" v-html="statusActive.descricao"></div>

                <div class="infos">
                  <div v-for="(info, indexInfo) in statusActive.infos" :key="indexInfo">
                    <h4 class="titulo" v-html="info.titulo"></h4>
                    <p v-html="info.descricao"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="proposta.statusProposta == 2 || proposta.statusProposta == 4"
            class="col-11 col-sm-11 col-md-11 col-lg-11"
          >
            <br />
            <button class="btn btn-primary btn-block" type="button" @click="preencherPendencia()">Resolver Pendência</button>
          </div>

          <div v-if="proposta.statusProposta == 1" class="col-11 col-sm-11 col-md-11 col-lg-11">
            <br />
            <button
              class="btn btn-primary btn-block"
              type="button"
              @click="continuarPreenchimento()"
            >Continuar Preenchimento</button>
          </div>

          <div class="row justify-content-center">
            <div class="col-11 col-sm-11 col-md-6 col-lg-8">
              <br />
              <Card :parentData="proposta.plano" visibleDetailPainel />
            </div>
          </div>
          <div class="col-12 col-sm-12 col-md-12 col-lg-12">
            <button
              class="btn btn-block text-link btn-cancel"
              type="button"
              v-on:click="cancelarProposta()"
            >CANCELAR PROPOSTA</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";
.app-wrapper {
  width: 100%;

  .img {
    width: 100%;
    text-align: center;
    img {
      width: 210px;
      @include media-breakpoint-up(sm) {
        width: 210px;
      }
      @include media-breakpoint-up(md) {
        width: 230px;
      }
      @include media-breakpoint-up(lg) {
        width: 250px;
      }
    }
  }

  .detail-body {
    text-align: left;
    padding: 0 30px 0 30px;

    .nrProposta {
      color: var(--quali-dark-gray);
    }

    .historico {
      margin-top: 25px;
      .line {
        display: flex;
        ul {
          display: table;
          list-style-type: none;
          padding-left: 0;
          li {
            height: 3em;
            &.only {
              height: 0;
            }
          }
          &.box-icon {
            li {
              background-color: var(--quali-gray-blue);
            }
            li.first {
              border-radius: 10px 10px 0 0;
            }
            li.last {
              border-radius: 0 0 10px 10px;
              height: 24px;
            }
            .icon {
              height: 25px;
              width: 25px;
              background-color: #dde4e6;
              border-radius: 50%;
              .fi {
                font-size: 11px;
                padding-left: 7px;
                padding-top: 4px;
                color: var(--quali-dark-blue);
              }

              &.active {
                background-color: var(--quali-brand);
                .fi {
                  color: white;
                }
              }
            }
          }
          &.box-text {
            padding-left: 2px;
            .texto {
              font-size: 14px;
              color: var(--quali-medium-gray);
              &.active {
                color: var(--dark);
                font-size: 16px;
              }
            }
            .descricao {
              padding-left: 7px;
            }
          }
        }
      }
    }

    .statusActive {
      .descricao {
      }

      .infos {
        .titulo {
          margin-top: 5px;
        }
      }
    }

    .btn-cancel {
      color: var(--danger);
    }
  }
}
</style>

<script>
import Mixin from "@/modules/PainelCliente/Mixins/painelClienteMixin.js";
import Header from "@/modules/Global/Components/Header.vue";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import Card from "@/modules/Global/Components/Card.vue";
import contratacaoService from "@/services/api-contratacao";
import { isArray } from "util";
export default {
  name: "DetalheProposta",
  mixins: [Mixin, CacheMixin],
  components: { Header, Card },
  data() {
    return {
      proposta: {},
      statusActive: {}
    };
  },
  computed: {},
  created() {
    this.proposta = this.$route.params.proposta;
    if (!this.proposta) {
      return this.$router.push({
        name: "PainelCliente"
      });
    }
    let arr = JSON.parse(JSON.stringify(this.proposta.detalheStatus.historico));
    if (!isArray(arr) || arr.length <= 0) return;
    let lastItem = arr.pop();
    this.statusActive = lastItem.status == 5 || lastItem.status == 4 ? lastItem : null;
  },
  methods: {
    back() {
      const hasPropostas = this.getCache("propostas");
      if (isArray(hasPropostas)) {
        this.$router.push({
          name: "PainelCliente",
          params: { propostas: hasPropostas }
        });
      } else {
        this.$router.push({
          name: "PainelCliente",
          params: { propostas: null }
        });
      }
    },
    async cancelarProposta() {
      this.$swal({
        title: "<strong>Atenção</strong>",
        type: "warning",
        html:
          "Após ser cancelada, esta proposta não poderá mais ser reativada. Tem certeza que deseja cancelar esta proposta?",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        allowOutsideClick: false
      }).then(r => {
        if (r.value) {
          this.$swal({
            title: "Justificativa",
            input: "text",
            inputAttributes: {
              autocapitalize: "off"
            },
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Confirmar",
            showLoaderOnConfirm: true,
            preConfirm: async justificativa => {
              try {
                let response = await contratacaoService.cancel(
                  this.proposta.nrProposta,
                  justificativa
                );
                return response;
              } catch (error) {
                this.$swal.showValidationMessage(
                  `Informe a justificativa do cancelamento`
                );
              }
            },
            allowOutsideClick: () => !this.$swal.isLoading()
          }).then(s => {
            if (s.value) {
              this.$swal(
                "Cancelada!",
                "Sua proposta foi cancelada com sucesso.",
                "success"
              ).then(c => {
                this.clearCache("propostas");
                this.$router.push({
                  name: "PainelCliente",
                  params: { propostas: null }
                });
              });
            }
          });
        }
      });
    },
    continuarPreenchimento() {
      this.$router.push(`/contratacao/${this.proposta.nrProposta}/cadastro`);
    },
    preencherPendencia() {
      this.$router.push(`/${this.proposta.nrProposta}/pendencia`);
    }
  }
};
</script>