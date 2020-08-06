import { mapMutations, mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      getPlaceholder: "ColetaDados/getPlaceholder"
    }),
  },
  methods: {
    checkPlaceholder(value) {
      const pattern = value.match(/{{.+}}/gi);
      if (pattern) {
        for (let item of pattern) {
          let filtered = item.replace(/{{/gi, "").replace(/}}/gi, "");
          let filteredState = this.getPlaceholder(filtered);
          value = value.replace(item, filteredState);
        }
      }
      return value;
    },
  }
}