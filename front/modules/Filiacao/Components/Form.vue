<template>
<div>
  <div v-if="!complete" style='max-width:400px;margin:auto;text-align:center'>
    <br /><br /> <br /><br />
    <img src="../../../assets/icon_document.png" />
    <br />
    <br />
    <h2>Chegou a hora da filiação</h2>
    <p>Para continuar é necessário fazer a filiação junto a sua entidade.
      Para isso clique no botão abaixo e preencha a ficha necessária.</p>
      <br />
      <button class="btn btn-primary" @click="filiar()">Quero fazer a minha filiação</button>
      <div>
        <br />
        <router-link :to="{name: 'DeclaracaoPessoalSaude'}" style='margin-left:12px'>Continuar sem a filiação</router-link>
      </div>
  </div>
  <div v-else style='max-width:400px;margin:auto;text-align:center'>
    <br /><br /> <br /><br />
    <img src="../../../assets/icon_document.png" />
    <br />
    <br />
    <h2>Filiação concluída</h2>
    <p>Texto</p>
      <button class="btn btn-primary" @click="baixarPdf">Baixar pdf</button>
      <router-link class="btn btn-primary" :to="{name: 'DeclaracaoPessoalSaude'}" style='margin-left:12px'>Continuar processo</router-link>
  </div>

    <b-modal id="modal-1" centered  title = "Filiação" :hide-footer="true" data-backdrop="static">
      <div class="modal-body__wrapper">
        
        <h1 class="logo" title="UBE - Filiação" style='text-align:center'>
            <img src="../../../assets/ube.png" alt="Logo da UBE" style='width:100px !important' />
          </h1>

        <loader v-show="loading" class='fieldLoader' text="Carregando" />



        <div class v-if="etapa==1">
          <p>Dados do estabelecimento de ensino</p>
          

            <form >
              <div class="row">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                  <div class='form_row'>
                    <!--<h1>Título</h1>-->
                    <div class="row">
                      <div
                        class="form_item col-12 col-sm-12 col-md-12 col-lg-12"
                        
                      >
                            <div class="form-group">
                              <label for="nomeEscola">Nome Completo da Escola/Instituição</label>
                              <input
                                type="text"
                                class="form-control"
                                id="nomeEscola"
                                name="nomeEscola"
                                v-on:input="testeInput()"
                                v-model="formData[0].value"
                                v-validate="'required'"
                                v-bind:class="{'is-invalid': errors.has('nomeEscola')}"
                              />
                              
                              <div class="invalid-feedback" v-if="errors.has('nomeEscola')">{{errors.first('nomeEscola')}}</div>
                            </div>
                      </div>

                      <div class="form_item col-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="form-group">
                              <label for="serie">Série</label>
                              <input
                                type="text"
                                class="form-control"
                                id="serie"
                                name="serie"
                                v-on:input="testeInput()"
                                v-model="formData[1].value"
                                v-validate="'required'"
                                v-bind:class="{'is-invalid': errors.has('serie')}"
                              />
                              <div class="invalid-feedback" v-if="errors.has('serie')">{{errors.first('serie')}}</div>
                            </div>
                      </div>

                      <div class="form_item col-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="form-group">
                              <label for="serie">Turma</label>
                              <input
                                type="text"
                                class="form-control"
                                id="turma"
                                name="turma"
                                v-on:input="testeInput()"
                                v-model="formData[2].value"
                                v-bind:class="{'is-invalid': errors.has('turma')}"
                              />
                              <div class="invalid-feedback" v-if="errors.has('turma')">{{errors.first('turma')}}</div>
                            </div>
                      </div>

                      <div class="form_item col-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="form-group">
                              <label for="serie">Turno</label>
                              <input
                                type="text"
                                class="form-control"
                                id="turno"
                                name="turno"
                                v-on:input="testeInput()"
                                v-model="formData[3].value"
                                v-bind:class="{'is-invalid': errors.has('turno')}"
                              />
                              
                              <div class="invalid-feedback" v-if="errors.has('turno')">{{errors.first('turno')}}</div>
                            </div>
                      </div>

                      <div class="form_item col-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="form-group">
                              <!--<label for="serie"></label>-->
                              <!--<input v-model="formData[4].value" v-validate="'required'" type="radio" value="infantil"  id="tipoCurso" name="tipoCurso" v-on:input="testeInput()"   /> Ensino Infantil
                              <br><input v-model="formData[4].value" v-validate="'required'" type="radio" value="fundamental"  id="tipoCurso" name="tipoCurso" v-on:input="testeInput()"   /> Ensino Fundamental                       
                              <br><input v-validate="'required'" type="radio" value="medio"  id="tipoCurso" name="tipoCurso" v-on:input="testeInput()" v-model="formData[4].value"  /> Ensino Médio
                              <br><input v-validate="'required'"  type="radio" value="universitario"  id="tipoCurso" name="tipoCurso" v-on:input="testeInput()" v-model="formData[4].value"  /> Universitário                                                
                              -->
                              <b-form-radio v-model="formData[4].value" v-validate="'required'" type="radio" value="infantil" name="tipoCurso" v-on:input="testeInput()" >Ensino Infantil</b-form-radio> 
                              <b-form-radio v-model="formData[4].value" v-validate="'required'" type="radio" value="fundamental" name="tipoCurso" v-on:input="testeInput()" >Ensino Fundamental</b-form-radio>
                              <b-form-radio v-model="formData[4].value" v-validate="'required'" type="radio" value="medio" name="tipoCurso" v-on:input="testeInput()" >Ensino Médio</b-form-radio>
                              <b-form-radio v-model="formData[4].value" v-validate="'required'" type="radio" value="universitario" name="tipoCurso" v-on:input="testeInput()" >Universitário</b-form-radio>

                              <div class="invalid-feedback" v-if="errors.has('tipoCurso')">{{errors.first('tipoCurso')}}</div>

                              <input
                                type="text"
                                class="form-control"
                                id="nomeCurso"
                                name="nomeCurso"
                                v-on:input="testeInput()"
                                v-model="formData[5].value"
                                v-if="formData[4].value=='universitario'"
                                v-validate="'required'"
                                placeholder="Curso"
                              />
                              

                              <div class="invalid-feedback" v-if="errors.has('nomeCurso')">{{errors.first('nomeCurso')}}</div>
                            </div>
                      </div>

                      <div class="form_item col-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="form-group">
                              
                              <!--<input
                                type="checkbox"
                                id="taxa"
                                name="taxa"
                                v-on:input="testeInput()"
                                v-model="formData[6].value"
                                v-validate="'required'"
                              /> TAXA DE FILIAÇÃO MENSAL: R$5,00 (R$60,00 ANUAL)-->


                              <b-form-checkbox
                                id="taxa"
                                name="taxa"
                                v-on:input="testeInput()"
                                v-model="formData[6].value"
                                v-validate="'required'">TAXA DE FILIAÇÃO MENSAL: R$5,00 (R$60,00 ANUAL)</b-form-checkbox>

                              <div style='font-size:12px'>
                                Declaro para todos os fins a veracidade das informações fornecidas, ciente da responsabilidade civil e
