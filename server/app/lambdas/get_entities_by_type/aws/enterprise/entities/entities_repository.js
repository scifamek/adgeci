'use strict';
var ObjectId = require('mongodb').ObjectId;

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
