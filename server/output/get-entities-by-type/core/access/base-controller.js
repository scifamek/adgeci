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
exports.baseContoller = exports.BaseController = void 0;
class BaseController {
    constructor() { }
    handler(event, context, usecase) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield usecase(event, context);
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: {
                        status: 156,
                        message: "",
                    },
                    data: response,
                }),
            };
        });
    }
}
exports.BaseController = BaseController;
function baseContoller(event, context, callback) {
    // const masterDataSource = await connectToDatabase(
    //     atlas_connection_uri,
    //     MASTER_DATABASE_NAME,
    //     cachedDb
    //   );
    //   var body = JSON.parse(JSON.stringify(event));
    //   if (event.body !== null && event.body !== undefined) {
    //     body = JSON.parse(event.body);
    //   }
    //   const enterpriseObj = await $insideEnterpriseRepository.getEnterpriseById(
    //     body["enterprise_id"],masterDataSource);
    //    const enterpriseDataSource = await connectToDatabase(
    //     atlas_connection_uri,
    //     enterpriseObj.database_name,
    //     enterpriseDB
    //   );
    //   const enviroment = {
    //     masterDataSource: masterDataSource,
    //     enterpriseDataSource:enterpriseDataSource
    //   }
    //   const response = await callback(repositories,enviroment,body);
    //   return { statusCode: 200, headers: {'Content-Type':'application/json'},body: JSON.stringify(response) };
}
exports.baseContoller = baseContoller;
