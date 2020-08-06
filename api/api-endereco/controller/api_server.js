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

server.get("/endereco/Estados", api_controller.ConsultarEstados);
server.get("/endereco/Municipio/:uf", api_controller.ConsultarCidadesPorEstado);
server.get("/endereco/Enderecos/:cep", api_controller.ConsultarEndereco);
server.post("/endereco", api_controller.ValidarRequest, api_controller.GravarEndereco);

exports.server = server;
