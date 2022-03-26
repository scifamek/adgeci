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
const base_datasource_1 = require("../datasource/base.datasource");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class MongoDBDatasource extends base_datasource_1.BaseDatasource {
    constructor() {
        super(...arguments);
        this.enviroment = {
            MASTER_DATABASE_NAME: "master",
            MONGODB_ATLAS_CLUSTER_URI: "mongodb+srv://pochecho:sifamek666@information.ekarf.mongodb.net",
        };
    }
    save(collection, data) {
        const response = this.connection
            .collection(collection)
            .insertOne({ properties: data });
        return (0, rxjs_1.from)(response).pipe((0, operators_1.map)((item) => {
            return Object.assign({ id: item.insertedId }, data);
        }));
    }
    getById(collection, id) {
        const obj = (0, rxjs_1.from)(this.connection
            .collection(collection)
            .find({
            _id: (0, mongodb_1.ObjectId)(id),
        })
            .toArray())
            .pipe((0, operators_1.take)(1))
            .pipe((0, operators_1.map)((item) => {
            return item;
        }));
        return obj;
    }
    getByFilters(collection, filters) {
        let data = this.connection.collection(collection).find();
        if (filters.skip) {
            data = data.skip(filters.skip);
        }
        if (filters.limit) {
            data = data.limit(filters.limit);
        }
        const response = (0, rxjs_1.of)(data.toArray()).pipe((0, operators_1.map)((item) => {
            console.log(item);
            return item;
        }));
        return response;
    }
    setConnection(databaseClusterUri, databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (MongoDBDatasource.cachedDB &&
                MongoDBDatasource.cachedDB.serverConfig.isConnected()) {
                console.log("=> using cached database instance");
                this.connection = MongoDBDatasource.cachedDB;
            }
            try {
                const mongoClient = new mongodb_1.MongoClient(databaseClusterUri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                const connection = yield mongoClient.connect();
                this.connection = connection.db(databaseName);
            }
            catch (error) {
                console.log("Error connecting to Mongo ", error);
            }
        });
    }
}
exports.MongoDBDatasource = MongoDBDatasource;
MongoDBDatasource.cachedDB = null;
