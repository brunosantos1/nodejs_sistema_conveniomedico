<template>
  <div class="page-planos--wrapper section--container">
    <loader type="circle" v-show="loadingSimilaresPage" text="Carregando dados do plano"></loader>
    <section class="plano--header">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <PlanoLogoDescricao :selectedPlano="plano" />
              </div>
          <div class="col-12">
            <PrecoTotal :selectedPlano="plano" />
          </div>
        </div>
      </div>
    </section>
    <PrecoPessoa :selectedPlano="plano" />
    <div class="row btn-desktop">
      <div class="col-12 text-center">
        <Botao id="btnDesktop" :text="btnText.text" :action="btnText.action" />
      </div>
    </div>
    <div class="container">
      <div class="row" v-if="conteudo.beneficio">
        <div class="col-12 text-center section-wrapper">
          <h2 class="section-title">Benefícios do plano</h2>
          <div class="section-description" >
            <p v-html="conteudo.beneficio.descricao.replace('{{nivel}}', plano.nivel ).replace('{{plano}}', plano.plano )"></p>
            <p class="no-margin" v-html="conteudo.beneficio.relacao.acomodacao.replace('{{tipo_acomodacao}}', plano.tipo_acomodacao ? plano.tipo_acomodacao.toLowerCase() : '' )"></p>
            <p class="no-margin" v-html="conteudo.beneficio.relacao.abrangencia.replace('{{abrangencia}}', plano.abrangencia )"></p>
            <p class="no-margin" v-if="plano.reembolso" v-html="conteudo.beneficio.relacao.reembolso"></p>
          </div>
        </div>
      </div>
    </div>
    <!-- Lista de Icones -->
    <div class="icon__list">
      <div class="container">
        <div class="row">
          <!-- Icone de abrangencia -->
          <div class="col-12 col-md-6 col-lg-4 mb-4" v-if="conteudo.abrangencia">
            <PlanoCaracteristica :selectedPlano="plano" area="abrangencia" />
            </div>
          <!-- Icone de Hospital  -->
          <div class="col-12 col-md-6 col-lg-4 mb-4" v-if="conteudo.hospital">
            <PlanoCaracteristica :selectedPlano="plano" area="hospital" />
            </div>
          <!-- Icone de Laboratorios -->
          <div class="col-12 col-md-6 col-lg-4 mb-4" v-if="conteudo.laboratorio">
            <PlanoCaracteristica :selectedPlano="plano" area="laboratorio" />
            </div>
          <!-- Icone de Maternidades -->
          <div class="col-12 col-md-6 col-lg-4 mb-4" v-if="conteudo.maternidade">
            <PlanoCaracteristica :selectedPlano="plano" area="maternidade" />
          </div>
          <!-- Icone de Pronto Socorro -->
          <div class="col-12 col-md-6 col-lg-4 mb-2" v-if="conteudo.prontoSocorro">
          <PlanoCaracteristica :selectedPlano="plano" area="prontoSocorro" />
           </div>
         </div>
       </div>
     </div>
   <!-- Informações Adicionais -->
   <div class="container">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 row-content row-content__bottom" v-if="conteudo.coparticipacao">
        <h4 class="plano--item__title">Coparticipação</h4>
        <p class="no-margin" v-html="conteudo.coparticipacao"></p>
      </div>

      <div class="col-12 col-md-6 col-lg-4 row-content row-content__bottom" >
        <h4 class="plano--item__title">Informações ANS</h4>
        <p class="no-margin" v-html="conteudo.ans.split(`{{nome_plano_ans}}`).join(plano.nome_plano_ans).split(`{{codigo_ans}}`).join(plano.codigo_ans)"></p>
      </div>

      <div class="col-12 col-md-6 col-lg-4 row-content row-content__bottom" v-if="conteudo.infoAdicionais">
        <h4 class="plano--item__title">Informações adicionais</h4>
        <p class="no-margin" v-html="conteudo.infoAdicionais"></p>
      </div>
    </div>
  </div>

  <!-- Planos Similares -->
  <div class="planos-similar">
    <div class="container">
      <loader type="page" class="loader-similares" v-show="loadingSimilares" text="Carregando Planos Similares Para Você"></loader>
     <div class="col-12 row-content row-content__bottom" v-if="planosSimilares && planosSimilares.length > 0">
        <h2 class="section-title">Planos similares</h2>
      </div>
    </div>

    <div class="slider-planos" v-show="planosSimilares && planosSimilares.length > 0">
      <div class="slider-content swiper-container">
        <div class="swiper-wrapper">
          <div v-for="item in planosSimilares" :key="item.id" class="swiper-slide width-slide">

            <Card noMarginBottom :parentData="item" visibleDetail @selected="itemSelected(item)" />
          
          </div>
        </div>
        <div class="slider-arrows">
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Botão Mobile que fica fixo no bottom da tela -->
  <div class="btn-mobile">
    <div class="col-12">
      <Botao class="btn-block" :text="btnText.text" :action="btnText.action" />
    </div>
  </div>
