<template>
  <div>
    <ValidationObserver v-slot="{ invalid }" ref="formLogin" tag="form">
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
              <br />
              <button
                type="button"
                class="btn btn-block btn-link text-link"
                @click="emitStage(4)"
              >Esqueci minha senha</button>
            </div>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<style scoped lang="scss">
</style>
<script>
import LoginContratacaoMixin from "@/modules/LoginContratacao/Mixins/loginContratacaoMixin.js";
import { TheMask } from "vue-the-mask";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import controleAcessoService from "@/services/api-controle-acesso";
import contratacaoService from "@/services/api-contratacao";

export default {
  name: "Login",
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
  mounted() {
    this.$nextTick(() => {
      this.$refs.senha.focus();
    });
  },
  computed: {},
  created() {
    this.vm.cpf = this.coletaDados.cpf;
    this.vm.nascimento = this.coletaDados.nascimento
      .split("/")
      .reverse()
      .join("-");
    this.vm.senha = "";
  },
  methods: {
    async logar() {
      try {
        if (this.isLoading) return;
        const isValid = await this.$refs.formLogin.validate();
        if (!isValid) return;

        this.isLoading = true;

        let isMaiorIdade = this.isMaiorIdade(this.vm.nascimento);
        let isDependentes =
          this.coletaDados.dependentes && this.coletaDados.dependentes.length
            ? true
            : false;

        let body = {
          contratacao: {
            fluxoId: !isMaiorIdade ? "menorIdade" : "maiorIdade",
            planoId: this.plano.id,
            planoIdSinf: this.plano.idplano_sinf
          },
          titular: {
            cpf: this.vm.cpf,
            cpf_raiz: this.coletaDados.cpf || this.vm.cpf,
            nome: this.coletaDados.nome,
            email: this.coletaDados.email,
            nascimento: this.vm.nascimento,
            telefone: this.coletaDados.telefone
          },
          endereco: {
            cep: this.coletaDados.cep,
            estado: this.coletaDados.estado,
            cidade: this.coletaDados.cidade
          },
          profissao: this.coletaDados.profissao,
          entidade: this.coletaDados.entidade,
          dependentes: isDependentes ? this.coletaDados.dependentes : []
        };

        let cpf = this.vm.cpf.split(".").join("");
        cpf = cpf.split("-").join("");
        const login = await controleAcessoService.logar({
          cpf: cpf,
          senha: this.vm.senha
        });

        let response = await contratacaoService.post(body);
        this.$nextTick(() => {
          this.isLoading = false;
          // this.alertSuccessGeneric("Usuário autenticado com sucesso!");
          this.$router.replace(
            "/contratacao/" + response.data.Proposta.nrProposta + "/cadastro"
          );
        });
      } catch (error) {
        this.isLoading = false;
        this.alertErrorGeneric(error.message || error);
      }
    },
    emitStage(stage) {
      this.$emit("changeStage", stage);
    }
  }
};
</script>