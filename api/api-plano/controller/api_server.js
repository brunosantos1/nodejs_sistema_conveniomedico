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

server.post("/plano", api_controller.validarPlanos, api_controller.listarPlanos);
server.get("/plano/vigencia/:id", api_controller.validarVigencias, api_controller.listarVigencias);
server.get("/plano/situacao/:id", api_controller.validarVigencias, api_controller.validarSituacaoPlano);

exports.server = server;
