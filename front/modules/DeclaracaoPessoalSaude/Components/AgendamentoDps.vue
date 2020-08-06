<template>
  <div class="mt-5 d-flex flex-column align-items-center">
    <div class="col-12 col-md-6 col-lg-5 col-xl-4 d-flex flex-column align-items-center">
      <div class="image-circle mb-4">
        <img src="@/assets/images/icon/icon-hearth.svg" alt>
      </div>
      <h2 class="text-center">Realize o seu agendamento</h2>
      <p class="text-center">Faça o seu agendamento no chat localizado no canto da página.</p>
    </div>

    <div class="col-12 col-md-6 col-lg-5 col-xl-4 d-flex flex-column align-items-center">
      <button
        v-if="!chatIsOpen"
        @click.prevent="openChat()"
        class="mt-4 btn-next-step btn btn-primary btn-block btn-width mb-5"
      >Abrir Chat</button>
      <router-link
        v-else
        class="mt-4 btn-next-step btn btn-primary btn-block btn-width mb-5"
        tag="a"
        :to="{ name: 'Pagamento' }"
      >Avançar</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CartaAns",
  data() {
    return {
      chatIsOpen: false
    };
  },
  methods: {
    openChat() {
      this.chatIsOpen = true;
      generalInfo.extras["etapa"] = "Agendamento";
      blipClient.toogleChat();
    }
  },
  mounted() {},
  components: {}
};
</script>

<style scoped lang="scss">
.image-circle {
  border-radius: 100%;
  width: 106px;
  height: 106px;
}
.text-radio {
  font-size: 14px;
  &--size {
    font-size: 12px;
  }
}

.text-center {
  a {
    color: #005883;
    text-decoration: none;
    font-weight: bold;
  }
}

.btn-width {
  max-width: 300px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0.5;
}
</style>
