<template>
<div class="mt-5 mb-5 row justify-content-center">
  <div class="col-12 col-sm-12 col-md-12 col-lg-6">
    
	<!--<br /><br /> <br /><br />
    <img src="../../../assets/icon_document.png" />
    <br />
    <br />
    <h2>Chegou a hora da filiação</h2>
    <p>Para continuar é necessário fazer a filiação junto a sua entidade.
      Para isso clique no botão abaixo e preencha a ficha necessária.</p>
      <button class="btn btn-primary" @click="filiar()">Quero fazer a minha filiação</button>
	  -->
	  
	  <h1>Pagamento</h1>
      <div class="modal-body__wrapper">
        <loader v-show="loading" class='fieldLoader' text="Carregando" />
        <div class>
          <p>Para continuar, precisamos que você informe alguns dados sobre o pagamento do plano.</p>
          
          <h2 class="mt-4">Forma de pagamento</h2>
          
          <b-form-radio v-on:change="radioChange()" v-model="formData[0].value" v-validate="'required'" type="radio" value="debito" name="formaPagamento">Débito em conta corrente</b-form-radio> 
          <b-form-radio  v-on:change="radioChange()" v-model="formData[0].value" v-validate="'required'" type="radio" value="boleto" name="formaPagamento">Boleto</b-form-radio>       

            <form class="mt-4">
              <div class="row">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                  <div class='form_row'>
                    <!--<h1>Título</h1>-->
                    <div class="row" v-if="formData[0].value=='debito'">
                      <div
                        class="form_item col-12 col-sm-12 col-md-12 col-lg-12"
                        
                      >
                            <div class="form-group">
                              <label for="banco">Banco</label>

                              <select v-bind:class="{'is-invalid': errors.has('banco')}"  class="form-control" v-on:blur="validarConta" id="banco" name="banco" v-model="formData[1].value" v-on:change="replicarDados()" >
                                <option v-for="option in optionsDebito" v-bind:value="option.value" v-bind:key="option.value">
                                  {{ option.text }}
                                </option>
                              </select>
                              <!-- {{formData[1].value}}
                              <v-select :options="optionsDebito" :class="['form-control',{'is-invalid': errors.has('banco')}]" label="text" :reduce="option => option.value" @change="replicarDados()" @blur="validarConta" v-model="formData[1].value">
                                  <template slot="option" slot-scope="option">
                                    <span><img width="20px" src="https://logospng.org/download/itau/logo-itau-256.png" alt=""></span>
                                    {{option.text}}
                                  </template>
                              </v-select> -->

                              <div class="invalid-feedback" v-if="errors.has('banco')">{{errors.first('banco')}}</div>
                              
                            </div>
                          
                        
                      </div>

                      <div class="form_item col-5 col-sm-5 col-md-5 col-lg-5">
                            <div class="form-group">
                              <label for="agencia">Agência</label>
                              <input
                                type="text"
                                class="form-control"
                                id="agencia"
                                name="agencia"
                                v-on:input="replicarDados()"
                                v-model="formData[2].value"
                                
                                v-on:blur="validarConta"
                                v-bind:class="{'is-invalid': !!validacaoMensagem1}"
                              />
                              
                              <div class="invalid-feedback" v-if="errors.has('agencia')">{{errors.first('agencia')}}</div>
                              
                            </div>
                      </div>

                      <div class="form_item col-7 col-sm-7 col-md-7 col-lg-7">
                            <div class="form-group">
                              <label for="contaCorrente">Conta corrente</label>
                              <input
                                type="text"
                                class="form-control"
                                id="contaCorrente"
                                name="contaCorrente"
                                v-on:input="replicarDados()"
                                v-model="formData[3].value"
                                v-on:blur="validarConta"
                                v-bind:class="{'is-invalid': !!validacaoMensagem1}"
                              />
                              <!-- <div class="invalid-feedback" v-if="errors.has('contaCorrente')">{{errors.first('contaCorrente')}}</div> -->
                            </div>
                      </div>

                      <div class="form_item col-12 col-sm-12 col-md-12 col-lg-12">
                          <div class="form-group">
                              <div class="invalid-feedback" v-if="!validacaoConta1"><span v-html="validacaoMensagem1"></span></div>
                          </div>
                      </div>
                      

                    </div>
                    <h2>Reembolso</h2>
                    <p>Se desejar, informe os dados da conta para receber eventuais
                          reembolsos do seu plano.</p>
                  <div v-if="formData[0].value=='debito'"  >
                      <p>Utilizar a mesma conta informada para o débito automático?</p>
                      <b-form-radio  v-on:change="replicarDados(true)" v-model="formData[7].value" value="sim" name="reembcopy">Sim</b-form-radio>
                
                      <b-form-radio  v-model="formData[7].value" value="nao" name="reembcopy" v-on:change="limparReemb()">Não</b-form-radio> 
                  </div>

                    <div class="row mt-4">
                      <!--
                      -->
                          <div
                            class="form_item col-12 col-sm-12 col-md-12 col-lg-12"
                          >
                            <div class="form-group">
                              <label for="reembolsoBanco">Banco</label>
                              <select v-bind:class="{'is-invalid': errors.has('reembolsoBanco')}" v-on:blur="validarConta" :disabled="formData[7].value=='sim' && formData[0].value=='debito'" class="form-control" id="reembolsoBanco" name="reembolsoBanco" v-model="formData[4].value" >
                                <option v-for="option in optionsDebito" v-bind:value="option.value" v-bind:key="option.value">
                                  {{ option.text }}
                                </option>
                              </select>
                              <div class="invalid-feedback" v-if="errors.has('reembolsoBanco')">{{errors.first('reembolsoBanco')}}</div>
                            </div>
                          </div>

                          <div class="form_item col-5 col-sm-5 col-md-5 col-lg-5">
                            <div class="form-group">
                              <label for="reembolsoAgencia">Agência</label>
                              
                              <input type="text" v-bind:class="{'is-invalid': !!validacaoMensagem2}" v-on:blur="validarConta" :readonly="formData[7].value=='sim' && formData[0].value=='debito'" class="form-control" id="reembolsoAgencia" name="reembolsoAgencia" v-model="formData[5].value"  />
                              <p class="v_errors" v-if="errors.has('reembolsoAgencia')">{{errors.first('reembolsoAgencia')}}</p>
                              <div class='invalid-feedback'></div>
                            </div>
                          </div>

                          <div class="form_item col-7 col-sm-7 col-md-7 col-lg-7">
                            <div class="form-group">
                              <label for="reembolsoContaCorrente">Conta Corrente</label>
                              <input type="text" v-bind:class="{'is-invalid': !!validacaoMensagem2}" v-on:blur="validarConta" :readonly="formData[7].value=='sim' && formData[0].value=='debito'" class="form-control" id="reembolsoContaCorrente" name="reembolsoContaCorrente" v-model="formData[6].value"  />
                              <div class='invalid-feedback' v-if="errors.has('reembolsoContaCorrente')">{{errors.first('reembolsoContaCorrente')}}</div>
                            </div>
                          </div>

                          <div class="form_item col-12 col-sm-12 col-md-12 col-lg-12">
                              <div class="form-group">
                                  <div class="invalid-feedback" v-if="!validacaoConta2"><span v-html="validacaoMensagem2"></span></div>
                              </div>
                          </div>
                          
                          </div>
                          

                        <button class="btn btn-primary w-100 mt-2" type="button" @click="aceitar">Continuar</button>


                      </div>
                </div>
              </div>
            </form>
            
            
          
        </div>
        


      </div>
    
	  
	  
  </div>
  

    



  
  </div>