</div>
</template>

<script>
  import planoService from "./../../../services/api-plano";
  import Mixin from "@/modules/DetalhePlano/Mixins/detalhePlanoMixin.js";
  import PrecoTotal from "@/modules/DetalhePlano/Components/PrecoTotal.vue";
  import PrecoPessoa from "@/modules/DetalhePlano/Components/PrecoPessoa.vue";
  import PlanoLogoDescricao from "@/modules/DetalhePlano/Components/PlanoLogoDescricao.vue";
  import PlanoCaracteristica from "@/modules/DetalhePlano/Components/PlanoCaracteristica.vue";
  import Botao from "@/modules/DetalhePlano/Components/Botao.vue";
  import Card from "@/modules/Global/Components/Card.vue";
  import Loader from "@/modules/Global/Components/Loader.vue";
  import infosJson from "./../infos.json";
  import fixHeader from "@/modules/Global/Mixins/fixHeader.js";
  import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
import Swiper from "swiper";
import "swiper/css/swiper.min.css";

  export default {
    name: "PageDetalhePlano",
    mixins: [Mixin, fixHeader, CacheMixin],
    props: {
      planoProp : Object,
      btnText: Object,
      conteudo: Object
    },
    data() {
      return {
        precos: [],
      coleta: this.getCache("ColetaDados"),
        prontoSocorros: [],
        planosSimilares: [],
        loadingSimilares: true,
        loadingSimilaresPage: false,
        planoKey: 0,
        plano:{}
      };
    },
    computed: {
    cardLogo() {
      let img = "";
        if (this.plano.operadoraLogo.match(/(jpg)$/gi)) {
          img = this.parentData.operadoraLogo;
        } else {
        img = "https://placehold.it/100x100";
        }
        return img;
      }
    },
    components: { 
      PrecoTotal, 
      PrecoPessoa, 
      PlanoLogoDescricao,
      Botao, 
      Card, 
      Loader,
    PlanoCaracteristica,
    Swiper
    // simplebar
    },
    created() {
      this.planoProp = this.planoProp.id ? this.planoProp : this.getCache( "Plano" );
      this.plano = this.planoProp;
      this.planoKey = this.plano.id; 
      
    },
    async mounted() {
      window.addEventListener("scroll", () => {
        if (window.scrollY == 0) {
          setTimeout(() => {
            if (this.loadingSimilaresPage) {
              this.loadingSimilaresPage = !this.loadingSimilaresPage;
            }
          }, 250);
        }
      });
      
      /**
       * Chatbot
       */
       generalInfo.extras['etapa'] = "Contratação";
      this.carregarPrecos();
      await this.carregarPlanosSimilares();
    },
    methods: {

      verListaCompleta(lista, prop) {
        setTimeout(() => { 
          this.conteudo[prop].quantidade = lista.length;
        }, 100);
      },
      carregarPrecos() {
        if (!this.plano.precos || !this.plano.precos.precos) return;
        this.plano.precos.precos.forEach(p => {
          let dtnasc = new Date().getFullYear() - 1 - p.idade;
          p.nascimento = dtnasc;
        });
      },

      async itemSelected(item) {
        this.planosSimilares = [];
        this.loadingSimilaresPage = true;
        this.loadingSimilares = true;
        
        this.$store.commit("Planos/createDetalhePlanoCache", item);
        this.plano = this.$store.state[ "Planos" ].plano;
        
        setTimeout(() => {
          if (this.loadingSimilaresPage) {
            this.loadingSimilaresPage = !this.loadingSimilaresPage;
          }
        }, 1000);

        await this.carregarPlanosSimilares();

        window.scroll({
          top: 0,
          left: 0,
        behavior: "smooth"
      });
    },
    initCarrosselPlanosSimilares() {
      new Swiper(".slider-content", {
        observer: true,
        observeParents: true,
        spaceBetween: 0,
        freeMode: true,
        slidesPerView: "auto",
        freeModeMomentum: true,
        freeModeMomentumRatio: .5,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        breakpoints: {
          1024: {
            freeMode: false,
            slidesPerView: 3,
          }
        }
        });
      },
      async carregarPlanosSimilares() {
        const res = await planoService.listar(
          this.coleta.entidade,
          this.coleta.estado,
          this.coleta.cidade,
          this.coleta.pessoas
          );
        let dados = res.data ? res.data : {};
        this.planosSimilares = (!dados.planos && !dados.planos.length)
        ? []
        : dados.planos.filter(p => {
          return p.nivel == this.plano.nivel && p.id != this.plano.id;
        });


        this.loadingSimilares = false;
        this.loadingSimilaresPage = false;
      this.initCarrosselPlanosSimilares();
      }
    }
  };
