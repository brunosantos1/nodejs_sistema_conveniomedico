<template>
  <ValidationObserver v-slot="{ pristine }">
    <ValidationProvider :name="field.label" :rules="field.validation" v-slot="{ errors }">
      <b-form-group :label="field.label">
        <b-form-radio-group
          v-model="field.value"
          :options="options"
          :disabled="field.isReadonly"
          :state="errors && errors[0]"
          :name="field.name"
          @input="changedField(item.model, indexField, $event)"
        >
          <div v-if="errors[0]" class="d-block invalid-feedback">Campo obrigatório</div>
        </b-form-radio-group>
      </b-form-group>
    </ValidationProvider>
  </ValidationObserver>
</template>

<style scoped lang="scss">
img {
  width: 100%;
}
</style>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "Radio",
  components: { ValidationObserver, ValidationProvider },
  data() {
    return {
      data: [],
      options: [{ text: "Não", value: false }, { text: "Sim", value: true }]
    };
  },
  props: {
    field: Object,
    item: Object,
    indexField: Number
  },
  created() {
    this.field.value = this.field.value || false;
  },
  computed: {},
  methods: {
    changedField(nameModel, index, value) {
      this.$emit("changedSelect", {
        nameModel: nameModel,
        index: index,
        value: value
      });
    }
  }
};
</script>