<template>
  <ValidationObserver v-slot="{ pristine }">
    <ValidationProvider :name="field.label" :rules="field.validation" v-slot="{ errors }">
      <div class="form-group">
        <label :for="field.label">
          {{field.label}}
          <span class="badge-info" :id="field.name + '-info'" v-if="field.info">
            <b>i</b>
          </span>
          <b-tooltip :target="field.name + '-info'" variant="danger">{{field.info}}</b-tooltip>
        </label>
        <v-select
          :options="data"
          :item-text="field.label"
          :item-value="field.value"
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
import { mapMutations, mapGetters, mapActions } from "vuex";
import genericaService from "@/services/api-generica";

export default {
  name: "Select",
  components: { ValidationObserver, ValidationProvider },
  data() {
    return {
      data: [],
      value: {}
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
  computed: {
    ...mapGetters({
      coletaDados: "Contratacao/getColetaDados",
      plano: "Contratacao/getPlano"
    })
  },
  methods: {
    async dataSource() {
      try {
        let res;
        if (this.field.dataSource.param) {
          res = await genericaService.get(
            this.field.dataSource.endpoint,
            this[this.field.dataSource.param.objectName][
              this.field.dataSource.param.propObject
            ]
          );
        } else res = await genericaService.get(this.field.dataSource.endpoint);

        let data = res.data.data || res.data;
        this.data = data.map(this.mapFormat);
        this.selected();
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
        this.selected();
      } catch (error) {
        this.data = [];
      }
    },
    selected() {
      let s = this.data.find(f => {
        let v =
          this.field.value && this.field.value.code
            ? this.field.value.code
            : this.field.value
            ? this.field.value
            : "";
        return f.code == v;
      });
      if (s) {
        this.field.value = s;
        this.$forceUpdate();
      }
    },
    changedField(nameModel, index, value) {
      this.$emit("changedSelect", {
        nameModel: nameModel,
        index: index,
        value: value
      });
      this.selected();
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