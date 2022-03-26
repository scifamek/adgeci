"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEntityUsecase = void 0;
class CreateEntityUsecase {
    constructor(entitiesRepository) {
        this.entitiesRepository = entitiesRepository;
    }
    call(data) {
        const response = this.entitiesRepository.createEntityByType(data.collection, data.entity);
        return response;
    }
}
exports.CreateEntityUsecase = CreateEntityUsecase;
