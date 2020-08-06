<template>
  <div class="container-fluid">
		<div class="row">
			<div class="col-12">
					<Header>
					</Header>
			</div>
		</div>
		<div class="row">
			<div class="col-12 offset-md-3 col-md-6 col-lg-4 offset-lg-4">
				<PagePendencia>
				</PagePendencia>
			</div>
		</div>
		<div class="row">
			<div class="col-12">
				<Footer>
				</Footer>
			</div>
		</div>
  </div>
</template>

<style lang="scss">
	@import "../../../assets/css/responsive.scss";
</style>

<script>

	import PagePendencia from "@/modules/Pendencia/Components/PagePendencia.vue";
  import CacheMixin from "@/modules/Global/Mixins/cacheMixin.js";
  import Header from "@/modules/Global/Components/Header.vue";
	import Footer from "@/modules/Global/Components/Footer.vue";

	export default {
		name: "Pendencia",
		mixins: [CacheMixin],
		components: {
			PagePendencia,
			Header,
			Footer
		},
		data() { return {} },
		methods: {},
		computed: {},
		created() {
			console.log( `Created --> Index...` );
		},
		mounted() {
			console.log( `Mounted --> Index...` );
		}
	};

</script>