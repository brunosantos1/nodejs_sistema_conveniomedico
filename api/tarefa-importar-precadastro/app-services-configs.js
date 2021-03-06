exports.configs = 
{
		tarefa_importar_precadastro:{
			http_port: 9026,
			url_neo4j_bolt: "bolt://devst2ap34.grupo.qualicorp:8568",
			neo4j_user: "neo4j",
			neo4j_password: "admin",
			core_http_server:'http://devst2ap34.grupo.qualicorp:8082',
			core_resource_uri:'/balde-evento/core-evento',
			security_api_http_server:'http://hml_seguranca_oauth.grupo.qualicorp',
			security_api_resource_uri:'/api/ValidarToken',
			apiGateway_apiKey: 'apiGateway_apiKey'
	},
	base_Dados: { 
		url_neo4j_bolt: "bolt://DEVAWSAP03:8568",
		neo4j_user: "neo4j",
		neo4j_password: "admin"
	},
	base_dados_SQL: {
		user: 'quali',
		password: 'corpquali',
		server: 'db_desenv', // You can use 'localhost\\instance' to connect to named instance
		database: 'qsaude',
	}

}