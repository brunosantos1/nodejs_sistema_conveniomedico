const neo4j = require("neo4j-driver").v1;
var appConfigs = require('../../../../../app-services-configs/app-services-configs');

exports.neo4j_driver = {}
exports.neo4j_driver.url_bolt = appConfigs.configs.neo4j_catalogo.url_neo4j_bolt;
exports.neo4j_driver.auth = neo4j.default.auth.basic(appConfigs.configs.neo4j_catalogo.neo4j_user, appConfigs.configs.neo4j_catalogo.neo4j_password)

exports.neo4j_driver_estatica = {}
exports.neo4j_driver_estatica.url_bolt = appConfigs.configs.neo4j_estrutura_estatica.url_neo4j_bolt;
exports.neo4j_driver_estatica.auth = neo4j.default.auth.basic(appConfigs.configs.neo4j_estrutura_estatica.neo4j_user, appConfigs.configs.neo4j_estrutura_estatica.neo4j_password)

exports.caminhoImagens = appConfigs.configs.imagensOperadoras.caminhoImagens;

//TODO: Alterar a filial quando houver a criação para uma exclusiva do E-commerce
exports.filial = appConfigs.configs.api_plano.filial;
exports.quantidade = 4 //Total de datas de vigência que poderão ser exibidas
