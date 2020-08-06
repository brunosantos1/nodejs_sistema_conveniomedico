const validator = {
  validate (value, args) {
    value=value.trim()
    if (value.length!=9) {
      return false;
    }
    return true;
  }
}
export default validator