criminal e em tempo declaro estar ciente da taxa de filiação a ser cobrada juntamente com o plano de saúde.
                              </div>
                              
                              <div class="invalid-feedback" v-if="errors.has('taxa')">{{errors.first('taxa')}}</div>
                            </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </form>
            
            <div class="row justify-content-center">
              <div class>
                <button class="btn btn-primary" type="button" @click="aceitar">Aceitar e continuar</button>
              </div>
            </div>
          
        </div>
        <div class v-else-if="etapa==2"> 
          <br />
          <div>Informe o token que foi enviado para o seu email ou por SMS.</div> 
          <div>
            <input id="txttoken" v-model="txttoken" /> 
            <a  @click="reenviarToken" style='cursor:pointer;color:blue;margin-left:8px;font-size:12px;'>Reenviar Token</a>
            </div>
          <div style='color:red' class='token-error'>{{tokenValidationMessage}}</div>
          <br />
          <div><button id="enviarToken" @click="checkToken" class="btn btn-primary">Confirmar</button></div>
        </div>
        <div class v-else-if="etapa==3"> 
          <h2>Filiação concluida com sucesso!</h2>
        </div>


      </div>
    </b-modal>



  
  </div>
</template>

<style scoped lang="scss">
.invalid-feedback{display:block}
.v_errors{color:red}
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
import model from "@/modules/Contratacao/model.json";
import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import ContratacaoMixin from "@/modules/Contratacao/Mixins/contratacaoMixin.js";
import { mapMutations, mapGetters, mapActions } from "vuex";
import Select from "@/modules/Contratacao/Components/Select.vue";
// Services
import genericaService from "@/services/api-generica";
import contratacaoService from "@/services/api-contratacao";
import tokenService from "@/services/api-token";
import filiacaoService from "@/services/api-filiacao"
import documentService from "@/services/api-documento"
import Loader from "@/modules/Global/Components/Loader.vue";

