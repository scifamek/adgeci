async function useCase(
  <<SIGNATURE>>
  enviroment,
  body
) {

  const schema = await schemasRepository.getSchemasByCollection(body.collection,enviroment);

  const response = extractMetadata(schema);

  return response;
}

function extractMetadata(
  entitiesBySchema
) {
    var tags = [];
    var definitions = [];
    var columns = [];
  for (const key in entitiesBySchema.definition) {
    if (Object.prototype.hasOwnProperty.call(entitiesBySchema.definition, key)) {
      const element = entitiesBySchema.definition[key];
      if (element['visible'] && element['usable']) {
        tags.push(element['display']);
        definitions.push(key);

        columns.push({
          definition: key,
          tag: element['display'],
        });
      }
    }
  }

  return {
    tags: tags,
    definitions: definitions,
    columns: columns,
  };
}