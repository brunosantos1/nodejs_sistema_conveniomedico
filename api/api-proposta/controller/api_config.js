var appConfigs = require('../../../../../app-services-configs/app-services-configs');
const QNeo4j = require("@qualitech/qneo4j");

exports.db = new QNeo4j({
  url: appConfigs.configs.neo4j_catalogo.url_neo4j_bolt,
  username: appConfigs.configs.neo4j_catalogo.neo4j_user,
  password: appConfigs.configs.neo4j_catalogo.neo4j_password,
  raw: false
});

exports.core = appConfigs.configs.proposta;

