<template>
  <div class="text-center row-content row-content__features">
    <img :src="'/static/'+icone" class="feature--icon" />
    <h4 class="plano--item__title">{{titulo}}</h4>
    <p class="plano--descricao" v-html="descricao"></p>
    <div v-if="conteudo.quantidade !== null" class="plano--lista">
      <ul class="no-padding">
        <li v-for="(item, index) in prestadores.slice(0, conteudo[area].quantidade)" :key="index">{{item.Prestador}}</li>
      </ul>
      <a v-if="area !== 'abrangencia'" href="#" class="text-link" @click.prevent="openModal(area)">Ver lista completa</a>
    </div>

    <b-modal :id="modalID" centered :title="modalTitle" :hide-footer="true">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1">Procure aqui</span>
        </div>
        <input @input="modalFilter" type="text" class="form-control" placeholder="Digite um termo por aqui" aria-label="Digite um termo por aqui" aria-describedby="basic-addon1" v-model="modalInput">
      </div>
      <div class="modal-body__wrapper">
        <ul v-for="(item, key) in modalList" :key="key">
          <li>{{item}}</li>
        </ul>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import redeService from "@/services/api-rede-resumida";
  import infosJson from "@/modules/DetalhePlano/infos.json";
  import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";

  export default {
    name: "PlanoCaracteristica",
    data(){
      return {
        prestadores: {},
        modalTitle: '',
        modalInput: '',
        modalList: [],
        modalListDefault: []
      }
    },
    props: {
      selectedPlano: {
        required: true,
        type: Object
      },
      area: {
        required: true,
        type: String
      }
    },
    computed: {
      ...mapGetters({
        getPlano: "Planos/getPlano"
      }),
      conteudo: () => {
        return infosJson;
      },
      icone(){
        return this.conteudo[this.area].icone;
      },
      plano(){
        const plano = this.selectedPlano || {};
        const redeCredenciada = this.conteudo[this.area].chave_rede_credenciada;
        this.prestadores = plano.rede_referencia.filter(
          i => i.TipoPrestador == redeCredenciada
        );
        return plano;
      },
      descricao(){
        return this.conteudo[this.area].texto.replace('{{plano}}', this.plano.plano).replace('{{abrangencia}}', this.plano.abrangencia);
      },
      titulo(){
        return this.conteudo[this.area].titulo;
      },
      modalID(){
        return "modal-" + this.area;
      }
    },
    methods: {
      async openModal(){
        const prestadores = this.prestadores.map( item => item.Prestador).sort((a, b) => (a > b) ? 1 : -1);
        this.modalTitle = this.conteudo[this.area].titulo_modal;
        this.modalListDefault = new Set(prestadores);
        this.tipoPrestador = this.area;
        //this.modalList = this.modalListDefault;
        this.modalInput ='';
        let tipoFormated = this.tipoPrestador
        if(tipoFormated=="prontoSocorro") {
          tipoFormated = "Pronto Socorro"
        }
        const res = await redeService.listarPorPrestador(tipoFormated,this.plano.id,this.modalInput);
        let dados = res.data ? res.data.map(item =>item.Prestador) : {};
        this.modalList= new Set(dados);

        
        this.$bvModal.show(this.modalID);
      },
      async modalFilter() { 
          let tipoFormated = this.tipoPrestador
          if(tipoFormated=="prontoSocorro") {
            tipoFormated = "Pronto Socorro"
          }
          const res = await redeService.listarPorPrestador(tipoFormated,this.plano.id,this.modalInput);
          let dados = res.data ? res.data.map(item =>item.Prestador) : {};
          this.modalList= new Set(dados);
      }
    }
  }
</script>

<style lang="scss" scoped>

.plano--item__title {
  font-size: 18px;
  font-weight: bold;
}

.plano--descricao {
  margin-bottom: 0;
  // text-align: left;
}
.plano--lista{
  // text-align: left;
}
.plano--lista ul{
  list-style-type: none;
}

.modal-body__wrapper {
  height: 300px;
  overflow-y: scroll;
}

.feature--icon {
  margin-bottom: 20px;
}

</style>