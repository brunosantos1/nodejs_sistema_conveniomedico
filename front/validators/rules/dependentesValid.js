const validator = {
  validate (value, args) {
    
    console.log('dependentes valid');
    if(window.localStorage.getItem("dependentesValid")=="true") {
      return true;
    } else {
      return false;
    }
  }
}
export default validator