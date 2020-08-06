var appConfigs = require('../../../../../app-services-configs/app-services-configs');
const neo4j = require("neo4j-driver").v1;

exports.neo4j_driver = {}
exports.neo4j_driver.url_bold = appConfigs.configs.contratacao.url_neo4j_bolt
exports.neo4j_driver.auth = neo4j.default.auth.basic(appConfigs.configs.contratacao.neo4j_user, appConfigs.configs.contratacao.neo4j_password)

exports.neo4j_driver_estatica = {}
exports.neo4j_driver_estatica.url_bold = appConfigs.configs.neo4j_estrutura_estatica.url_neo4j_bolt;
exports.neo4j_driver_estatica.auth = neo4j.default.auth.basic(appConfigs.configs.neo4j_estrutura_estatica.neo4j_user, appConfigs.configs.neo4j_estrutura_estatica.neo4j_password)

exports.security_api = {}
exports.security_api.http_server = appConfigs.configs.contratacao.security_api_http_server
exports.security_api.resource_uri = appConfigs.configs.contratacao.resource_uri

exports.range_proposta_url = appConfigs.configs.gravitee.url + appConfigs.configs.contratacao.range_proposta_uri
exports.range_proposta_contrato = appConfigs.configs.contratacao.range_proposta_contrato
exports.range_proposta_observacao = appConfigs.configs.contratacao.range_proposta_observacao
exports.range_proposta_usuario = appConfigs.configs.contratacao.range_proposta_usuario
