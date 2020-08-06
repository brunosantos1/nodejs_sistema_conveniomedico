<template>
  <ValidationObserver v-slot="{pristine}">
    <Select :field="field" :item="item" :indexField="indexField" @changedSelect="changedSelect" />
    <ValidationProvider
      :name="'Aceite de não redução da carência'"
      :rules="operadoraCongenere == -1 ? 'required: true' : ''"
      v-slot="{ errors }"
    >
      <div class="custom-control custom-checkbox compare-checkbox" v-if="operadoraCongenere == -1">
        <input
          type="checkbox"
          class="custom-control-input"
          v-bind:class="{'is-valid': ((!errors || !errors[0]) && operadoraCongenere == -1), 'is-invalid': errors[0]}"
          :name="'aceiteNCarencia'"
          v-bind:id="'aceiteNCarencia-checkbox'"
          v-model="aceiteNaoReducaoCarencia"
          @click="checkFieldInput()"
        />
        <label
          class="custom-control-label"
          v-bind:for="'aceiteNCarencia-checkbox'"
        >Estou ciente que não terei redução de carência</label>
      </div>
      <div class="invalid-feedback">{{errors[0]}}</div>
    </ValidationProvider>
  </ValidationObserver>
</template>

<style scoped lang="scss">
.custom-control {
  margin-bottom: 10px;
}
</style>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { mapMutations, mapGetters, mapActions } from "vuex";
import Select from "@/modules/Contratacao/Components/Select.vue";

export default {
  name: "OperadoraCongenere",
  components: { ValidationObserver, ValidationProvider, Select },
  data() {
    return {
      field: {
        label:
          "Identifique se a operadora do seu plano anterior consta abaixo:",
        value: "",
        name: "operadoraCongenere",
        validation: "required",
        dataSource: {}
      },
      operadoraCongenere: null,
      aceiteNaoReducaoCarencia: false
    };
  },
  props: {
    item: Object,
    parent: Object,
    indexField: Number
  },
  created() {
    this.field.value = this.parent.operadoraCongenere;
    this.field.dataSource = this.parent.dataSource;
    this.operadoraCongenere = this.parent.operadoraCongenere;
    this.aceiteNaoReducaoCarencia = this.parent.aceiteNaoReducaoCarencia;
  },
  computed: {},

  methods: {
    changedSelect(obj) {
      this.operadoraCongenere = obj.value.code || obj.value;
      this.aceiteNaoReducaoCarencia = false;
      this.$emit("selectOperadora", {
        nameModel: this.item.model,
        index: this.indexField,
        operadoraCongenere: this.operadoraCongenere,
        aceiteNaoReducaoCarencia: this.aceiteNaoReducaoCarencia
      });
    },
    checkFieldInput() {
      this.$emit("selectOperadora", {
        nameModel: this.item.model,
        index: this.indexField,
        operadoraCongenere: this.operadoraCongenere,
        aceiteNaoReducaoCarencia: !this.aceiteNaoReducaoCarencia
      });
    }
  }
};
</script>