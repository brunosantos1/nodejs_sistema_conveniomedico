<template>
  <div class="app-wrapper">
    <Header visibleBack
    />
    <div class="container">

      
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
import Form from "@/modules/Pagamento/Components/Form.vue";
import { mapMutations, mapGetters, mapActions } from "vuex";

export default {
  name: "Pagamento",
  mixins: [CacheMixin],
  components: {
    Header,
    Form
  },
  computed: {
    
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