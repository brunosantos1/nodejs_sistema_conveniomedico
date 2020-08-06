var api_log = require("./api_log").log;
var api_controller = require("./api_controller");
var restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");
const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["*"]
});

var server = restify.createServer();

server.pre(cors.preflight);
server.use(cors.actual);
server.use(api_log);
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

server.post("/controle/autenticar", api_controller.ValidarAutenticacao, api_controller.AutenticarUsuario);
server.post("/controle/cadastro", api_controller.ValidarCadastro, api_controller.CadastarUsuario);
server.post("/controle/esqueci", api_controller.ValidarEsqueciSenha, api_controller.EsqueciSenhaUsuario);
server.post("/controle/alterar", api_controller.ValidarAlteracao, api_controller.AlterarSenhaUsuario);

exports.server = server;
