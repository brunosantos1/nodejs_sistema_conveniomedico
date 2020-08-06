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

server.get("/parametriza-tela", api_controller.buscarPergunta);
server.put("/parametriza-tela", api_controller.alterarPergunta);
server.post("/parametriza-tela", api_controller.inclusaoPergunta);
server.del("/parametriza-tela", api_controller.deletarPergunta);

exports.server = server;
