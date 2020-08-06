<template>
  <div class="form-navigation">
    <button
      v-if="formState.activeField!=0"
      type="button"
      class="btn-icon btn-icon__sm btn-back"
      @click="$emit('back')"
      tabindex="-1"
    >
      <div class="box-btn-back">
        <ico icon="chevron-left" class="btn-blue" />
        <span>VOLTAR</span>
      </div>
    </button>

  <button class="btn-next-step btn btn-primary btn-block" type="button" @click="next()">
      <span v-if="formState.isComplete">Ver meus planos agora.</span>
      <span v-else>Próxima Pergunta</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.btn-back {
  height: 20px;
  position: absolute;
  top: -135px;
}

.btn-blue {
  fill: var(--quali-brand);
}

.form-navigation {
  padding-top: 2em;
}

.btn-next-step {
  position: relative;
  z-index: 10;
}
.box-btn-back {
  display: flex;
  align-items: flex-end;
  font-size: smaller;
  color: var(--quali-brand);
}
.box-btn-back span {
  line-height: normal;
}
</style>

<script>
import Ico from "@/modules/Global/Components/Icon.vue";

export default {
  name: "FormNav",
  inject: ["formState"],
  components: {
    Ico
  },
  methods:{
    next(){
      this.$emit('next');
    }
}};
</script>