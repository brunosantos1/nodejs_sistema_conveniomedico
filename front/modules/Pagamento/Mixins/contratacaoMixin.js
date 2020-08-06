export default {
  data() {
    return {
      isSubmit: false
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    async next(state, endpoint) {
      //Valida formulário
      const isValid = await this.$refs.myForm.validate();
      if (!isValid) return;

      //Formata body de requisição
      const formData = this.$store.state["Contratacao"].formData;
      const body = this.formatBody(formData);

      //Verifica se é primeira etapa. Se for chama api de login antes da atualização da contratação
      
      this.$store.commit("Contratacao/updateStageForm", (this.formStage.current + 1));

    },
    formatBody(data) {
      let body = {};
      if (!this.formStage.current) return {};
      let formModel = data[this.formStage.current];
      for (let el in formModel) {
        for (let index = 0; index < formModel[el].length; index++) {
          const field = formModel[el][index];
          if (field && field.name)
            body[field.name] = field.value;
        }

      }
      return body;
    },
    isValidDate(d) {
      d = new Date(d.split("/")
        .reverse()
        .join(","));
      return d instanceof Date && !isNaN(d);
    }
  }
}