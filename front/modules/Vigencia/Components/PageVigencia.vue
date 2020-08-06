<template>
	<section class="container-fluid">
		<div class="col-12 offset-md-3 col-md-6 offset-lg-4 col-lg-4">
			<h1 class="increase-5">
				{{ this.content.title }} 
				<IconeInfo v-bind:value="this.content.informativo"></IconeInfo>
			</h1>
			<p class="lightgray mt-4">
				{{ this.content.observacao }}
			</p>
			<!-- area para selecao vigencia -->
			<div class="mt-4">
				<form action="#">
					<div class="form-group">
						<div>
							<label for="" class="text-bold"> {{ this.content.vigencia.mensagemData }}&nbsp;</label>
							<IconeInfo v-bind:value="this.content.vigencia.informativo"> </IconeInfo>
						</div>
						<select name="" @change="consultarReajuste" id="slcDataVigencia" class="form-control">
							<option v-bind:value="dataVigencia.dataVigencia" v-for="(dataVigencia, index) in this.datasVigencia"
								v-bind:key="index">
								{{ dataVigencia.dataVigencia.toString().formatData( "/" ) }}
							</option>
						</select>
					</div>
				</form>
			</div>
			<!-- valores para a vigencia escolhida -->
			<transition name="fade">
				<div class="mt-4" v-if="this.mostrarReajuste">
					<p class="lightgray">{{ this.content.vigencia.escolhida }}</p>
					<!--TODO: CRIAR UM COMPONENTE -->
					<Reajuste :source="this.reajuste.faixa"></Reajuste>
					<Reajuste :source="this.reajuste.anual"></Reajuste>

				</div>
			</transition>
			<!--TODO: CRIAR UM COMPONENTE TOTAL -->
			<div class="d-flex justify-space-around text-bold increase-4 my-5">
				<span class=""> {{ this.content.total }}: </span>
				<span class="price">R$:&nbsp;<span class="increase-2"> {{ this.totalComReajuste.toString().price() }} </span>
				</span>
			</div>
			<div class="text-center mt-4">
				<button class="btn btn-primary btn-block btn-more w-100" @click="this.avancar"> {{this.content.confirmar}} </button>
			</div>
			<div class="text-center mt-4 text-bold">
				<span><a class="quali-blue" href="" @click="this.voltar" > {{this.content.voltar}} </a> </span>
			</div>
		</div>
	</section>
</template>

<style lang="scss">

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	.quali-blue {
		color: var(--quali-dark-blue);
	}

	.dev-border {
		border: 2px dashed var(--quali-dark-blue);
	}

	.h-row {
		border-bottom: 1px solid var(--quali-light-gray);
	}

	.w-100 {
		width: 100%;
	}

	select {
		color: var(--quali-dark-blue);
	}

	.d-flex {
		display: flex;
	}

	.justify-center {
		justify-content: center;
	}

	.justify-space-between {
		justify-content: space-between;
	}

	.justify-space-around {
		justify-content: space-around;
	}

	.text-right {
		text-align: right !important;
	}

	.text-left {
		text-align: left !important;
	}

	.text-center {
		text-align: center !important;
	}

	.price {
		color: var(--quali-dark-blue);
	}

	.notLink,
	.notLink:hover {
		color: var(--quali-dark-blue);
		text-decoration: none;
	}

	.text-bold {
		font-weight: bold;
		font-size: 1.03rem;
	}

	.increase-1 {
		font-size: 1.1em !important;
	}

	.increase-2 {
		font-size: 1.2em !important;
	}

	.increase-3 {
		font-size: 1.3em !important;
	}

	.increase-4 {
		font-size: 1.4em !important;
	}

	.increase-5 {
		font-size: 1.5em !important;
	}

	.text-bolder {
		font-weight: bolder;
		font-size: 1.03em;
	}

	.container-fluid .lightgray {
		color: var(--quali-medium-gray);
	}
</style>

