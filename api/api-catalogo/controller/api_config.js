const neo4j = require("neo4j-driver").v1;
var appConfigs = require("../../../../../app-services-configs/app-services-configs");

exports.neo4j_driver = {};
exports.neo4j_driver.url_bold = appConfigs.configs.api_catalogo.url_neo4j_bolt;
exports.neo4j_driver.auth = neo4j.default.auth.basic(appConfigs.configs.api_catalogo.neo4j_user, appConfigs.configs.api_catalogo.neo4j_password);


exports.security_api = {};
(exports.security_api.http_server =
  "http://hml_seguranca_oauth.grupo.qualicorp"),
  (exports.security_api.resource_uri = "/api/ValidarToken");
