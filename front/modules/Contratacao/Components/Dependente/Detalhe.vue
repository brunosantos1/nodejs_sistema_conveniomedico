<template>
  <div class="detail">
    <Header isFixed />
    <div class="btn-close" @click="close">
      <span class="fi-x"></span>
    </div>
    <ValidationObserver v-slot="{ invalid }" ref="myFormDep" tag="form">
      <form class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-12 col-md-12 col-lg-6">
            <h1>Dependente</h1>
            <br />
            <div class="price-table">
              <div class="marked-line">
                <div class="left">
                  <span class="price-title">Dependente {{dependenteIndex + 1}}</span>
                  <span class="price-desc">Preencha os dados abaixo.</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div
                class="col-12 col-sm-12 col-md-12 col-lg-12"
                v-for="(field, indexField) in dependentes[dependenteIndex].fields"
                :key="indexField"
              >
                <ValidationObserver
                  v-slot="{ pristine }"
                  v-if="!field.hidde && field.type != 'select' && field.type != 'boolean'"
                >
                  <ValidationProvider
                    :name="field.label"
                    :rules="field.validation"
                    v-slot="{ errors }"
                  >
                    <div class="form-group">
                      <label :for="field.label">
                        {{field.label}}
                        <span
                          class="badge-info"
                          :id="field.name + '-info'"
                          v-if="field.info"
                        >
                          <b>i</b>
                        </span>
                        <b-tooltip :target="field.name + '-info'">{{field.info}}</b-tooltip>
                      </label>
                      <!-- Quando input não tiver máscara -->
                      <input
                        v-if="!field.mask"
                        :type="field.type"
                        :readonly="field.isReadonly"
                        class="form-control"
                        v-bind:class="{'is-valid': !errors[0] && !pristine && field.validation, 'is-invalid': errors[0]}"
                        :id="field.name"
                        :name="field.name"
                        v-model="dependentes[dependenteIndex].fields[indexField].value"
                      />
                      <!-- Quando input tiver máscara -->
                      <the-mask
                        v-if="field.mask"
                        :mask="field.mask"
                        :readonly="field.isReadonly"
                        class="form-control"
                        v-bind:class="{'is-valid': !errors[0] && !pristine && field.validation, 'is-invalid': errors[0]}"
                        :id="field.name"
                        :name="field.name"
                        v-model="dependentes[dependenteIndex].fields[indexField].value"
                      />
                      <div class="invalid-feedback">{{errors[0]}}</div>
                    </div>
                  </ValidationProvider>
                </ValidationObserver>

                <!-- Quando input for SELECT -->
                <Select
                  v-if="field.type == 'select'"
                  :field="field"
                  :item="{}"
                  :indexField="indexField"
                  @changedSelect="changedSelect"
                />

                <!-- Quando input for BOOLEAN -->
                <Radio
                  v-if="field.type == 'boolean'"
                  :field="field"
                  :item="{}"
                  :indexField="indexField"
                  @changedSelect="changedSelect"
                />

                <!-- Quando possuir plano nos ultimos meses -->
                <OperadoraCongenere
                  :parent="field"
                  :item="{}"
                  :indexField="indexField"
                  @selectOperadora="selectOperadora"
                  v-if="field.name == 'possuiPlano' && dependentes[dependenteIndex].fields[indexField].value"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-12 col-sm-12 col-md-12 col-lg-6">
            <button
              class="btn btn-primary btn-block"
              type="button"
              @click="saveDependente"
            >Confirmar</button>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>
<style scoped lang="scss">
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
  // font-weight: 300;
}
.marked-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.marked-line:nth-child(odd) {
  background-color: var(--quali-gray-blue);
  width: 100%;
  padding: 10px 15px 10px 15px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}
.marked-line .left {
  float: left;
  cursor: pointer;
}
.marked-line .right {
  float: right;
  color: var(--quali-dark-blue);
  cursor: pointer;
}
.detail {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #ffff;
  z-index: 99;
}
.btn-close {
  position: fixed;
  top: 20px;
  right: 20px;
  color: var(--quali-brand);
  cursor: pointer;
  z-index: 100;
}
.container {
  margin-bottom: 10px;
  margin-top: 60px;
}
form {
  margin-bottom: 70px;
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
</style>

<script>
import { TheMask } from "vue-the-mask";
import Header from "@/modules/Global/Components/Header.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import model from "@/modules/Contratacao/model.json";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import ContratacaoMixin from "@/modules/Contratacao/Mixins/contratacaoMixin.js";
import { mapMutations, mapGetters, mapActions } from "vuex";
import Select from "@/modules/Contratacao/Components/Select.vue";
import Radio from "@/modules/Contratacao/Components/Radio.vue";
import OperadoraCongenere from "@/modules/Contratacao/Components/OperadoraCongenere.vue";

export default {
  name: "DetalheDependente",
  mixins: [CacheMixin, ContratacaoMixin],
  components: {
    Header,
    TheMask,
    ValidationObserver,
    ValidationProvider,
    Select,
    Radio,
    OperadoraCongenere
  },
  props: {
    stageActive: Object,
    dependenteIndex: Number
  },
  data() {
    return {
      temp: [],
      deps: []
    };
  },
  computed: {
    ...mapGetters({
      formStage: "Contratacao/getFormStage",
      dependentes: "Contratacao/getDependentes"
    })
  },
  created() {
    this.$store.commit("Contratacao/updateFixedHeader", false);
  },

  methods: {
    async saveDependente() {
      //Valida formulário
      const isValid = await this.$refs.myFormDep.validate();
      if (!isValid) return this.alertWarningGeneric("Preencha os campos corretamente");
      else {
        this.$store.commit("Contratacao/updateDataFieldTemplate", {
          template: this.stageActive.template,
          index: this.dependenteIndex,
          value: JSON.parse(
            JSON.stringify(this.dependentes[this.dependenteIndex])
          )
        });
        this.$emit("validate", true);
      }
    },
    changedSelect(obj) {
      //Método responsável por capturar mudanças nos SELECTS/CHECKBOX
      this.dependentes[this.dependenteIndex].fields[obj.index].value =
        obj.value.code || obj.value;
    },
    selectOperadora(obj) {
      this.dependentes[this.dependenteIndex].fields[
        obj.index
      ].operadoraCongenere = obj.operadoraCongenere;
      this.dependentes[this.dependenteIndex].fields[obj.index].aceiteNaoReducaoCarencia =
        obj.aceiteNaoReducaoCarencia;
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>