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
server.use(restify.plugins.queryParser());

server.post("/pessoa",[api_controller.validarPessoa, api_controller.validarPessoaExistente], api_controller.incluirPessoa);
server.put("/pessoa",api_controller.validarPessoa, api_controller.alterarPessoa); 
server.del("/pessoa/:cpf", api_controller.excluirPessoa); 
server.get("/pessoa/:cpf", api_controller.consultarPessoa); 
server.post("/pessoa/dependente",api_controller.validarDependente, api_controller.incluirDependenteAPI);

exports.server = server;
