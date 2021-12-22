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
exports.handler = exports.ModuleController = void 0;
const base_controller_1 = require("../../../core/access/base-controller");
const response_codes_helpers_1 = require("../../../core/helpers/response-codes.helpers");
const mongodb_datasource_1 = require("../../../core/repository/datasource/mongodb.datasource");
const enterprise_master_repository_1 = require("../../../core/repository/master/enterprise/enterprise.master.repository");
const get_modules_by_enterprise_usecase_1 = require("./get-modules-by-enterprise.usecase");
const response_constants_1 = require("../response.constants");
const modules_repository_1 = require("../../../core/repository/enterprise/modules/modules-repository");
const modules_master_repository_1 = require("../../../core/repository/master/modules/modules.master.repository");
let masterDatabaseConnection = null;
let enterpriseDatabaseConnection = null;
/**
 * This function is encharged of getting all modules configured for a enterprise.
 */
class ModuleController extends base_controller_1.BaseController {
    handler(body, context, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const MASTER_DATABASE_NAME = process.env["MASTER_DATABASE_NAME"];
            const CLUSTER_URI = process.env["MONGODB_ATLAS_CLUSTER_URI"];
            const mongoDataSource = new mongodb_datasource_1.MongoDBDatasource();
            masterDatabaseConnection = yield mongoDataSource.getConnection(CLUSTER_URI, MASTER_DATABASE_NAME, masterDatabaseConnection);
            const enterpriseMasterRepository = new enterprise_master_repository_1.EnterpriseMasterRepository(masterDatabaseConnection);
            const enterpriseObj = yield enterpriseMasterRepository.getEnterpriseById(body["enterpriseId"]);
            if (enterpriseObj && enterpriseObj.database_name) {
                enterpriseDatabaseConnection = yield mongoDataSource.getConnection(CLUSTER_URI, enterpriseObj.database_name, enterpriseDatabaseConnection);
            }
            const modulesMasterRepository = new modules_master_repository_1.ModulesMasterRepository(masterDatabaseConnection);
            const modulesEnterpriseRepository = new modules_repository_1.ModulesEnterpriseRepository(enterpriseDatabaseConnection);
            const usecase = new get_modules_by_enterprise_usecase_1.GetModulesByEnterpriseIdUsecase(modulesEnterpriseRepository, modulesMasterRepository);
            const response = yield usecase.call(body);
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: (0, response_codes_helpers_1.buildResponseCode)(response_constants_1.BASE_CODE, response_constants_1.RESPONSE_CODES_MAPPER.MODULES_SUCCESSFULLY_FOUNDED, enterpriseObj),
                    data: {
                        id: response,
                    },
                }),
            };
        });
    }
}
exports.ModuleController = ModuleController;
const entityController = new ModuleController();
exports.handler = entityController.handler;
