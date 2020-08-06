const validator = {
  validate (value, args) {
    value=value.trim()
    if (!value.match(/^[a-zA-Z\u00C0-\u00FF]+([\s][a-zA-Z\u00C0-\u00FF]+)*$/gm)) {
      return false;
    }
    return true;
  }
} 
export default validator