</script>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";

* {
  box-sizing: border-box;
}

.btn-desktop,
.loader-similares,
.section-wrapper {
  margin: em(60px) 0;
}

.section-title {
  font-size: 28px;
  line-height: em(36.4px, 28px);
}

.section-description {
  margin: 0 auto;
  max-width: 610px;
}

.slider-planos {
  width: 100%;
  @media (min-width: 992px) {
    max-width: 1110px;
    margin: 0 auto;
  }

  .slider-content {
    // &::-webkit-scrollbar {
    //   width: 2px;
    //   height: 2px;
    // }
    //  -ms-overflow-style: -ms-autohiding-scrollbar;
    // scrollbar-width: none;
  display: flex;
    // overflow-y: none;
    // overflow-x: scroll;
  }

  .slider-arrows {
    display: none;
    @media (min-width: 1024px){
      display: block;
    }

    .swiper-button-prev, .swiper-button-next{
      color: var(--quali-dark-blue)
    }
    .swiper-button-prev {
      left: 10px;
    }
    .swiper-button-next {
      right: 10px;
    }
  }

  .width-slide {
    width: 80%;
    @media (min-width: 1024px) {
      width: 100%;
    }
  }
}

.feature--icon {
  margin-bottom: em(10px);
}

/**
 * Media QUeries
 */

 @include media-breakpoint-up(xs) {
  .row-content__bottom {
    padding-bottom: 2em;
    padding-top: 2em;

    border-top: solid 2px var(--quali-light-x-gray);

    &:last-child {
      border-bottom: solid 2px var(--quali-light-x-gray);      
    }
  }
}

@include media-breakpoint-up(md) {
  .icon__list {
    margin: em(80px) 0;
  }

  .planos-similar {
    margin-top: em(80px);
  }
}

@include media-breakpoint-up(lg) {
  .btn-mobile {
    display: none;
  }

  .btn-desktop {
    display: block;
  }

  .row-content__bottom {
    &:last-child {
      border-bottom: none;
    }
  }

  .section-wrapper {
    margin: 0 auto;
  }
}

@include media-breakpoint-down(md) {
  .row-content__features {
    margin-bottom: 3em;
  }
  
  .icon__list {
    margin: em(40px) 0;
  }

  .planos-similar {
    margin-top: em(20px);

    .row-content__bottom {
      border-top: none;
      border-bottom: none;
    }
  }
}

@include media-breakpoint-down(lg) {
  .btn-mobile {
    bottom: 0;
    display: block;
    left: 0;
    position: fixed;
    width: 100%;
    z-index: 10;

    & > div {
      padding: 0;
    }

    .btn {
      padding-bottom: 1em;
      padding-top: 1em;

      border-radius: 0;
    }
  }

  .btn-desktop {
    display: none;
  }
}
</style>