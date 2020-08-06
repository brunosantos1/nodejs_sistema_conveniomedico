export default {
  data() {
    return {
      isFixedHeader: true,
      stage: 1,
      prevStage: [1]
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    backStage() {
      this.prevStage.pop()
      if (!this.prevStage.slice(-1)[0])
        this.$router.back();
      this.stage = this.prevStage.slice(-1)[0];
    },
    changeStage(stage) {
      let i = this.stage != stage ? stage : this.prevStage.slice(-1)[0];
      this.prevStage.push(i)
      setTimeout(() => {
        this.stage = stage;
      });
    },
    setStage(stages) {
      setTimeout(() => {
        this.prevStage = stages;
      });
    },
    emailMask(email) {
      var maskedEmail = email.replace(/([^@])/g, "*").split('');
      var previous = "";
      for (let i = 0; i < maskedEmail.length; i++) {
        if (i <= 1 || previous == "@") {
          maskedEmail[i] = email[i];
        }
        previous = email[i];
      }
      return maskedEmail.join('');
    },
    isMaiorIdade(nascimento) {
      let rt = true;
      let anoNascimento = new Date(nascimento).getFullYear();
      let anoAtual = new Date().getFullYear();
      let diff = 0;
      if (!isNaN(anoNascimento)) {
        if (1900 < anoNascimento && anoNascimento <= anoAtual) {
          diff = anoAtual - anoNascimento;
          if (diff < 18)
            rt = false;
        }
      }
      return rt;
    },
    alertErrorGeneric(msg) {
      return this.$swal({
        toast: true,
        type: "error",
        position: "top-end",
        showConfirmButton: false,
        title: msg,
        timer: 5000
      });
    },
    alertSuccessGeneric(msg) {
      return this.$swal({
        toast: true,
        type: "success",
        position: "top-end",
        showConfirmButton: false,
        title: msg,
        timer: 5000
      });
    }
  }
}