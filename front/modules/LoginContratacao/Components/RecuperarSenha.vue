<template>
  <div>
    <ValidationObserver v-slot="{ invalid }" ref="formRecuperacao" tag="form">
      <form>
        <div class="row justify-content-center">
          <div class="col-12 col-sm-12 col-md-12 col-lg-4">
            <div class="container">
              <br />
              <h1 class="text-center">Recuperação de senha</h1>
              <ValidationProvider
                :name="'cpf'"
                :rules="'required|cpf'"
                v-slot="{ errors, changed }"
              >
                <div class="form-group">
                  <label :for="'cpf'">CPF</label>
                  <input
                    :type="'cpf'"
                    :readonly="true"
                    class="form-control"
                    v-bind:class="{'is-valid': !errors[0] && changed, 'is-invalid': errors[0]}"
                    :id="'cpf'"
                    :name="'cpf'"
                    v-model="vm['cpf']"
                  />
                  <div class="invalid-feedback">{{errors[0]}}</div>
                </div>
              </ValidationProvider>

              <ValidationProvider
                :name="'nascimento'"
                :rules="'required|nascimento'"
                v-slot="{ errors, changed }"
              >
                <div class="form-group">
                  <label :for="'nascimento'">Data de nascimento</label>
                  <input
                    :type="'date'"
                    :readonly="true"
                    class="form-control"
                    v-bind:class="{'is-valid': !errors[0] && changed, 'is-invalid': errors[0]}"
                    :id="'nascimento'"
                    :name="'nascimento'"
                    v-model="vm['nascimento']"
                  />
                  <div class="invalid-feedback">{{errors[0]}}</div>
                </div>
              </ValidationProvider>
              <br />
              <button
                ref="btnRecuperar"
                class="btn btn-primary btn-block"
                type="button"
                @click="recuperar()"
              >{{!isLoading ? 'Recuperar' : 'Enviando...'}}</button>
            </div>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin-bottom: 100px;
}
</style>
<script>
import LoginContratacaoMixin from "@/modules/LoginContratacao/Mixins/loginContratacaoMixin.js";
import { TheMask } from "vue-the-mask";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import controleAcessoService from "@/services/api-controle-acesso";

export default {
  name: "RecuperarSenha",
  mixins: [LoginContratacaoMixin],
  components: {
    TheMask,
    ValidationObserver,
    ValidationProvider
  },
  props: {
    coletaDados: Object,
    plano: Object
  },
  data() {
    return {
      vm: Object,
      isLoading: false
    };
  },
  mounted() {},
  computed: {},
  created() {
    this.vm.cpf = this.coletaDados.cpf;
    this.vm.email = this.coletaDados.email;
    this.vm.nascimento = this.coletaDados.nascimento
      .split("/")
      .reverse()
      .join("-");
  },
  methods: {
    async recuperar() {
      try {
        if (this.isLoading) return;
        const isValid = await this.$refs.formRecuperacao.validate();
        if (!isValid) return;
        this.isLoading = true;

        let cpf = this.vm.cpf.split(".").join("");
        cpf = cpf.split("-").join("");
        let recupera = await controleAcessoService.solicitarSenha({
          cpf: cpf,
          dataNascimento: this.vm.nascimento
        });
        this.$nextTick(() => {
          this.isLoading = false;
          let email = this.emailMask(this.vm.email);
          this.$swal({
            title: "<strong>Sucesso</strong>",
            type: "success",
            html: `Um link para criação de uma nova senha foi enviado para o e-mail ${email}`,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: "Reenviar",
            cancelButtonText: "Login",
            allowOutsideClick: false
          }).then(result => {
            if (result.value) {
              this.recuperar();
            } else {
              this.emitStage(2);
              this.setStage([1, 2]);
            }
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