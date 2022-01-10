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
exports.GetFormattedEntitiesByType = void 0;
class GetFormattedEntitiesByType {
    constructor(schemasRepository, entitiesRepository) {
        this.schemasRepository = schemasRepository;
        this.entitiesRepository = entitiesRepository;
    }
    call(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.schemasRepository.getSchemasByCollection(body.collection);
            const relationship = [];
            for (const property in schema["definition"]) {
                const value = schema["definition"][property];
                if ("relationship" in value) {
                    const coll = value["relationship"];
                    const schemaRelationship = yield this.schemasRepository.getSchemasByCollection(coll);
                    relationship.push({
                        relationship: coll,
                        name: property,
                        local: value["local"],
                        repr: schemaRelationship["repr"],
                    });
                }
            }
            const entities = yield this.entitiesRepository.getFormattedEntitiesByType(body.collection, body.page, body.sizePage, body.definition, relationship);
            const response = [];
            for (const item of entities) {
                var temp = {};
                for (const key in item["properties"]) {
                    if (Object.hasOwnProperty.call(item["properties"], key)) {
                        const element = item["properties"][key];
                        temp[key] = element;
                    }
                }
                for (const key in item) {
                    if (["properties"].indexOf(key) <= -1) {
                        console.log(key);
                        if (Object.hasOwnProperty.call(item, key)) {
                            const element = item[key];
                            temp[key] = element;
                        }
                    }
                }
                response.push(temp);
            }
            return response;
        });
    }
}
exports.GetFormattedEntitiesByType = GetFormattedEntitiesByType;
