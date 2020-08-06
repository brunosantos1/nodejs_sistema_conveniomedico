<template>
  <div class>
    <div class="row justify-content-center">
      <div class="col-12 col-sm-12 col-md-12 col-lg-6">
        <h1 class="mb-3">Dependentes</h1>
        <p>Gerencie seus dependentes por aqui. Lembre-se que alterações podem refletir no preço final.</p>

        <div class="price-table">
          <div class="marked-line" v-for="(item, index) in dependentes" :key="index">
            <div class="left" @click="detailDep(index)">
              <span class="price-title">
                <span
                  v-if="dependentes[index] && !dependentes[index].fields.find(r => { return r.name == 'nome' && r.value})"
                >Dependente {{index + 1}}</span>

                <span
                  v-if="dependentes[index] && dependentes[index].fields.find(r => { return r.name == 'nome' && r.value})"
                >{{dependentes[index].fields.find(r => { return r.name == 'nome' && r.value}).value}}</span>

                <span class="fi-check check" v-if="validates[index]"></span>
              </span>
              <span class="price-desc">Clique para preencher os dados</span>
            </div>
            <div class="right" @click="delDep(index)">
              <span class="price-link">Remover</span>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <button
            type="button"
            class="btn btn-block btn-link text-link"
            @click="addDep()"
            v-if="this.dependentes.length <= 7"
          >Adicionar dependente</button>
        </div>
      </div>
    </div>
    <transition name="fade" mode="in-out">
      <DetalheDependente
        :stageActive="stageActive"
        :dependenteIndex="detailIndex"
        @validate="validateDep"
        @close="closeDetail"
        v-if="detailIndex >= 0"
      />
    </transition>

    <div class="row justify-content-center">
      <div class="col-12 col-sm-12 col-md-12 col-lg-6">
        <button
          class="btn btn-primary btn-block"
          type="button"
          @click="nextTemplate()"
          :disabled="disableBtn"
        >{{loading ? 'Salvando...' : 'Continuar'}}</button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.justify-content-center {
  margin-bottom: 70px;
}
.price-table {
  // max-width: 610px;
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

.marked-line {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
}

.marked-line:nth-child(odd) {
  background-color: var(--quali-gray-blue);
  width: 100%;
  // padding: 20px;
  font-size: 14px;
  font-weight: 500;
}
.marked-line:nth-child(even) {
  background-color: white;
  width: 100%;
  // padding: 20px;
  font-size: 14px;
  font-weight: 500;
}

.marked-line .left {
  // float: left;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // width: 60%;
  padding: 20px;
  flex: 1;
}
.marked-line .right {
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  // float: right;
  color: var(--quali-dark-blue);
  cursor: pointer;
  //  padding: 20px;
  padding-right: 20px;
   padding-left: 0;
}
.btn-primary.disabled,
.btn-primary:disabled {
  color: #fff;
  background-color: #0c5098;
  border-color: #80b4ea;
}
.btn-next {
  position: fixed;
  bottom: 40px;
  left: 5%;
}

.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  overflow: hidden;
  transition: opacity 0.5s;
}
.fade-enter {
  // transform: translateX(10px);
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>

<script>
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import ContratacaoMixin from "@/modules/Contratacao/Mixins/contratacaoMixin.js";
import dataModel from "@/modules/Contratacao/model.json";
import { mapMutations, mapGetters, mapActions } from "vuex";
import DetalheDependente from "@/modules/Contratacao/Components/Dependente/Detalhe.vue";

export default {
  name: "ListaDependente",
  mixins: [CacheMixin, ContratacaoMixin],
  components: { DetalheDependente },
  props: {
    stageActive: Object
  },
  data() {
    return {
      detailIndex: -1,
      validates: {},
      disableBtn: true
    };
  },
  computed: {
    ...mapGetters({
      formStage: "Contratacao/getFormStage",
      dependentes: "Contratacao/getDependentes",
      stages: "Contratacao/getStages"
    })
  },
  created() {
    const dadosColeta = this.$store.state["Contratacao"].coletaDados;
    let dependentes = [];
    if (!dadosColeta || !dadosColeta.dependentes) {
      this.$store.commit(
        "Contratacao/updateStageForm",
        this.formStage && this.formStage.current
          ? this.formStage.current - 1
          : 1
      );
      return;
    }
    dadosColeta.dependentes.sort((a, b) => {
      return a.id - b.id;
    });
    dependentes = dadosColeta.dependentes ? dadosColeta.dependentes : [];
    this.createVm(dependentes);
    this.detectDisableBtn();
  },
  methods: {
    createVm(dependentes) {
      if (this.stageActive && this.stageActive.formularios) {
        for (let index = 0; index < dependentes.length; index++) {
          const dep = dependentes[index];
          this.stageActive.formularios.forEach(s => {
            const newModel = JSON.parse(JSON.stringify(dataModel[s.model]));
            let fields = newModel;
            fields = this.mergeFieldDate(
              fields,
              dep.nascimento,
              "nascimento"
            );
            fields = this.mergeFields(fields, dep);
            this.$store.dispatch("Contratacao/createStoreFieldsDependente", {
              index: index,
              model: fields,
              id: dep.id,
              value: dep.value
            });
          });
        }
        this.$forceUpdate();
      }
    },
    mergeFieldDate(model, value, name) {
      for (let index = 0; index < model.length; index++) {
        const el = model[index];
        if (el.name == name) {
          model[index].value = value
            .split("/")
            .reverse()
            .join("-");
        }
      }
      return model;
    },
    mergeFields(fields, dep) {
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        if (dep[field.name]) {
          field.value = dep[field.name];
          if (field.name === "possuiPlano") {
            field.operadoraCongenere = dep["operadoraCongenere"];
            field.aceiteNaoReducaoCarencia = dep["aceiteNaoReducaoCarencia"];
          }
        }
      }
      return fields;
    },
    addDep() {
      const dadosColeta = this.$store.state["Contratacao"].coletaDados;
      if (
        dadosColeta &&
        dadosColeta.dependentes &&
        dadosColeta.dependentes.length + 1 == this.dependentes.length + 1
      ) {
        this.alertAlteraDependente().then(result => {
          if (result.value) {
            this._add();
          }
        });
      } else this._add();
    },
    _add() {
      let count = this.obterIdentificador();
      ++count;
      this.resetFields(dataModel["dadosDependente"]);
      this.$store.commit("Contratacao/addDependentes", {
        index: this.dependentes.length,
        model: dataModel["dadosDependente"],
        id: count,
        value: ""
      });
      this.detectDisableBtn();
      this.$forceUpdate();
    },
    delDep(index) {
      const dadosColeta = this.$store.state["Contratacao"].coletaDados;
      if (
        dadosColeta &&
        dadosColeta.dependentes &&
        dadosColeta.dependentes.length - 1 == this.dependentes.length - 1
      ) {
        this.alertAlteraDependente().then(result => {
          if (result.value) {
            this._del(index);
          }
        });
      } else this._del(index);
    },
    _del(index) {
      let deps = this.dependentes;
      deps.splice(index, 1);
      this.$store.commit("Contratacao/updateDependentes", deps);

      if (this.validates[index]) {
        delete this.validates[index];
        this.$store.commit("Contratacao/removeDataFieldTemplate", {
          index: index,
          template: this.stageActive.template
        });
      }
      this.detectDisableBtn();
      this.$forceUpdate();
    },
    detailDep(index) {
      this.$nextTick(() => {
        console.log(index)
        this.detailIndex = index;
      });
    },
    closeDetail() {
      this.detailIndex = -1;
    },
    validateDep(isValid) {
      if (isValid) this.validates[this.detailIndex] = true;
      else this.validates[this.detailIndex] = false;
      this.$nextTick(() => {
        this.detailIndex = -1;
        this.detectDisableBtn();
      });
    },
    resetFields(model) {
      model.forEach(m => {
        m.value = "";
      });
      return model;
    },
    detectDisableBtn() {
      let countIsValid = 0;
      let countValidates = 0;
      let countDependentes = this.dependentes.length;
      for (let el in this.validates) {
        if (this.validates[el]) countIsValid++;
        countValidates++;
      }
      if (countValidates == countDependentes && countIsValid == countValidates)
        this.disableBtn = false;
      else this.disableBtn = true;
    },
    obterIdentificador() {
      let atualId = 0;
      try {
        if (this.dependentes) {
          this.dependentes.forEach((item, index) => {
            if (item.hasOwnProperty("id")) {
              if (parseInt(item.id) > atualId)
                atualId = parseInt(item.id)
            }
          })
        }
      } catch (e) {
        console.log(`Error obter identificador -->`, e);
      }
      return atualId;
    }
  }
};
</script>