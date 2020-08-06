<template>
	<div class="page-wrapper detalhe-wrapper">
		<Header visibleBack></Header>
		<PageVigencia></PageVigencia>
		<Footer />
	</div>
</template>

<style lang="scss">
	@import "../../../assets/css/responsive.scss";
</style>

<script>
	import PageVigencia from "@/modules/Vigencia/Components/PageVigencia.vue";
  import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
  import Header from "@/modules/Global/Components/Header.vue";
	import Footer from "@/modules/Global/Components/Footer.vue";

	export default {
		name: "Vigencia",
		mixins: [CacheMixin],
		components: {
			PageVigencia,
			Header,
			Footer
		},
		data() { return {} },
		created() {
			let dadosColetado = null;
			let planos = null;
			let planoSelecionado = null;
			let contratacaoFormdata = null;

			contratacaoFormdata = this.$store.state[ "Contratacao" ].formData;
			dadosColetado = this.$store.state[ "ColetaDados" ].formData;
			planoSelecionado = this.$store.state["Planos"].plano;
			planos = this.$store.state[ "Planos" ].planos;

			if( dadosColetado == null || dadosColetado == undefined || Object.keys( dadosColetado ).length == 0 ){
				this.$router.push( { name : "ColetaDados" } );
				return false;
			}

			if( planos == null || planos == undefined || Object.keys( planos ).length == 0 ){
				this.$router.push( { name : "Planos"} );
				return false;
			}

			if( planoSelecionado == null || planoSelecionado == undefined || Object.keys( planoSelecionado ).length == 0 ){
				this.$router.push( { name : "Planos"} );
				return false;
			}

			if( contratacaoFormdata == null || contratacaoFormdata == undefined || Object.keys( contratacaoFormdata ).length == 0 ){
				this.$router.push( { name : "Planos"} );
				return false;
			}
		},
		methods: {},
		computed: {}
	};

</script>