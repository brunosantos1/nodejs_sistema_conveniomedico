<template>
  <div class="d-flex justify-content-between my-4 w-100" v-if="this.mostrarComponente">
    	<span class="lightgray"> {{ this.source.name }} </span>
			<span class="price pr-4"> R$: {{ this.source.valor.toString().price() }} </span>
  </div>
</template>

<style lang="scss">

</style>

<script>

  export default {
		name: "nome-valor",
		components: { },
		props: ["source"],
		data : function(){
			return {
				monstrandoComponente : false
			}
		},
		computed : {
      mostrarComponente : function(){
        return this.monstrandoComponente;
      }
		},
		methods: {
			getName(){
				let dependentesCadastrados = this.$store.state[ "ColetaDados" ].formData.dependentes;
				let nomesDependente = this.$store.state[ "Contratacao" ].dependentes;
				let contratante = this.$store.state[ "ColetaDados" ].formData;
				let dataNascimento = this.source.datanascimento.formatData();
				let regNotNumber = /[^0-9]/g;
				let idDependente = null;

				this.source.name = "";

				// verificar se a data é do titular
				if( dataNascimento.replace( regNotNumber , "") == contratante.nascimento.replace( regNotNumber, "" ) ){
					this.source.name = contratante.nome;
				}else {
					// encontrar id do dependente pela data de nascimento
					for (const dependente of dependentesCadastrados) {
						if( dependente.value.replace( regNotNumber, "" ) == dataNascimento.replace( regNotNumber, "" ) ){
							idDependente  = dependente.id;
							break;
						}
					}
					// encontrar objeto correto a partir do id obtido
					for (const dependente of nomesDependente) {
						if( dependente.id == idDependente ){
							// obter o nome do depentente
							for (const field of dependente.fields) {
								if( field.name == "nome" ){
									this.source.name = field.value;
									break;
								}
							}
							break;
						}
					}						
				}
			}
		},
		created : function(){
      let valor = 0;
      valor = parseFloat( this.source.valor );

      if( valor == 0 )
        this.monstrandoComponente = false;
      else 
				this.monstrandoComponente = true;
				
			// GET NAME
			this.getName();
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

</script>