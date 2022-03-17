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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.EntityController = void 0;
const base_controller_1 = require("../../../core/access/base-controller");
const response_codes_helpers_1 = require("../../../core/helpers/response-codes.helpers");
const mongodb_datasource_1 = require("../../../core/repository/datasource/mongodb.datasource");
const entity_repository_1 = require("../../../core/repository/enterprise/entity/entity-repository");
const schema_repository_1 = require("../../../core/repository/enterprise/schemas/schema-repository");
const schema_mapper_1 = require("../../../core/repository/enterprise/schemas/schema.mapper");
const enterprise_master_repository_1 = require("../../../core/repository/master/enterprise/enterprise.master.repository");
const response_constants_1 = require("../response.constants");
const get_entities_by_type_usecase_1 = require("./get-entities-by-type.usecase");
const decorators_1 = require("../../../core/helpers/decorators");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
let masterDatabaseConnection = null;
let enterpriseDatabaseConnection = null;
/**
 * This function is encharged of creating a new entity in a specified collection.
 */
class EntityController extends base_controller_1.BaseController {
    handler(event, context, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(event, 123);
            const params = event.queryStringParameters || {};
            const headers = event.headers || {};
            if (!headers.token) {
                return {
                    statusCode: 304,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        code: {
                            status: 304,
                            message: "Token is not present in the header",
                        },
                        data: {},
                    }),
                };
            }
            const decodedToken = (0, jwt_decode_1.default)(headers.token);
            const MASTER_DATABASE_NAME = process.env["MASTER_DATABASE_NAME"];
            const CLUSTER_URI = process.env["MONGODB_ATLAS_CLUSTER_URI"];
            const dataSource = new mongodb_datasource_1.MongoDBDatasource();
            masterDatabaseConnection = yield dataSource.getConnection(CLUSTER_URI, MASTER_DATABASE_NAME, masterDatabaseConnection);
            const enterpriseMasterRepository = new enterprise_master_repository_1.EnterpriseMasterRepository(masterDatabaseConnection);
            const enterpriseObj = yield enterpriseMasterRepository.getEnterpriseById(decodedToken["enterpriseId"]);
            if (enterpriseObj && enterpriseObj.database_name) {
                enterpriseDatabaseConnection = yield dataSource.getConnection(CLUSTER_URI, enterpriseObj.database_name, enterpriseDatabaseConnection);
            }
            const schemaMapper = new schema_mapper_1.SchemaMapper();
            const schemaEnterpriseRepository = new schema_repository_1.SchemaEnterpriseRepository(enterpriseDatabaseConnection, schemaMapper);
            const entityRepository = new entity_repository_1.EntityEnterpriseRepository(enterpriseDatabaseConnection);
            const usecase = new get_entities_by_type_usecase_1.GetEntitiesByTypeUsecase(schemaEnterpriseRepository, entityRepository);
            const response = yield usecase.call(params);
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: (0, response_codes_helpers_1.buildResponseCode)(response_constants_1.BASE_CODE, response_constants_1.RESPONSE_CODES_MAPPER.ENTITIES_BY_TYPE_FOUNDED_SUCCESSFULLY, params),
                    data: Object.assign({}, response),
                }),
            };
        });
    }
}
__decorate([
    (0, decorators_1.method)("get"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], EntityController.prototype, "handler", null);
exports.EntityController = EntityController;
const entityController = new EntityController();
exports.handler = entityController.handler;
