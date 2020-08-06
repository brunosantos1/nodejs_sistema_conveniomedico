import contratacaoService from "@/services/api-contratacao";
export default {
  data() {
    return {}
  },
  computed: {

  },
  watch: {

  },
  methods: {
    getIcon(status) {
      let icon = "";
      switch (status) {
        case "1":
        case 1:
          icon = "fi-pencil";
          break;
        case "2":
        case 2:
          icon = "fi-ellipses";
          break;
        case "4":
        case 4:
          icon = "fi-warning";
          break;
        case "3":
        case 3:
          icon = "fi-clock";
          break;
        case "5":
        case 5:
          icon = "fi-check";
          break;
        case "6":
        case 6:
        case "7":
        case 7:
          icon = "fi-x";
          break;
        default:
          icon = "fi-warning";
          break;
      }
      return icon;
    },
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
    }
  }
}