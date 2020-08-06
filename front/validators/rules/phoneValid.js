const validator = {
  validate (value, args) {
    let resultado = true;

    //Cria um modelo Regex que seleciona tudo o que não for números.
    let regex = /[^0-9]/gi;

    value=value.trim();
    value = value.replace(regex, "");

    if (value.length<10) {
      resultado = false;
    }
    return resultado;
  }
}
export default validator