var appConfigs = require("../../../../app-services-configs/app-services-configs");
var controller = require("./controller");

async function startup() {
  console.log("Iniciando a aplicação API de Profissões ");

  try {
    console.log("Iniciando o módulo API de Profissões  web server");

    controller.server.listen(appConfigs.configs.profissao.http_port, function() {
      console.log(
        "%s módulo iniciado em %s",
        controller.server.name,
        controller.server.url
      );
    });
  } catch (err) {
    console.log("Erro ao iniciar api API de Profissões .");
    console.error(err);
    process.exit(1);
  }
}

startup();
