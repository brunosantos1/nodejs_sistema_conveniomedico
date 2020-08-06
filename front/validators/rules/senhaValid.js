const validator = {
    validate (value, args) {
      return (value.length >= 6) ? true : false
    }
  }
  export default validator