</template>

<style scoped lang="scss">
.v_errors{color:red};
.container {
  margin-bottom: 10px;
}
form {
  margin-bottom: 70px;
}
.btn-primary.disabled,
.btn-primary:disabled {
  color: #fff;
  background-color: #0c5098;
  border-color: #80b4ea;
}
.btn-next {
  position: fixed;
  bottom: 40px;
  left: 5%;
}
</style>

<script>
import { TheMask } from "vue-the-mask";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import Select from "@/modules/Contratacao/Components/Select.vue";
// Services
import genericaService from "@/services/api-generica";
import contratacaoService from "@/services/api-contratacao";
import pagamentoService from "@/services/api-pagamento"
import Loader from "@/modules/Global/Components/Loader.vue";

export default {
  name: "Form",
  mixins: [CacheMixin],
  components: { TheMask, Select, Loader },
  data() {
    return {
      validacaoConta1: false,
      validacaoConta2: false,
      validacaoMensagem1: "",
      validacaoMensagem2: "",
      optionsDebito: [],
      options: [],
      tokenValidationMessage: "",
      loading: false,
      userIP: "",
      etapa: "1",
      complete: false,
      lastPagamentoData: {},
      pagamentoData: {},
      formData: [
        {
            "label": "Forma Pagamento",
            "name": "formaPagamento",
            "value": "debito",
            "validation": "required",
            "type": "text"
        },
        {
            "label": "Banco",
            "name": "banco",
            "value": "",
            "validation": "required",
            "type": "text"
        },
        {
            "label": "Agência",
            "name": "agencia",
            "value": "",
            "type": "text"
        },
        {
            "label": "Conta corrente",
            "name": "contaCorrente",
            "value": "",
            "validation": "required",
            "type": "text"
        },
        {
          "label": "Banco",
          "name": "reembolsoBanco",
          "value": "",
          "validation": "required",
          "type": "text"
        },
        {
          "label": "Agência",
          "name": "reembolsoAgencia",
          "value": "",
          "validation": "required",
          "type": "text"
        },
        {
          "label": "Conta corrente",
          "name": "reembolsoContaCorrente",
          "value": "",
          "validation": "required",
          "type": "text"
        },
		{
          "label": "Utilizar mesmos dados do débito no reembolso",
          "name": "reembCopy",
          "value": "nao",
          "validation": "",
          "type": "text"
        }
    ],
      proposta: {},
      idProposta: ""
    };
  },
  computed: {

  },
  async created() {
    //this.alertWarningGeneric("aaa")
    let nrProposta = this.$route.params.nrProposta;
    let resultPagamentos = await pagamentoService.listarFormas()
    if(resultPagamentos && resultPagamentos.data) {
      let optionsDebito1 = [];
      let dataPagamento = resultPagamentos.data
      // Débito
      console.log(dataPagamento[1])
      let formaDebito = dataPagamento[1]
      let bancosDebito = formaDebito.bancos
      optionsDebito1.push({
          'text': '',
          'value': ''
        })
      for(var i = 0; i<bancosDebito.length;i++)
      {
        let option1 = {
          'text': bancosDebito[i].CODIGO,
          'value': bancosDebito[i].IDBANCO
        }
        optionsDebito1.push(option1);
      }
      this.optionsDebito=optionsDebito1
      
      
    }
    
    let response = await contratacaoService.get(nrProposta);

    

    if (!response || !response.data) {
      //this.$router.push({ name: "LoginContratacao" });
      //return this.alertWarningGeneric("Proposta não encontrada");
      alert("Proposta não encontrada")
      window.location.href="/"
    } else {
      console.log("Proposta ok")
      this.proposta = response.data
      this.idProposta=nrProposta

      console.log('Carregando dados de pagamento');
      console.log(this.idProposta)
      let dadosPagamentoSalvos = await pagamentoService.carregarDados(this.idProposta)
      console.log(dadosPagamentoSalvos)
      if(dadosPagamentoSalvos && dadosPagamentoSalvos.data && dadosPagamentoSalvos.data.data) {
        this.lastPagamentoData = dadosPagamentoSalvos.data.data
        if(this.lastPagamentoData.pagamento && this.lastPagamentoData.pagamento.properties) {
          let pagamentoProperties = this.lastPagamentoData.pagamento.properties
          if(pagamentoProperties.Forma=="Débito") {
            this.formData[0].value = "debito"
          } else if(pagamentoProperties.Forma=="Boleto"){
            this.formData[0].value = "boleto"
          } else {
            this.formData[0].value = pagamentoProperties.Forma
          }
          this.formData[1].value = pagamentoProperties.Banco
          this.formData[2].value = pagamentoProperties.Agencia
          this.formData[3].value = pagamentoProperties.ContaCorrente
    }

        if(this.lastPagamentoData.reembolso && this.lastPagamentoData.reembolso.properties) {
          let reembolsoProperties = this.lastPagamentoData.reembolso.properties
          this.formData[4].value = reembolsoProperties.Banco
          this.formData[5].value = reembolsoProperties.Agencia
          this.formData[6].value = reembolsoProperties.ContaCorrente
        }

      } else {
        this.lastPagamentoData = {}
      }

    }
    this.createVm();
  },
  mounted() {
    this.$nextTick(() => {});
    console.log('monted')
    this.getUserIP(response => this.userIP = response);
  },
  methods: {
    
    async copiarDadosReemb(){
		console.log('copiar dados do débito para reembolso');
		this.formData[4].value=this.formData[1].value;
		this.formData[5].value=this.formData[2].value;
		this.formData[6].value=this.formData[3].value;
	},
    async validarConta() {
      console.log('Validar conta');
      
      let formaPagamento = this.formData[0].value
      let resultValid1 = true
      let resultValid2 = true
      let msg1 = ""
      let msg2 = ""
      let banco = this.formData[1].value
      let ag = this.formData[2].value
      let cc = this.formData[3].value

      let reembBanco = this.formData[4].value
      let reembAg = this.formData[5].value
      let reembCc = this.formData[6].value

      if(formaPagamento=='debito') {
        if(banco && ag && cc)
        {
          let proc1 = await pagamentoService.validarConta(banco,ag,cc)
		      resultValid1 = proc1.data
          console.log(resultValid1)
        } else if(!banco && !ag && !cc) {
          resultValid1 = true
        }

        if(resultValid1) {
            msg1 = ""
        } else {
            msg1 = "Os dados da conta de débito não são válidos. <br />"
        }
      }
      
      if(reembBanco && reembAg && reembCc) {
          let proc2 = await pagamentoService.validarConta(reembBanco,reembAg,reembCc)
          resultValid2 = proc2.data
      } else if (!reembBanco && !reembAg && !reembCc) {
        resultValid2 = true
      }
      if(resultValid2) {
          msg2 = ""
      } else {
          msg2 = "Os dados da conta de reembolso não são válidos. <br />"
      }
      /*if(resultValid1 && resultValid2) {
        this.validacaoConta = true
        this.validacaoMensagem = ""
      } else {
        this.validacaoConta = false
        this.validacaoMensagem = msg1 + msg2
      }*/

      if(resultValid1) {
        this.validacaoConta1 = true
        this.validacaoMensagem1 = ""
      } else {
        this.validacaoConta1 = false
        this.validacaoMensagem1 = msg1
      }

      if(resultValid2) {
        this.validacaoConta2 = true
        this.validacaoMensagem2 = ""
      } else {
        this.validacaoConta2 = false
        this.validacaoMensagem2 = msg2
      }

      return Math.random()
    },
    getUserIP(onNewIP) {
      var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      var pc = new myPeerConnection({
        iceServers: []
      }),
      noop = function() {},
      localIPs = {},
      ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;
      function iterateIP(ip) {
        if (!localIPs[ip]) {
          console.log('new')
          onNewIP(ip);
          
        }
        localIPs[ip] = true;
      }
      pc.createDataChannel("");
      pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
          if (line.indexOf('candidate') < 0) return;
          line.match(ipRegex).forEach(iterateIP);
        });
        pc.setLocalDescription(sdp, noop, noop);
      }).catch(function(reason) {
      });
      //listen for candidate events
      pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    },
    radioChange() {
      //alert(this.formData[0].value)
      this.validacaoMensagem = ""
    },
    async alertWarningGeneric(msg) {
      this.$swal({
        toast: true,
        type: "warning",
        position: "top-end",
        showConfirmButton: false,
        title: msg,
        timer: 5000
      });
    },
    async aceitar(){
      const isValid = await this.$validator.validate() //this.$refs.observer.validate();
      let test = await this.validarConta() 
      
      // Validação adicional 1
      let banco = this.formData[1].value
      let agencia = this.formData[2].value
      let cc = this.formData[3].value
      if(banco || agencia || cc) {
        // Se foi informado dados de pagamento de forma incompleta, considera como erro. 
        if((!banco || !agencia || !cc) && (this.formData[0].value=="debito")) {
          this.validacaoConta1 = false
          this.validacaoMensagem1 = "Os dados da conta de débito não são válidos."
        }  
      }


      // Validação adicional 2
      let reembBanco = this.formData[4].value
      let reembAg = this.formData[5].value
      let reembCc = this.formData[6].value
       if(reembBanco || reembAg || reembCc) {
        // Se foi informado reembolso de forma incompleta, considera como erro. 
        if(!reembBanco || !reembAg || !reembCc) {
          this.validacaoConta2 = false
          this.validacaoMensagem2 = "Os dados da conta de reembolso não são validos"
        }  
       }

      if(isValid && this.validacaoConta1 && this.validacaoConta2) {
        //alert('Correto. Todos os campos estão válidos.')
        let frmPagTxt = ''
        console.log('val1')
        
        if(this.formData[0].value=='debito')  {
          console.log('val2')
          frmPagTxt = 'Débito'

          if(!banco && !agencia && !cc) {
            
            if(this.lastPagamentoData.pagamento && this.lastPagamentoData.pagamento.properties) {
              // Se já tem pagamento salvo, ao não informar deve limpar
              console.log('...');
            } else {
              //skip - permite o usuário prosseguir sem informar os dados
                this.$router.push({
                  name: "ContratacaoDocumento",
                  params: this.idProposta
                });
                return;

            }
            

          }

        } else if(this.formData[0].value=='boleto') {
          frmPagTxt = 'Boleto'
          this.formData[1].value = "",
          this.formData[2].value = "",
          this.formData[3].value = ""

        }
        console.log('val3')
        console.log(this.formData[1].value)

        let jsonPagamento = {
          "NrProposta": this.idProposta,
          "Forma": frmPagTxt,
          "Banco": this.formData[1].value,
          "Agencia": this.formData[2].value,
          "ContaCorrente": this.formData[3].value,
          "ReembolsoBanco": this.formData[4].value,
          "ReembolsoAgencia": this.formData[5].value,
          "ReembolsoContaCorrente": this.formData[6].value
        }
        console.log(jsonPagamento)
        

        try {
          let responsePagamento = await pagamentoService.incluirFormaProposta(jsonPagamento)
          this.pagamentoData = jsonPagamento
          if(responsePagamento && responsePagamento.data && responsePagamento.data.success) {
            //alert('Pagamento incluído com sucesso');
            this.$router.push({
              name: "ContratacaoDocumento",
              params: this.idProposta
            });
          } else {
            //alert(responsePagamento)
            console.log(responsePagamento)
            if(responsePagamento && responsePagamento.data && responsePagamento.data.message)
            {
              alert(responsePagamento.data.message);
            } else {
              alert('Não foi possível salvar a forma de pagamento');
            }
            
          }
        } catch (e) {
          console.log(e)
          alert(e)
        }


        

        //let response = await tokenService.gerarToken("Filiacao",this.idProposta);
        //this.$bvModal.show('modal-1')
        //this.etapa="2"
      } else {
        console.log('Erros de validação')
        this.alertWarningGeneric("Preencha os campos corretamente.")
      }
    },
    async checkToken(){
    },
    replicarDados(force=false) {
      console.log(force)
      //console.log(this.$store.state.Filiacao)
      console.log('teste input')
      if(this.formData[0].value=='debito' && (this.formData[7].value=='sim' || force )) {
        this.formData[4].value = this.formData[1].value
        this.formData[5].value = this.formData[2].value
        this.formData[6].value = this.formData[3].value
      }
    },
    limparReemb() {
      
      this.formData[4].value = ""
      this.formData[5].value = ""
      this.formData[6].value = ""
    },
    createVm() {
      
      var fieldList = []
    //this.formData=fieldList
      //if (this.stageActive && this.stageActive.formularios) {
        //this.stageActive.formularios.forEach(s => {
          //this.$store.dispatch("Filiacao/createStoreFields", fieldList);
        //});
        //this.mergeFields();
      //}


    },
    mergeFields() {
      
    },
    changedField(nameModel, index, value) {
      /*this.$store.commit("Contratacao/updateDataField", {
        nameModel: nameModel,
        index: index,
        value: value
      });*/
    },
    changedSelect(obj) {
      /*this.$store.commit("Contratacao/updateDataField", {
        nameModel: obj.nameModel,
        index: obj.index,
        value: obj.value
      });*/
    }
  }
};
</script>

<style lang="scss" scoped>


.invalid-feedback {
  display: block;
}
</style>
