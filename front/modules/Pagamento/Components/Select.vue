<template>
  <ValidationObserver v-slot="{ pristine }">
    <ValidationProvider :name="field.label" :rules="field.validation" v-slot="{ errors }">
      <div class="form-group">
        <label :for="field.label">{{field.label}}</label>
        <v-select
          :options="data"
          :reduce="option => option.code"
          :id="field.name"
          :name="field.name"
          :readonly="field.isReadonly"
          v-model="field.value"
          class="form-control"
          v-bind:class="{'is-valid': (!errors || !errors[0]) && !pristine && field.validation, 'is-invalid': errors[0]}"
          @input="changedField(item.model, indexField, $event)"
        >
          <div slot="no-options">Nenhum resultado encontrado</div>
        </v-select>
        <div class="invalid-feedback">{{errors[0]}}</div>
      </div>
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
import genericaService from "@/services/api-generica";

export default {
  name: "Select",
  components: { ValidationObserver, ValidationProvider },
  data() {
    return {
      data: []
    };
  },
  props: {
    field: Object,
    item: Object,
    indexField: Number
  },
  created() {
    if (this.field.dataSource.endpoint) this.dataSource();

    if (this.field.dataSource.stateName) this.dataSourceLocation();
  },
  computed: {},
  methods: {
    async dataSource() {
      try {
        let res = await genericaService.get(this.field.dataSource.endpoint);
        let data = res.data.data;
        this.data = data.map(this.mapFormat);
      } catch (error) {
        this.data = [];
      }
    },
    dataSourceLocation() {
      try {
        let res = this.$store.state["Contratacao"].services[
          this.field.dataSource.stateName
        ];
        this.data = res && res.length ? res : [];
      } catch (error) {
        this.data = [];
      }
    },
    changedField(nameModel, index, value) {
      this.$emit("changedSelect", {
        nameModel: nameModel,
        index: index,
        value: value
      });
    },
    mapFormat(vm) {
      let limitProps = 0;
      let itemData = {};
      for (let el in vm) {
        switch (el.toLowerCase()) {
          case this.field.dataSource.label.toLowerCase():
            itemData.label = vm[el];
            break;
          case this.field.dataSource.code.toLowerCase():
            itemData.code = vm[el];
            break;
          default:
            itemData.label = "Não especificado";
            itemData.code = limitProps;
            break;
        }
        if (limitProps) break;
        else limitProps++;
      }
      return itemData;
    }
  }
};
</script>