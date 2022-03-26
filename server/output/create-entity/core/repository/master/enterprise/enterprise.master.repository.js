"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseMasterRepository = void 0;
class EnterpriseMasterRepository {
    constructor(masterDataSource) {
        this.masterDataSource = masterDataSource;
    }
    getEnterpriseById(enterpriseId) {
        const enterpriseObj = this.masterDataSource.getById("enterprises", enterpriseId);
        return enterpriseObj;
    }
}
exports.EnterpriseMasterRepository = EnterpriseMasterRepository;