<script>

	import apiDataVigencia from "./../../../services/api-data-vigencia";
	import apiReajuste from "./../../../services/api-reajuste";
	import Reajuste from "@/modules/Vigencia/Components/Reajuste.vue";
	import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
	import IconeInfo from "@/modules/Global/Components/Info.vue";
	import { mapMutations } from "vuex";
	import info from "./../info.json";

	export default {
		name: "PageVigencia",
		mixins: [CacheMixin],
		components: {
			Reajuste,
			IconeInfo,
		},
		data() {
			return {
				planoSelecionado: {},
				dadosColetado: {},
				datasVigencia: [],
				reajuste: {},
				valorTotal : 0,
				mostrandoReajuste: false
			};
		},
		methods: {
			...mapMutations( {
				updateVigencia : "Contratacao/updateVigencia"
			}),
			consultarReajuste: function () {
				let selectedIndex = document.getElementById("slcDataVigencia").selectedIndex;
				let selectedValue = document.getElementById("slcDataVigencia").value;
				let [selectedData] = this.datasVigencia.filter((data) => {
					return data.dataVigencia === selectedValue
				});

				if (selectedIndex == 0) {
					this.mostrandoReajuste = false;
					this.reajuste = new ReajusteValor();	
					return false;
				}

				selectedData.init();
				this.reajuste = selectedData.reajuste;
				this.mostrandoReajuste = true;
			},
			validar(){
				let estaValido = false;
				let slcDataVigencia = document.getElementById( "slcDataVigencia" );
				if( slcDataVigencia.selectedIndex >= 1 ){
					estaValido = true;
				}
				return estaValido;
			},
			voltar(){
				this.$router.back();
			},
			avancar(){
				let estaValido = this.validar();
				let dataVigencia = document.getElementById( "slcDataVigencia" ).value;
				let objetoReajuste = { dataVigencia , ...this.reajuste };
				let axiosParametros = {};
				let contratacao=  this.$store.state["Contratacao"];

				axiosParametros.nrProposta = "";
				axiosParametros.dataVigencia = "";

				if( !!contratacao && !!contratacao.coletaDados && !!this.$route.params.nrProposta ){
					axiosParametros.nrProposta = this.$route.params.nrProposta;
					axiosParametros.dataVigencia = dataVigencia;	
				}

				delete objetoReajuste.faixa.informativo;
				delete objetoReajuste.faixa.titulo;
				delete objetoReajuste.faixa.hash;
				delete objetoReajuste.anual.informativo;
				delete objetoReajuste.anual.titulo;
				delete objetoReajuste.anual.hash;
				delete objetoReajuste.dadoBruto;

				if( estaValido ){
					apiDataVigencia.salvarDataVigencia( axiosParametros );
					this.updateVigencia( { ...objetoReajuste } );
					this.$router.push( { name : "ContratacaoDocumento", params : this.$route.params } );
				}else {
					throw "necessario selecionar uma data de vigência";
				}
			}
		},
		computed: {
			mostrarReajuste : function(){
				return this.mostrandoReajuste == true && this.totalReajuste > 0;
			},
			content: function () {
				return info;
			},
			total : function(){
				return this.valorTotal;
			},
			totalReajuste: function () {
				let total = 0.0;

				{ // MINI ESCOPO
					let _total = total;
					try {
						if( this.reajuste && this.reajuste.faixa ){
							this.reajuste.faixa.reajuste.forEach(item => {
								total += parseFloat(item.valor);
							});
						}
					}catch(ex){
						total = _total;
						console.warn( "erro totalReajuste ->" + ex )
					}
				}

				{ // MINI ESCOPO
					let _total = total;
					try {
						if( this.reajuste && this.reajuste.anual ){
							this.reajuste.anual.reajuste.forEach(item => {
								total += parseFloat(item.valor);
							});
						}
					}catch(ex){
						total = _total;
						console.warn( "erro totalReajuste ->" + ex );
					}
				}
				
				return total;
			},
			totalComReajuste : function(){
				return this.total + this.totalReajuste
			},
		},
		created() {
			this.dadosColetado = this.$store.state[ "ColetaDados" ].formData;
			this.planoSelecionado = this.$store.state[ "Planos" ].plano;
			
			if( this.planoSelecionado && this.planoSelecionado.precos ){
				this.valorTotal = parseFloat(this.planoSelecionado.precos.total);
			}

			let vigencia = new Vigencia();

			vigencia
				.init()
				.then(() => {
					this.datasVigencia = [{ dataVigencia: "Selecione" }, ...vigencia.datas];
				})
				.catch((error) => {
					throw "nenhum plano selecionado";
				});

			console.log("Created -> Components/PageVigencia.vue...");
		},
		mounted() {
			console.log("Munted -> Components/PageVigencia.vue...");
		},
	};

	class Vigencia {
		constructor() {
			this.datas = [];
		}
		init() {
			return this.consultarDatasVigencia();
		}
		consultarDatasVigencia() {
			let context = this;
			return new Promise(function (resolve, reject) {
				let planoSelecionado = CacheMixin.methods.getCache("Plano");
				let result = [];

				if (planoSelecionado == null || planoSelecionado.id.toString().length === 0) {
					reject(null);
					return false;
				}

				try {
					result = apiDataVigencia.listarDatasVigencia(planoSelecionado.id);
					result.then((r) => {
						let datas = r.data;
						let datasArray = [];

						datas.forEach((data) => {
							datasArray.push(new DataVigencia(data));
						});

						context.datas = datasArray;
						resolve();
					});
				} catch (exception) {
					reject(exception);
				}
			})
		}
	}

	class DataVigencia {
		constructor({ datavigencia, datafechamentoaceitacao, datafechamentoreapresentacao }) {
			this.dataVigencia = datavigencia;
			this.dataFechamentoAceitacao = datafechamentoaceitacao;
			this.dataFechamentoRepresentacao = datafechamentoreapresentacao;
			this.reajuste = {};
		}
		init() {
			this.reajuste = new ReajusteValor();
			this.reajuste.init(this.dataVigencia);
		}
	}

	class ReajusteValor {
		constructor() {
			this.dadoBruto = [];
			this.faixa = {
				reajuste: []
			};
			this.anual = {
				reajuste: []
			};
		}
		init(dataVigencia) {
			this.consultarReajuste(dataVigencia);
		}
		async consultarReajuste(dataVigencia) {
			let dadosColetado = CacheMixin.methods.getCache("ColetaDados");
			let planoSelecionado = CacheMixin.methods.getCache("Plano");
			let objetoReajuste = new ReajusteValor();
			let resultadoPesquisa = {};
			let parametros = {};

			parametros.datanascimento = dadosColetado.pessoas;
			parametros.datasimulacao = (new Date).toLocaleDateString().formatData( "-" );
			parametros.datavigencia = dataVigencia;
			parametros.idplano_sinf = planoSelecionado.idplano_sinf;
			parametros.entidade = dadosColetado.entidade;
			parametros.id = planoSelecionado.id;

			resultadoPesquisa = await apiReajuste.consultarReajuste(parametros);
			this.dadoBruto = resultadoPesquisa.data;
			this.tratarReajuste();
		}
		tratarReajuste() {
			let _this = this;
			this.dadoBruto.forEach((_reajuste) => {
				let reajusteFaixa = { ..._reajuste };
				let reajusteAnual = { ..._reajuste };

				if( !_reajuste.hasOwnProperty( "reajuste_anual" ) ){
					_reajuste.reajuste_anual = 0.0;
				}
	
				if( !_reajuste.hasOwnProperty( "reajuste_faixa" ) ){
					_reajuste.reajuste_faixa = 0.0;
				}

				reajusteFaixa.valor = _reajuste.reajuste_faixa;
				_this.faixa.titulo = info.reajuste.faixa.mensagem,
				_this.faixa.informativo = info.reajuste.faixa.informativo;

				reajusteAnual.valor = _reajuste.reajuste_anual;
				_this.anual.titulo = info.reajuste.anual.mensagem,
				_this.anual.informativo = info.reajuste.anual.informativo;

				delete reajusteFaixa.reajuste_faixa;
				delete reajusteFaixa.reajuste_anual;
				delete reajusteAnual.reajuste_faixa;
				delete reajusteAnual.reajuste_anual;

				_this.faixa.reajuste.push(reajusteFaixa);
				_this.anual.reajuste.push(reajusteAnual);
			});
		}
	}

	if (!String.prototype.formatData) {
		String.prototype.formatData = function () {
			let value = this;
			let [split] = arguments;
			let regex = /([0-9]{2,4})(.{1})([0-9]{2})(?:.{1})([0-9]{2,4})/g;

			if (!(/[0-9]+/g.test(value))) {
				return value;
			}

			if (split != undefined && split != null && split.length != 0) {
				value = value.replace(/[^0-9]/g, split);
			}

			if (regex.test(value)) {
				return value.replace(regex, "$4$2$3$2$1");
			} else {
				return value;
			}
		}
	}

	if (!String.prototype.price) {
		String.prototype.price = function () {
			let regex = /(?:\.)([0-9]{2,})$/;
			try {
				let value = parseFloat(this);
				return value.toFixed(2).toString().replace(regex, ",$1");
			} catch (e) {
				return this;
			}
		}
	}

</script>