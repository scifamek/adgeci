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
exports.GetPresentationSchemaDefinitionUsecase = void 0;
class GetPresentationSchemaDefinitionUsecase {
    constructor(schemasRepository, presentationRepository) {
        this.schemasRepository = schemasRepository;
        this.presentationRepository = presentationRepository;
    }
    call(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.schemasRepository.getSchemasByCollection(body.collection);
            const presentation = yield this.presentationRepository.getPresentationBySchemaId(schema["_id"]);
            return presentation["definition"];
        });
    }
}
exports.GetPresentationSchemaDefinitionUsecase = GetPresentationSchemaDefinitionUsecase;
