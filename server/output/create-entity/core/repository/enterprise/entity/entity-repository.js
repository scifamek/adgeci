"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityEnterpriseRepository = void 0;
class EntityEnterpriseRepository {
    constructor(enterpriseDataSource) {
        this.enterpriseDataSource = enterpriseDataSource;
    }
    getEntitiesByType(collection, page, sizePage) {
        const skip = sizePage * page;
        const response = this.enterpriseDataSource.getByFilters(collection, {
            skip,
            limit: sizePage,
            conditions: [
                {
                    operator: "equals",
                    property: "",
                },
            ],
        });
        return response;
    }
    // async getExpandedEntitiesByType(
    //   collection: string,
    //   page: number,
    //   sizePage: number,
    //   relationship: any
    // ) {
    //   const skip = sizePage * page;
    //   const pipeline = [];
    //   for (const rel of relationship) {
    //     pipeline.push({
    //       $lookup: {
    //         from: rel["relationship"],
    //         localField: `properties.${rel["name"]}`,
    //         foreignField: "_id",
    //         as: rel["relationship"],
    //       },
    //     });
    //   }
    //   const response = await this.enterpriseDataSource
    //     .collection(collection)
    //     .aggregate(pipeline)
    //     .skip(skip)
    //     .limit(sizePage)
    //     .toArray();
    //   return response;
    // }
    // async getFormattedEntitiesByType(
    //   collection: string,
    //   page: number,
    //   sizePage: number,
    //   fields: any,
    //   relationship: any
    // ) {
    //   const skip = sizePage * page;
    //   var definition: any = { properties: {} };
    //   for (const df of fields) {
    //     definition["properties"][df] = 1;
    //   }
    //   const pipeline = [];
    //   for (const rel of relationship) {
    //     pipeline.push({
    //       $lookup: {
    //         from: rel["relationship"],
    //         localField: `properties.${rel["local"]}`,
    //         foreignField: "_id",
    //         as: rel["relationship"],
    //       },
    //     });
    //   }
    //   for (const rel of relationship) {
    //     const repr = rel["repr"]
    //       .map((x: any) => `$$xxx.properties.${x}`)
    //       .join(", ,")
    //       .split(",");
    //     console.log(repr);
    //     const obj: any = {};
    //     obj[rel["name"]] = {
    //       $map: {
    //         input: `$${rel["name"]}`,
    //         as: "xxx",
    //         in: { $concat: repr },
    //       },
    //     };
    //     pipeline.push({
    //       $addFields: obj,
    //     });
    //   }
    //   console.log(JSON.stringify(pipeline));
    //   const response = await this.enterpriseDataSource
    //     .collection(collection)
    //     .aggregate(pipeline)
    //     .skip(skip)
    //     .limit(sizePage)
    //     .toArray();
    //   return response;
    // }
    createEntityByType(collection, data) {
        return this.enterpriseDataSource.save(collection, data);
    }
}
exports.EntityEnterpriseRepository = EntityEnterpriseRepository;
