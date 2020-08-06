const validator = {
    validate (value, args) {
      let resultado = true;
      let regex = /[^\w.@-]/gi;
      let bool = regex.test(value)

      if ( bool ) {
        resultado = false;
      } 
      return resultado;
    }
  }
  export default validator