var appConfigs = require('../app-services-configs');
const neo4j = require("neo4j-driver").v1;

// exports.neo4j_driver = {}
// exports.neo4j_driver.url_bold = appConfigs.configs.tarefa-importar-precadastro.url_neo4j_bolt
// exports.neo4j_driver.auth = neo4j.default.auth.basic(appConfigs.configs.tarefa-importar-precadastro.neo4j_user, appConfigs.configs.tarefa-importar-precadastro.neo4j_password)

// exports.security_api = {}
// exports.security_api.http_server = appConfigs.configs.tarefa-importar-precadastro.security_api_http_server
// exports.security_api.resource_uri = appConfigs.configs.tarefa-importar-precadastro.resource_uri


exports.core = {}
exports.core.http_server = `http://devst2ap34:8082`;
exports.core.resource_uri = `/balde-evento/core-evento`;

