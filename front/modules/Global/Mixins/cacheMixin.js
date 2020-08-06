/**
 * Abstração de session storage para 
 * salvamento de dados do VUEX e de 
 * manipulação de dados gerais da aplicação
 *
 * O método de setCache está associado ao VUEX
 * dentro de cada módulo.
 */
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  methods: {
    getCache(section) {
      if (sessionStorage) {
        const cachedObj = JSON.parse(sessionStorage.getItem(section));
        if (cachedObj && Object.entries(cachedObj).length === 0 && cachedObj.constructor === Object) {
          return false;
        } else {
          return cachedObj;
        }
      } else {
        return false;
      }
    },
    clearCache(section = '') {
      if (section) {
        sessionStorage.removeItem(section);
        this.$store.commit(`${section}/resetState`, { root: true });
      }
    },
    setCache(section, data) {
      if (sessionStorage) {
        sessionStorage.setItem(section, JSON.stringify(data));
        return true;
      } else {
        return false;
      }
    }
  }
}