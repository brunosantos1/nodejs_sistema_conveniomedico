<template>
  <div>
    <div v-if="!stageActive.template">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-12 col-md-12 col-lg-6">
          <h1 class="no-margin mb-3">Cadastro</h1>
          <p
            v-if="!formStage.current || formStage.current == 1"
          >Complete as questões e verifique se as informações já preenchidas estão corretas.</p>
        </div>
      </div>
    </div>
    <ValidationObserver v-slot="{ invalid }" ref="myForm" tag="form" v-if="!stageActive.template">
      <form>
        <div class="row justify-content-center">
          <div class="col-12 col-sm-12 col-md-12 col-lg-6">
            <div v-for="(item, index) in stageActive.formularios" :key="index">
              <div v-if="!item.optionalForm || item.showOptionalForm">
                <h1>{{item.titulo}}</h1>
                <div class="row">
                  <div
                    class="col-12 col-sm-12 col-md-12 col-lg-12"
                    v-for="(field, indexField) in formData[item.model]"
                    :key="indexField"
                  >
                    <!-- Quando input for removível-->
                    <!-- <div v-if="field.removeField">
                      <div
                        class="link-remove"
                        @click="removeField(item.model,indexField, field.fieldParent)"
                      >
                        <span class="fi fi-circle-x"></span>
                      </div>
                    </div> -->
                    <ValidationObserver
                      v-slot="{ pristine }"
                      v-if="field.type && !field.hidde && (field.type != 'select' && field.type != 'check' && field.type != 'boolean' && (field.optionalField == null || field.optionalField == undefined))"
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
                          <div class="input-group" v-if="!field.mask">
                          <input
                            v-if="!field.mask"
                            :type="field.type"
                            :readonly="field.isReadonly"
                            class="form-control"
                            v-bind:class="{'is-valid': !errors[0] && !pristine && field.validation, 'is-invalid': errors[0]}"
                            :id="field.name"
                            :name="field.name"
                            v-model="formData[item.model][indexField].value"
                            :maxlength="field.length?field.length:false"
                            v-on:change="changedField(item.model, indexField, $event.target.value)"
                          />
                           <div v-if="field.removeField" class="input-group-append">
                              <button @click="removeField(item.model,indexField, field.fieldParent)" class="btn btn-outline-danger" type="button">Remover</button>
                            </div>
                          </div>
                          <!-- Quando input tiver máscara -->
                          <div class="input-group" v-if="field.mask">
                          <the-mask
                            :mask="field.mask"
                            :readonly="field.isReadonly"
                            class="form-control"
                            v-bind:class="{'is-valid': !errors[0] && !pristine && field.validation, 'is-invalid': errors[0]}"
                            :id="field.name"
                            :name="field.name"
                            v-model="formData[item.model][indexField].value"
                            @change.native="changedField(item.model, indexField, $event.target.value)"
                          />
                            <div v-if="field.removeField" class="input-group-append">
                                <button @click="removeField(item.model,indexField, field.fieldParent)" class="btn btn-outline-danger" type="button">Remover</button>
                              </div>
                          </div>
                           <div class="invalid-feedback" style="display: block" v-if="errors[0]">{{errors[0]}}</div>
                        </div>
                      </ValidationProvider>
                    </ValidationObserver>

                    <!-- Quando input for SELECT -->
                    <Select
                      v-if="field.type == 'select'"
                      :field="field"
                      :item="item"
                      :indexField="indexField"
                      @changedSelect="changedSelect"
                    />

                    <!-- Quando input for BOOLEAN/RADIO -->
                    <Radio
                      v-if="field.type == 'boolean'"
                      :field="field"
                      :item="item"
                      :indexField="indexField"
                      @changedSelect="changedSelect"
                    />

                    <!-- Quando input for BOOLEAN/CHECKBOX -->
                    <CheckboxEndereco
                      v-if="field.type == 'check' && enderecoCobranca"
                      :field="field"
                      :item="item"
                      :indexField="indexField"
                      @changedSelect="defineEnderecoCobranca"
                    />

                    <!-- Quando input pode ser incrementado -->
                    <div v-if="field.optionalField">
                      <div
                        class="text-link link-add"
                        @click="addField(item.model,indexField, field.fieldParent, field)"
                      >
                        <span class="fi fi-plus"></span>
                        <span>{{field.title}}</span>
                      </div>
                      <br />
                      <br />
                    </div>
                    <!-- Quando possuir plano nos ultimos meses -->
                    <OperadoraCongenere
                      :parent="field"
                      :item="item"
                      :indexField="indexField"
                      @selectOperadora="selectOperadora"
                      v-if="field.name == 'possuiPlano' && formData[item.model][indexField].value"
                    />
                  </div>
                </div>
                <div class="row justify-content-center" v-if="item.showOptionalForm">
                  <div class>
                    <button
                      class="btn text-link btn-remove"
                      type="button"
                      @click="removeForm(item.model,index)"
                    >Remover {{item.titulo}}</button>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
              <!-- Quando formulário pode ser incrementado -->
              <div v-if="item.optionalForm && !item.showOptionalForm">
                <div
                  class="text-link link-add"
                  @click="addForm(item.model,index, item.parentModel)"
                >
                  <span class="fi fi-plus"></span>
                  <span>{{item.descricao}}</span>
                </div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div class="row justify-content-center">
        <div class="col-12 col-sm-12 col-md-12 col-lg-6">
          <button
            class="btn btn-primary btn-block"
            type="button"
            @click="next()"
          >{{loading ? 'Salvando...' : 'Continuar'}}</button>
        </div>
      </div>
    </ValidationObserver>

    <!-- TELA DE Dependente -->
    <div v-if="stageActive && stageActive.template && stageActive.template == 'dependente'">
      <ListaDependente :stageActive="stageActive" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.nome-pessoa {
  text-transform: capitalize
}
.container {
  margin-bottom: 10px;
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
.link-add {
  float: left;
}
.link-add .fi {
  font-size: 11px;
  margin-right: 5px;
}
.link-remove {
  position: absolute;
  right: 20px;
  font-size: 13px;
  color: #9e1111;
  cursor: pointer;
  padding: 5px;
}
.btn-remove {
  color: #d62c2c;
}
</style>

<script>
import { TheMask } from "vue-the-mask";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import model from "@/modules/Contratacao/model.json";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import ContratacaoMixin from "@/modules/Contratacao/Mixins/contratacaoMixin.js";
import { mapMutations, mapGetters, mapActions } from "vuex";
import Select from "@/modules/Contratacao/Components/Select.vue";
import Radio from "@/modules/Contratacao/Components/Radio.vue";
import CheckboxEndereco from "@/modules/Contratacao/Components/CheckboxEndereco.vue";
import ListaDependente from "@/modules/Contratacao/Components/Dependente/Lista.vue";
import OperadoraCongenere from "@/modules/Contratacao/Components/OperadoraCongenere.vue";
// Services
import genericaService from "@/services/api-generica";
import enderecoService from "@/services/api-endereco";
import planoService from "@/services/api-plano";
import contratacaoService from "@/services/api-contratacao";

export default {
  name: "FormCadastro",
  mixins: [CacheMixin, ContratacaoMixin],
  components: {
    TheMask,
    ValidationObserver,
    ValidationProvider,
    Select,
    ListaDependente,
    Radio,
    CheckboxEndereco,
    OperadoraCongenere
  },
  data() {
    return {
      stageActive: {},
      cepResidencial: "",
      cepComercial: ""
    };
  },
  computed: {
    ...mapGetters({
      formData: "Contratacao/getFormDataCurrent",
      formDataAll: "Contratacao/getFormData",
      coletaDados: "Contratacao/getColetaDados",
      plano: "Contratacao/getPlano",
      formStage: "Contratacao/getFormStage",
      formErrors: "Contratacao/getFormErrors",
      stages: "Contratacao/getStages",
      services: "Contratacao/getServices",
      enderecoCobranca: "Contratacao/getEnderecoCobranca"
    }), 
    ...mapMutations({
      updateData: "Contratacao/updateData"
    })
  },
  created() {
    this.createVm();
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit("onInit");
    });
  },
  methods: {
    async createVm() {
      if (!this.formStage || !this.formStage.current) return;

      const stageActive = this.stages.find(
        e => e.sequencia == this.formStage.current
      );
      this.stageActive = stageActive;

      //REDIRECIONAMENTO - Quando a etapa for para redirecionar para outra rota
      if (this.stageActive.redirecionamento) {
        this.$router.push({
          name: this.stageActive.redirecionamento.name
        });
        this.$store.commit(
          "Contratacao/updateStageForm",
          this.formStage.current - 1
        );
      }
      //END - REDIRECIONAMENTO

      //TEMPLATE - Quando etapa refere-se a um template EX: Dependentes
      if (this.stageActive.template) {
        this.$store.commit(
          "Contratacao/updateData",
          {
            [this.stageActive.template]: []
          },
          {
            root: true
          }
        );
      }
      //END - TEMPLATE

      //PADRÃO - Quando a etapa segue o fluxo padrão de formulário
      if (
        this.stageActive &&
        this.stageActive.formularios &&
        !this.stageActive.template &&
        (this.stageActive.optionalForm == null ||
          this.stageActive.optionalForm == undefined)
      ) {
        this.stageActive.formularios.forEach(s => {
          this.$store.dispatch("Contratacao/createStoreFields", {
            modelName: s.model,
            model: model[s.model]
          });
        });
        this.mergeFields();
      }
      //END - PADRÃO
    },
    mergeFields() {
      //Método responsável por varrer propriedades de Coleta e compara com campos do FormData
      const dadosColeta = this.coletaDados;
      let formData = this.formData;
      let endereco = {};

      let cpfRaiz = dadosColeta.cpf;
      for (let field in dadosColeta) {
        for (let fieldModel in formData) {
          if (formData[fieldModel] && Array.isArray(formData[fieldModel])) {
            for (let index = 0; index < formData[fieldModel].length; index++) {
              const fieldForm = formData[fieldModel][index];
              if (
                fieldForm.name === field &&
                !fieldForm.notFill &&
                !fieldForm.value
              ) {
                fieldForm.value = dadosColeta[field];
                if (fieldForm.name === "possuiPlano") {
                  fieldForm.operadoraCongenere =
                    dadosColeta["operadoraCongenere"];
                  fieldForm.aceiteNaoReducaoCarencia =
                    dadosColeta["aceiteNaoReducaoCarencia"];
                }
              }

              if (fieldForm.name === "cpfRaiz") {
                fieldForm.value = cpfRaiz;
              }
              if (
                (fieldForm.name === "cep" ||
                  fieldForm.name === "cepComercial") &&
                fieldForm.value
              ) {
                endereco = {
                  cep: fieldForm.value,
                  modelName: fieldModel
                };
              }
            }
          }
        }
      }

      if (endereco && endereco.cep && endereco.modelName)
        this.fillEndereco(endereco.cep, endereco.modelName);

      this.loadFieldsIncrement();
      this.loadFormsIncrement();

      //Atualiza escopo FormData
      this.$store.commit("Contratacao/updateData", formData, {
        root: true
      });
    },
    loadFieldsIncrement() {
      const dadosColeta = this.coletaDados;
      let formData = this.formData;
      for (let field in dadosColeta) {
        for (let fieldModel in formData) {
          //QUANDO FOR TELEFONE
          if (
            field.indexOf("telefoneAdicional") >= 0 &&
            field != "telefoneAdicional"
          ) {
            let indexTel = formData[fieldModel].findIndex(f => {
              return f.name === "telefoneAdicional";
            });

            if (formData[fieldModel][indexTel]) {
              let exist = formData[fieldModel].findIndex(f => {
                return f.name === field;
              });
              if (exist < 0) {
                this.addField(
                  fieldModel,
                  indexTel,
                  formData[fieldModel][indexTel].fieldParent,
                  formData[fieldModel][indexTel],
                  dadosColeta[field],
                  field
                );
              }
              break;
            }
          }
        }
      }
    },
    loadFormsIncrement() {
      let forms = this.stageActive.formularios;
      const dadosColeta = this.coletaDados;

      let indexEnderecoComercial = forms.findIndex(f => {
        return f.model === "dadosEnderecoComercial";
      });

      let formData = this.formData;

      if (
        dadosColeta["cepComercial"] &&
        forms[indexEnderecoComercial].showOptionalForm != false
      ) {
        this.addForm(
          "dadosEnderecoComercial",
          indexEnderecoComercial,
          forms[indexEnderecoComercial].parentModel
        );
      }
    },
    changedField(nameModel, index, value) {
      //Método responsável por capturar mudanças nos INPUTS
      this.$store.commit("Contratacao/updateDataField", {
        nameModel: nameModel,
        index: index,
        value: value
      });

      //VALIDAÇÕES ENDEREÇO
      if (
        this.formData[nameModel] &&
        this.formData[nameModel][index] &&
        (this.formData[nameModel][index].name == "cep" ||
          this.formData[nameModel][index].name == "cepComercial") &&
        this.formData[nameModel][index].value
      ) {
        if (this.formData[nameModel][index].name == "cep") {
          this.cepResidencial = this.formData[nameModel][index].value;
          if (this.cepComercial == this.cepResidencial)
            return this.alertCepIgualResidencial("comercial");
        }

        if (this.formData[nameModel][index].name == "cepComercial") {
          this.cepComercial = this.formData[nameModel][index].value;
          this.cepResidencial = this.cepResidencial
            ? this.cepResidencial
            : this.coletaDados.cep;
          if (this.cepComercial == this.cepResidencial)
            return this.alertCepIgualResidencial("residencial");
        }
        this.fillEndereco(
          this.formData[nameModel][index].value,
          nameModel,
          true
        );
      }

      //VALIDAÇÕES RESPONSÁVEL LEGAL
      if (
        this.formData[nameModel] &&
        this.formData[nameModel][index] &&
        this.formData[nameModel][index].name == "cpfResponsavel" &&
        this.formData[nameModel][index].value &&
        this.coletaDados.cpf == this.formData[nameModel][index].value
      ) {
        this.alertCpfIgualTitular().then(s => {
          this.$store.commit("Contratacao/updateDataField", {
            nameModel: nameModel,
            index: index,
            value: ""
          });
          return this.$forceUpdate();
        });
      }
    },
    changedSelect(obj) {
      //Método responsável por capturar mudanças nos SELECTS/CHECKBOX
      this.$store.commit("Contratacao/updateDataField", {
        nameModel: obj.nameModel,
        index: obj.index,
        value: obj.value
      });

      if (
        this.formData[obj.nameModel] &&
        this.formData[obj.nameModel][obj.index] &&
        this.formData[obj.nameModel][obj.index].name == "emancipado" &&
        this.formData[obj.nameModel][obj.index].value
      ) {
        this.alertEmancipado();
      }

      // if (
      //   this.formData[obj.nameModel] &&
      //   this.formData[obj.nameModel][obj.index] &&
      //   this.formData[obj.nameModel][obj.index].name == "possuiPlano" &&
      //   this.formData[obj.nameModel][obj.index].value
      // ) {
      //   this.alertPossuiPlano();
      // }
    },
    async validarCepPlano(nameModel, estado, cidade) {
      //Método responsável por validar se o cep informado
      //é valido para o plano selecionado anteriormente
      try {
        this.$store.commit("Contratacao/updateLoading", true);
        const res = await planoService.listar(
          this.coletaDados.entidade,
          estado,
          cidade,
          this.coletaDados.pessoas
        );
        if (res && res.status == 200 && res.data) {
          const idxPlano = res.data.planos.findIndex(f => {
            return f.idplano_sinf == this.plano.idplano_sinf;
          });
          if (idxPlano < 0) {
            this.$store.commit("Contratacao/updateLoading", false);
            this.resetEndereco(nameModel);
            return this.alertCepInvalido();
          }
          this.alertCepValido();
          this.$store.commit("Contratacao/updateLoading", false);
        } else {
          this.alertCepInvalido();
        }
      } catch (error) {
        this.$store.commit("Contratacao/updateLoading", false);
        this.resetEndereco(model);
        this.alertCepInvalido();
      }
    },

    async fillEndereco(cep, model, isValided) {
      //Método responsável por buscar endereço na base e preencher campos
      if (!cep || cep.length < 7) return;
      try {
        const res = await enderecoService.listar(cep);
        if (status != 200 && !res.data) return;

        if (isValided) {
          if (
            res.data.ESTADO_SIGLA != this.coletaDados.estado ||
            res.data.CIDADE_NOME != this.coletaDados.cidade
          ) {
            this.alertCepInvalido();
            return this.resetEndereco(model);
          } else this.alertCepValido();
        }

        let formEndereco = this.formData[model];

        for (let index = 0; index < formEndereco.length; index++) {
          const fieldForm = formEndereco[index];
          if (
            fieldForm.name == "endereco" ||
            fieldForm.name == "enderecoComercial"
          )
            fieldForm.value = res.data.ENDERECO_ABREV;
          if (fieldForm.name == "bairro" || fieldForm.name == "bairroComercial")
            fieldForm.value = res.data.BAIRRO_NOME;
          if (fieldForm.name == "estado" || fieldForm.name == "estadoComercial")
            fieldForm.value = res.data.ESTADO_SIGLA;
          if (fieldForm.name == "cidade" || fieldForm.name == "cidadeComercial")
            fieldForm.value = res.data.CIDADE_NOME;
        }
        this.$forceUpdate();
      } catch (error) {
        this.alertCepInvalido();
        this.resetEndereco(model);
      }
    },

    resetEndereco(model) {
      //Método responsável por limpar os campos de endereço
      let formEndereco = this.formData[model];

      for (let index = 0; index < formEndereco.length; index++) {
        const fieldForm = formEndereco[index];
        if (
          fieldForm.name == "endereco" ||
          fieldForm.name == "enderecoComercial"
        )
          fieldForm.value = "";
        if (fieldForm.name == "bairro" || fieldForm.name == "bairroComercial")
          fieldForm.value = "";
        if (fieldForm.name == "estado" || fieldForm.name == "estadoComercial")
          fieldForm.value = "";
        if (fieldForm.name == "cidade" || fieldForm.name == "cidadeComercial")
          fieldForm.value = "";
      }
      this.$forceUpdate();
    },

    addField(nameModel, index, fieldParent, newObj, value, nameOld) {
      let indexIncrement = this.formData[nameModel].findIndex(f => {
        return f.name == fieldParent;
      });
      if (this.formData[nameModel][index].limit) {
        this.formData[nameModel][index].limit--;
        if (!this.formData[nameModel][index].limit) {
          this.formData[nameModel][index].optionalField = false;
        }
      }

      let count = parseInt(this.formData[nameModel].length) + 1;
      let name = newObj.name + count;
      this.formData[nameModel].splice(indexIncrement + 1, 0, {
        title: newObj.title,
        label: newObj.label,
        name: nameOld ? nameOld : name,
        value: value ? value : "",
        type: newObj.type,
        mask: newObj.mask,
        validation: newObj.validation,
        removeField: true,
        fieldParent: newObj.name
      });
      this.$forceUpdate();
    },
    removeField(nameModel, index, fieldParent) {
      let indexIncrement = this.formData[nameModel].findIndex(f => {
        return f.name == fieldParent;
      });

      if (
        this.formData[nameModel][indexIncrement].limit ||
        this.formData[nameModel][indexIncrement].limit == 0
      ) {
        this.formData[nameModel][indexIncrement].limit++;
        this.formData[nameModel][indexIncrement].optionalField = true;
      }

      this.formData[nameModel].splice(index, 1);
      this.$forceUpdate();
    },
    addForm(nameModel, index, parentModel) {
      try {
        this.$store.dispatch("Contratacao/createStoreFields", {
          modelName: nameModel,
          model: model[nameModel]
        });

        setTimeout(() => {
          this.stageActive.formularios[index].showOptionalForm = true;
          this.$forceUpdate();
        }, 200);
      } catch (error) {}
    },
    removeForm(nameModel, index) {
      try {
        this.stageActive.formularios[index].showOptionalForm = false;
        delete this.formData[nameModel];
        this.$forceUpdate();

        this.$store.commit("Contratacao/updateEnderecoCobranca", "");
        setTimeout(() => {
          this.$store.commit(
            "Contratacao/updateEnderecoCobranca",
            "residencial"
          );
        }, 200);
      } catch (err) {}
    },
    defineEnderecoCobranca(obj) {
      if (
        this.formData[obj.nameModel] &&
        this.formData[obj.nameModel][obj.index] &&
        this.formData[obj.nameModel][obj.index].name == "enderecoCobranca"
      ) {
        this.$store.commit("Contratacao/updateEnderecoCobranca", "");
        setTimeout(() => {
          this.$store.commit(
            "Contratacao/updateEnderecoCobranca",
            "residencial"
          );
        }, 200);
      }

      if (
        this.formData[obj.nameModel] &&
        this.formData[obj.nameModel][obj.index] &&
        this.formData[obj.nameModel][obj.index].name ==
          "enderecoCobrancaComercial"
      ) {
        this.$store.commit("Contratacao/updateEnderecoCobranca", "");
        setTimeout(() => {
          this.$store.commit("Contratacao/updateEnderecoCobranca", "comercial");
        }, 200);
      }
    },
    selectOperadora(obj) {
      this.$store.commit("Contratacao/updateOperadoraCongenere", {
        nameModel: obj.nameModel,
        index: obj.index,
        operadoraCongenere: obj.operadoraCongenere,
        aceiteNaoReducaoCarencia: obj.aceiteNaoReducaoCarencia
      });
    }
  }
};
</script>