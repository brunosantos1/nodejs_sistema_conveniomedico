<template>
  <div class="app-wrapper">
    <Header />
    <ValidationObserver v-slot="{ invalid }" ref="formLoginAnonimo" tag="form">
      <form>
        <div class="row justify-content-center">
          <div class="col-12 col-sm-12 col-md-12 col-lg-4">
            <div class="container">
              <br />
              <h1 class="text-center">Login de acesso</h1>
              <ValidationProvider
                :name="'cpf'"
                :rules="'required|cpf'"
                v-slot="{ errors, changed }"
              >
                <div class="form-group">
                  <label :for="'cpf'">CPF</label>
                  <input
                    :type="'cpf'"
                    :readonly="false"
                    class="form-control"
                    v-bind:class="{'is-valid': !errors[0] && changed, 'is-invalid': errors[0]}"
                    :id="'cpf'"
                    :name="'cpf'"
                    v-model="vm['cpf']"
                  />
                  <div class="invalid-feedback">{{errors[0]}}</div>
                </div>
              </ValidationProvider>
              <ValidationProvider :name="'senha'" :rules="'required'" v-slot="{ errors, changed }">
                <div class="form-group">
                  <label :for="'senha'">Senha</label>
                  <input
                    ref="senha"
                    :type="'password'"
                    :readonly="false"
                    class="form-control"
                    v-bind:class="{'is-valid': !errors[0] && changed, 'is-invalid': errors[0]}"
                    :id="'senha'"
                    :name="'senha'"
                    v-model="vm['senha']"
                    v-on:keyup.enter="logar()"
                  />
                  <div class="invalid-feedback">{{errors[0]}}</div>
                </div>
              </ValidationProvider>
              <br />
              <button
                class="btn btn-primary btn-block"
                type="button"
                @click="logar()"
              >{{!isLoading ? 'Entrar' : "Entrando..."}}</button>
            </div>
          </div>
        </div>
      </form>
    </ValidationObserver>
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
  margin-bottom: 100px;
}
</style>
<script>
import LoginContratacaoMixin from "@/modules/LoginContratacao/Mixins/loginContratacaoMixin.js";
import { TheMask } from "vue-the-mask";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Header from "@/modules/Global/Components/Header.vue";
import controleAcessoService from "@/services/api-controle-acesso";

export default {
  name: "LoginAnonimo",
  mixins: [LoginContratacaoMixin],
  components: {
    TheMask,
    ValidationObserver,
    ValidationProvider,
    Header
  },
  props: {},
  data() {
    return {
      vm: Object,
      isLoading: false
    };
  },
  mounted() {},
  computed: {},
  created() {
    this.vm = {};
  },
  methods: {
    async logar() {
      try {
        if (this.isLoading) return;
        const isValid = await this.$refs.formLoginAnonimo.validate();
        if (!isValid) return;

        this.isLoading = true;
        let cpf = this.vm.cpf.split(".").join("");
        cpf = cpf.split("-").join("");
        const login = await controleAcessoService.logar({
          cpf: cpf,
          senha: this.vm.senha
        });
        this.$nextTick(() => {
          this.isLoading = false;
          this.alertSuccessGeneric("Usuário autenticado com sucesso!");
        });
      } catch (error) {
        this.isLoading = false;
        this.alertErrorGeneric(error.message || error);
      }
    }
  }
};
</script>