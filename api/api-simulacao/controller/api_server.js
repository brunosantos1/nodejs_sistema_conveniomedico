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

server.post("/simulacao", api_controller.ValidarRequest, api_controller.IncluirSimulacao);
server.put("/simulacao", api_controller.AlterarSimulacao);
server.get("/simulacao/:CPF", api_controller.ConsultarSimulacao);

exports.server = server;
