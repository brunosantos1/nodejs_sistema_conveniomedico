<template>
  <div class="label-error" :class="{active: !formState.isValid}">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
  .label-error {
    height: 0;
    padding-left: .5em;
    
    line-height: 2.5em;
    font-size: .7em;
    transition: all .5s ease-in-out;

    &.active {
      height: auto;

      // border: solid 1px var(--danger);
      background-color: lighten(red, 45%);
      color: var(--danger);
    }
  }
</style>

<script>
  export default {
    name: 'FormFieldError',
    inject: ['formState']
  }
</script>