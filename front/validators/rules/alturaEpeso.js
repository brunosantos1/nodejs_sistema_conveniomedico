const validator = {
    validate (value, args) {
      if (value <= 0) {
        return false;
      }
      return true;
    }
  } 
  export default validator