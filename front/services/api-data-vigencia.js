import repository from './repository'
const resource = "/plano/vigencia/{0}";

export default {
	async listarDatasVigencia( id ) {
		try {
			let endpoint = resource.replace( "{0}" , id );
			return await repository.get(endpoint);
		} catch (error) {
			console.log(error);
		}
	},
	async salvarDataVigencia( parameter = {} ){
		try {
			let endpoint = "contratacao/vigencia";
			return await repository.post( endpoint , parameter );
		} catch (error) {
			throw  `error at SalvarDataVigencia() --> ${ error }`;
		}
	}
}

