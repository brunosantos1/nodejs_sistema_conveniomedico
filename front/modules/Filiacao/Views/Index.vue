<template>
  <div class="app-wrapper">
    <Header visibleBack />
    <div class="container">
      <!--<h1 class="no-margin">Ficha de Filiação</h1>-->

      <!-- <p>{{dadosColeta.nome}}</p> -->
      
      <transition name="fade" mode="out-in">
        <Form  />
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
}
.container {
  margin-bottom: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
<script>
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import Header from "@/modules/Global/Components/Header.vue";
import Form from "@/modules/Filiacao/Components/Form.vue";
import { mapMutations, mapGetters, mapActions } from "vuex";

export default {
  name: "Filiacao",
  mixins: [CacheMixin],
  components: {
    Header,
    Form
  },
  computed: {
    ...mapGetters({
      formData: "Filiacao/getFormData"
    })
  },
  created() {
    
    this.loadServices();

    

    

    
  },
  methods: {
    loadServices() {
      
    }
  }
};
</script>