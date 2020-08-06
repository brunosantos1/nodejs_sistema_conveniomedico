var appConfigs = require("../../../../app-services-configs/app-services-configs");
var controller = require("./controller");

async function startup() {
  console.log("Iniciando a aplicação pessoa");

  try {
    console.log("Iniciando o módulo pessoa web server");

    controller.server.listen(appConfigs.configs.pessoa.http_port, function() {
      console.log(
        "%s módulo iniciado em %s",
        controller.server.name,
        controller.server.url
      );
    });
  } catch (err) {
    console.log("Erro ao iniciar api pessoa.");
    console.error(err);
    process.exit(1);
  }
}

startup();
