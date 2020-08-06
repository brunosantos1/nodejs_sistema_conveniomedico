<template>
  <ValidationObserver v-slot="{ pristine }">
    <ValidationProvider :name="field.label" :rules="field.validation" v-slot="{ errors }">
      <div class="custom-control custom-checkbox compare-checkbox">
        <input
          type="checkbox"
          class="custom-control-input"
          v-bind:class="{'is-valid': (!errors || !errors[0]) && !pristine && field.validation, 'is-invalid': errors[0]}"
          :disabled="field.isReadonly || field.value == enderecoCobranca"
          :name="field.name"
          v-bind:id="field.name"
          :checked="field.value == enderecoCobranca || false"
          @click="changedField(item.model, indexField, $event.target.checked)"
        />
        <label class="custom-control-label" v-bind:for="field.name">{{field.label}}</label>
      </div>
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

export default {
  name: "CheckboxEndereco",
  components: { ValidationObserver, ValidationProvider },
  data() {
    return {};
  },
  props: {
    field: Object,
    item: Object,
    indexField: Number
  },
  created() {
  },
  computed: {
    ...mapGetters({
      formData: "Contratacao/getFormDataCurrent",
      enderecoCobranca: "Contratacao/getEnderecoCobranca"
    })
  },

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