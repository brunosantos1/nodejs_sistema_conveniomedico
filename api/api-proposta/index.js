var appConfigs = require('../../../../app-services-configs/app-services-configs');
var controller = require("./controller");
var api_controller = require("./controller/api_controller");
var CronJob = require('cron').CronJob;

const job = new CronJob('0-59/10 * * * * *', function () {
  api_controller.statusAceitacao();
}, null, true, 'America/Sao_Paulo');


async function startup() {
  console.log("Iniciando a aplicação api-proposta");

  try {
    console.log("Iniciando o módulo api-proposta web server");

    controller.server.listen(appConfigs.configs.proposta.http_port, function() {
      console.log(
        "%s módulo iniciado em %s",
        controller.server.name,
        controller.server.url
      );
    });
  } catch (err) {
    console.log("Erro ao iniciar api api-proposta.");
    console.error(err);
    process.exit(1);
  }
}

startup();
