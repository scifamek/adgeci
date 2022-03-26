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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = exports.MONGODB_ATLAS_CLUSTER_URI_ENVIRONMENT_VARIABLE = exports.MASTER_DATABASE_NAME_ENVIRONMENT_VARIABLE = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const mongodb_datasource_1 = require("../repository/datasource/mongodb.datasource");
const enterprise_master_repository_1 = require("../repository/master/enterprise/enterprise.master.repository");
const enterprise_identifiers_constants_1 = require("../access/constants/enterprise-identifiers.constants");
exports.MASTER_DATABASE_NAME_ENVIRONMENT_VARIABLE = "MASTER_DATABASE_NAME";
exports.MONGODB_ATLAS_CLUSTER_URI_ENVIRONMENT_VARIABLE = "MONGODB_ATLAS_CLUSTER_URI";
class BaseController {
    constructor() { }
    getInfrastructureComponents(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const CLUSTER_URI = process.env[exports.MONGODB_ATLAS_CLUSTER_URI_ENVIRONMENT_VARIABLE];
            const MASTER_DATABASE_NAME = process.env[exports.MASTER_DATABASE_NAME_ENVIRONMENT_VARIABLE];
            const headers = event.headers;
            const decodedToken = (0, jwt_decode_1.default)(headers.token);
            const databaseName = decodedToken[enterprise_identifiers_constants_1.DATABASE_NAME_HEADER];
            const enterpriseId = decodedToken[enterprise_identifiers_constants_1.ENTERPRISE_ID_HEADER];
            const enterpriseDataSource = new mongodb_datasource_1.MongoDBDatasource();
            const masterDataSource = new mongodb_datasource_1.MongoDBDatasource();
            if (databaseName) {
                try {
                    yield enterpriseDataSource.setConnection(CLUSTER_URI, databaseName);
                }
                catch (error) {
                    if (enterpriseId) {
                        yield this.getConnectionsByEnterpiseId(masterDataSource, enterpriseDataSource, CLUSTER_URI, MASTER_DATABASE_NAME, enterpriseId);
                    }
                }
            }
            else if (enterpriseId) {
                yield this.getConnectionsByEnterpiseId(masterDataSource, enterpriseDataSource, CLUSTER_URI, MASTER_DATABASE_NAME, enterpriseId);
            }
            return {
                enterpriseDataSource,
                masterDataSource,
            };
        });
    }
    getConnectionsByEnterpiseId(masterDataSource, enterpriseDataSource, CLUSTER_URI, MASTER_DATABASE_NAME, enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield masterDataSource.setConnection(CLUSTER_URI, MASTER_DATABASE_NAME);
            const enterpriseMasterRepository = new enterprise_master_repository_1.EnterpriseMasterRepository(masterDataSource);
            const enterpriseObj = yield enterpriseMasterRepository
                .getEnterpriseById(enterpriseId)
                .toPromise();
            if (enterpriseObj && enterpriseObj.databaseName) {
                yield enterpriseDataSource.setConnection(CLUSTER_URI, enterpriseObj.databaseName);
            }
        });
    }
}
exports.BaseController = BaseController;
