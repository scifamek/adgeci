"use strict";
var ObjectId = require("mongodb").ObjectId;

module.exports = {

  getPresentationBySchemaId: async function (schemaId,enviroment) {
    let response = await enviroment.enterpriseDataSource
      .collection("presentations")
      .find({
        schema_id: schemaId,
      })
      .toArray();
      if (response.length > 0) {
        response = response[0];
      }
    return response;
  },
};
