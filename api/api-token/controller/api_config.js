const QNeo4j = require("@qualitech/qneo4j")
var appConfigs = require("../../../../../app-services-configs/app-services-configs");

exports.db = new QNeo4j({
  url: appConfigs.configs.api_token.url_neo4j_bolt,
  username: appConfigs.configs.api_token.neo4j_user,
  password: appConfigs.configs.api_token.neo4j_password,
  raw: false
});

exports.config = {
  validadeToken: 'hours: 1'
}
