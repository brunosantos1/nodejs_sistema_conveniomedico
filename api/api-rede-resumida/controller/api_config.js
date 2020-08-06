const neo4j = require("neo4j-driver").v1;
var appConfigs = require("../../../../../app-services-configs/app-services-configs");

exports.neo4j_driver = {};
exports.neo4j_driver.url_bold = appConfigs.configs.api_rede_resumida.url_neo4j_bolt;
exports.neo4j_driver.auth = neo4j.default.auth.basic(appConfigs.configs.api_rede_resumida.neo4j_user, appConfigs.configs.api_rede_resumida.neo4j_password);

exports.security_api = {};
(exports.security_api.http_server =
  "http://hml_seguranca_oauth.grupo.qualicorp"),
  (exports.security_api.resource_uri = "/api/ValidarToken");

//
//Método exports de configuração
//
exports.requestApi = {

  Auth: {
    url: '/oauth/access-token',
    baseUrl: 'https://apisulamerica.sensedia.com/dev/referenciada/api/v2',
    headers: {
      'Authorization': 'Basic Yjc4YTU0MGItYWVjZi0zMGFmLWE4ZTMtM2JmNzIwN2YyYmU5OjdiYzM1MzM4LTUxOTMtMzA2Yi1hMDI2LWFjNzI0ODllNTdkYQ==',
      'Content-Type': 'application/json'
    },
  },

  Send: {
    url: '/prestadores',
    baseUrl:'https://apisulamerica.sensedia.com/dev/referenciada/api/v2',
    headers: {
      Accept: 'application/json',
      client_id: 'b78a540b-aecf-30af-a8e3-3bf7207f2be9'
    }
  }
}