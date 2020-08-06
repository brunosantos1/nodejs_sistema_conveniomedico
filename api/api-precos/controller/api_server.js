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

server.post("/precoplano/buscaRange", api_controller.BuscaRangePrecos);
server.post("/precoplano/reajuste", api_controller.validarReajuste, api_controller.listarPrecosReajuste);
exports.server = server;
