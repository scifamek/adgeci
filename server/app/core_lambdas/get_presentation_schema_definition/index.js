async function useCase(
  <<SIGNATURE>>
  enviroment,
  body
) {

  const schema = await schemasRepository.getSchemasByCollection(body.collection,enviroment);
  const presentation = await presentationsRepository.getPresentationBySchemaId(schema["_id"],enviroment);

  return presentation['definition'];
}

