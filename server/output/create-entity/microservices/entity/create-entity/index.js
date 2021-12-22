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
exports.handler = exports.EntityController = void 0;
const base_controller_1 = require("../../../core/access/base-controller");
const response_codes_helpers_1 = require("../../../core/helpers/response-codes.helpers");
const mongodb_datasource_1 = require("../../../core/repository/datasource/mongodb.datasource");
const entity_repository_1 = require("../../../core/repository/enterprise/entity/entity-repository");
const enterprise_master_repository_1 = require("../../../core/repository/master/enterprise/enterprise.master.repository");
const create_entity_usecase_1 = require("./create-entity.usecase");
const response_constants_1 = require("../response.constants");
let masterDatabaseConnection = null;
let enterpriseDatabaseConnection = null;
/**
 * This function is encharged of creating a new entity in a specified collection.
 */
class EntityController extends base_controller_1.BaseController {
    handler(body, context, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const MASTER_DATABASE_NAME = process.env["MASTER_DATABASE_NAME"];
            const CLUSTER_URI = process.env["MONGODB_ATLAS_CLUSTER_URI"];
            const dataSource = new mongodb_datasource_1.MongoDBDatasource();
            masterDatabaseConnection = yield dataSource.getConnection(CLUSTER_URI, MASTER_DATABASE_NAME, masterDatabaseConnection);
            const enterpriseMasterRepository = new enterprise_master_repository_1.EnterpriseMasterRepository(masterDatabaseConnection);
            const enterpriseObj = yield enterpriseMasterRepository.getEnterpriseById(body["enterpriseId"]);
            if (enterpriseObj && enterpriseObj.database_name) {
                enterpriseDatabaseConnection = yield dataSource.getConnection(CLUSTER_URI, enterpriseObj.database_name, enterpriseDatabaseConnection);
            }
            const entityRepository = new entity_repository_1.EntityEnterpriseRepository(enterpriseDatabaseConnection);
            const usecase = new create_entity_usecase_1.CreateEntityUsecase(entityRepository);
            const response = yield usecase.call(body);
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: (0, response_codes_helpers_1.buildResponseCode)(response_constants_1.BASE_CODE, response_constants_1.RESPONSE_CODES_MAPPER.ENTITY_SUCCESSFULLY_STORED, body),
                    data: Object.assign({ id: response.insertedId }, body.entity),
                }),
            };
        });
    }
}
exports.EntityController = EntityController;
const entityController = new EntityController();
exports.handler = entityController.handler;
