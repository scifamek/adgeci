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
exports.ModulesMasterRepository = void 0;
const mongodb_1 = require("mongodb");
class ModulesMasterRepository {
    constructor(masterDataSource) {
        this.masterDataSource = masterDataSource;
    }
    getModules() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.masterDataSource
                .collection("modules")
                .find()
                .toArray();
            return response;
        });
    }
    getModuleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.masterDataSource
                .collection("modules")
                .find({
                _id: (0, mongodb_1.ObjectId)(id),
            })
                .toArray();
            if (response.length > 0) {
                response = response[0];
            }
            return response;
        });
    }
}
exports.ModulesMasterRepository = ModulesMasterRepository;
