async function useCase(
  <<SIGNATURE>>
  enviroment,
  body
) {

  var definition =  {'properties':{}};

  for (const df of body.definition) {
    definition['properties']['df'] = 1;
  }

  const entities = await entitiesRepository.getFormattedEntitiesByType(body.collection,body.page,body.sizePage,definition,enviroment);

  const response = [];


  for (const item of entities) {
    var temp = {
      '_id':item['_id']
    };
    for (const key in item['properties']) {
      if (Object.hasOwnProperty.call(item['properties'], key)) {
        const element = item['properties'][key];
        
        temp[key] = element;
      }
    }
    response.push(temp);
  }

  return response;
}
