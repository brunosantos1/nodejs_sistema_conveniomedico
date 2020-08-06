const validator = {
    validate (value, args) {
      let resultado = true;

      //Cria um modelo Regex que seleciona tudo o que não for números.
      let regex = /[^0-9]/gi;
    
      /*Cria um modelo para varrer o obj e verificar se algum número de 0-9 está sendo repetido 10 ou
      11 vezes.
        */
      let objRegex = /^(0{10,11}|1{10,11}|2{10,11}|3{10,11}|4{10,11}|5{10,11}|6{10,11}|7{10,11}|8{10,11}|9{10,11})$/g;
      
      value=value.trim();
      value = value.replace(regex, "");
  
      let resultadoRegex = objRegex.test(value);
  
      if ( resultadoRegex == true ) {
        resultado = false;
      } 
      return resultado;
    }
  }
  export default validator