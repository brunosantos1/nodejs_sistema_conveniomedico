var appConfigs = require('../../../../app-services-configs/app-services-configs');
var controller = require("./controller");

async function startup() {
  console.log("Iniciando a aplicação documento");

  try {
    console.log("Iniciando o módulo documento web server");

    controller.server.listen(appConfigs.configs.api_documento.http_port, function() {
      console.log(
        "%s módulo iniciado em %s",
        controller.server.name,
        controller.server.url
      );
    });
  } catch (err) {
    console.log("Erro ao iniciar api documento.");
    console.error(err);
    process.exit(1);
  }
}

startup();
