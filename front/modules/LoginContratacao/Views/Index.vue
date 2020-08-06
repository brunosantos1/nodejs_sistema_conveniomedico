<template>
  <div class="app-wrapper" ref="pageLogin">
    <Header visibleBack hasStage @changeStage="backStage" :isFixed="isFixedHeader" />
    <div class="container" v-bind:style="isFixedHeader ? 'margin-top: 60px;' : 'margin-top: 0;'">
      <transition name="fade" mode="out-in">
        <div v-if="stage == 1">
          <br />
          <div class="row justify-content-center">
            <div class="col-12 col-sm-12 col-md-12 col-lg-4">
              <div class="container text-center">
                <br />
                <div class="image-info">
                  <span class="fi-document"></span>
                </div>
                <br />
                <br />
                <br />
                <h1>Cadastro Qualicorp</h1>
                <p>Para continuar com o processo de contratação, precisamos de mais algumas informações suas. Será rápido.</p>
                <br />
                <button
                  class="btn btn-outline-primary btn-block"
                  type="button"
                  @click="changeStage(3)"
                >Fazer o cadastro</button>
                <br />
                <button
                  class="btn btn-primary btn-block"
                  type="button"
                  @click="changeStage(2)"
                >Fazer login</button>
              </div>
            </div>
          </div>
        </div>
        <Login
          v-if="stage == 2"
          :coletaDados="coletaDados"
          :plano="plano"
          @changeStage="changeStage"
        />
        <Cadastro
          v-if="stage == 3"
          :coletaDados="coletaDados"
          :plano="plano"
          @changeStage="changeStage"
        />
        <RecuperarSenha
          v-if="stage == 4"
          :coletaDados="coletaDados"
          :plano="plano"
          @changeStage="changeStage"
          @setStage="setStage"
        />
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.image-info {
  margin-top: 30px;
  color: var(--quali-dark-blue);
  cursor: pointer;
}

.image-info span {
  background-color: #26a5d412;
  padding: 40px 40px 32px 42px;
  border-radius: 60px;
  font-size: 30px;
}
</style>
<script>
import LoginContratacaoMixin from "@/modules/LoginContratacao/Mixins/loginContratacaoMixin.js";
import Header from "@/modules/Global/Components/Header.vue";
import data from "@/modules/LoginContratacao/data.json";
import Login from "@/modules/LoginContratacao/Components/Login.vue";
import Cadastro from "@/modules/LoginContratacao/Components/Cadastro.vue";
import RecuperarSenha from "@/modules/LoginContratacao/Components/RecuperarSenha.vue";

export default {
  name: "LoginContratacao",
  mixins: [LoginContratacaoMixin],
  components: {
    Header,
    Login,
    Cadastro,
    RecuperarSenha
  },
  data() {
    return {
      coletaDados: {},
      plano: {}
    };
  },
  computed: {},
  created() {
    const hasColetaDados = this.$store.state["ColetaDados"].formData;
    const hasPlano = this.$store.state["Planos"].plano;

    if (!hasColetaDados || !hasColetaDados.cpf) return this.$router.push("/");
    // if (!hasPlano || !hasPlano.idplano_sinf) return this.$router.push("/planos");

    this.coletaDados = hasColetaDados;
    this.plano = hasPlano && hasPlano.idplano_sinf ? hasPlano : data.plano;
  },
  methods: {}
};
</script>