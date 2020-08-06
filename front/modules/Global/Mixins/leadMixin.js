import { mapMutations, mapGetters, mapActions } from "vuex";
import { isMobile } from "mobile-device-detect";
import simulacaoService from "@/services/api-simulacao";

export default {
  data() {
    return {
      leadIP: '',
      leadInfos: {
        CPF: '',
        Veiculo: '',
        Formato: '',
        Campanha: '',
        DataSimulacao: '',
        Estado: '',
        CEP: '',
        Profissao: '',
        CodigoEntidade: '',
        Entidade: '',
        CodigoOperadora: '',
        Operadora: '',
        TipoAcomodacao: '',
        Reembolso: '',
        NomeCompleto: '',
        Email: '',
        DddProspect: '',
        Telefone: '',
        DataNascimento: '',
        AdicionaDependentes: false,
        QuantidadeDependentes: 0,
        Dependentes: '',
        CodigoPlano: '',
        Plano: '',
        ValorPlanoSimulado: '',
        FiltroRangeValor: '',
        TipoLead_ContatoNao: '',
        Hora_ContatoNao: '',
        TipoLead_ClickToCall: '',
        Hora_ClickToCall: '',
        TipoLead_Chat: '',
        Hora_Chat: '',
        TipoLead_DetalhesPlano: '',
        Hora_DetalhesPlano: '',
        TipoLead_ContatoSim: '',
        Hora_ContatoSim: '',
        TipoLead_PedidoOnline: '',
        Hora_PedidoOnline: '',
        TipoLead_MobileSim: '',
        Hora_MobileSim: '',
        Ativo: ''
        //TODO: ESSES CAMPOS COMENTADOS PROVAVELMENTE VIRÃO SER IMPLEMENTADOS EM DEZEMBRO DE 2019. 
        // TipoLead_HOME_LOGIN_DESISTENCIA: '',
        // hora_HOME_LOGIN_DESISTENCIA: '',
        // TipoLead_LOGIN_DESISTENCIA: '',
        // hora_LOGIN_DESISTENCIA: '',
        // TipoLead_CADASTRO_DESISTENCIA: '',
        // hora_CADASTRO_DESISTENCIA: '',
        // LEAD_ACEITA_CONTATO: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      getColetaDados: 'ColetaDados/getColetaDados',
      getPlanoDetalhe: 'Planos/getPlanoDetalhe'
    }),
    leadInfosComputed() {
      const dateNow = new Date();
      const horaLead = this.createTimeStamp();
      let [posicaoUm, posicaoDois, posicaoTres] = this.getColetaDados.nascimento.split("/");

      if (this.getUrlParameter('utm_source')) {
        this.leadInfos.Veiculo = this.getUrlParameter('utm_source');
      } else {
        this.leadInfos.Veiculo = '';
      }
      if (this.getUrlParameter('utm_medium')) {
        this.leadInfos.Formato = this.getUrlParameter('utm_medium');
      } else {
        this.leadInfos.Formato = '';
      }
      if (this.getUrlParameter('utm_campaign')) {
        this.leadInfos.Campanha = this.getUrlParameter('utm_campaign');
      } else {
        this.leadInfos.Campanha = '';
      }
      this.leadInfos.DataSimulacao = `${dateNow.getDate()}/${dateNow.getMonth() + 1}/${dateNow.getFullYear()}`;
      this.leadInfos.Estado = this.getColetaDados.estado || "";
      this.leadInfos.CEP = this.getColetaDados.cep || "";
      this.leadInfos.Profissao = this.getColetaDados.profissao || "";
      this.leadInfos.CodigoEntidade = this.getColetaDados.entidade || "";
      this.leadInfos.Entidade = this.getColetaDados.entidade || "";
      this.leadInfos.CodigoOperadora = this.getColetaDados.CodigoOperadora || "";
      this.leadInfos.Operadora = this.getPlanoDetalhe.operadora || "";
      this.leadInfos.TipoAcomodacao = this.getPlanoDetalhe.tipo_acomodacao || "";
      this.leadInfos.reembolso = !!this.getColetaDados.reembolso ? 'S' : 'N';
      this.leadInfos.NomeCompleto = this.getColetaDados.nome || "";
      this.leadInfos.Email = this.getColetaDados.email || "";
      if (this.getColetaDados.telefone) {
        let regex = /\d{2}/;
        let resultado = this.getColetaDados.telefone.match(regex);
        this.leadInfos.DddProspect = resultado[0];
      } else {
        this.leadInfos.DddProspect = "";
      }
      this.leadInfos.Telefone = this.getColetaDados.telefone || "";
      this.leadInfos.DataNascimento = `${posicaoTres || ""}${posicaoTres ? "-" : ""}${posicaoDois || ""}${posicaoDois ? "-" : ""}${posicaoUm || ""}`;
      if (this.getColetaDados.dependentes) {
        this.leadInfos.Dependentes = this.getColetaDados.dependentes || "";
        this.leadInfos.AdicionaDependentes = true;
        this.leadInfos.QuantidadeDependentes = this.getColetaDados.dependentes.length;
      }
      this.leadInfos.CPF = this.getColetaDados.cpf || "";
      this.leadInfos.FiltroRangeValor = (!!this.getColetaDados.valor[0] ? this.getColetaDados.valor[0] + "-" : "") + (!!this.getColetaDados.valor[1] ? this.getColetaDados.valor[1] : "");

      if (isMobile) {
        this.leadInfos.TipoLead_MobileSim = 'SW_MOBILE_SIM';
        this.leadInfos.Hora_MobileSim = horaLead;
      } else {
        this.leadInfos.TipoLead_MobileSim = '';
        this.leadInfos.Hora_MobileSim = '';
      }

      if (this.getColetaDados.optin) {
        this.leadInfos.TipoLead_ContatoSim = 'SW_SOLICITACAO_CONTATO_SIM';
        this.leadInfos.Hora_ContatoSim = horaLead;
      } else {
        this.leadInfos.TipoLead_ContatoNao = 'SW_SOLICITACAO_CONTATO_NAO';
        this.leadInfos.Hora_ContatoNao = horaLead;
      }
      /**
       * 
       * Verifica se a URL possui Query String de campanhas (URL UTM)
       * 
       */

      // if ( this.getUrlParameter('utm_term')) {
      //   this.leadInfos.utm_term = this.getUrlParameter('utm_term');
      // } else {
      //   this.leadInfos.utm_term = '';
      // }

      // if ( this.getUrlParameter('utm_content')) {
      //   this.leadInfos.utm_content = this.getUrlParameter('utm_content');
      // } else {
      //   this.leadInfos.utm_content = '';
      // }
      if (this.getPlanoDetalhe && Object.keys(this.getPlanoDetalhe).length > 0) {
        this.leadInfos.TipoLead_DetalhesPlano = "SW_DETALHES_DO_PLANO";
        this.leadInfos.Hora_DetalhesPlano = horaLead;

        if (this.getPlanoDetalhe.idplano_sinf) {
          this.leadInfos.CodigoPlano = this.getPlanoDetalhe.idplano_sinf;//validar
        }
        if (this.getPlanoDetalhe.plano) {
          this.leadInfos.Plano = this.getPlanoDetalhe.plano;
        }

        if (this.getPlanoDetalhe.reembolso) {
          this.leadInfos.Reembolso = "S";
        } else {
          this.leadInfos.Reembolso = "N";
        }
        if (this.getPlanoDetalhe.precos) {
          this.leadInfos.ValorPlanoSimulado = this.getPlanoDetalhe.precos.total;
        }
      }
      return this.leadInfos;
    }
  },
  mounted() {
    this.getUserIP(response => this.leadIP = response);
  },
  methods: {
    getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },
    createTimeStamp() {
      const dateNow = new Date();
      return `${dateNow.getDay() + 1}/${dateNow.getMonth() + 1}/${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
    },
    async incluirSimulacao() {
      try {
        simulacaoService.incluir(this.leadInfosComputed);
      } catch (error) {
        console.log(error);
      }
    },
    async atualizarSimulacao() {
      try {
        let hora = this.createTimeStamp();

        //REGRA DE NEGÓCIO
        this.leadInfosComputed.TipoLead_ContatoSim = 'SW_SOLICITACAO_CONTATO_SIM';
        this.leadInfosComputed.Hora_ContatoSim = hora;
        this.leadInfosComputed.TipoLead_ContatoNao = '';
        this.leadInfosComputed.Hora_ContatoNao = '';
        
        simulacaoService.alterar(this.leadInfosComputed);
      } catch (error) {
        console.log(error);
      }
    },
    getUserIP(onNewIP) {
      var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      var pc = new myPeerConnection({
        iceServers: []
      }),
        noop = function () { },
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

      function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
      }

      pc.createDataChannel("");
      pc.createOffer().then(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
          if (line.indexOf('candidate') < 0) return;
          line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
      }).catch(function (reason) {
      });

      //listen for candidate events
      pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    }
  }
}