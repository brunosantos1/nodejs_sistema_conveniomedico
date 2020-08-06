var appConfigs = require('../../../../app-services-configs/app-services-configs');
var controller = require("./controller");

async function startup() {
  console.log("Iniciando a aplicação api-validacao");

  try {
    console.log("Iniciando o módulo api-validacao web server");

    controller.server.listen(appConfigs.configs.api_validacao.http_port, function() {
      console.log(
        "%s módulo iniciado em %s",
        controller.server.name,
        controller.server.url
      );
    });
  } catch (err) {
    console.log("Erro ao iniciar api api-validacao.");
    console.error(err);
    process.exit(1);
  }
}

startup();
