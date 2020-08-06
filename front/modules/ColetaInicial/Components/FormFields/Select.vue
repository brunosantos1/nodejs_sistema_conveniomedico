<template>
  <div class="box-select">
    <v-select
      :placeholder="placeholder"
      :options="results"
      :id="'select'"
      :name="'select'"
      class="form-control"
      v-model="selected"
      :clearable="false"
      @input="select($event)"
    >
      <div slot="no-options">Nenhum resultado encontrado</div>
    </v-select>
  </div>
</template>
<style scoped lang="scss">
.box-select {
  border: none;
  border-bottom: 2px solid var(--quali-brand);
  .form-control {
    border: none;
    padding-left: 0;
  }
}
</style>
<script>
export default {
  props: ["value", "placeholder", "options", "value"],
  inject: ["formState"],
  data() {
    return {
      results: [],
      selected: ""
    };
  },
  created() {},
  mounted() {
    if (this.options.length > 0) {
      this.results = this.options.map(item => {
        return {
          label: item.text,
          code: item.value
        };
      });
      if (this.value) this.load();
    }
  },
  methods: {
    load(newValue) {
      let value = newValue ? newValue : this.value;
      let s = this.results.find(f => {
        return f.code == value;
      });
      if (s) {
        this.selected = s;

        this.$forceUpdate();
      }
    },
    select(value) {
      let code = (value && value.code) || "";
      this.$emit("input", code);
      this.load(value);
    }
  }
};
</script>