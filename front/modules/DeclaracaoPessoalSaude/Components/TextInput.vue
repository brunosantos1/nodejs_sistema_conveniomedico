<template>
  <div class="d-flex justify-content-between w-100 align-items-center">
    <h3>{{titulo}}</h3>
    <div class="width-input d-flex justify-content-end">
      <ValidationProvider
        tag="div"
        class="input-text"
        rules="required|alturaEpeso"
        v-slot="{ flags, errors }"
        :name="value.DPS[index].TipoResposta == 'numerico' ? 'peso' : 'altura'"
        v-for="(questao, index) in value.DPS"
        :key="questao.CodigoPergunta"
      >
        <input
          @blur="testValue(value.DPS[index])"
          v-mask="'####'"
          v-model="value.DPS[index].Resposta"
          :class="{'is-valid': !errors[0] && value.DPS[index].Resposta, 'is-invalid': errors[0]}"
          class="form-control"
          type="tel"
         :placeholder="value.DPS[index].TipoResposta == 'numerico' ? '0' : '0'"
        >
        <div v-if="errors[0]" class="d-block invalid-feedback">{{errors[0]}}</div>
      </ValidationProvider>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import {mask} from 'vue-the-mask'

export default {
  name: "TextInput",
  directives: {mask},
  props: {
    value: {
      required: false
    },
    titulo: {
      default: "Nome"
    }
  },
  methods: {
    testValue(value) {
     if(value.Resposta > 0){
       this.$emit('changeValue')
     }
    }
  },
  components: {
    ValidationProvider
  }
};
</script>

<style scope lang="scss">
.width-input {
  width: 200px;
  .input-text {
    margin-left: 10px;
    width: 100px;
  }
}
</style>
