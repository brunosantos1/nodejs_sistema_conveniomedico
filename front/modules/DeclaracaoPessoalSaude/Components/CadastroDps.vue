<template>
  <div class="mt-5 mb-5 row justify-content-center">
    <Loader class="mt-5" v-if="!formData"></Loader>
    <div class="col-12 col-sm-12 col-md-12 col-lg-6" v-else>
      <div>
        <h1>Declaração pessoal de saúde</h1>
        <p>Para prosseguir, preencha os dados abaixo. Qualquer dúvida você pode acionar nosso chat exclusivo.</p>
      </div>
      <div>
        <ValidationObserver ref="myForm" tag="form">
          <h2 class="mb-4 mt-4">Informe as medidas do grupo</h2>
          <!-- inicio pergunta -->
          <div class="mb-5 mxwidth">
            <div class="d-flex justify-content-end mb-2">
              <div class="d-flex justify-content-around title-inputs">
                <div>altura(cm)</div>
                <div>peso(kg)</div>
              </div>
            </div>
            <div v-for="(pessoa, indexPessoa) in formData.idPessoa" :key="pessoa.id" class="item-dep">
              <!-- tipo texto -->
                  <TextInput
                  @changeValue="submit(indexPessoa)"
                  v-model="model.modelMedidas[indexPessoa]"
                  :titulo="pessoa.nome"
                ></TextInput>
              
              <!-- tipo texto -->
            </div>
          </div>
          <!-- fim Pergunta -->
          <h2 class="mb-4">Questões sobre sua saúde</h2>
          <!-- inicio pergunta -->
          <div
            class="mb-5"
            v-for="(pergunta, indexPergunta) in formData.saude"
            :key="pergunta.CodigoPergunta"
          >
            <p>
              {{indexPergunta + 1}}.
              <span v-html="pergunta.Pergunta"></span>
            </p>
            <div v-for="(pessoa, indexPessoa) in formData.idPessoa" :key="pessoa.id" class="mb-2 item-dep">
              <!-- tipo radio -->
                <RadioWithText
                  @changeValue="submit(indexPessoa)"
                  v-model="model.modelSaude[indexPessoa].DPS[indexPergunta]"
                  :titulo="pessoa.nome"
                ></RadioWithText>
              <!-- tipo radio -->
            </div>
          </div>
          <!-- fim Pergunta -->

          <router-link
            class="btn btn-primary btn-block btn-width"
            :class="{'disabled' : !acceptedData}"
            @click.prevent="submit()"
            :to="{name: 'Pagamento'}"
          >Enviar Declaração</router-link>
         <div class="d-flex justify-content-center">
            <b-form-checkbox
            class="mt-3"
            v-model="acceptedData"
            :value="true"
            :unchecked-value="false"
          >Estou de acordo que as informações fonecidades são verdadeiras.</b-form-checkbox>
         </div>
          <p class="info-text"></p>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// services
import contratacaoService from "@/services/api-contratacao";
import dpsService from "@/services/api-dps.js";

// componentes
// import Pergunta from "./Pergunta";
import RadioWithText from "./RadioWithText";
import TextInput from "./TextInput";
import Loader from "@/modules/Global/Components/Loader";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { setTimeout } from "timers";

