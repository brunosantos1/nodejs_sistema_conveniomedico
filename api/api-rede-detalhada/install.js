var Service = require("node-windows").Service;

// Create a new service object
var svc = new Service({
  name: "api-rede-detalhada",
  description: "Retorna rede referenciada detalhada",
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
