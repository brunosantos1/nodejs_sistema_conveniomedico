<template>
  <div>
    <ValidationObserver v-slot="{ invalid }" ref="formCadastro" tag="form">
      <form>
        <div class="row justify-content-center">
          <div class="col-12 col-sm-12 col-md-12 col-lg-4">
            <div class="container">
              <br />
              <h1 class="text-center">Cadastro de acesso</h1>
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
                    v-mask="'###.###.###-##'"
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
                :name="'nome'"
                :rules="'required|nome'"
                v-slot="{ errors, changed }"
              >
                <div class="form-group">
                  <label :for="'nome'">Nome completo</label>
                  <input
                    :type="'nome'"
                    :readonly="false"
                    class="form-control"
                    v-bind:class="{'is-valid': !errors[0] && changed, 'is-invalid': errors[0]}"
                    :id="'nome'"
                    :name="'nome'"
                    v-model="vm['nome']"
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
                    type="date"
                    :readonly="false"
                    class="form-control"
                    v-bind:class="{'is-valid': !errors[0] && changed, 'is-invalid': errors[0]}"
                    :id="'nascimento'"
                    :name="'nascimento'"
                    v-model="vm['nascimento']"
                  />
                  <div class="invalid-feedback">{{errors[0]}}</div>
                </div>
              </ValidationProvider>

              <ValidationProvider
                :name="'email'"
                :rules="'required|email'"
                v-slot="{ errors, changed }"
              >
                <div class="form-group">
                  <label :for="'email'">E-mail</label>
                  <input
                    :type="'email'"
                    :readonly="false"
                    class="form-control"
                    v-bind:class="{'is-valid': !errors[0] && changed, 'is-invalid': errors[0]}"
                    :id="'email'"
                    :name="'email'"
                    v-model="vm['email']"
                  />
                  <div class="invalid-feedback">{{errors[0]}}</div>
                </div>
              </ValidationProvider>
              <h3>Senha de acesso</h3>
              <ValidationProvider
                :name="'senha'"
                vid="senha"
                :rules="'required|senhaValid'"
                v-slot="{ errors, changed }"
              >
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
                  <label :for="'confimação de senha'">Confimação de senha</label>
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
                class="btn btn-primary btn-block"
                type="button"
                @click="logar()"
              >{{!isLoading ? 'Cadastrar' : 'Cadastrando...'}}</button>
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
import contratacaoService from "@/services/api-contratacao";
import controleAcessoService from "@/services/api-controle-acesso";
import {mask} from 'vue-the-mask'

export default {
  name: "Cadastro",
  mixins: [LoginContratacaoMixin],
   directives: {mask},
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
    this.vm.nome = this.coletaDados.nome;
    this.vm.email = this.coletaDados.email;
    this.vm.nascimento = this.coletaDados.nascimento
      .split("/")
      .reverse()
      .join("-");
    this.vm.senha = "";
    this.vm.senhaConfirma = "";
  },
  methods: {
    async logar() {
      try {
        if (this.isLoading) return;
        const isValid = await this.$refs.formCadastro.validate();
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
            nome: this.vm.nome,
            email: this.vm.email,
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

        const cadastro = await controleAcessoService.cadastrar({
          cpf: this.vm.cpf,
          senha: this.vm.senha,
          email: this.vm.email,
          dataNascimento: this.vm.nascimento,
          token: ""
        });

        let cpf = this.vm.cpf.split(".").join("");
        cpf = cpf.split("-").join("");
        const login = await controleAcessoService.logar({
          cpf: cpf,
          senha: this.vm.senha
        });

        let response = await contratacaoService.post(body);
        this.$nextTick(() => {
          this.isLoading = false;
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