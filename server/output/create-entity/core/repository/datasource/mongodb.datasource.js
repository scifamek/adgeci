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
exports.MongoDBDatasource = void 0;
const mongodb_1 = require("mongodb");
class MongoDBDatasource {
    getConnection(databaseClusterUri, databaseName, cachedDB) {
        return __awaiter(this, void 0, void 0, function* () {
            let con = null;
            if (cachedDB && cachedDB.serverConfig.isConnected()) {
                console.log("=> using cached database instance");
                con = cachedDB;
            }
            try {
                const mongoClient = new mongodb_1.MongoClient(databaseClusterUri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                const connection = yield mongoClient.connect();
                con = connection.db(databaseName);
            }
            catch (error) {
                console.log("Error connecting to Mongo ", error);
            }
            finally {
                return con;
            }
        });
    }
}
exports.MongoDBDatasource = MongoDBDatasource;
