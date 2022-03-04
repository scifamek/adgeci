import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@adgeci/entities",
  app: () => System.import("@adgeci/entities"),
  activeWhen: ["/entities"],
});


registerApplication({
  name: "@adgeci/authentication",
  app: () => System.import("@adgeci/authentication"),
  activeWhen: ["/authentication"],
});



registerApplication({
  name: "@adgeci/home",
  app: () => System.import("@adgeci/home"),
  activeWhen: ["/home"],
});

start({
  urlRerouteOnly: true,
});
