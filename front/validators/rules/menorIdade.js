const validator = {
  validate(value, args) {
    let rt = true;
    let anoNascimento = new Date(value).getFullYear();
    let anoAtual = new Date().getFullYear();

    let mesNascimento = new Date(value).getMonth() + 1;
    let mesAtual = new Date().getMonth() + 1;

    let diaNascimento = new Date(value).getDate() + 1;
    let diaAtual = new Date().getDate();

    let diff = 0;
    if (!isNaN(anoNascimento)) {
      if (anoNascimento <= anoAtual) {
        diff = anoAtual - anoNascimento;
        if (diff < 18)
          rt = false;
      }
    }
    return rt;
  }
}
export default validator