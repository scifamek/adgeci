"use strict";
var ObjectId = require("mongodb").ObjectId;

module.exports = {
  getEntitiesByType: async function (collection, page, sizePage, enviroment) {
    const skip = sizePage * page;
    const response = await enviroment.enterpriseDataSource
      .collection(collection)
      .find()
      .skip(skip)
      .limit(sizePage)
      .toArray();
    return response;
  },
  getFormattedEntitiesByType: async function (collection, page, sizePage,fields, enviroment) {
    const skip = sizePage * page;
    const response = await enviroment.enterpriseDataSource
      .collection(collection)
      .find({},fields)
      .skip(skip)
      .limit(sizePage)
      .toArray();
    return response;
  },
  createEntityByType: async function (collection, data, enviroment) {
    const response = await enviroment.enterpriseDataSource
      .collection(collection)
      .insertOne({'properties':data});
    return response;
  },
};
