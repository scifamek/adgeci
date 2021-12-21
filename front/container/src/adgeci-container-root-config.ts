import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@adgeci/entities",
  app: () => System.import("@adgeci/entities"),
  activeWhen: ["/entities"],
});

start({
  urlRerouteOnly: true,
});
