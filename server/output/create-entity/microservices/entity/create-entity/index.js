"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.handler = exports.EntityController = void 0;
const base_controller_1 = require("../../../core/access/base-controller");
const response_codes_helpers_1 = require("../../../core/helpers/response-codes.helpers");
const entity_repository_1 = require("../../../core/repository/enterprise/entity/entity-repository");
const decorators_1 = require("../../../core/helpers/decorators");
const create_entity_usecase_1 = require("./create-entity.usecase");
const response_constants_1 = require("../response.constants");
const enterprise_identifiers_middleware_1 = require("../../../core/access/middlewares/enterprise-identifiers/enterprise-identifiers.middleware");
const jwt_structure_middleware_1 = require("../../../core/access/middlewares/jwt-structure/jwt-structure.middleware");
/**
 * This function is encharged of creating a new entity in a specified collection.
 */
class EntityController extends base_controller_1.BaseController {
    handler(event, context, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = event.body || {};
            const { enterpriseDataSource, masterDataSource } = yield this.getInfrastructureComponents(event);
            const entityRepository = new entity_repository_1.EntityEnterpriseRepository(enterpriseDataSource);
            const usecase = new create_entity_usecase_1.CreateEntityUsecase(entityRepository);
            const response = yield usecase.call(body).toPromise();
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: (0, response_codes_helpers_1.buildResponseCode)(response_constants_1.BASE_CODE, response_constants_1.RESPONSE_CODES_MAPPER.ENTITY_SUCCESSFULLY_STORED, body),
                    data: response,
                }),
            };
        });
    }
}
__decorate([
    (0, jwt_structure_middleware_1.JWTStructureMiddleware)(),
    (0, enterprise_identifiers_middleware_1.EnterpriseIdentifiersMiddleware)(),
    (0, decorators_1.method)("post"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], EntityController.prototype, "handler", null);
exports.EntityController = EntityController;
const entityController = new EntityController();
exports.handler = entityController.handler;
