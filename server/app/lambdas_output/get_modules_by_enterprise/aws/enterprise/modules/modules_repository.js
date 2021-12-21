"use strict"
var ObjectId = require("mongodb").ObjectId;

module.exports = {
   getModules: async function(enviroment) {

        const enterpriseObj = await enviroment.enterpriseDataSource
        .collection("modules")
        .find()
        .toArray();
        
        return enterpriseObj;

   }
}