<template>
  <div class="mt-4 d-flex flex-column align-items-center">
    <div class="col-12 col-md-6 col-lg-5 col-xl-4 d-flex flex-column align-items-center">
      <div class="image-circle mb-4">
        <img src="@/assets/images/icon/icon-hearth.svg" alt />
      </div>
      <h2 class="text-center">Declaração pessoal de saúde</h2>
      <p class="text-center">
        As próximas questões serão relacionadas a sua saúde, responde o mais próximo da realidade. Caso você tenha alguma dúvida
        <b>leia a carta da ANS abaixo</b>:
      </p>
    </div>

    <div class="d-flex flex-column w-100 align-items-center mb-3">
      <simplebar class="carta-ans-content mb-2" data-simplebar-auto-hide="false">
        <h2>CARTA DE ORIENTAÇÃO AO BENEFICIÁRIO</h2>

        <p>Prezado (a) Beneficiário (a),</p>

        <p>
          <b>A Agência Nacional de Saúde Suplementar (ANS)</b>, instituição que regula as atividades das
          operadoras de planos privados de assistência à saúde,e tem como missão defender o interesse público vem,por meio
          desta,prestar informações para o preenchimento da DECLARAÇÃO DE SAÚDE.
        </p>

        <div class="text-block">
          <h3>O QUE É A DECLARAÇÃO DE SAÚDE?</h3>
          <p>
            É o formulário que acompanha o Contrato do Plano de Saúde,onde o beneficiário ou seu representante legal deverá
            informar as doenças ou lesões preexistentes que saiba ser portador ou sofredor no momento da contratação do
            plano. Para o seu preenchimento,o beneficiário tem o direito de ser orientado, gratuitamente, por um médico
            credenciado/referenciado pela operadora. Se optar por um profissional de sua livre escolha,assumirá o custo
            desta opção.
          </p>
          <p>
            Portanto, se o beneficiário (você) toma medicamentos regularmente,consulta médicos por problema de saúde do qual
            conhece o diagnóstico, fez qualquer exame que identificou alguma doença ou lesão, esteve internado ou
            submeteu-se a alguma cirurgia, DEVE DECLARAR ESTA DOENÇA OU LESÃO.
          </p>
        </div>
        <div class="text-block">
          <h3>AO DECLARAR AS DOENÇAS E/OU LESÕES QUE O BENEFICIÁRIO SAIBA SER PORTADOR NO MOMENTO DA CONTRATAÇÃO</h3>
          <ul>
            <li>
              <p>
                A operadora NÃO poderá impedi-lo de contratar o plano de saúde. Caso isto ocorra, encaminhe a denúncia à
                ANS.
              </p>
            </li>
            <li>
              <p>
                A operadora deverá oferecer: cobertura total ou COBERTURA PARCIAL TEMPORÁRIA (CPT), podendo ainda oferecer o
                Agravo, que é um acréscimo no valor da mensalidade, pago ao plano privado de assistência à saúde, para que
                se possa utilizar toda a cobertura contratada, após os prazos de carências contratuais.
              </p>
            </li>
            <li>
              <p>
                No caso de CPT, haverá restrição de cobertura para cirurgias, leitos de alta tecnologia (UTI, unidade
                coronariana ou neonatal) e procedimentos de alta complexidade – PAC (tomografia, ressonância, etc. *)
                EXCLUSIVAMENTE relacionados à doença ou lesão declarada, até 24 meses, contados desde a assinatura do
                contrato. Após o período máximo de 24 meses da assinatura contratual, a cobertura passará a ser integral de
                acordo com o plano contratado.
              </p>
            </li>
            <li>
              <p>
                NÃO haverá restrição de cobertura para consultas médicas, internações não cirúrgicas, exames e procedimentos
                que não sejam de alta complexidade, mesmo que relacionados à doença ou lesão preexistente declarada, desde
                que cumpridos os prazos de carências estabelecidas no contrato.
              </p>
            </li>
            <li>
              <p>
                Não caberá alegação posterior de omissão de informação na Declaração de Saúde por parte da operadora para
                esta doença ou lesão.
              </p>
            </li>
          </ul>
        </div>

        <div class="text-block">
          <h3>AO NÃO DECLARAR AS DOENÇAS E/OU LESÕES QUE O BENEFICIÁRIO SAIBA SER PORTADOR NO MOMENTO DA CONTRATAÇÃO:</h3>
          <ul>
            <li>
              <p>
                A operadora poderá suspeitar de omissão de informação e, neste caso, deverá comunicar imediatamente ao
                beneficiário, podendo oferecer CPT, ou solicitar abertura de processo administrativo junto à ANS,
                denunciando a omissão da informação.
              </p>
            </li>
            <li>
              <p>
                Comprovada a omissão de informação pelo beneficiário, a operadora poderá RESCINDIR o contrato por FRAUDE e
                responsabilizá-lo pelos procedimentos referentes a doença ou lesão não declarada.
              </p>
            </li>
            <li>
              <p>
                Até o julgamento final do processo pela ANS, NÃO poderá ocorrer suspensão do atendimento nem rescisão do
                contrato. Caso isto ocorra, encaminhe a denúncia à ANS.
              </p>
            </li>
          </ul>
        </div>

        <div class="text-block">
          <p>
            <b>ATENÇÃO!</b> Se a operadora oferecer redução ou isenção de carência, isto não significa que dará cobertura
            assistencial para as doenças ou lesões que o beneficiário saiba ter no momento da assinatura contratual. Cobertura Parcial Temporária - CPT - NÃO é carência!
            <br />Portanto, o beneficiário não deve deixar de informar se
            possui alguma doença ou lesão ao preencher a Declaração de Saúde!
          </p>
        </div>
        <p>
          Para consultar a lista completa de procedimentos de alta complexidade – PAC, acesse o Rol de Procedimentos e Eventos em Saúde da ANS no endereço eletrônico:
          <b>
            <a href="https://www.ans.gov.br/">www.ans.gov.br</a> - Perfil Beneficiário
          </b>. Em caso de dúvidas, entre em contato com a ANS pelo telefone 0800-701-9656 ou consulte a página da ANS -
          <b>
            <a href="https://www.ans.gov.br/">www.ans.gov.br</a> - Perfil Beneficiário.
          </b>
        </p>
      </simplebar>
      <b-form-checkbox
        id="checkbox-1"
        name="checkbox-1"
        @change="updateAcceptAns($event)"
        v-model="acceptAns"
        :unchecked-value="false"
      >Li e estou ciente das informações acima</b-form-checkbox>
    </div>

    <div class="col-12 col-md-6 col-lg-5 col-xl-4 d-flex flex-column align-items-center">
      <div class="w-100 mt-4">
        <b-form-radio
          name="tipo-dps"
          value="DpsOnline"
          v-model="tipoDps"
          @change="updateTipoDps($event)"
          class="text-radio"
          :disabled="!acceptAnsState"
        >Dispensei a presença de um médico orientador</b-form-radio>

        <div class="mt-3">
          <div class="mb-2">
            <button
              class="button-more"
              @click="collapse = !collapse"
            >{{!collapse ? '+ Ver mais' : '- Ocultar'}}</button>
          </div>
          <div class="mb-3 col" v-show="collapse">
            <b-form-radio
              class="text-radio text-radio--size mb-2"
              name="tipo-dps"
              value="DpsOperadora"
              v-model="tipoDps"
              @change="updateTipoDps($event)"
              :disabled="!acceptAnsState"
            >Optei por ser orientado por um médico indicado pela Operadora</b-form-radio>
            <b-form-radio
              class="text-radio text-radio--size mb-2"
              name="tipo-dps"
              value="DpsParticular"
              v-model="tipoDps"
              @change="updateTipoDps($event)"
              :disabled="!acceptAnsState"
            >Optei por ser orientado por um médico de minha livre escolha e confiança</b-form-radio>
          </div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <router-link
          key="1"
          v-if="tipoDps == 'DpsOperadora'"
          :class="{'disabled' : buttonHasActive}"
          class="mt-4 btn-next-step btn btn-primary btn-block btn-width mb-5"
          tag="a"
          :to="{ name: 'AgendamentoDps' }"
        >Agendar</router-link>
        <router-link
          key="2"
          v-else-if="tipoDps == 'DpsParticular'"
          class="mt-4 btn-next-step btn btn-primary btn-block btn-width mb-5"
          :class="{'disabled' : buttonHasActive}"
          tag="a"
          :to="{ name: 'EmailDps' }"
        >Avançar</router-link>
        <router-link
          v-else
          key="3"
          class="mt-4 btn-next-step btn btn-primary btn-block btn-width mb-5"
          :class="{'disabled' : buttonHasActive}"
          tag="a"
          :to="{ name: 'CadastroDps' }"
        >Avançar</router-link>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import axios from "axios";
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

