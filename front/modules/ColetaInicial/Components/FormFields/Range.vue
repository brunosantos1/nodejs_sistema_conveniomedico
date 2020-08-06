<template>
  <div>
    <VueSlider
      :enable-cross="true"
      :tooltip="'always'" 
      :min="minPrice"
      :max="maxPrice"
      :value="valueComputed"
      @change="val => $emit('input', val)"
    />
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "@/assets/css/rangeField.scss";

  export default {
  data() {
      return {
        minPrice: 0,
      maxPrice: 1000,
      valueFiltered: null
    };
    },
  created() {
      const totalPrice = this.$store.state.ColetaDados.formData.valor;
      const minPrice = this.$store.state.ColetaDados.formData.valorMinimo;
      const maxPrice = this.$store.state.ColetaDados.formData.valorMaximo;

      if (minPrice) {
        this.minPrice = parseInt(minPrice);
      }
      if (maxPrice) {
        this.maxPrice = parseInt(maxPrice);
      }
    this.valueFiltered = this.filteredValue;
    },  
    props: {
      divider: {
        type: Boolean,
        default: false
      },
      filteredValue: Array
    },
    computed: {
      valueComputed: {
      set(value) {
          this.$attrs.value = value;
          this.value = value;
        },
      get() {
          if (this.divider) {
          const step1 = Math.floor(this.minPrice);
          const step2 = Math.floor(this.maxPrice);
            if (!this.value) {
              this.value = [step1, step2];  
              this.$attrs.value = this.value;
            this.valueFiltered = null;
            this.$emit("input", this.value);
            }
            return [step1, step2];
          }

        if (this.valueFiltered) {
          return this.valueFiltered;
          } else {
            return this.value;
          }
        }
      }
    },
    components: {
      VueSlider
    }
};
</script>