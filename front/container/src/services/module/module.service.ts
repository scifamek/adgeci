export class ModuleService {
  getModulesByEnterprise() {
    return fetch("http://localhost:3000/get-modules-by-enterprise");
  }
}
