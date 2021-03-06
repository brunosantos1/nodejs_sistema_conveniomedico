var appConfigs = require('../../../../../app-services-configs/app-services-configs');
const neo4j = require("neo4j-driver").v1;

exports.neo4j_driver = {}
exports.neo4j_driver.url_bolt = appConfigs.configs.api_controle_acesso.url_neo4j_bolt
exports.neo4j_driver.auth = neo4j.default.auth.basic(appConfigs.configs.api_controle_acesso.neo4j_user, appConfigs.configs.api_controle_acesso.neo4j_password)
exports.urlAutServer = 'http://10.253.4.70:8080/';
exports.urlAutServico = 'AutQualicorp/acesso?wsdl';
exports.urlPrimeiroAcessoServico = 'AutQualicorp/primeiroAcesso?wsdl';
exports.urlEsqueciServico = 'AutQualicorp/esqueciSenha?wsdl';
exports.urlAlterarServico = 'AutQualicorp/esqueciSenhaAlteracao?wsdl';
exports.idOrigem = '66';

exports.security_api = {};
(exports.security_api.http_server =
  "http://hml_seguranca_oauth.grupo.qualicorp"),
  (exports.security_api.resource_uri = "/api/ValidarToken");
