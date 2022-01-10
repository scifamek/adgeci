async function useCase(
  <<SIGNATURE>>
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
