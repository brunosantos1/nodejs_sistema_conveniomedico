<template>
  <div class="app-wrapper">
    <Header />
    <ValidationObserver v-slot="{ invalid }" ref="formAlterar" tag="form">
      <form>
        <div class="row justify-content-center">
          <div class="col-12 col-sm-12 col-md-12 col-lg-4">
            <div class="container">
              <br />
              <h1 class="text-center">Alterar senha</h1>
              <ValidationProvider
                :name="'senha'"
                vid="senha"
                :rules="'required'"
                v-slot="{ errors, changed }"
              >
                <div class="form-group">
                  <label :for="'senha'">Nova Senha</label>
                  <input
                    ref="senha"
                    :type="'password'"
                    :readonly="false"
                    class="form-control"
                    v-bind:class="{'is-valid': !errors[0] && changed, 'is-invalid': errors[0]}"
                    :id="'senha'"
                    :name="'senha'"
                    v-model="vm['senha']"
                  />
                  <div class="invalid-feedback">{{errors[0]}}</div>
                </div>
              </ValidationProvider>
              <ValidationProvider
                :name="'confimação de senha'"
                :rules="'required|confirmed:senha'"
                v-slot="{ errors, changed }"
              >
                <div class="form-group">
                  <label :for="'confimação de senha'">Confimação de nova senha</label>
                  <input
                    ref="confimação de senha"
                    :type="'password'"
                    :readonly="false"
                    class="form-control"
                    v-bind:class="{'is-valid': !errors[0] && changed, 'is-invalid': errors[0]}"
                    :id="'confimação de senha'"
                    :name="'confimação de senha'"
                    v-model="vm['senhaConfirma']"
                    v-on:keyup.enter="logar()"
                  />
                  <div class="invalid-feedback">{{errors[0]}}</div>
                </div>
              </ValidationProvider>
              <br />
              <button
                ref="btnRecuperar"
                class="btn btn-primary btn-block"
                type="button"
                @click="alterar()"
              >{{!isLoading ? 'Alterar' : 'Alterando...'}}</button>
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
  name: "AlterarSenha",
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
      isLoading: false,
      token: ""
    };
  },
  mounted() {},
  computed: {},
  created() {
    this.token = this.$route.params.token;
  },
  methods: {
    async alterar() {
      try {
        if (this.isLoading) return;
        const isValid = await this.$refs.formAlterar.validate();
        if (!isValid) return;
        this.isLoading = true;

        let altera = await controleAcessoService.alterarSenha({
          token: this.token,
          senhaNova: this.vm.senha
        });

        this.$nextTick(() => {
          this.isLoading = false;
          this.$swal({
            title: "<strong>Sucesso</strong>",
            type: "success",
            html: `Sua senha foi alterada com sucesso!`,
            focusConfirm: false,
            confirmButtonText: "Acessar",
            allowOutsideClick: false
          }).then(result => {
            this.$router.push("/login-anonimo");
          });
        });
      } catch (error) {
        this.isLoading = false;
        this.alertErrorGeneric(error.message || error);
      }
    },
    emitStage(stage) {
      this.$emit("changeStage", stage);
    },
    setStage(stage) {
      this.$emit("setStage", stage);
    }
  }
};
</script>