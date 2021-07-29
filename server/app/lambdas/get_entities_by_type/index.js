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


;


const schemasRepository = {
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

'use strict';
var ObjectId = require('mongodb').ObjectId;

const entitiesRepository = {
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
	getExpandedEntitiesByType: async function (collection, page, sizePage, relationship, enviroment) {
		const skip = sizePage * page;
		const pipeline = [];
		for (const rel of relationship) {
			pipeline.push({
				$lookup: {
					from: rel['relationship'],
					localField: `properties.${rel['name']}`,
					foreignField: '_id',
					as: rel['relationship'],
				},
			});
		}
		const response = await enviroment.enterpriseDataSource
			.collection(collection)
			.aggregate(pipeline)
			.skip(skip)
			.limit(sizePage)
			.toArray();
		return response;
	},
	getFormattedEntitiesByType: async function (collection, page, sizePage, fields, relationship, enviroment) {
		const skip = sizePage * page;

		var definition = { properties: {} };

		for (const df of fields) {
			definition['properties'][df] = 1;
		}

		const pipeline = [];

		for (const rel of relationship) {
			pipeline.push({
				$lookup: {
					from: rel['relationship'],
					localField: `properties.${rel['local']}`,
					foreignField: '_id',
					as: rel['relationship'],
				},
			});
		}

		for (const rel of relationship) {
			const repr = rel['repr']
				.map((x) => `$$xxx.properties.${x}`)
				.join(', ,')
				.split(',');
			console.log(repr);
			const obj = {};
			obj[rel['name']] = {
				$map: {
					input: `$${rel['name']}`,
					as: 'xxx',
					in: 
					 { $concat: repr },
					
				},
			};

			pipeline.push({
				$addFields: obj,
			});
		}
		// pipeline.push({
		//   '$project':
		//     definition
		// });
		console.log(JSON.stringify(pipeline));
		const response = await enviroment.enterpriseDataSource
			.collection(collection)
			.aggregate(pipeline)
			.skip(skip)
			.limit(sizePage)
			.toArray();
		return response;
	},
	createEntityByType: async function (collection, data, enviroment) {
		const response = await enviroment.enterpriseDataSource.collection(collection).insertOne({ properties: data });
		return response;
	},
};




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

  
  const response = await useCase(schemasRepository,entitiesRepository,enviroment,body);

  return { statusCode: 200, headers: {'Content-Type':'application/json'},body: JSON.stringify(response) };
}


async function useCase(
  schemasRepository,entitiesRepository,
  enviroment,
  body
) {

  const schema = await schemasRepository.getSchemasByCollection(body.collection,enviroment);
  const relationship = [];
  for (const property in schema['definition']) {
    const value = schema['definition'][property];
    if('relationship' in value) {
      const coll = value['relationship'];
      relationship.push({
        'relationship': coll,
        'name': property,
        'local': value['local']
      });
    }
  }
  const entities = await entitiesRepository.getExpandedEntitiesByType(body.collection,body.page,body.sizePage,relationship,enviroment);
  return entities;
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