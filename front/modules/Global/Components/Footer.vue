<template>
  <footer class="content-footer">
    <div class="container">
      <div class="row">
        <div class="ans--item col-4 col-lg-2" v-for="(item, index) in conteudo.ans" :key="index">
          <p class="name" v-html="item.nome"></p>
          <span class="badge badge-dark">ANS n° {{item.codigo}}</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="footer-terms" v-html="conteudo.politica"></p>
        </div>
      </div>
      <div class="row">
        <div class="redes">
          <div class="col">
            <img src="../../../assets/qualicorp-horizontal.svg" alt="Logo da Qualicorp" />
          </div>
          <div class="col">
            <div class="midia">
              <a href="https://www.facebook.com/Qualicorp/">
                <img src="../../../assets/images/midia/facebook.svg" alt="Logo da Qualicorp" />
              </a>
              <a href="https://www.instagram.com/qualicorp/">
                <img src="../../../assets/images/midia/instagram.svg" alt="Logo da Qualicorp" />
              </a>
              <a href="https://www.youtube.com/user/qualicorp">
                <img src="../../../assets/images/midia/youtube.svg" alt="Logo da Qualicorp" />
              </a>
              <a href="https://twitter.com/qualicorp">
                <img src="../../../assets/images/midia/twitter.svg" alt="Logo da Qualicorp" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@import "../../../assets/css/responsive.scss";
.content-footer {
  margin-top: em(80px);
  padding: em(40px) em(15px) em(20px);

  background-color: var(--quali-footer);
  font-size: 14px;
}

.content-footer .redes {
  display: flex;
  width: 100%;
}

.politica .descricao {
  margin-top: 20px;
}

.politica .name {
  font-size: 12px;
}

.politica .badge {
  width: 100%;
}

.content-footer img {
  height: 30px;
}

.ans--item {
  margin-bottom: 1em;
  
  font-size: 13px;

  .name {
    padding: 0;
    margin: 0;

    font-size: 11px;
    line-height: 1;
  }
}

.midia {
  display: flex;
  float: right;
  align-items: center;
  justify-content: space-between;
  max-width: 260px;
  width: 100%;
}

.midia img {
  margin-right: 10px;
  height: 20px;
}

.footer-terms {
  margin: em(20px) 0; 

  font-size: 11px;
}

.badge {
  border-radius: 0;
}

.redes {
  margin-top: em(20px);
}

</style>

<script>
export default {
  name: "Footer",
  data() {
    return {
      conteudo: {
        ans: [
          { nome: "Amil", codigo: "326305" },
          { nome: "Ana Costa Saúde", codigo: "360244" },
          { nome: "Bradesco Saúde", codigo: "005711" },
          { nome: "Central Nacional Unimed", codigo: "339679" },
          { nome: "Doctor Clin", codigo: "349682" },
          { nome: "MAPFRE Saúde", codigo: "418951" },
          { nome: "SulAmérica Saúde", codigo: "006246" },
          { nome: "Unimed Fortaleza", codigo: "317144" },
          { nome: "Unimed Juiz de Fora", codigo: "306886" },
          { nome: "Unimed Natal", codigo: "335592" },
          { nome: "Unimed Norte/Nordeste", codigo: "324213" },
          { nome: "Unimed Nova Friburgo", codigo: "335479" },
          { nome: "Unimed Porto Alegre", codigo: "352501" },
          { nome: "Unimed Rio", codigo: "393321" },
          { nome: "Unimed Santos", codigo: "355721" },
          { nome: "Vitallis Sanitas", codigo: "348520" }
        ],
        politica:
          "A disponibilidade e as características da rede médica e/ou do benefício especial podem variar de acordo com as condições contratuais do plano adquirido. Os preços e as condições são obtidos através de negociação coletiva da Qualicorp com as operadoras parceiras. As vendas de planos de saúde coletivos por adesão ocorrem de acordo com as regras da ANS. Informações resumidas. A Qualicorp criou este simulador para auxiliar os interessados na contratação de planos, de modo que permita que os beneficiários comparem as opções disponíveis no mercado e suas principais características. A Qualicorp assegura a confiabilidade das informações deste simulador no momento da pesquisa, porém reserva-se no direito de corrigir ou atualizar a base de dados a qualquer momento e sem a necessidade de aviso prévio. A comercialização dos planos respeita a área de abrangência dos produtos comercializados e das respectivas operadoras. A disponibilidade dos produtos pode variar de acordo com a região e a entidade de classe com a qual os proponentes mantêm o vínculo. Todas as informações referentes aos planos, incluindo preços, rede de prestadores e sua abrangência geográfica, são de responsabilidade exclusiva das respectivas operadoras de saúde. Inclusive, é importante salientar que os planos podem ser coparticipados. Para conhecer a tabela completa de procedimentos e valores, consulte a operadora. A rede de prestadores é uma amostra ilustrativa, e não a rede completa de cada plano. O preço e a rede de prestadores estão sujeitos a alterações, por parte da respectiva operadora de saúde, mesmo após a contratação do plano, respeitadas as disposições contratuais e legais (Lei no 9.656/98). Julho/2019"
      }
    };
  },
  components: {},
  props: {},
  methods: {}
};
</script>
