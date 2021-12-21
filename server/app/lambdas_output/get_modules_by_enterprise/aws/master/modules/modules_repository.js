"use strict";
var ObjectId = require("mongodb").ObjectId;

module.exports = {
  getModules: async function (enviroment) {
    const response = await enviroment.masterDataSource
      .collection("modules")
      .find()
      .toArray();
    return response;
  },
  getModuleById: async function (id, enviroment) {
    let response = await enviroment.masterDataSource
      .collection("modules")
      .find({
        _id: ObjectId(id),
      })
      .toArray();

      if (response.length > 0) {
        response = response[0];
      }

    return response;
  },
};
