<template>
  <div class="filtro-wrapper">
    <div class="filtro-scroll">
      <section class="filtro--header">
      <button type="button" @click="$emit('toggleFilter')" class="btn btn-ico">
        <Icon class="filtro-icon" icon="x" />
      </button>
      <h2 class="filtro-title">Filtro</h2>
    </section>
    <div class="filtro--section">
      <Range
        class="filtro--range"
        name="filtroPreco"
        id="filtroPreco"
        @input="obterValores"
        :filteredValue="filtro.valor"
      />
    </div>
    <div class="filtro--section">
      <h4>Onde quero ser tratado:</h4>
      <div class="btn-options">
        <button
          v-for="(abrangencia,indexAbrangencia) in listaAbrangencia"
          class="btn btn-filtro"
          :class="{active: filtroActive['abrangencia'] && filtroActive['abrangencia'][indexAbrangencia] }"
          type="button"
          :key="indexAbrangencia"
          @click="aplicarFiltro('abrangencia', abrangencia, indexAbrangencia)"
        >{{abrangencia}}</button>
      </div>
    </div>

    <div class="filtro--section">
      <h4>Coparticipação:</h4>
      <div class="btn-options">
        <button
          type="button"
          class="btn btn-filtro"
          :class="{active: filtroActive['coparticipacao'] && filtroActive['coparticipacao'][0]}"
          @click="aplicarFiltro('coparticipacao', true, 0)"
        >Sim</button>
        <button
          type="button"
          class="btn btn-filtro"
          :class="{active: filtroActive['coparticipacao'] && filtroActive['coparticipacao'][1]}"
          @click="aplicarFiltro('coparticipacao', false, 1)"
        >Não</button>
      </div>
    </div>

    <div class="filtro--section">
      <h4>Reembolso:</h4>
      <div class="btn-options">
        <button
          type="button"
          class="btn btn-filtro"
          :class="{active: filtroActive['reembolso'] && filtroActive['reembolso'][0]}"
          @click="aplicarFiltro('reembolso', true, 0)"
        >Sim</button>
        <button
          type="button"
          class="btn btn-filtro"
          :class="{active: filtroActive['reembolso'] && filtroActive['reembolso'][1]}"
          @click="aplicarFiltro('reembolso', false, 1)"
        >Não</button>
      </div>
    </div>

    <div class="filtro--section">
      <h4>Acomodação:</h4>
      <div class="btn-options">
        <button
          v-for="(tipo_acomodacao,indexAcomodacao) in listaAcomodacao"
          class="btn btn-filtro"
          :class="{active: filtroActive['tipo_acomodacao'] && filtroActive['tipo_acomodacao'][indexAcomodacao] }"
          type="button"
          :key="indexAcomodacao"
          @click="aplicarFiltro('tipo_acomodacao', tipo_acomodacao, indexAcomodacao)"
        >{{tipo_acomodacao}}</button>
      </div>
    </div>

    <div class="filtro--section">
      <h4>Operadora:</h4>
      <div class="btn-options">
        <button
          v-for="(operadora,indexOperadora) in listaOperadora"
          class="btn btn-filtro"
          :class="{active: filtroActive['operadora'] && filtroActive['operadora'][indexOperadora] }"
          type="button"
          :key="indexOperadora"
          @click="aplicarFiltro('operadora', operadora, indexOperadora)"
        >{{operadora}}</button>
      </div>
    </div>

    <div v-for="(prestadores,index) in listaPrestadores" :key="index">
      <div class="filtro--section" v-if="prestadores.prestadores.length > 0">
        <h4>Preferencias por {{prestadores.tipo}}:</h4>
        <v-select
          :options="prestadores.prestadores"
          :id="prestadores.tipo"
          :name="prestadores.tipo"
          class="form-control"
          v-model="filtroActiveSelect[prestadores.tipo]"
          @input="aplicarFiltro(prestadores.tipo, $event, null)"
        >
          <div slot="no-options">Nenhum resultado encontrado</div>
        </v-select>
      </div>
    </div>

   
    </div>
     <div class="filtro--footer">
      <div>
        <b>Total {{totalPlanos}} planos</b>
      </div>
      <div class="filtro--footer__btn">
        <button type="button" class="btn btn-outline-secondary" @click="limpar()">Limpar</button>
        <button type="button" class="btn btn-outline-primary" @click="aplicar()">Aplicar</button>
      </div>
    </div>
  </div>
