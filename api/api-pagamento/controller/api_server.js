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

server.get("/pagamento/formas", api_controller.listarFormasPagamento);
server.get("/pagamento/validar/:banco/:ag/:cc", api_controller.ValidarConta);
server.get("/pagamento/consultar/:nrProposta",api_controller.CarregarDadosPagamento);
server.post("/pagamento/formas",api_controller.validarFormaPagamentoProposta, api_controller.IncluirFormaPagamentoProposta);

exports.server = server;
