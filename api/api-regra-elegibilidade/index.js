var appConfigs = require('./app-services-configs');
var controller = require("./controller");

async function startup() {
  console.log("Iniciando a aplicação regra_elegibilidade");

  try {
    console.log("Iniciando o módulo regra_elegibilidade web server");

    controller.server.listen(appConfigs.configs.regra_elegibilidade.http_port, function() {
      console.log(
        "%s módulo iniciado em %s",
        controller.server.name,
        controller.server.url
      );
    });
  } catch (err) {
    console.log("Erro ao iniciar api regra_elegibilidade.");
    console.error(err);
    process.exit(1);
  }
}

startup();
