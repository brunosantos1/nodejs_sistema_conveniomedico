var Service = require("node-windows").Service;

// Create a new service object
var svc = new Service({
  name: "API-Controle-Acesso",
  description: "API de Controle de Acesso de Usuários",
  script: "./index.js",
  nodeOptions: ["--harmony", "--max_old_space_size=4096"],
  env: {
    name: "NODE_ENV",
    value: "production"
  }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function() {
  svc.start();
});

svc.install();
