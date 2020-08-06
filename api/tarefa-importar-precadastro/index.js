var appConfigs = require('../../../../app-services-configs/app-services-configs');
var controller = require("./controller");

async function startup() {
  console.log("Iniciando a aplicação tarefa-importar-precadastro");

  try {
    console.log("Iniciando o módulo tarefa-importar-precadastro web server");

    controller.server.listen(appConfigs.configs.tarefa_importar_precadastro.http_port, function() {
      console.log(
        "%s módulo iniciado em %s",
        controller.server.name,
        controller.server.url
      );
    });
  } catch (err) {
    console.log("Erro ao iniciar api tarefa-importar-precadastro.");
    console.error(err);
    process.exit(1);
  }
}

startup();
