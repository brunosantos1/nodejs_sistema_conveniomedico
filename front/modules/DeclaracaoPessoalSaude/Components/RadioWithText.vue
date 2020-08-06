<template>
  <div class="w-100">
    <ValidationProvider rules="required" v-slot="{ errors, flags }">
      <div class="d-flex justify-content-between mxwidth">
        <h3 class="title">{{titulo}}</h3>
        <div class="d-flex justify-content-between">
          <b-form-radio
            class="mr-3"
            :class="{'invalid-input': errors[0]}"
            v-model="value.Resposta"
            :name="name"
            value="SIM"
          >Sim</b-form-radio>
          <b-form-radio
            :class="{'invalid-input': errors[0]}"
            v-model="value.Resposta"
            :name="name"
            value="NÃO"
          >Não</b-form-radio>
        </div>
      </div>
      <div v-if="errors[0]" class="mt-0 d-block invalid-feedback">Assinale sim ou não</div>
    </ValidationProvider>
    <div v-if="hasOptional">
      <ValidationProvider rules="required" v-slot="{ errors, flags }">
      <div class="mt-2 d-flex justify-content-between">
        <input
          @blur="testValue()"
          :class="{'is-valid': !errors[0] && value.Especificacoes, 'is-invalid': errors[0]}"
          v-model="value.Especificacoes"
          class="form-control"
          type="text"
          maxlength="2000"
          placeholder="Justifique..."
        >
      </div>
      <div v-if="errors[0]" class="mb-2 d-block invalid-feedback">Justifique o ocorrido</div>
    </ValidationProvider>
    <ValidationProvider name="data" rules="required|nascimento" v-slot="{ errors, flags, messages }">
      <div class="mt-2 d-flex justify-content-between">
        <input
          @blur="testValue(), !flags.valid ? value.DataEvento = '' : false"
          :class="{'is-valid': !errors[0] && value.DataEvento, 'is-invalid': errors[0]}"
          v-model="value.DataEvento"
          class="form-control"
          type="date"
          placeholder="Data do ocorrido (dd/mm/aaaaa)"
        >
      </div>
      <div v-if="errors[0]" class="mb-2 d-block invalid-feedback">{{errors[0]}}</div>
    </ValidationProvider>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import {mask} from 'vue-the-mask'

export default {
  name: "RadioWithText",
  directives: {mask},
  props: {
    value: {
      required: false
    },
    name: {
      required: false
    },
    titulo: {
      default: "Nome"
    }
  },
  computed: {
    hasOptional() {
      return this.value.Resposta === "SIM" ? true : false
    }
  },
  methods: {
    testValue() {
       if(this.value.Resposta === 'SIM' && this.value.Especificacoes.length > 0 && this.value.DataEvento.length >= 10){
         this.$emit('changeValue')
       }else if(this.value.Resposta === 'NÃO'){
          this.value.Especificacoes = "";
        this.value.DataEvento = "";
         this.$emit('changeValue')
       }
    }
  },
  watch: {
    'value.Resposta'(){
      this.testValue()
    },
  },
  components: {
    ValidationProvider
  }
};
</script>

<style lang="scss">
// .mxwidth {
//   max-width: 350px;
// }
.title {
  margin-bottom: 0;
}
.invalid-input {
  .custom-control-label {
    color: #e4606d;
    &::before {
      border-color: #e4606d !important;
    }
  }
}
</style>
