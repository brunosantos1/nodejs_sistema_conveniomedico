<template>
  <div class="container chat-container">
    <Progress />
    <form class="form-template" @submit.prevent="submit">
      <!-- 
        COMPONENTE DE QUESTAO ANTERIOR
        ele espelha o estado anterior do componente principal
        carregando aqui com outro estilo

        Única ação que pode ser feita aqui é um clique que é o mesmo 
        efeito de voltar uma questão
      -->
      <!-- <div
        v-show="false"
        @click="back()"
        :class="{'animated fadeIn delayAnimation': isAnimating}"
        class="field-area field-area__prev"
        disabled
      >
        <field-label class="question-label" :for="prevQuestion.name">
          <strong>{{prevQuestion.label}}</strong>
        </field-label>
        <component 
          :disabled="true"
          :is="prevQuestionComponent" 
          :value="prevQuestionValue" 
          class="input-wrapper"
        />
      </div> -->
      <!-- 
        LOOP PRINCIPAL
        onde a mágica acontece
      -->
      <template v-for="(field, key) in dadosQuestoes">
        <field-group :field-id="key" :key="field.name">
          <div class="field-area">
            <field-label>
              <h2 class="question-title">{{checkPlaceholder(field.title)}}</h2>
            </field-label>
            <field-description
              class="question-description"
              v-html="checkPlaceholder(field.description)"
            ></field-description>
            <field-label class="question-label" :for="field.name">
              <strong>{{field.label}}</strong>
            </field-label>
            <!-- 
              COMPONENTE PRINCIPAL 
              as questões são carregadas aqui
            -->
            <component ref="principalComponent"
              :class="{'input-wrapper': field.type != 'autocomplete' && field.type != 'select' }"
            v-model="formData[field.name]"
            :value="formData[field.name]"
            v-bind="{ ...field.options.attrs }"
            v-validate="field.validation"
            :data-vv-as="field.alias?field.alias:field.name"
            :is="field.component"
            :type="field.type"
            :name="field.name"
            :id="field.name"
            :options="!!field.options.choices ? field.options.choices : false"
            :datasource="!!field.options.datasource ? field.options.datasource : false"
              :divider="true"
            @input="checkFieldInput({ key: field.name, value: formData[field.name] })"
            @jumpQuestion="jumpQuestion"
            @:keyup.enter="submit"
            />
          </div>
          <!-- 
            COMPONENTE FILHO
            caso a questão tenha a propriedade "parent" ele é carregado aqui
          -->
          <div v-if="field.childs">
             <div v-for="child in field.childs" :key="child.id">
            <div v-show="isShow" class="field-area">
              <field-label>
                <h2 class="question-title">{{checkPlaceholder(child.title)}}</h2>
              </field-label>
              <field-description>{{checkPlaceholder(child.description)}}</field-description>
              <component
              :childLabel="child"
              class="input-wrapper"
              v-model="formData[child.name]"
              v-bind="{ ...child.options.attrs }"
              v-validate="child.validation"
              :data-vv-as="child.alias?child.alias:child.name"
              :is="child.component"
              :type="child.type"
              :name="child.name"
              :id="child.name"
              :options="!!child.options.choices ? child.options.choices : false"
              @checkIsValid="checkIsValid()"
              @change="changed()"
              @input="checkFieldInput({ key: child.name, value: formData[child.name] })"
              />
            </div>
          </div>
          </div>
          <!-- Label de erro -->
          <field-error>{{ errors.first(field.name) }}</field-error>
          <!-- <div v-show="formState.isComplete" class="input-optin">
            <div class="custom-control custom-checkbox compare-checkbox">
             <input type="checkbox" class="custom-control-input" :name="'optin'" v-bind:id="'optin-checkbox'"
                v-model="formData['optin']" @click="checkFieldInput({ key: 'optin', value: formData['optin']  })" />
              <label class="custom-control-label" v-bind:for="'optin-checkbox'">Estou de acordo em receber oportunidades
                do grupo Qualicorp</label>
          </div>
          </div> -->
        </field-group>
      </template>
      <form-nav @back="back" @next="submit()" />
      <div v-show="formState.isComplete" class="text-termo">
        <p>
          Ao clicar no botão acima o solicitante declara estar ciente e de acordo com o
          <a
            href="http://www.economizecomaqualicorp.com.br/#/Landing"
            target="_blank"
          >Termo de Uso e Política de Privacidade</a> da Qualicorp.
        </p>
      </div>
    </form>
  </div>
</template>

<script>

// Form Fields
import InputText from "@/modules/ColetaInicial/Components/FormFields/Input.vue";
import Checkbox from "@/modules/ColetaInicial/Components/FormFields/Checkbox.vue";
import Radio from "@/modules/ColetaInicial/Components/FormFields/Radio.vue";
import Datepicker from "@/modules/ColetaInicial/Components/FormFields/Datepicker.vue";
import Range from "@/modules/ColetaInicial/Components/FormFields/Range.vue";
import Select from "@/modules/ColetaInicial/Components/FormFields/Select.vue";
import Autocomplete from "@/modules/ColetaInicial/Components/FormFields/Autocomplete.vue";
import Repeatable from "@/modules/ColetaInicial/Components/FormFields/Repeatable.vue";

