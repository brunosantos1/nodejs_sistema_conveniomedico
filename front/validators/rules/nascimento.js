const validator = {
  validate (value, args) {
    var currentDate = new Date()
    var newValue = value.split("/").reverse().join("-");
    var paramDate = new Date(newValue)

    if (parseInt(newValue.split('-')[0]) < 1900) {
      // console.log('menor que 1900')
      return false;
    }

    if(paramDate > currentDate) {
      // console.log('maior que data atual')
      return false;
    }


    return true
  }
}
export default validator