var appConfigs = require('../app-services-configs');
const QNeo4j = require("@qualitech/qneo4j")


exports.core = {}
exports.core.http_server = `http://devst2ap34:8082`;
exports.core.resource_uri = `/balde-evento/core-evento`;

exports.db = new QNeo4j({
    url: appConfigs.configs.base_Dados.url_neo4j_bolt,
    username: appConfigs.configs.base_Dados.neo4j_user,
    password: appConfigs.configs.base_Dados.neo4j_password,
    raw: false
  });

exports.dbSQL = {
    user: appConfigs.configs.base_dados_SQL.user,
    password: appConfigs.configs.base_dados_SQL.password,
    server: appConfigs.configs.base_dados_SQL.server,
    database: appConfigs.configs.base_dados_SQL.database,
 
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
  }

exports.idSequencia = { 
  ID_SEQ_PESSOA_JURIDICA : 13,
  ID_SEQ_PRE_CADASTRO : 19,
  ID_SEQ_TAXA_ADESAO : 20,
  ID_SEQ_OBSERVACAO_PRE_CADASTRO : 22,
  ID_SEQ_PRE_PESSOA : 55,
  ID_SEQ_PRE_TELEFONE : 59,
  ID_SEQ_QUESTIONARIO_PRE_PESSOA : 60,
  ID_SEQ_QUESTIONARIO_RESPOSTA : 62
};