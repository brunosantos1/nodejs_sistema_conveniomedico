<template>
	<div v-show="!this.zerado">

		<!-- CONTAINER GERAL -->
		<div class="">
			<p class="font-bold increase-1">  
				{{ this.source.titulo }}
				<IconeInfo v-bind:value="this.source.informativo"></IconeInfo>
			</p>
		</div>

		<!-- AREA DO PRECO -->
		<div class="d-flex justify-content-between my-3">
			<span class="price font-bold increase-3">R$:&nbsp;&nbsp; {{ this.totalReajuste.toString().price() }} </span>
			<span v-show="!this.isPlanoIndividual()">
				<a class="notLink font-bold pr-2" href="/" @click="toggleDetalhesVisiveis( $event )"> {{ this.content.verDetalhes }} </a>
			</span>
		</div>

		<!-- LINHA HORIZONTAL DE ESTILO -->
		<div class="h-row my-2"></div>

		<!-- DETALHES  -->
		<transition name="fade">
			<div v-if="detalhesVisiveis">
				<div v-for="(r, index) in this.source.reajuste" v-bind:key="index">
					<NomeValor v-bind:source="r" />
				</div>
				<div v-if="this.source.reajuste.map( (item ) => parseFloat(item.valor) > 0).length > 0"
					class="h-row w-100 my-2"></div>
			</div>
		</transition>

	</div>
</template>

<style lang="scss">

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter,
	.fade-leave-to{
		opacity: 0;
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

	.h-row {
		width: 100% !important;
		border-bottom: 1px solid var(--quali-light-gray);
	}
	
	a.notLink,
	a.notLink:hover {
		color: var(--quali-dark-blue);
		text-decoration: none;
	}

	.lightgray {
		color: var(--quali-medium-gray);
	}

	.price {
		color: var(--quali-dark-blue);
	}

	.font-bold {
		font-weight: bold;
	}
</style>

<script>

	import NomeValor from "@/modules/Vigencia/Components/NomeValor.vue";
	import IconeInfo from "@/modules/Global/Components/Info.vue";
	import info from "./../info.json";

	export default {
		name: "reajuste",
		components: {
			NomeValor,
			IconeInfo
		},
		props: ["source"],
		data: function () {
			return {
				detalhesVisiveis: false,
				dadosColetados : {}
			}
		},
		computed: {
			content : function(){
				return info;
			},
			totalReajuste: function () {
				let total = 0.0;
				this.source.reajuste.forEach((item) => {
					total += parseFloat(item.valor);
				});
				return total;
			},
			zerado: function () {
				let isZero = false;
				if (this.totalReajuste === 0.0) {
					isZero = true;
				}
				return isZero;
			}
		},
		methods: {
			toggleDetalhesVisiveis: function ( event ) {
				this.detalhesVisiveis = !this.detalhesVisiveis;
				event.preventDefault();
			},
			isPlanoIndividual: function () {
				let dados = this.dadosColetados;
				let retorno = false;

				if (dados && Object.keys( dados ).length > 0 && dados.dependente == "individual")
					retorno = true;

				return retorno;
			}
		},
		created: function () {
			this.source.hash = guid();
			this.dadosColetados = this.$store.state[ "ColetaDados" ].formData;
		}
	};

	function guid() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	}

</script>