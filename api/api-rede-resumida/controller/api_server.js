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

server.post("/rede-resumida", api_controller.buscaRedeResumida);
server.get("/rede-resumida/:tipo/:id",api_controller.buscaRedeResumidaPorId);
server.get("/rede-resumida/:tipo/:id/:prestador",api_controller.buscaRedeResumidaPorId);
server.post("/rede-detalhada",api_controller.buscaRedeDetalhada);



exports.server = server;
