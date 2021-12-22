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
exports.EntityEnterpriseRepository = void 0;
class EntityEnterpriseRepository {
    constructor(enterpriseDataSource) {
        this.enterpriseDataSource = enterpriseDataSource;
    }
    getEntitiesByType(collection, page, sizePage) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = sizePage * page;
            const response = yield this.enterpriseDataSource
                .collection(collection)
                .find()
                .skip(skip)
                .limit(sizePage)
                .toArray();
            return response;
        });
    }
    getExpandedEntitiesByType(collection, page, sizePage, relationship) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = sizePage * page;
            const pipeline = [];
            for (const rel of relationship) {
                pipeline.push({
                    $lookup: {
                        from: rel["relationship"],
                        localField: `properties.${rel["name"]}`,
                        foreignField: "_id",
                        as: rel["relationship"],
                    },
                });
            }
            const response = yield this.enterpriseDataSource
                .collection(collection)
                .aggregate(pipeline)
                .skip(skip)
                .limit(sizePage)
                .toArray();
            return response;
        });
    }
    getFormattedEntitiesByType(collection, page, sizePage, fields, relationship) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = sizePage * page;
            var definition = { properties: {} };
            for (const df of fields) {
                definition["properties"][df] = 1;
            }
            const pipeline = [];
            for (const rel of relationship) {
                pipeline.push({
                    $lookup: {
                        from: rel["relationship"],
                        localField: `properties.${rel["local"]}`,
                        foreignField: "_id",
                        as: rel["relationship"],
                    },
                });
            }
            for (const rel of relationship) {
                const repr = rel["repr"]
                    .map((x) => `$$xxx.properties.${x}`)
                    .join(", ,")
                    .split(",");
                console.log(repr);
                const obj = {};
                obj[rel["name"]] = {
                    $map: {
                        input: `$${rel["name"]}`,
                        as: "xxx",
                        in: { $concat: repr },
                    },
                };
                pipeline.push({
                    $addFields: obj,
                });
            }
            console.log(JSON.stringify(pipeline));
            const response = yield this.enterpriseDataSource
                .collection(collection)
                .aggregate(pipeline)
                .skip(skip)
                .limit(sizePage)
                .toArray();
            return response;
        });
    }
    createEntityByType(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.enterpriseDataSource
                .collection(collection)
                .insertOne({ properties: data });
            return response;
        });
    }
}
exports.EntityEnterpriseRepository = EntityEnterpriseRepository;
