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


var entitiesRepository = require('enterprise/entities/entities_repository.js');
var schemasRepository = require('enterprise/schemas/schemas_repository.js');



const MASTER_DATABASE_NAME = process.env["MASTER_DATABASE_NAME"];
const URI = process.env["MONGODB_ATLAS_CLUSTER_URI"];

let cachedDb = null;
let enterpriseDB = null;

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

  const enterpriseObj = await $insideEnterpriseRepository.getEnterpriseById(
    body["enterprise_id"],masterDataSource);

   const enterpriseDataSource = await connectToDatabase(
    atlas_connection_uri,
    enterpriseObj.database_name,
    enterpriseDB
  );
  const enviroment = {
    masterDataSource: masterDataSource,
    enterpriseDataSource:enterpriseDataSource
  }

  
  const response = await useCase(entitiesRepository,schemasRepository,enviroment,body);

  return { statusCode: 200, headers: {'Content-Type':'application/json'},body: JSON.stringify(response) };
}


async function useCase(
  entitiesRepository,schemasRepository,
  enviroment,
  body
) {

  

  const schema = await schemasRepository.getSchemasByCollection(body.collection,enviroment);

  const relationship = [];
  for (const property in schema['definition']) {
    const value = schema['definition'][property];
    if('relationship' in value) {
      const coll = value['relationship'];
      const schemaRelationship =  await schemasRepository.getSchemasByCollection(coll ,enviroment);
      console.log(schemaRelationship)
      relationship.push({
        'relationship': coll,
        'name': property,
        'local': value['local'],
        'repr': schemaRelationship['repr']
      });
    }
  }

  const entities = await entitiesRepository.getFormattedEntitiesByType(body.collection,body.page,body.sizePage,body.definition,relationship,enviroment);

  const response = [];


  for (const item of entities) {
    var temp = {
    };
    for (const key in item['properties']) {
      if (Object.hasOwnProperty.call(item['properties'], key)) {
        const element = item['properties'][key];
        
        temp[key] = element;
      }
    }
    for (const key in item) {
      if(['properties'].indexOf(key) <= -1) {
        console.log(key);
        if (Object.hasOwnProperty.call(item, key)) {
          const element = item[key];
          temp[key] = element;
        }

      }
    
    }
      response.push(temp);
  }

  return response;
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