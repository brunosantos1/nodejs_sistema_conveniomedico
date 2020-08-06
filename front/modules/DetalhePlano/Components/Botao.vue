<template>
  <div>
    <button v-if="buttonType == 'button'" class="btn btn-primary" type="button" @click="execute(action)">{{text}}</button>
    <a v-if="buttonType == 'link'" class="text-link btn-link" @click="execute(action)">{{text}}</a>
  </div>
</template>

<style scoped>
.btn-link {
  padding: 10px 0;
}
</style>

<script>
export default {
  name: "Botao",
  components: {},
  props: {
    action: String,
    text: String,
    buttonType: {
      type: String,
      default: "button"
    }
  },  
  methods: {
    execute(act) {
      switch (act) {
        case 'simulacao':
          this.$router.push({name: 'ReceberProposta'});
        break;
        case '/contratacao':
          this.$router.push('/contratacao');
        break;
        case 'sucessoLead':
          this.$router.push({name: 'Planos'});
        break;
      }
    }
  }
};
</script>
