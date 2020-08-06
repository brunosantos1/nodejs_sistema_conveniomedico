var appConfigs = require('../../../../../app-services-configs/app-services-configs');
const neo4j = require("neo4j-driver").v1;

exports.neo4j_driver = {}
exports.neo4j_driver.url_bold = appConfigs.configs.api_documento.url_neo4j_bolt
exports.neo4j_driver.auth = neo4j.default.auth.basic(appConfigs.configs.api_documento.neo4j_user, appConfigs.configs.api_documento.neo4j_password)

exports.security_api = {}
exports.security_api.http_server = appConfigs.configs.api_documento.security_api_http_server
exports.security_api.resource_uri = appConfigs.configs.api_documento.resource_uri
exports.security_api.aws_user = appConfigs.configs.api_documento.aws_user

