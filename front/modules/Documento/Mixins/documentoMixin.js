export default {
  data() {
    return {}
  },
  computed: {

  },
  watch: {

  },
  methods: {
    alertSuccessGeneric(msg) {
      this.$swal({
        toast: true,
        type: "success",
        position: "top-end",
        showConfirmButton: false,
        title: msg,
        timer: 5000
      });
    },
    alertWarningGeneric(msg) {
      this.$swal({
        toast: true,
        type: "warning",
        position: "top-end",
        showConfirmButton: false,
        title: msg,
        timer: 5000
      });
    },
    alertErrorGeneric(msg) {
      this.$swal({
        toast: true,
        type: "error",
        position: "top-end",
        showConfirmButton: false,
        title: msg,
        timer: 5000
      });
    },
    alertConfimarExclusao() {
      return this.$swal({
        title: "<strong>Excluir arquivo</strong>",
        type: "question",
        html: "Tem certeza de que deseja excluir este arquivo?",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        allowOutsideClick: false
      });
    }
  }
}