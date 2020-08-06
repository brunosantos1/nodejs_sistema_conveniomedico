//Vue.use(Vuex);

const validator = {
  validate (value, args) {
    if(value=="familia") {
      if(window.localStorage.getItem("temDependente")=="true") {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
export default validator