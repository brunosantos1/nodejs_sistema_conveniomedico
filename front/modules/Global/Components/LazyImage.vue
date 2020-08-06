<template>
  <div>
    <img v-bind:src="url" />
  </div>
</template>

<style scoped lang="scss">
img {
  width: 100%;
}
</style>

<script>
import documentoService from "@/services/api-documento";
export default {
  name: "LazyImage",
  data() {
    return {
      url: ""
    };
  },
  props: {
    data: Object,
    endpoint: String,
    indice: { type: Number, required: false }
  },
  created() {
    this.loadImage();
  },
  methods: {
    async loadImage() {
      switch (this.endpoint) {
        case "documento":
          let res = await documentoService.getDocumeto(this.data);
          this.url = res.data;
          if (this.url)
            this.$emit("showImage", { indice: this.indice, isNotImage: false });
          else this.$emit("showImage", { indice: this.indice, isNotImage: true });
          break;

        default:
          break;
      }
    }
  }
};
</script>