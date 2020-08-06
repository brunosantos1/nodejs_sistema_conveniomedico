var appConfigs = require('../../../../../app-services-configs/app-services-configs');
const neo4j = require("neo4j-driver").v1;

exports.neo4j_driver = {}
exports.neo4j_driver.url_bold = appConfigs.configs.simulacao.url_neo4j_bolt
exports.neo4j_driver.auth = neo4j.default.auth.basic(appConfigs.configs.simulacao.neo4j_user, appConfigs.configs.simulacao.neo4j_password)

// exports.neo4j_driver = {};
// exports.neo4j_driver.url_bold = "bolt://DEVAWSAP03:8568";
// //exports.neo4j_driver.url_bold = "bolt://localhost:11008";
// exports.neo4j_driver.auth = neo4j.default.auth.basic("neo4j", "admin");

 exports.security_api = {};
 (exports.security_api.http_server =
   "http://hml_seguranca_oauth.grupo.qualicorp"),
   (exports.security_api.resource_uri = "/api/ValidarToken");