</template>

<script>
import Range from "@/modules/ColetaInicial/Components/FormFields/Range";
import Icon from "@/modules/Global/Components/Icon";
import { mapMutations, mapGetters, mapState } from "vuex";

export default {
  name: "Filtro",
  components: { Range, Icon },
  data() {
    return {
      filtroActive: { data: {} },
      filtroActiveSelect: {},
      filtro: {},
      listaPrestadores: [],
      listaAbrangencia: [],
      listaAcomodacao: [],
      listaOperadora: [],
      tiposPrestador: [],
      totalPlanos: 0,
      isActive: false
    };
  },
  props: {
    parentData: Object,
    prevRoute: Object
  },
  created() {
    const vuexFiltro = this.$store.state["Planos"].filtro;
    if (
      Object.entries(vuexFiltro).length > 0 &&
      vuexFiltro.constructor === Object
    ) {
      this.filtroActive = this.$store.state["Planos"].filtro;
    }
    var planos = this.parentData.planos;
    this.filtro.valor = this.$store.state["ColetaDados"].formData.valor;
    this.listaAbrangencia = this.listarAbrangencias(planos);
    this.listaAcomodacao = this.listarAcomodacoes(planos);
    this.listaOperadora = this.listarOperadoras(planos);
    this.tiposPrestador = this.listarTiposPrestador(planos);
    this.listaPrestadores = this.listarPrestadores(planos);
    this.totalPlanos = this.parentData.total;
    this.filtrarPlanos();
  },
  mounted() {
    let keys = "";

    if (
      Object.entries(this.filtroActive).length === 0 &&
      this.filtroActive.constructor === Object
    ) {
      keys = Object.keys(this.filtroActive);
    } else {
      if (this.filtro) {
        keys = Object.keys(this.filtro);
      }
    }

    if (keys) {
      for (let key of keys) {
        if (key != "valor") {
          for (let index of key) {
            if (index) {
              this.ativaDesativa(key, index);
            }
          }
        }
      }

      if (Object.getOwnPropertyNames(this.filtroActive.data).length > 1) {
        const filtroActive = JSON.parse(JSON.stringify(this.filtroActive));
        if (!filtroActive.data.valor) {
          filtroActive.data.valor = this.filtro.valor;
        }
        this.filtro = filtroActive.data;
        this.filtrarPlanos();
      }
    }
  },
  computed: {
    ...mapGetters({
      getFiltro: "Planos/getPlanoFilter"
    })
  },
  methods: {
    ...mapMutations({
      updatePlanoFilter: "Planos/updatePlanoFilter",
      clearPlanoFilter: "Planos/clearPlanoFilter"
    }),
    aplicarFiltro(propriedade, valor, index) {
      if (!this.filtro[propriedade]) {
        this.filtro[propriedade] = [valor];
        if (index == null) this.filtroActiveSelect[propriedade] = valor;
      } else {
        if (this.filtro[propriedade].includes(valor)) {
          this.filtro[propriedade].splice(
            this.filtro[propriedade].indexOf(valor),
            1
          );
        } else {
          if (["reembolso", "coparticipacao"].includes(propriedade)) {
            this.filtro[propriedade] = [];
          }
          if (index != null) this.filtro[propriedade].push(valor);
          else {
            this.filtro[propriedade] = valor ? [valor] : [];
            this.filtroActiveSelect[propriedade] = valor ? valor : null;
          }
        }
      }
      this.filtroActive.data[propriedade] = this.filtro["__ob__"].value[
        propriedade
      ];
      this.updatePlanoFilter({ data: this.filtro });
      this.ativaDesativa(propriedade, index);
      this.filtrarPlanos();
    },
    filtrarPlanos() {
      var propriedades = Object.getOwnPropertyNames(this.filtro);
      propriedades.splice(propriedades.indexOf("__ob__"), 1);
      const filtroObj = {
        keys: propriedades,
        values: this.filtro
      };

      // console.log("filtro", this.filtro);

      var lista_planos = [];
      var retorno = this.parentData.planos;

      //Conjunto de prestadores selecionados
      this.parentData.planos.forEach(plano => {
        propriedades.forEach(propriedade => {
          if (this.tiposPrestador.includes(propriedade)) {
            this.filtro[propriedade].forEach(prestador_selecionado => {
              var prestadores = plano.rede_referencia.filter(prestador => {
                return (
                  prestador.TipoPrestador == propriedade && //Verifica o tipo do prestador
                  prestador_selecionado == prestador.Prestador
                );
                sesData[propriedade] = prestadores;
              });
              if (!lista_planos.includes(plano.id) && !prestadores.length)
                lista_planos.push(plano.id);
            });
          }
        });
      });

      // console.log("Total original:", retorno.length);

      //Filtragem de propriedades do objeto PLANO
      propriedades.forEach(propriedade => {
        if (
          !this.tiposPrestador.includes(propriedade) &&
          propriedade != "valor" &&
          this.filtro[propriedade].length
        ) {
          retorno = retorno.filter(planos => {
            return this.filtro[propriedade].includes(planos[propriedade]);
          });
        }
      });

      // console.log("Total com filtros de PLANO:", retorno.length);

      // Filtragem de propriedades de PREÇO e prestadores de REDE DE REFERÊNCIA
      retorno = retorno.filter(plano => {
        return (
          !lista_planos.includes(plano.id) &&
          this.filtro["valor"][0] <= parseInt(plano.precos.total, 10) &&
          this.filtro["valor"][1] >= parseInt(plano.precos.total, 10)
        );
      });

      // console.log( "Total com filtros de PREÇO e REDE DE REFERÊNCIA:", retorno);

      this.totalPlanos = retorno.length;
      // console.log({ total: this.parentData.total, total_filtrado: retorno.length, planos: retorno});
      this.$emit("filtrarPlanos", {
        total: this.parentData.total,
        total_filtrado: retorno.length,
        planos: retorno
      });
    },
    listarTiposPrestador(planos) {
      var tiposprestador = Object.getOwnPropertyNames(
        planos[0].total_rede_referencia
      );
      tiposprestador.splice(tiposprestador.indexOf("Total"), 1);
      tiposprestador.splice(tiposprestador.indexOf("__ob__"), 1);
      return tiposprestador;
    },
    listarPrestadores(planos) {
      const listaPrestadores = [];
      this.tiposPrestador.forEach(tipo => {
        var prestadores_plano = [];
        planos.forEach(plano => {
          plano.rede_referencia.forEach(prestador => {
            if (
              tipo == prestador.TipoPrestador &&
              !prestadores_plano.includes(prestador.Prestador)
            )
              prestadores_plano.push(prestador.Prestador);
          });
        });
        listaPrestadores.push({ tipo: tipo, prestadores: prestadores_plano });
      });
      return listaPrestadores;
    },
    listarAbrangencias(planos) {
      const abrangencias = [];
      planos.forEach(plano => {
        if (!abrangencias.includes(plano.abrangencia))
          abrangencias.push(plano.abrangencia);
      });
      return abrangencias;
    },
    listarAcomodacoes(planos) {
      const acomodacoes = [];
      planos.forEach(plano => {
        if (!acomodacoes.includes(plano.tipo_acomodacao))
          acomodacoes.push(plano.tipo_acomodacao);
      });
      return acomodacoes;
    },
    listarOperadoras(planos) {
      const operadoras = [];
      planos.forEach(plano => {
        if (!operadoras.includes(plano.operadora))
          operadoras.push(plano.operadora);
      });
      return operadoras;
    },
    limpar() {
      this.filtro = {};
      this.filtro.valor = this.$store.state["ColetaDados"].formData.valor;
      (this.filtroActive = { data: {} }), this.clearPlanoFilter();

      for (let el in this.filtroActiveSelect) {
        this.filtroActiveSelect[el] = null;
      }
      this.filtrarPlanos();
    },
    aplicar() {
      this.$emit("toggleFilter");
    },
    obterValores(valor) {
      this.updatePlanoFilter({ valor });
      this.filtro.valor = valor;
      this.filtroActive.data.valor = valor;
      this.filtrarPlanos();
    },
    ativaDesativa(propriedade, index) {
      if (this.filtroActive[propriedade]) {
        if (this.filtroActive[propriedade][index]) {
          this.filtroActive[propriedade][index] = this.filtroActive[
            propriedade
          ][index];
        } else {
          this.filtroActive[propriedade] = {
            ...this.filtroActive[propriedade],
            [index]: false
          };
        }
      } else {
        this.filtroActive = {
          ...this.filtroActive,
          [propriedade]: {
            [index]: false
          }
        };
      }

      if (propriedade == "coparticipacao") {
        if (index) this.filtroActive[propriedade][0] = false;
        else this.filtroActive[propriedade][1] = false;
      }

      if (propriedade == "reembolso") {
        if (index) this.filtroActive[propriedade][0] = false;
        else this.filtroActive[propriedade][1] = false;
      }

      this.filtroActive[propriedade][index] = !this.filtroActive[propriedade][
        index
      ];

      const response = JSON.parse(JSON.stringify(this.filtroActive));
      this.updatePlanoFilter(response);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";

.filtro-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  width: 100%;
  background-color: #fff;
  box-shadow: -3px 0 5px rgba(216, 216, 216, 0.25);
  transition: transform 0.25s ease-in-out;
  transform: translateY(0) translateX(100%);

  @include media-breakpoint-up(lg) {
    right: 0;
    max-width: 420px;
    width: 30vw;
  }

  .filtro-scroll {
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
    padding: 1em;
    overflow: scroll;
    height: 100%;
    padding-bottom: 70px;
    &::-webkit-scrollbar {
    width: 0 !important;
  }
    @include media-breakpoint-up(lg) {
      padding: 1em 1em 5em;
    }
  }
}

.filtro--header {
  display: flex;
  align-items: center;
  width: 100%;
}

.filtro-title {
  flex-basis: 60%;
  margin-bottom: 0;
  margin-left: em(10px, 24px);

  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.filtro-icon {
  margin: 0;
}

.filtro--range {
  margin: 0 auto;
  width: 80%;
}

.filtro--section {
  padding: 2em 0;

  border-bottom: solid 2px var(--quali-light-x-gray);
}

.filtro--footer {
    bottom: 0;
    position: absolute;
    padding: 1em 5.5em 1em 1em;
    width: 100%;
    z-index: 21;
    background-color: #fff;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    width: 100%;
}

.filtro--footer__btn {
  @include media-breakpoint-up(lg) {
    .btn-outline-primary {
      display: none;
    }
  }
}

.btn {
  margin: em(5px, 14px);
}

.btn-filtro {
  border: solid 1px var(--quali-light-gray);
  color: var(--quali-gray);
  font-size: 14px;

  &__active,
  &.active {
    background-color: #dbefff;
    border-color: #dbefff;
    color: var(--quali-dark-blue);
  }

  @include media-breakpoint-up(md) {
    &:hover {
      background-color: #dbefff;
      border-color: #dbefff;
      color: var(--quali-dark-blue);
    }
  }
}
</style>
