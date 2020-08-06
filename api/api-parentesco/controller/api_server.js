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

server.get("/parentesco/:idplano_sinf", api_controller.validarGrauParentesco, api_controller.listarGrauParentesco);
server.get("/parentesco/dependente/:idplano_sinf", api_controller.validarGrauParentesco, api_controller.listarGrauParentescoDependente);
server.get("/parentesco/representante/:idplano_sinf", api_controller.validarGrauParentesco, api_controller.listarGrauParentescoRepresentante);

exports.server = server;
