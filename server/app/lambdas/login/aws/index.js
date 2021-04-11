"use strict";

var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

const $insideEnterpriseRepository = {
  getEnterpriseById: async function (id, masterDataSource) {
    const enterpriseObj = await masterDataSource
      .collection("enterprises")
      .find({
        _id: ObjectId(id),
      })
      .toArray();
    return enterpriseObj[0];
  },
};



const MASTER_DATABASE_NAME = process.env["MASTER_DATABASE_NAME"];
const URI = process.env["MONGODB_ATLAS_CLUSTER_URI"];

let cachedDb = null;

let atlas_connection_uri = null;

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (atlas_connection_uri == null) {
    atlas_connection_uri = URI;
  }
  const response = await processEvent(event, context, callback);
  callback(null, response);
};

async function processEvent(event, context, callback) {
  const masterDataSource = await connectToDatabase(
    atlas_connection_uri,
    MASTER_DATABASE_NAME,
    cachedDb
  );

  var body = JSON.parse(JSON.stringify(event));

  if (event.body !== null && event.body !== undefined) {
    body = JSON.parse(event.body);
  }


  const enviroment = {
    masterDataSource: masterDataSource
  }

  
  const response = await useCase(enviroment,body);

  return { statusCode: 200, headers: {'Content-Type':'application/json'},body: JSON.stringify(response) };
}


async function useCase(
  
  enviroment,
  body
) {

  return   {
    "_id": {
      "$oid": "5e38569701c17a0da5e1c5ec"
    },
    "enterprises_id": [
      {
        "_id":  "5e98666701c17a0da56325ec"
        ,
        "schema": {
          "$oid": "5e38569701c17a0da5e1c5ec"
        }
      }
    ],
    "properties": {
      "name": "Sergio",
      "last_name": "Posada Urrea",
      "email": "sergio.posadaurrea@gmail.com"
    }
  };
}



function connectToDatabase(connectionUri, databaseName, cachedDB) {
  if (cachedDB && cachedDB.serverConfig.isConnected()) {
    console.log("=> using cached database instance");
    return Promise.resolve(cachedDB);
  }
  return MongoClient.connect(connectionUri).then((client) => {
    cachedDB = client.db(databaseName);
    return cachedDB;
  });
}