// services
import contratacaoService from "@/services/api-contratacao";
import dpsService from "@/services/api-dps.js";

export default {
  name: "CartaAns",
  data() {
    return {
      pdfData: null,
      acceptAns: false,
      tipoDps: null,
      collapse: false
    };
  },
  computed: {
    ...mapGetters({
      titular: "DeclaracaoPessoalSaude/getDataTitular",
      acceptAnsState: "DeclaracaoPessoalSaude/getAcceptAns",
      tipoDpsState: "DeclaracaoPessoalSaude/getTipoDps",
      dadosContratacao: "DeclaracaoPessoalSaude/getDadosContratacao"
    }),
    nrProposta() {
      return this.$route.params.nrProposta;
    },
    buttonHasActive() {
      return !this.tipoDps || !this.acceptAnsState;
    }
  },
  methods: {
    collapseTest() {
      if (!(this.tipoDps == "DpsOnline")) {
        this.collapse = true;
      }
    },
    updateAcceptAns(value) {
      this.$store.commit("DeclaracaoPessoalSaude/updateAcceptAns", value);
    },
    updateTipoDps(value) {
      this.$store
        .dispatch("DeclaracaoPessoalSaude/updateTipoDps", value)
        .then(() => {
          this.saveTipoDps();
        });
    },
    async saveTipoDps() {
      try {
        let payload = {
          idPessoa: this.titular.id,
          NumeroProposta: this.nrProposta,
          titular: this.titular.titular,
          TipoDPS: this.tipoDps,
          DPS: this.titular.DPS
        };

        const { data } = await dpsService.put(payload);
        this.collapseTest();
      } catch (error) {
        console.error(error);
      }
    },
    async getFormData() {
      try {
        let response = await dpsService.getByProposta(this.nrProposta);

        // commito os valores que vieram da requisição e armazeno no meu state;
        await this.$store.dispatch("DeclaracaoPessoalSaude/updateFormData", response.data)
         this.saveTipoDps();

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
          await this.$store.dispatch("DeclaracaoPessoalSaude/updateDadosContratacao",response.data)
          console.log(this.tipoDpsState);
          this.tipoDps = this.tipoDpsState;
          this.getFormData();
        }
      } catch (error) {
        console.log("contratacao, vuex: ",  this.tipoDpsState)
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
    }
  },
  mounted() {
    this.getContratacao();
    this.acceptAns = this.acceptAnsState;
  },
  components: {
    simplebar
  }
};
</script>

<style scoped lang="scss">
.carta-ans-content {
  width: 100%;
  height: 60vh;
  border: 1px solid var(--quali-light-gray);
  border-radius: 10px;
  padding: 10px 14px 10px 10px;
  -ms-overflow-style: none !important;
  @media (min-width: 992px) {
    height: 400px;
  }
  ul {
    padding-left: 24px;
  }
  p {
    font-size: 14px;
    a {
      text-decoration: underline;
      color: #000;
    }
  }
  .text-block {
    margin-bottom: 20px;
    border: 1px solid var(--quali-light-gray);
    padding: 5px;
  }
  // h2 {
  //   font-size: 16px;
  // }
  // h3 {
  //   font-size: 14px;
  // }
  // p {
  //   font-size: 12px;
  // }
}
.image-circle {
  border-radius: 100%;
  width: 106px;
  height: 106px;
}
.text-radio {
  font-size: 16px;
  font-weight: bold;
  &--size {
    font-weight: normal;
    font-size: 12px;
  }
}

.button-more {
  font-size: 14px;
  padding: 5px 5px;
  outline: none;
  background: none;
  border: 0;
  color: #005883;
  text-decoration: none;
  font-weight: bold;
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
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
