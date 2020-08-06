var api_log = require("./api_log").log;
var api_controller = require("./api_controller");
var aws = require("./aws");
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

server.post("/documento/balde", api_controller.CriarBalde);
server.post("/documento", api_controller.ValidarMergeDocumento, aws.MergeArquivoAWS, api_controller.MergeDocumento, aws.VisualizarArquivoAWS);
server.post("/documento/upload", api_controller.ValidarMergeDocumento, aws.MergeArquivoAWS, api_controller.MergeUploadDocumento);
server.post("/documento/excluir", aws.DeletarArquivoAWS, api_controller.ExcluirDocumento);
server.post("/documento/visualizar", aws.VisualizarArquivoAWS);
server.post("/documento/proposta/visualizar", aws.VisualizarArquivoPropostaAWS);
server.post("/documento/proposta/detalhe", aws.VisualizarArquivoPropostaDetalheAWS);
server.post("/documento/proposta/lista", api_controller.ConsultarDocumentosProposta);
server.post("/documento/pessoa/lista", api_controller.ConsultarDocumentosPessoa);
exports.server = server;
