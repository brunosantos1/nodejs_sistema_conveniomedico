<template>
  <DataDrivenTransition :isNext="isNext">
    <div class="field-group" v-if="active" :key="fieldId">
      <slot />
    </div>
  </DataDrivenTransition>
</template>

<style scoped>
  .field-group {
    position: relative;
    min-height: 200px;
  }

  .form-out {
    position: absolute !important;
    width: 100%;
    z-index: -1;
  }

  .form-in {
   animation-delay: .25s;
  }
</style>

<script>
  import DataDrivenTransition from '../Functionals/DataDrivenTransition.vue'
  export default {
    name: 'FormFieldGroup',
    components: {
      DataDrivenTransition
    },
    props: ["fieldId"],
    inject: ["formState"],
    computed:{
      active(){
        return this.formState.activeField === this.fieldId
      },
      isNext(){
        return this.formState.isNext
      }
    }
  }
</script>