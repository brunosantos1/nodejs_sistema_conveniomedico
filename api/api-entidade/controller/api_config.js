var appConfigs = require("../../../../../app-services-configs/app-services-configs");
const neo4j = require("neo4j-driver").v1;

exports.neo4j_driver = {};
exports.neo4j_driver.url_bolt = appConfigs.configs.api_entidade.url_neo4j_bolt;
exports.neo4j_driver.auth = neo4j.default.auth.basic(appConfigs.configs.api_entidade.neo4j_user, appConfigs.configs.api_entidade.neo4j_password);

exports.neo4j_catalogo = {}
exports.neo4j_catalogo.url_bolt = appConfigs.configs.neo4j_catalogo.url_neo4j_bolt;
exports.neo4j_catalogo.auth = neo4j.default.auth.basic(appConfigs.configs.neo4j_catalogo.neo4j_user, appConfigs.configs.neo4j_catalogo.neo4j_password)

