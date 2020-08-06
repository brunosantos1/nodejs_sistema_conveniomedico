var controller = require("./controller");
var appConfigs = require("../../../../app-services-configs/app-services-configs")

async function startup() {
  console.log("Iniciando a aplicação api-entidade");

  try {
    console.log("Iniciando módulo server da aplicação api-entidade");

    controller.server.listen(appConfigs.configs.api_entidade.http_port, function() {
      console.log(
        "%s módulo iniciado em %s",
        controller.server.name,
        controller.server.url
      );
    });
  } catch (err) {
    console.log("Erro ao iniciar api-entidade");
    console.error(err);
    process.exit(1);
  }
}

async function shutdown(e) {
  let err = e;

  console.log("Finalizando a  aplicacção api-entidade");
  try {
    console.log("Finalizando o módulo webserver");
    await controller.server.close();
    console.log("módulo webserver finalizado.");
  } catch (e) {
    console.error(e);
    err = err || e;
  }
  console.log("Exiting process");
}

process.on("uncaughtException", err => {
  console.log("Uncaught exception");
  console.error(err);

  controller.server.close(() => {
    startup();
  });
});

startup();
