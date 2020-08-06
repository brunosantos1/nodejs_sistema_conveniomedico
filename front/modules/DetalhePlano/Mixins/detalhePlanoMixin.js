import { TimelineLite, Elastic } from "gsap"

export default {
  data() {
    return {}
  },
  computed: {

  },
  watch: {

  },
  methods: {
    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",", isMoeda) {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        var res = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        if (isMoeda) res = "R$ " + res;
        return res;
      } catch (e) {
        console.log(e)
      }
    }
  }
}