export default {
  name: "CadastroDps",
  data() {
    return {
      model: null,
      formData: null,
      acceptedData: false
    };
  },
  computed: {
    ...mapGetters({
      perguntas: "DeclaracaoPessoalSaude/getFormData",
      tipoDpsState: "DeclaracaoPessoalSaude/getTipoDps"
    }),
    nrProposta() {
      return this.$route.params.nrProposta;
    },
    dpsIsCompleted() {
      return this.$refs.myForm.ctx.valid;
    },
    formHasAnswer() {
      for (const pessoa of this.perguntas) {
        for (const pergunta of pessoa.DPS) {
          if (pergunta.Resposta.length > 0) {
            return true;
            break;
          }
        }
      }

      return false;
    }
  },
  methods: {
    async submit(indexPessoa) {
      try {
        let payload = this.formatPayload(this.model);
        payload = this.validPayload(payload);
        const { data } = await dpsService.put(payload[indexPessoa]);
      } catch (error) {
        this.$swal({
          toast: true,
          type: "warning",
          position: "top-end",
          showConfirmButton: false,
          title: "Falha ao salvar a DPS",
          timer: 5000
        });
        console.error(error);
      }
    },
    validForm() {
      if (this.formHasAnswer) {
        setTimeout(() => this.$refs.myForm.validate(), 500);
      }
    },
    validPayload(payload) {
      let newPayload = JSON.parse(JSON.stringify(payload));
      for (const pessoa of newPayload) {
        for (const pergunta of pessoa.DPS) {
          if (
            pergunta.TipoResposta === "sim/não" &&
            pergunta.Resposta === "SIM"
          ) {
            if (
              pergunta.Especificacoes.length === 0 ||
              pergunta.DataEvento.length === 0
            ) {
              pergunta.Resposta = "";
            }
          }
        }
      }
      return newPayload;
    },

    // formato a minha model para o payload a ser enviado
    formatPayload(obj) {
      let { modelMedidas, modelSaude } = JSON.parse(JSON.stringify(obj));
      const payload = [];
      for (const itemSaude of modelSaude) {
        for (const itemMedidas of modelMedidas) {
          if (itemSaude.id === itemMedidas.id) {
            delete itemSaude.nome;
            itemSaude.idPessoa = itemSaude.id;
            delete itemSaude.id;
            itemSaude.TipoDPS = this.tipoDpsState;
            itemSaude.NumeroProposta = this.nrProposta;

            itemSaude.DPS = [...itemSaude.DPS, ...itemMedidas.DPS];
            payload.push(itemSaude);
          }
        }
      }

      return payload;
    },

    // crio o modelo do meu formulario
    formatFormData() {
      // pego value do questionario do vuex
      let obj = JSON.parse(JSON.stringify(this.perguntas));
      let formData = {};

      const pessoas = obj.map(({ id, nome }) => {
        return { id, nome };
      });

      formData = { idPessoa: pessoas, saude: [] };

      for (const item of obj[0].DPS) {
        if (
          item.TipoResposta === "sim/não" ||
          item.TipoResposta === "SIM/NÃO"
        ) {
          formData.saude.push(item);
        }
      }

      this.formData = formData;
    },

    // crio o modelo da minha model
    formatModel() {
      let obj = JSON.parse(JSON.stringify(this.perguntas));
      let model = { modelMedidas: [], modelSaude: [] };

      for (const pessoa of obj) {
        let newObj = JSON.parse(JSON.stringify(pessoa));
        newObj.DPS = newObj.DPS.filter(
          item =>
            item.TipoResposta === "sim/não" || item.TipoResposta === "SIM/NÃO"
        );
        model.modelSaude.push(newObj);
      }

      for (const pessoa of obj) {
        let newObj = JSON.parse(JSON.stringify(pessoa));
        newObj.DPS = pessoa.DPS.filter(
          item =>
            item.TipoResposta === "decimal" || item.TipoResposta === "numerico"
        );

        const orderMedidas = JSON.parse(JSON.stringify(newObj.DPS));
        for (const item of orderMedidas) {
          if (item.TipoResposta === "numerico") {
            newObj.DPS[1] = item;
          } else {
            newObj.DPS[0] = item;
          }
        }

        model.modelMedidas.push(newObj);
      }

      this.model = model;
    },

    async getContratacao() {
      try {
        let response = await contratacaoService.get(this.nrProposta);

        if (!response || !response.data) {
          this.$swal({
            toast: true,
            type: "warning",
            position: "top-end",
            showConfirmButton: false,
            title: "Falha ao consultar a contratação",
            timer: 5000
          });
          // this.$router.push({ name: "LoginContratacao" });
        } else {
          // commito os valores que vieram da requisição e armazeno no meu state;
          await this.$store.dispatch(
            "DeclaracaoPessoalSaude/updateDadosContratacao",
            response.data
          );
          console.log(this.tipoDpsState);
          // this.tipoDps = this.tipoDpsState;
          this.getFormData();
        }
      } catch (error) {
        console.log("contratacao, vuex: ", this.tipoDpsState);
        this.$swal({
          toast: true,
          type: "warning",
          position: "top-end",
          showConfirmButton: false,
          title: "Falha ao consultar a contratação",
          timer: 5000
        });
        console.error(error);
      }
    },

    async getFormData() {
      try {
        let response = await dpsService.getByProposta(this.nrProposta);

        // commito os valores que vieram da requisição e armazeno no meu state;
        this.$store
          .dispatch("DeclaracaoPessoalSaude/updateFormData", response.data)
          .then(() => {
            this.formatModel();
            this.formatFormData();
            this.validForm();
          });
      } catch (error) {
        this.$swal({
          toast: true,
          type: "warning",
          position: "top-end",
          showConfirmButton: false,
          title: "Falha ao consultar a DPS",
          timer: 5000
        });
        console.error(error);
      }
    }
  },
  created() {
    this.getContratacao();
  },

  components: {
    Loader,
    ValidationProvider,
    ValidationObserver,
    TextInput,
    RadioWithText
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
// .mxwidth {
//   max-width: 350px;
// }
.item-dep {
  padding: 10px 5px 10px 10px;
  display: flex;
  align-items: center;
  &:nth-child(even){
    background-color: var(--quali-gray-blue);
  }
}
.info-text {
  color: #4d4d4d;
  font-size: 14px;
  padding: 10px 20px;
}
.title-inputs {
  width: 200px;
}
.invalid-feedback {
  display: block;
}
</style>

