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

