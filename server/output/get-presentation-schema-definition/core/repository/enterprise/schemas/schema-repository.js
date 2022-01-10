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
exports.SchemaEnterpriseRepository = void 0;
class SchemaEnterpriseRepository {
    constructor(enterpriseDataSource, schemaMapper) {
        this.enterpriseDataSource = enterpriseDataSource;
        this.schemaMapper = schemaMapper;
    }
    getSchemasTypeEntity() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.enterpriseDataSource
                .collection("schemas")
                .find({
                type: "entity",
            })
                .toArray();
            return response.map((x) => {
                return this.schemaMapper.fromJson(x);
            });
        });
    }
    getSchemasByCollection(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.enterpriseDataSource
                .collection("schemas")
                .find({
                type: "entity",
                collection: collection,
            })
                .toArray();
            if (response.length > 0) {
                response = response[0];
            }
            return response;
        });
    }
}
exports.SchemaEnterpriseRepository = SchemaEnterpriseRepository;
