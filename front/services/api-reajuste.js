import repository from './repository'
const resource = "/precoplano/reajuste";

export default {
	consultarReajuste : async function(parametros) {
		try {
			let response = await repository.post(resource , parametros);
			return response
		} catch (error) {
			throw error;
		}
	}
}