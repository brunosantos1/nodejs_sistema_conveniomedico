<template>
  <div>
    <input 
    type="checkbox">
  </div>
</template>

<script>
  export default {
    name: 'Checkbox',
    // methods: {
    //   sendData(el){
    //     this.$emit('getData', el.target.value);
    //   }
    // },
    inject: ['formState']
  }
</script>