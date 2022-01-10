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
exports.GetEntitiesByTypeUsecase = void 0;
class GetEntitiesByTypeUsecase {
    constructor(schemasRepository, entitiesRepository) {
        this.schemasRepository = schemasRepository;
        this.entitiesRepository = entitiesRepository;
    }
    call(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.schemasRepository.getSchemasByCollection(params.collection);
            const relationship = [];
            for (const property in schema["definition"]) {
                const value = schema["definition"][property];
                if ("relationship" in value) {
                    const coll = value["relationship"];
                    relationship.push({
                        relationship: coll,
                        name: property,
                        local: value["local"],
                    });
                }
            }
            const entities = yield this.entitiesRepository.getExpandedEntitiesByType(params.collection, params.page, params.sizePage, relationship);
            return entities;
        });
    }
}
exports.GetEntitiesByTypeUsecase = GetEntitiesByTypeUsecase;