export default {
  name: "Form",
  mixins: [CacheMixin, ContratacaoMixin],
  components: { TheMask, Select, Loader },
  data() {
    return {
      tokenValidationMessage: "",
      loading: false,
      userIP: "",
      etapa: "1",
      complete: false,
      filiacaoData: {},
      formData: [
        {
            "label": "Nome Completo da Escola/Instituição",
            "name": "nomeEscola",
            "value": "",
            "validation": "required",
            "type": "text"
        },
        {
            "label": "Série",
            "name": "serie",
            "value": "",
            "validation": "required",
            "type": "text"
        },
        {
            "label": "Turma",
            "name": "turma",
            "value": "",
            "type": "text"
        },
        {
            "label": "Turno",
            "name": "turno",
            "value": "",
            "validation": "",
            "type": "text"
        },
        {
            "label": "Tipo do curso",
            "name": "tipoCurso",
            "value": "",
            "validation": "required",
            "type": "radio"
        },
        {
            "label": "Nome do curso",
            "name": "nomeCurso",
            "value": "",
            "type": "text"
        },
        {
            "label": "Taxa de filiação",
            "name": "taxa",
            "value": "",
            "type": "text"
        }
    ],
      stageActive: {},
      nomeEscola: "bbb",
      txttoken: "",
      proposta: {},
      idProposta: ""
    };
  },
  computed: {

  },
  async created() {
    let nrProposta = this.$route.params.nrProposta;
    console.log('teste')
    console.log(nrProposta)

    
    let response = await contratacaoService.get(nrProposta);

    console.log(response)

    if (!response || !response.data) {
      //this.$router.push({ name: "LoginContratacao" });
      //return this.alertWarningGeneric("Proposta não encontrada");
      alert("Proposta não encontrada")
      window.location.href="/"
    } else {
      console.log("Proposta ok")
      this.proposta = response.data
      this.idProposta=nrProposta
    }
    

    this.createVm();
  },
  mounted() {
    this.$nextTick(() => {});
    console.log('monted')
    this.getUserIP(response => this.userIP = response);
  },
  methods: {
    async reenviarToken() {
      let response = await tokenService.gerarToken("Filiacao",this.idProposta);
      alert('Token reenviado')
    },
    async baixarPdf() {
      let dados = {
        "nrProposta":this.idProposta,
        "identificador":"filiacao_proposta",
        "tipoDocumento":"ComprovanteFiliacaoTitular"
      } 
      let result = await documentService.getDocumentoProposta(dados)
      window.open(result.data,"_blank")
      console.log(result)
    },
    async filiar() {
      this.$bvModal.show('modal-1')
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
    async aceitar(){
      
      const isValid = await this.$validator.validate() //this.$refs.observer.validate();
      if(isValid) {
        //alert('Correto. Todos os campos estão válidos.')

        let jsonFiliacao = {
          "nrProposta": this.idProposta,
          "instituicao": this.formData[0].value,
          "serie":this.formData[1].value,
          "turma": this.formData[2].value,
          "turno": this.formData[3].value,
          "tipoCurso": this.formData[4].value,
          "nomeCurso": this.formData[5].value
        }
        let filiacao = await filiacaoService.criarFiliacao(jsonFiliacao)
        this.filiacaoData = jsonFiliacao
        let response = await tokenService.gerarToken("Filiacao",this.idProposta);

        
        //this.$bvModal.show('modal-1')
        this.etapa="2"
      } else {
        //alert('Erros de validação')
      }
    },
    async checkToken(){
      //alert(this.txttoken)
      let data = {
        "token": this.txttoken,
        "ip": "",
        "proposta":this.idProposta,
        "localizacao": ""
      }
      let result
      
        console.log('tok')
      try {
        
        result = await tokenService.validarToken(data)
        
        console.log('tok2')
        if(result && result.data && result.data.message) {
          this.tokenValidationMessage = ""
          //alert("Token correto")
          this.complete = true

          var dNow = new Date();
          var dataFiliacao = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear();
          var horaFiliacao = dNow.getHours() + ':' + dNow.getMinutes();

          let dadosPdf = {
            "idProposta": this.idProposta,
            "proposta": this.proposta,
            "filiacao": this.filiacaoData,
            "ip": this.userIP,
            "dataFiliacao": dataFiliacao,
            "horaFiliacao": horaFiliacao

          }
          this.loading=true
          let responsePdf = await filiacaoService.gerarPdf(dadosPdf)
          this.loading=false
          this.etapa="3"
          this.$bvModal.hide('modal-1')

        } else {
          //alert("Token incorreto")
          this.tokenValidationMessage = "Token incorreto"
        }
      }
      catch(e) {
        result = false
        //alert("Token incorreto")
        this.tokenValidationMessage = "Token incorreto"
      }
      

    },
    testeInput(){
      //console.log(this.$store.state.Filiacao)
    },
    createVm() {
      
      var fieldList = [
        {
            "label": "Nome Completo da Escola/Instituição",
            "name": "nomeEscola",
            "value": "",
            "validation": "required",
            "type": "text"
        },
        {
            "label": "Série",
            "name": "serie",
            "value": "",
            "validation": "required",
            "type": "text"
        },
        {
            "label": "Turma",
            "name": "turma",
            "value": "",
            "type": "text"
        },
        {
            "label": "Turno",
            "name": "turno",
            "value": "",
            "validation": "",
            "type": "text"
        },
        {
            "label": "Tipo do curso",
            "name": "tipoCurso",
            "value": "",
            "validation": "required",
            "type": "radio"
        },
        {
            "label": "Nome do curso",
            "name": "nomeCurso",
            "value": "",
            "type": "text"
        },
        {
            "label": "Taxa de filiação",
            "name": "taxa",
            "value": "",
            "type": "text"
        }
    ]
    this.formData=fieldList
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