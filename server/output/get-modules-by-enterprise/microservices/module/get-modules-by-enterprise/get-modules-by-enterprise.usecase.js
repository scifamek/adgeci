"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetModulesByEnterpriseIdUsecase = void 0;
class GetModulesByEnterpriseIdUsecase {
    constructor(modulesEnterpriseRepository, modulesMasterRepository) {
        this.modulesEnterpriseRepository = modulesEnterpriseRepository;
        this.modulesMasterRepository = modulesMasterRepository;
    }
    call(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = [];
            const adquiredModules = yield this.modulesEnterpriseRepository.getModules();
            for (const mod of adquiredModules) {
                const moduleInside = yield this.modulesMasterRepository.getModuleById(mod["module_id"]);
                response.push({
                    module: moduleInside,
                    custom_name: mod["custom_name"],
                });
            }
            return response;
        });
    }
}
exports.GetModulesByEnterpriseIdUsecase = GetModulesByEnterpriseIdUsecase;
