
export default {
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    isMobile() {
      const width = window.screen.availWidth;
      if (width >= 1024) return false;

      return true;
    }

  }
}