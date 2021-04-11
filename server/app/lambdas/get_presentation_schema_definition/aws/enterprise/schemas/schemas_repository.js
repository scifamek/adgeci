"use strict";
var ObjectId = require("mongodb").ObjectId;

module.exports = {
  getSchemasTypeEntity: async function (enviroment) {
    const response = await enviroment.enterpriseDataSource
      .collection("schemas")
      .find({
        type: "entity",
      })
      .toArray();

    return response;
  },
  getSchemasByCollection: async function (collection,enviroment) {
    let response = await enviroment.enterpriseDataSource
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
  },
};