// Form Elements
import FieldGroup from "@/modules/ColetaInicial/Components/FormElements/FormFieldGroup.vue";
import FieldLabel from "@/modules/ColetaInicial/Components/FormElements/FormFieldLabel.vue";
import FieldError from "@/modules/ColetaInicial/Components/FormElements/FormFieldError.vue";
import FieldDescription from "@/modules/ColetaInicial/Components/FormElements/FormFieldDescription.vue";
import Progress from "@/modules/ColetaInicial/Components/FormElements/FormProgress.vue";

// Form Mixins
import Mixin from "@/modules/ColetaInicial/Mixins/coletaMixin.js";
import LeadMixin from "@/modules/Global/Mixins/leadMixin.js";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";

// Vuex
import { mapMutations, mapGetters, mapActions } from "vuex";

// Components
import FormNav from "./FormNav.vue";

// Services
import profissaoService from "@/services/api-profissao";
import enderecoService from "@/services/api-endereco";
import entidadeService from "@/services/api-entidade";
import simulacaoService from "@/services/api-simulacao";

export default {
  data() {
    return {
      dadosQuestoes: [],
      datasources: {
        profissao: []
      },
      prevQuestionComponent: "",
      prevQuestionData: {
        name: "",
        label: ""
      }
    };
  },
  provide() {
    return {
      formState: this.formState
    };
  },
  created() {
    this.formFields.then(response => {
      this.dadosQuestoes = response;
      this.formState.formLength = response.length - 1;
      this.$store.dispatch("ColetaDados/createStoreFields", response);
      this.$store.commit("ColetaDados/updateField", { key: "optin", value: false });
    });

    //Limpa variáveis de localStorage
    window.localStorage.setItem("temDependente", false);
    window.localStorage.setItem("dependentesValid", false);
    this.clearCache("Planos");
    this.clearCache("ColetaDados");
    this.formData['optin'] = true
  },
  name: "FormWrapper",
  mixins: [Mixin, LeadMixin, CacheMixin],
  props: ["formFields"],
  components: {
    InputText,
    Checkbox,
    Radio,
    Datepicker,
    Range,
    Select,
    Autocomplete,
    Repeatable,
    FieldError,
    FieldLabel,
    FieldGroup,
    FieldDescription,
    FormNav,
    Progress
  },
  watch: {
    fieldMin(newV) {
      console.log("asdasdsad --->", newV);
    }
  },
  computed: {
    ...mapGetters({
      getPlaceholder: "ColetaDados/getPlaceholder",
      getTheProfissao: "ColetaDados/getProfissao"
    }),
    ...mapMutations({
      updateField: "ColetaDados/updateField"
    }),
    prevQuestionValue() {
      if (this.formState.activeField > 0) {
        let value = this.formData[
          this.dadosQuestoes[this.formState.activeField - 1].name
        ];
        const label = this.formData[
          this.dadosQuestoes[this.formState.activeField - 1].label
        ];
        if (this.prevQuestionComponent === InputText) {
          return value ? value : "uepa";
        }
      } else {
        return "primeira questao";
      }
    },
    prevQuestion: {
      get() {
        return this.prevQuestionData;
      },
      set(name) {
        if (this.formState.activeField > 0) {
        const fieldID = this.formState.activeField - 1;
        const label = this.dadosQuestoes[fieldID].label;

        this.prevQuestionData.name = name;
        this.prevQuestionData.label = label;
      }
    }
    }
  },
  methods: {
     atualizaInputValueDependente(inputValue){
      this.$store.commit("ColetaDados/updateField", { key: "dependentes", value: inputValue });
    },
    async consultarEndereco(cep) {
      return await enderecoService.listar(cep);
    },
    checkPlaceholder(value) {
      const pattern = value.match(/{{.+}}/gi);
      if (pattern) {
        for (let item of pattern) {
          let filtered = item.replace(/{{/gi, "").replace(/}}/gi, "");
          let filteredState = this.getPlaceholder(filtered);
          value = value.replace(item, filteredState);
        }
      }
      value = value.split("\n").join("<br/>");
      return value;
    },
    checkFieldInput(inputObj, el) {
      window.formWrapper = this;
      // Checa se o input tem um limit que precisa ser fornecido
      let limit = this.dadosQuestoes.find(item => item.name === inputObj.key);
      if (limit) {
        if (limit && typeof limit === "array") {
          if (limit[0].options.attrs.maxlength) {
            limit = limit[0].options.attrs.maxlength;
          }
        } else {
          if (limit.options.attrs.maxlength) {
            limit = limit.options.attrs.maxlength;
          }
        }
      }

      // Mixin com a logica de cada input
      switch (inputObj.key) {
        case "nome":
        inputObj.value = inputObj.value.trim();
        generalInfo.fullName = inputObj.value.trim();
        break;
        case "email":
        break;
        case "telefone":
        break;
        case "cep":
        const cep = inputObj.value.replace("-", "");
        if (cep.length === limit - 1) {
          let endereco = this.consultarEndereco(cep);
          endereco
          .then(response => {
            this.$store.dispatch(
              "ColetaDados/updateAddressField",
              response.data,
              { root: true }
              );
          })
          .catch(err => {
            this.triggerError("informe um cep válido");
          });
        }
        break;
        case "dependente":
        if (inputObj.value === "familia") {
          this.isShow = true;
            this.$validator.validate(inputObj.key);
        } else {
          this.isShow = false;
        }
        break;
        case "dependentes":
          if (inputObj.value.length > 0) {
            for (var i = inputObj.value.length - 1; i >= 0; i--) {
              if (inputObj.value[i].value == "") {
                inputObj.value.splice(i, 1);
            }
          }

            if (inputObj.value.length > 0) {
              window.localStorage.setItem("temDependente", true);
          } else {
              window.localStorage.setItem("temDependente", false);
          }
        } else {
            window.localStorage.setItem("temDependente", false);
        }
        var context = this;
          this.$validator.validate("dependente");
            setTimeout(function () {
              var totalErrors;
              totalErrors = 0;
            for (var i = 0; i < context.errors.items.length; i++) {
              if (context.errors.items[i].field.indexOf("dependentes_") > -1) {
                totalErrors += 1;
                }
              }

            if (totalErrors > 0) {
              window.localStorage.setItem("dependentesValid", false);
              } else {
              window.localStorage.setItem("dependentesValid", true);
              }

            context.$validator.validate("dependentes");
          }, 500);
        break;
        case "profissao":
        if (inputObj.value) {
          var entidades = entidadeService.listarPorEstado(
            inputObj.value,
            this.getColetaDados.estado,
            this.getColetaDados.cidade
            );
          entidades.then(listaEntidade => {
            const result = {
              key: "listaEntidades",
              value: listaEntidade.data
            };
            this.$store.commit("ColetaDados/updateField", result, {
              root: true
            });
            this.$refs.principalComponent[0].notice();
          });
        }
          this.formData.entidade = "";
        break;
        case "optin":
          inputObj.value = !inputObj.value;
          this.$store.commit("ColetaDados/updateField", { key: "optin", value: inputObj.value });          
        break;
        case "entidade":
          if (inputObj.value) {
            const data = {
              ano: "nascimento",
              entidade: inputObj.value
            };
            this.updatePriceRange(data);
      }
        break;
      }

      /**
       * Prepara o componente prévio para espelhar os dados 
       * do componente principal
       */
        this.prevQuestionComponent = InputText;
        this.prevQuestion = inputObj.key;

      /**
       * Insere o obj "inputObj" no VUEX dentro do módulo "ColetaDados"
       * inputObj é um objeto com duas propriedades: key e value
       * onde key é o id da Questão (vindo do banco de dados) 
       * e value é o que foi inputado pelo cliente
       * 
       * {key: STRING, value: STRING}
       */
      this.$store.commit("ColetaDados/updateField", inputObj, { root: true });

      /**
       * TEMPORÁRIO
       * para demonstração do chatbot
       */
      if (typeof inputObj.value === "object") {
        generalInfo.extras[inputObj.key] = `Interesse de ${
          inputObj.value[0]
        } a ${inputObj.value[1]}`;
      } else {
        generalInfo.extras[inputObj.key] = inputObj.value;
      }

    },
    submit() {
      if (this.formState.isComplete) {
            this.incluirSimulacao();
        }
      this.next();
    },
    ...mapActions({
      updateAddressField: "ColetaDados/updateAddressField",
      updateDependentes: "ColetaDados/updateAddressField",
      updatePriceRange: "ColetaDados/updatePriceRange"
    })
    }
};
</script>


<style scoped lang="scss">
@import url("https://cdn.jsdelivr.net/npm/animate.css@3.5.1");
@import "../../../assets/css/responsive.scss";

.question-title {
  font-weight: bold;
  font-size: 24px;
}

.input-wrapper input[type="text"] {
  border: none;
}

.delayAnimation {
  // animation-delay: .62s;
  animation-delay: 0.8s;
  animation-duration: 0.7s;
}

.field-area {
  margin-bottom: 1em;

  &__prev {
    margin-bottom: em(40px, 12px);
    min-width: 120px;
    width: 30%;

    opacity: 0.5;
    font-size: 12px;
    line-height: 1.4;

    .question-label {
      margin: 0;
    }
  }
}

.form-template {
  position: relative;
}

.question-description {
  font-weight: 300;
}

.question-label {
  margin-top: em(30px);
}

.input-optin {
  margin-top: 35px;
}

.text-termo {
  margin-top: 10px;
}
</style>