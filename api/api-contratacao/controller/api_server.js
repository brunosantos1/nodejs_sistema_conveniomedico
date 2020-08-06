var api_log = require("./api_log").log;
var api_controller = require("./api_controller");
var restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");
const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["*"]
});
const criar_proposta = require("./api_functions/criar_proposta");

var server = restify.createServer();

server.pre(cors.preflight);
server.use(cors.actual);
server.use(api_log);
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.get("/contratacao/:nrProposta", api_controller.ConsultarProposta);
server.get("/contratacao/propostas/:cpf", api_controller.ConsultarPropostaPessoa);
server.post("/contratacao", criar_proposta.validarCriacaoProposta, api_controller.CriarProposta);
server.post("/contratacao/ResponsavelFinanceiro", api_controller.validarResponsavelFinanceiro, api_controller.IncluirResponsavelFinanceiro);
server.post("/contratacao/vigencia",api_controller.validarVigencia, api_controller.atualizarVigencia);
server.put("/contratacao", api_controller.AtualizarProposta);
server.put("/contratacao/atualizarSequencia", api_controller.AtualizarSequencia);
server.put("/contratacao/atualizarStatus", api_controller.AtualizarStatus);
server.post("/contratacao/cancelarProposta", api_controller.CancelarProposta);
exports.server = server;
