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
exports.GetSchemaDefinitionUsecase = void 0;
class GetSchemaDefinitionUsecase {
    constructor(schemasRepository) {
        this.schemasRepository = schemasRepository;
    }
    call(params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(params);
            const schema = yield this.schemasRepository.getSchemasByCollection(params.collection);
            console.log(schema);
            const response = this.extractMetadata(schema);
            return response;
        });
    }
    extractMetadata(entitiesBySchema) {
        var tags = [];
        var definitions = [];
        var columns = [];
        for (const key in entitiesBySchema.definition) {
            if (Object.prototype.hasOwnProperty.call(entitiesBySchema.definition, key)) {
                const element = entitiesBySchema.definition[key];
                if (element["visible"] && element["usable"]) {
                    tags.push(element["display"]);
                    definitions.push(key);
                    columns.push({
                        definition: key,
                        tag: element["display"],
                    });
                }
            }
        }
        return {
            tags: tags,
            definitions: definitions,
            columns: columns,
        };
    }
}
exports.GetSchemaDefinitionUsecase = GetSchemaDefinitionUsecase;
